/**
 * 衣物管理路由
 *
 * GET    /api/items       — 获取衣橱列表（支持筛选）
 * POST   /api/items       — 添加新衣服
 * PUT    /api/items/:id   — 修改衣服信息
 * DELETE /api/items/:id   — 删除衣服（同时删图片）
 * POST   /api/items/archive — 批量归档/取消归档
 */

import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { getWardrobe, addItem, removeItem, updateItem, archiveBySeason } from '../services/wardrobeService';
import { deleteImage } from '../services/imageService';
import { ClothingItem } from '../types';

const router = Router();

// 所有路由都需要登录
router.use(authMiddleware);

/**
 * GET /api/items
 * 查询参数：?season=summer&color=blue&style=casual
 */
router.get('/', (req: AuthRequest, res: Response) => {
  let items = getWardrobe(req.user!.userId);

  // 筛选
  const { season, color, style, archived } = req.query as Record<string, string>;

  if (season) {
    items = items.filter(i => i.season.includes(season as any));
  }
  if (color) {
    items = items.filter(i => i.color === color);
  }
  if (style) {
    items = items.filter(i => i.style.includes(style as any));
  }
  // archived: 'true'=只看归档, 'false'=只看未归档, 不传=全部
  if (archived === 'true') {
    items = items.filter(i => i.isArchived);
  } else if (archived === 'false') {
    items = items.filter(i => !i.isArchived);
  }

  res.json(items);
});

/**
 * POST /api/items
 * 添加新衣服
 */
router.post('/', (req: AuthRequest, res: Response) => {
  const { name, category, color, season, style, imagePath } = req.body;

  if (!name || !category || !color || !imagePath) {
    return res.status(400).json({ error: '名称、分类、颜色、图片为必填项' });
  }

  const newItem: ClothingItem = {
    id: uuid(),
    name,
    category,
    color,
    season: season || ['all'],
    style: style || ['casual'],
    imagePath,
    isArchived: false,
    createdAt: new Date().toISOString(),
  };

  addItem(req.user!.userId, newItem);
  res.json(newItem);
});

/**
 * PUT /api/items/:id
 * 修改衣服信息
 */
router.put('/:id', (req: AuthRequest, res: Response) => {
  const updated = updateItem(req.user!.userId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: '衣服不存在' });
  }
  res.json(updated);
});

/**
 * DELETE /api/items/:id
 * 删除衣服（同时删除本地图片）
 */
router.delete('/:id', (req: AuthRequest, res: Response) => {
  const removed = removeItem(req.user!.userId, req.params.id);
  if (!removed) {
    return res.status(404).json({ error: '衣服不存在' });
  }
  // 同步删除本地图片
  deleteImage(removed.imagePath);
  res.json({ message: '删除成功' });
});

/**
 * POST /api/items/archive
 * 批量归档/取消归档
 * Body: { season: "summer", archived: true }
 */
router.post('/archive', (req: AuthRequest, res: Response) => {
  const { season, archived } = req.body;
  if (!season) {
    return res.status(400).json({ error: '请指定季节' });
  }
  archiveBySeason(req.user!.userId, season, archived);
  res.json({ message: archived ? '已归档' : '已取消归档' });
});

export default router;
