/**
 * 衣橱数据服务
 *
 * 每个用户一个独立的 JSON 文件，数据完全隔离。
 * 提供增删改查、筛选等方法。
 */

import fs from 'fs';
import path from 'path';
import { ClothingItem } from '../types';

/** 获取某个用户的衣橱文件路径 */
function getWardrobePath(userId: string): string {
  return path.resolve(__dirname, `../data/wardrobe-${userId}.json`);
}

/** 读取用户的衣橱数据 */
export function getWardrobe(userId: string): ClothingItem[] {
  const filePath = getWardrobePath(userId);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/** 保存衣橱数据 */
export function saveWardrobe(userId: string, items: ClothingItem[]): void {
  fs.writeFileSync(getWardrobePath(userId), JSON.stringify(items, null, 2));
}

/** 添加一件衣服 */
export function addItem(userId: string, item: ClothingItem): void {
  const items = getWardrobe(userId);
  items.push(item);
  saveWardrobe(userId, items);
}

/** 删除一件衣服（返回被删除的衣服，便于删除图片） */
export function removeItem(userId: string, itemId: string): ClothingItem | null {
  const items = getWardrobe(userId);
  const index = items.findIndex(i => i.id === itemId);
  if (index === -1) return null;
  const removed = items.splice(index, 1)[0];
  saveWardrobe(userId, items);
  return removed;
}

/** 更新一件衣服 */
export function updateItem(userId: string, itemId: string, updates: Partial<ClothingItem>): ClothingItem | null {
  const items = getWardrobe(userId);
  const item = items.find(i => i.id === itemId);
  if (!item) return null;
  Object.assign(item, updates);
  saveWardrobe(userId, items);
  return item;
}

/** 批量归档/取消归档某季节的衣服 */
export function archiveBySeason(userId: string, season: string, archived: boolean): void {
  const items = getWardrobe(userId);
  for (const item of items) {
    if (item.season.includes(season as any)) {
      item.isArchived = archived;
    }
  }
  saveWardrobe(userId, items);
}
