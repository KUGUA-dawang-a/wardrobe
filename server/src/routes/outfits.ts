/**
 * 穿搭推荐路由
 *
 * GET  /api/outfits/generate  — 生成穿搭推荐
 * GET  /api/outfits/saved     — 获取收藏的穿搭
 * POST /api/outfits/saved     — 收藏一套穿搭
 * DELETE /api/outfits/saved/:id — 取消收藏
 * GET  /api/outfits/ai-status — 检查 Ollama 是否可用
 */

import { Router, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { getWardrobe } from '../services/wardrobeService';
import { generateOutfits } from '../services/fashionEngine';
import { aiGenerateOutfits, checkOllama } from '../services/aiService';
import { getKnowledge } from '../services/knowledgeService';
import { OutfitSuggestion, ClothingItem, SavedOutfit } from '../types';

const router = Router();
router.use(authMiddleware);

/** 获取用户的收藏文件路径 */
function getFavoritesPath(userId: string): string {
  return path.resolve(__dirname, `../data/favorites-${userId}.json`);
}

/** 读取收藏 */
function getFavorites(userId: string): SavedOutfit[] {
  const p = getFavoritesPath(userId);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

/** 保存收藏 */
function saveFavorites(userId: string, favs: SavedOutfit[]): void {
  fs.writeFileSync(getFavoritesPath(userId), JSON.stringify(favs, null, 2));
}

/**
 * GET /api/outfits/generate
 * 查询参数: ?occasion=上班&useAI=true
 */
router.get('/generate', async (req: AuthRequest, res: Response) => {
  const { occasion, useAI } = req.query as Record<string, string>;

  // 获取用户的衣橱（排除归档的）
  let items = getWardrobe(req.user!.userId).filter(i => !i.isArchived);

  if (items.length < 2) {
    return res.json({
      outfits: [],
      source: 'empty',
      message: '衣橱中衣服太少，请先上传至少2件衣服',
    });
  }

  const knowledge = getKnowledge();

  // 先用规则引擎生成
  const ruleOutfits = generateOutfits(items, knowledge, occasion);

  // 如果要求使用 AI 且 Ollama 可用
  let aiOutfits: OutfitSuggestion[] | null = null;
  let aiAvailable = false;

  if (useAI === 'true') {
    aiOutfits = await aiGenerateOutfits(items, knowledge, occasion);
    aiAvailable = await checkOllama();
  }

  res.json({
    outfits: ruleOutfits,
    aiOutfits,
    source: aiOutfits ? 'ai' : 'rules',
    aiAvailable,
  });
});

/** GET /api/outfits/ai-status — 检查 Ollama 是否可用 */
router.get('/ai-status', async (_req: AuthRequest, res: Response) => {
  const available = await checkOllama();
  res.json({ available });
});

/** GET /api/outfits/saved — 获取收藏 */
router.get('/saved', (req: AuthRequest, res: Response) => {
  const favs = getFavorites(req.user!.userId);
  res.json(favs);
});

/** POST /api/outfits/saved — 收藏穿搭 */
router.post('/saved', (req: AuthRequest, res: Response) => {
  const { suggestion, itemIds } = req.body as {
    suggestion: OutfitSuggestion;
    itemIds: string[];
  };

  if (!suggestion) {
    return res.status(400).json({ error: '请提供要收藏的穿搭' });
  }

  // 获取搭配中衣服的详细信息
  const allItems = getWardrobe(req.user!.userId);
  const matchedItems: ClothingItem[] = itemIds
    .map(id => allItems.find(i => i.id === id))
    .filter(Boolean) as ClothingItem[];

  const saved: SavedOutfit = {
    id: uuid(),
    suggestion,
    items: matchedItems,
    createdAt: new Date().toISOString(),
  };

  const favs = getFavorites(req.user!.userId);
  favs.push(saved);
  saveFavorites(req.user!.userId, favs);

  res.json(saved);
});

/** DELETE /api/outfits/saved/:id — 取消收藏 */
router.delete('/saved/:id', (req: AuthRequest, res: Response) => {
  let favs = getFavorites(req.user!.userId);
  favs = favs.filter(f => f.id !== req.params.id);
  saveFavorites(req.user!.userId, favs);
  res.json({ message: '已取消收藏' });
});

export default router;
