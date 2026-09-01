/**
 * 潮流库管理服务
 *
 * 提供季节潮流（trendInfo）和搭配模板（matchTemplates）
 * 的增删改查读写操作，直接操作 fashionKnowledge.json。
 */

import { v4 as uuid } from 'uuid';
import { readDataJson, writeDataJson } from './dataService';
import { TrendInfo, MatchTemplate, FashionKnowledge } from '../types';

/** 读取完整的知识库数据 */
function readKnowledge(): FashionKnowledge {
  return readDataJson<FashionKnowledge>('fashionKnowledge.json', true);
}

/** 保存完整的知识库数据 */
function saveKnowledge(data: FashionKnowledge): void {
  writeDataJson('fashionKnowledge.json', data);
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
