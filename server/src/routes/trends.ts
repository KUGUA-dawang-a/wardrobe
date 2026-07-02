/**
 * 潮流库管理路由
 *
 * GET/POST/PUT/DELETE /api/trends/info     — 季节潮流 CRUD
 * GET/POST/PUT/DELETE /api/trends/templates — 搭配模板 CRUD
 */

import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import {
  getTrendInfoList, createTrendInfo, updateTrendInfo, deleteTrendInfo,
  getMatchTemplateList, createMatchTemplate, updateMatchTemplate, deleteMatchTemplate,
} from '../services/trendService';

const router = Router();
router.use(authMiddleware);

// ==================== 季节潮流 ====================

/** GET /api/trends/info — 获取所有季节潮流 */
router.get('/info', (_req: AuthRequest, res: Response) => {
  res.json(getTrendInfoList());
});

/** POST /api/trends/info — 新增季节潮流 */
router.post('/info', (req: AuthRequest, res: Response) => {
  const { season, yearQuarter, popularColors, styles, taboos } = req.body;
  if (!season || !yearQuarter) {
    return res.status(400).json({ error: '季节和年份季度为必填项' });
  }
  const item = createTrendInfo({ season, yearQuarter, popularColors: popularColors || [], styles: styles || [], taboos: taboos || [] });
  res.json(item);
});

/** PUT /api/trends/info/:id — 编辑季节潮流 */
router.put('/info/:id', (req: AuthRequest, res: Response) => {
  const updated = updateTrendInfo(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: '未找到该季节潮流' });
  res.json(updated);
});

/** DELETE /api/trends/info/:id — 删除季节潮流 */
router.delete('/info/:id', (req: AuthRequest, res: Response) => {
  const ok = deleteTrendInfo(req.params.id);
  if (!ok) return res.status(404).json({ error: '未找到该季节潮流' });
  res.json({ message: '删除成功' });
});

// ==================== 搭配模板 ====================

/** GET /api/trends/templates — 获取所有搭配模板 */
router.get('/templates', (_req: AuthRequest, res: Response) => {
  res.json(getMatchTemplateList());
});

/** POST /api/trends/templates — 新增搭配模板 */
router.post('/templates', (req: AuthRequest, res: Response) => {
  const { name, occasion, season, style, topRange, bottomRange, outerwearRange, shoesRange, description } = req.body;
  if (!name || !occasion || !season) {
    return res.status(400).json({ error: '名称、场合、季节为必填项' });
  }
  const item = createMatchTemplate({
    name, occasion, season, style: style || 'casual',
    topRange: topRange || [], bottomRange: bottomRange || [],
    outerwearRange: outerwearRange || [], shoesRange: shoesRange || [],
    description: description || '',
  });
  res.json(item);
});

/** PUT /api/trends/templates/:id — 编辑搭配模板 */
router.put('/templates/:id', (req: AuthRequest, res: Response) => {
  const updated = updateMatchTemplate(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: '未找到该搭配模板' });
  res.json(updated);
});

/** DELETE /api/trends/templates/:id — 删除搭配模板 */
router.delete('/templates/:id', (req: AuthRequest, res: Response) => {
  const ok = deleteMatchTemplate(req.params.id);
  if (!ok) return res.status(404).json({ error: '未找到该搭配模板' });
  res.json({ message: '删除成功' });
});

export default router;
