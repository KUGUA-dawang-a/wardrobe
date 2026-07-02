/**
 * 类型定义
 * 所有数据结构集中在这里，前后端共享
 */

// ===== 用户 =====
export interface User {
  id: string;
  username: string;
  password: string; // bcrypt 加密后的密码
  createdAt: string;
}

// ===== 衣服单品 =====
export type ClothingCategory = 'top' | 'bottom' | 'outerwear' | 'shoes' | 'accessory' | 'dress';
export type ClothingColor = 'white' | 'black' | 'gray' | 'red' | 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'brown' | 'beige' | 'multicolor';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
export type Style = 'casual' | 'business' | 'sporty' | 'fashion' | 'sweet' | 'academic' | 'street' | 'pastoral';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: ClothingColor;
  season: Season[];
  style: Style[];
  imagePath: string;   // 如 /uploads/xxx/abc.webp
  isArchived: boolean;  // 是否已归档（换季）
  createdAt: string;
}

// ===== 穿搭推荐 =====
export interface OutfitSuggestion {
  id: string;
  itemIds: string[];         // 搭配中的衣服 ID 列表
  score: number;             // 搭配评分 0-100
  reason: string;            // 搭配理由
  occasion: string;          // 适用场合
  style: string;             // 整体风格
  colorHarmony: string;      // 配色说明
}

// ===== 收藏穿搭 =====
export interface SavedOutfit {
  id: string;
  suggestion: OutfitSuggestion;
  items: ClothingItem[];     // 搭配中的衣服详情
  createdAt: string;
}

// ===== 潮流知识库 =====
export interface ColorRule {
  color1: ClothingColor;
  color2: ClothingColor;
  score: number;             // 配色评分 0-100
  description: string;       // 配色说明，如"经典黑白配"
}

export interface OccasionTemplate {
  name: string;              // 场合名称，如"上班"、"约会"
  style: Style[];            // 推荐风格
  forbidden: string[];       // 禁忌描述，如"不要穿过于花哨"
  description: string;       // 穿搭建议
}

export interface Taboo {
  description: string;       // 禁忌描述，如"夏天不要穿羽绒服"
  reason: string;            // 原因
}

export interface FashionKnowledge {
  colorRules: ColorRule[];
  occasions: OccasionTemplate[];
  taboos: Taboo[];
  trendInfo: TrendInfo[];
  matchTemplates: MatchTemplate[];
}

// ===== 新增：季节潮流 =====
export interface TrendInfo {
  id: string;
  season: Season;            // 适用季节
  yearQuarter: string;       // 年份季度，如 "2025-Q1"
  popularColors: ClothingColor[];  // 流行色列表
  styles: Style[];           // 推荐风格
  taboos: string[];          // 该季节的穿搭禁忌
}

// ===== 新增：自定义搭配模板 =====
export interface MatchTemplate {
  id: string;
  name: string;              // 模板名称
  occasion: string;          // 适用场合
  season: Season;            // 适用季节
  style: Style;              // 整体风格
  topRange: ClothingCategory[];   // 上装可选范围
  bottomRange: ClothingCategory[]; // 下装可选范围
  outerwearRange: ClothingCategory[]; // 外套可选范围
  shoesRange: ClothingCategory[];   // 鞋子可选范围
  description: string;       // 搭配说明
}
