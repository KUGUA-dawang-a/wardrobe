/**
 * 潮流库管理服务
 *
 * 提供季节潮流（trendInfo）和搭配模板（matchTemplates）
 * 的增删改查读写操作，直接操作 fashionKnowledge.json。
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { TrendInfo, MatchTemplate, FashionKnowledge } from '../types';

/** 知识库 JSON 文件路径 */
const knowledgePath = path.resolve(__dirname, '../data/fashionKnowledge.json');

/** 读取完整的知识库数据 */
function readKnowledge(): FashionKnowledge {
  return JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));
}

/** 保存完整的知识库数据 */
function saveKnowledge(data: FashionKnowledge): void {
  fs.writeFileSync(knowledgePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ==================== 季节潮流 CRUD ====================

/** 获取所有季节潮流 */
export function getTrendInfoList(): TrendInfo[] {
  return readKnowledge().trendInfo || [];
}

/** 新增一条季节潮流 */
export function createTrendInfo(data: Omit<TrendInfo, 'id'>): TrendInfo {
  const knowledge = readKnowledge();
  const newItem: TrendInfo = { id: uuid(), ...data };
  knowledge.trendInfo.push(newItem);
  saveKnowledge(knowledge);
  return newItem;
}

/** 更新一条季节潮流 */
export function updateTrendInfo(id: string, data: Partial<TrendInfo>): TrendInfo | null {
  const knowledge = readKnowledge();
  const index = knowledge.trendInfo.findIndex(t => t.id === id);
  if (index === -1) return null;
  knowledge.trendInfo[index] = { ...knowledge.trendInfo[index], ...data };
  saveKnowledge(knowledge);
  return knowledge.trendInfo[index];
}

/** 删除一条季节潮流 */
export function deleteTrendInfo(id: string): boolean {
  const knowledge = readKnowledge();
  const index = knowledge.trendInfo.findIndex(t => t.id === id);
  if (index === -1) return false;
  knowledge.trendInfo.splice(index, 1);
  saveKnowledge(knowledge);
  return true;
}

// ==================== 搭配模板 CRUD ====================

/** 获取所有搭配模板 */
export function getMatchTemplateList(): MatchTemplate[] {
  return readKnowledge().matchTemplates || [];
}

/** 新增一条搭配模板 */
export function createMatchTemplate(data: Omit<MatchTemplate, 'id'>): MatchTemplate {
  const knowledge = readKnowledge();
  const newItem: MatchTemplate = { id: uuid(), ...data };
  knowledge.matchTemplates.push(newItem);
  saveKnowledge(knowledge);
  return newItem;
}

/** 更新一条搭配模板 */
export function updateMatchTemplate(id: string, data: Partial<MatchTemplate>): MatchTemplate | null {
  const knowledge = readKnowledge();
  const index = knowledge.matchTemplates.findIndex(t => t.id === id);
  if (index === -1) return null;
  knowledge.matchTemplates[index] = { ...knowledge.matchTemplates[index], ...data };
  saveKnowledge(knowledge);
  return knowledge.matchTemplates[index];
}

/** 删除一条搭配模板 */
export function deleteMatchTemplate(id: string): boolean {
  const knowledge = readKnowledge();
  const index = knowledge.matchTemplates.findIndex(t => t.id === id);
  if (index === -1) return false;
  knowledge.matchTemplates.splice(index, 1);
  saveKnowledge(knowledge);
  return true;
}
