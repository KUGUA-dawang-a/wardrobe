/**
 * 潮流知识库管理路由
 *
 * GET    /api/knowledge — 获取完整知识库
 * PUT    /api/knowledge — 整体保存知识库
 * POST   /api/knowledge/color   — 新增配色规则
 * DELETE /api/knowledge/color/:index — 删除配色规则
 * POST   /api/knowledge/occasion   — 新增场合模板
 * DELETE /api/knowledge/occasion/:index — 删除场合模板
 * POST   /api/knowledge/taboo   — 新增禁忌
 * DELETE /api/knowledge/taboo/:index — 删除禁忌
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { FashionKnowledge, ColorRule, OccasionTemplate, Taboo } from '../types';

const router = Router();

/** 知识库文件路径 */
const knowledgePath = path.resolve(__dirname, '../data/fashionKnowledge.json');

/** 读取知识库 */
function getKnowledge(): FashionKnowledge {
  return JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));
}

/** 保存知识库 */
function saveKnowledge(k: FashionKnowledge): void {
  fs.writeFileSync(knowledgePath, JSON.stringify(k, null, 2));
}

/** 获取完整知识库 */
router.get('/', (_req: Request, res: Response) => {
  res.json(getKnowledge());
});

/** 整体保存（前端编辑后整体提交） */
router.put('/', (req: Request, res: Response) => {
  saveKnowledge(req.body);
  res.json({ message: '保存成功' });
});

// ===== 配色规则 =====
router.post('/color', (req: Request, res: Response) => {
  const k = getKnowledge();
  k.colorRules.push(req.body as ColorRule);
  saveKnowledge(k);
  res.json(k.colorRules);
});

router.delete('/color/:index', (req: Request, res: Response) => {
  const k = getKnowledge();
  const idx = parseInt(req.params.index);
  if (idx >= 0 && idx < k.colorRules.length) {
    k.colorRules.splice(idx, 1);
    saveKnowledge(k);
  }
  res.json(k.colorRules);
});

// ===== 场合模板 =====
router.post('/occasion', (req: Request, res: Response) => {
  const k = getKnowledge();
  k.occasions.push(req.body as OccasionTemplate);
  saveKnowledge(k);
  res.json(k.occasions);
});

router.delete('/occasion/:index', (req: Request, res: Response) => {
  const k = getKnowledge();
  const idx = parseInt(req.params.index);
  if (idx >= 0 && idx < k.occasions.length) {
    k.occasions.splice(idx, 1);
    saveKnowledge(k);
  }
  res.json(k.occasions);
});

// ===== 禁忌 =====
router.post('/taboo', (req: Request, res: Response) => {
  const k = getKnowledge();
  k.taboos.push(req.body as Taboo);
  saveKnowledge(k);
  res.json(k.taboos);
});

router.delete('/taboo/:index', (req: Request, res: Response) => {
  const k = getKnowledge();
  const idx = parseInt(req.params.index);
  if (idx >= 0 && idx < k.taboos.length) {
    k.taboos.splice(idx, 1);
    saveKnowledge(k);
  }
  res.json(k.taboos);
});

export default router;
