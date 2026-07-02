// ===== 与后端类型保持一致 =====

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
  imagePath: string;
  isArchived: boolean;
  createdAt: string;
}

export interface OutfitSuggestion {
  id: string;
  itemIds: string[];
  score: number;
  reason: string;
  occasion: string;
  style: string;
  colorHarmony: string;
}

export interface SavedOutfit {
  id: string;
  suggestion: OutfitSuggestion;
  items: ClothingItem[];
  createdAt: string;
}

export interface ColorRule {
  color1: ClothingColor;
  color2: ClothingColor;
  score: number;
  description: string;
}

export interface OccasionTemplate {
  name: string;
  style: Style[];
  forbidden: string[];
  description: string;
}

export interface Taboo {
  description: string;
  reason: string;
}

export interface FashionKnowledge {
  colorRules: ColorRule[];
  occasions: OccasionTemplate[];
  taboos: Taboo[];
  trendInfo: TrendInfo[];
  matchTemplates: MatchTemplate[];
}

// ===== 季节潮流 =====
export interface TrendInfo {
  id: string;
  season: Season;
  yearQuarter: string;
  popularColors: ClothingColor[];
  styles: Style[];
  taboos: string[];
}

// ===== 自定义搭配模板 =====
export interface MatchTemplate {
  id: string;
  name: string;
  occasion: string;
  season: Season;
  style: Style;
  topRange: ClothingCategory[];
  bottomRange: ClothingCategory[];
  outerwearRange: ClothingCategory[];
  shoesRange: ClothingCategory[];
  description: string;
}

// ===== 常量（下拉选项） =====
export const CATEGORY_OPTIONS: { value: ClothingCategory; label: string }[] = [
  { value: 'top', label: '上衣' },
  { value: 'bottom', label: '下装' },
  { value: 'outerwear', label: '外套' },
  { value: 'shoes', label: '鞋' },
  { value: 'accessory', label: '配饰' },
  { value: 'dress', label: '连衣裙' },
];

export const COLOR_OPTIONS: { value: ClothingColor; label: string }[] = [
  { value: 'white', label: '白色' },
  { value: 'black', label: '黑色' },
  { value: 'gray', label: '灰色' },
  { value: 'red', label: '红色' },
  { value: 'blue', label: '蓝色' },
  { value: 'green', label: '绿色' },
  { value: 'yellow', label: '黄色' },
  { value: 'pink', label: '粉色' },
  { value: 'purple', label: '紫色' },
  { value: 'brown', label: '棕色' },
  { value: 'beige', label: '米色' },
  { value: 'multicolor', label: '花色' },
];

export const SEASON_OPTIONS: { value: Season; label: string }[] = [
  { value: 'spring', label: '春' },
  { value: 'summer', label: '夏' },
  { value: 'autumn', label: '秋' },
  { value: 'winter', label: '冬' },
  { value: 'all', label: '四季' },
];

export const STYLE_OPTIONS: { value: Style; label: string }[] = [
  { value: 'casual', label: '休闲' },
  { value: 'business', label: '商务' },
  { value: 'sporty', label: '运动' },
  { value: 'fashion', label: '时尚' },
  { value: 'sweet', label: '甜美' },
  { value: 'academic', label: '学院' },
  { value: 'street', label: '街头' },
  { value: 'pastoral', label: '田园' },
];
