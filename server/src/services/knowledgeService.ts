/**
 * 潮流知识库读取工具
 * 供 fashionEngine 和 aiService 使用
 */

import { readDataJson } from './dataService';
import { FashionKnowledge } from '../types';

export function getKnowledge(): FashionKnowledge {
  return readDataJson<FashionKnowledge>('fashionKnowledge.json', true);
}
