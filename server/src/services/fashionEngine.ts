/**
 * 本地穿搭规则引擎
 *
 * 根据潮流知识库（配色规则、场合模板、禁忌、季节潮流、搭配模板）和用户衣橱，
 * 自动生成穿搭推荐。完全本地运行，不需要任何外部 API。
 *
 * 搭配逻辑：
 * 1. 从衣橱中选出上装 + 下装 + 鞋子（+ 可选外套）
 * 2. 检查是否存在禁忌搭配
 * 3. 根据配色规则打分
 * 4. 根据风格兼容性打分
 * 5. 根据季节流行趋势加分
 * 6. 优先匹配用户自定义模板
 * 7. 按综合评分排序返回
 */

import { ClothingItem, FashionKnowledge, OutfitSuggestion, TrendInfo, MatchTemplate } from '../types';

/** 搭配时需要覆盖的主要分类 */
const CATEGORY_PRIORITY = ['top', 'bottom', 'shoes'] as const;

/**
 * 生成穿搭推荐
 * @param items 用户的衣橱（已筛选/已过滤归档）
 * @param knowledge 潮流知识库（含 trendInfo / matchTemplates）
 * @param targetOccasion 目标场合（可选）
 * @returns 推荐搭配列表
 */
export function generateOutfits(
  items: ClothingItem[],
  knowledge: FashionKnowledge,
  targetOccasion?: string,
): OutfitSuggestion[] {
  const suggestions: OutfitSuggestion[] = [];

  // 取出季节潮流和搭配模板
  const trendInfo = knowledge.trendInfo || [];
  const matchTemplates = knowledge.matchTemplates || [];

  // 将衣服按分类分组
  const tops = items.filter(i => i.category === 'top');
  const bottoms = items.filter(i => i.category === 'bottom');
  const shoes = items.filter(i => i.category === 'shoes');
  const outerwears = items.filter(i => i.category === 'outerwear');
  const dresses = items.filter(i => i.category === 'dress');

  // 获取匹配的潮流趋势（根据目标场合或当前季节）
  const matchedTrend = findMatchedTrend(trendInfo, targetOccasion);

  // —— 连衣裙 + 鞋子 ——
  for (const dress of dresses) {
    for (const shoe of shoes) {
      if (!checkTaboo(dress, shoe, trendInfo)) continue;
      const score = calculateScore([dress, shoe], knowledge, matchedTrend);
      suggestions.push(buildSuggestion([dress, shoe], score, knowledge, targetOccasion, matchedTrend, matchTemplates));
    }
  }

  // —— 上装 + 下装 + 鞋子 ——
  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        if (!checkTaboo(top, bottom, shoe, trendInfo)) continue;
        const score = calculateScore([top, bottom, shoe], knowledge, matchedTrend);
        suggestions.push(buildSuggestion([top, bottom, shoe], score, knowledge, targetOccasion, matchedTrend, matchTemplates));

        // 尝试加外套
        for (const outer of outerwears) {
          if (!checkTaboo(top, bottom, shoe, outer, trendInfo)) continue;
          const outerScore = calculateScore([top, bottom, shoe, outer], knowledge, matchedTrend);
          suggestions.push(buildSuggestion([top, bottom, shoe, outer], outerScore, knowledge, targetOccasion, matchedTrend, matchTemplates));
        }
      }
    }
  }

  // 按评分降序排列，取前 20 条
  suggestions.sort((a, b) => b.score - a.score);
  return suggestions.slice(0, 20);
}

/**
 * 根据目标场合找到匹配的季节潮流
 */
function findMatchedTrend(trendInfo: TrendInfo[], targetOccasion?: string): TrendInfo | null {
  if (trendInfo.length === 0) return null;
  // 如果没有指定场合，返回第一条（默认当前季节）
  if (!targetOccasion) return trendInfo[0];

  // 根据场合关键词推测季节
  const occasionSeasonMap: Record<string, string> = {
    '运动': 'summer', '健身': 'summer', '校园': 'spring',
    '约会': 'spring', '正式': 'autumn', '上班': 'autumn', '通勤': 'autumn',
    '日常': 'spring', '聚会': 'summer',
  };
  const guessedSeason = occasionSeasonMap[targetOccasion] || trendInfo[0].season;
  return trendInfo.find(t => t.season === guessedSeason) || trendInfo[0];
}

/**
 * 检查是否存在禁忌搭配
 * 新增：检查 trendInfo 中的季节禁忌
 */
function checkTaboo(...args: [...ClothingItem[], TrendInfo[] | undefined]): boolean {
  // 分离 ClothingItem 和 TrendInfo[]
  const items = args.slice(0, -1) as ClothingItem[];
  const trendInfo = args[args.length - 1] as TrendInfo[] | undefined;

  if (items.length < 2) return true;

  // 检查季节是否一致
  const hasWinter = items.some(i => i.season.includes('winter'));
  const hasSummer = items.some(i => i.season.includes('summer'));

  const winterItems = items.filter(i => i.season.includes('winter') && !i.season.includes('all'));
  const summerItems = items.filter(i => i.season.includes('summer') && !i.season.includes('all'));
  if (winterItems.length > 0 && summerItems.length > 0) {
    return false; // 冬夏混穿
  }

  // 检查 trendInfo 中的禁忌
  if (trendInfo && trendInfo.length > 0) {
    for (const trend of trendInfo) {
      for (const taboo of trend.taboos) {
        // 简单关键词过滤：如果禁忌包含"深色"，检查所有衣服是否都偏深
        if (taboo.includes('深色')) {
          const darkColors = ['black', 'brown', 'purple', 'gray'];
          if (items.every(i => darkColors.includes(i.color))) {
            return false; // 违反：全身暗沉
          }
        }
        if (taboo.includes('浅色') || taboo.includes('易脏')) {
          const lightColors = ['white', 'beige', 'pink', 'yellow'];
          if (items.every(i => lightColors.includes(i.color))) {
            return false; // 违反：全浅色易脏
          }
        }
      }
    }
  }

  return true;
}

/**
 * 计算搭配综合评分（0-100）
 * 新增：季节流行色/风格加分 + 模板匹配加分
 */
function calculateScore(
  items: ClothingItem[],
  knowledge: FashionKnowledge,
  matchedTrend: TrendInfo | null,
): number {
  let score = 70; // 基础分

  // 1. 配色评分（最高 +15）
  const colorPairs = getAllColorPairs(items);
  for (const [c1, c2] of colorPairs) {
    if (isComplementary(c1, c2, knowledge)) score += 8;
    if (isSameColor(c1, c2)) score += 4;
  }

  // 2. 风格一致性（最高 +10）
  const allStyles = items.flatMap(i => i.style);
  const uniqueStyles = new Set(allStyles);
  if (uniqueStyles.size === 1) score += 10;
  else if (uniqueStyles.size === 2) score += 5;

  // 3. 季节流行色加分（最高 +10）
  if (matchedTrend && matchedTrend.popularColors.length > 0) {
    const itemColors = items.map(i => i.color);
    const trendColorMatch = itemColors.filter(c => matchedTrend.popularColors.includes(c as any));
    score += Math.min(10, trendColorMatch.length * 3);
  }

  // 4. 季节流行风格加分（最高 +5）
  if (matchedTrend && matchedTrend.styles.length > 0) {
    const itemStyles = items.flatMap(i => i.style);
    const hasTrendStyle = itemStyles.some(s => matchedTrend.styles.includes(s as any));
    if (hasTrendStyle) score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

/** 获取所有衣服两两之间的颜色对 */
function getAllColorPairs(items: ClothingItem[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i].color, items[j].color]);
    }
  }
  return pairs;
}

/**
 * 是否是互补色
 * 现在从知识库的 colorRules 中读取（取评分 >= 70 的配对）
 */
function isComplementary(c1: string, c2: string, knowledge: FashionKnowledge): boolean {
  return knowledge.colorRules.some(r =>
    r.score >= 70 && (
      (r.color1 === c1 && r.color2 === c2) || (r.color1 === c2 && r.color2 === c1)
    )
  );
}

/** 是否是同色系 */
function isSameColor(c1: string, c2: string): boolean {
  return c1 === c2 && c1 !== 'multicolor';
}

/** 生成场合描述 */
function getOccasion(items: ClothingItem[], targetOccasion?: string): string {
  if (targetOccasion) return targetOccasion;

  const allStyles = items.flatMap(i => i.style);
  if (allStyles.includes('business')) return '上班通勤';
  if (allStyles.includes('sporty')) return '运动休闲';
  if (allStyles.includes('sweet') || allStyles.includes('fashion')) return '日常出行';
  return '日常出行';
}

/** 生成风格描述 */
function getStyle(items: ClothingItem[]): string {
  const styleSet = new Set(items.flatMap(i => i.style));
  const styles: Record<string, string> = {
    casual: '休闲', business: '商务', sporty: '运动', fashion: '时尚',
    sweet: '甜美', academic: '学院', street: '街头', pastoral: '田园',
  };
  return Array.from(styleSet).map(s => styles[s] || s).join('+') || '休闲';
}

/** 生成搭配理由（包含流行趋势信息） */
function generateReason(items: ClothingItem[], score: number, matchedTrend: TrendInfo | null): string {
  const names = items.map(i => i.name).join(' + ');
  const colors = items.map(i => i.color).join(' + ');

  let reason = `${names}，${colors}搭配`;
  if (score >= 85) reason += '，非常协调';
  else if (score >= 70) reason += '，整体协调';
  else reason += '，基础搭配';

  // 如果匹配了季节流行趋势，加上推荐标签
  if (matchedTrend) {
    const matchedColors = items.filter(i => matchedTrend.popularColors.includes(i.color as any));
    if (matchedColors.length > 0) {
      reason += '，符合本季流行色';
    }
  }

  return reason;
}

/** 生成配色说明 */
function getColorHarmony(items: ClothingItem[]): string {
  const colors = [...new Set(items.map(i => i.color))];
  if (colors.length === 1) return `${translateColor(colors[0])}同色系搭配`;
  return `${colors.map(translateColor).join('+')}搭配`;
}

function translateColor(c: string): string {
  const map: Record<string, string> = {
    white: '白色', black: '黑色', gray: '灰色', red: '红色',
    blue: '蓝色', green: '绿色', yellow: '黄色', pink: '粉色',
    purple: '紫色', brown: '棕色', beige: '米色', multicolor: '花色',
  };
  return map[c] || c;
}

/** 构建推荐结果 */
function buildSuggestion(
  items: ClothingItem[],
  score: number,
  knowledge: FashionKnowledge,
  targetOccasion?: string,
  matchedTrend?: TrendInfo | null,
  matchTemplates?: MatchTemplate[],
): OutfitSuggestion {
  // 查找是否有匹配的自定义模板
  let templateDescription = '';
  if (matchTemplates && matchTemplates.length > 0 && targetOccasion) {
    const itemCategories = items.map(i => i.category);
    const matchedTemplate = matchTemplates.find(t =>
      t.occasion === targetOccasion &&
      (itemCategories.some(c => t.topRange.includes(c as any)) ||
       itemCategories.some(c => t.bottomRange.includes(c as any)) ||
       itemCategories.some(c => t.shoesRange.includes(c as any)))
    );
    if (matchedTemplate) {
      templateDescription = `（参考模板：${matchedTemplate.description}）`;
    }
  }

  return {
    id: `outfit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    itemIds: items.map(i => i.id),
    score,
    reason: generateReason(items, score, matchedTrend || null) + templateDescription,
    occasion: getOccasion(items, targetOccasion),
    style: getStyle(items),
    colorHarmony: getColorHarmony(items),
  };
}
