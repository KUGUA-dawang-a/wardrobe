/**
 * 潮流知识库读取工具
 * 供 fashionEngine 和 aiService 使用
 */

import fs from 'fs';
import path from 'path';
import { FashionKnowledge } from '../types';

const knowledgePath = path.resolve(__dirname, '../data/fashionKnowledge.json');

export function getKnowledge(): FashionKnowledge {
  return JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));
}
