/**
 * DeepSeek AI 时尚顾问服务
 *
 * 调用 DeepSeek API（OpenAI 兼容接口）来增强穿搭推荐。
 * 如果未配置 API Key 或请求失败，自动降级（返回 null），不会报错。
 *
 * 提示词强制 AI 只输出标准 JSON，方便前端直接渲染。
 * 将用户自定义的季节潮流和搭配模板一并传入模型。
 */

import axios from 'axios';
import { config } from '../config';
import { getApiKey } from './aiConfigService';
import { ClothingItem, FashionKnowledge, OutfitSuggestion } from '../types';

/** 检查 DeepSeek API 是否可用（已配置 Key 且服务可达） */
export async function checkAI(): Promise<boolean> {
  const apiKey = getApiKey();
  if (!apiKey) return false;
  try {
    const res = await axios.get(`${config.deepseek.baseUrl}/models`, {
      timeout: 3000,
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

/**
 * 调用 DeepSeek 生成穿搭推荐
 *
 * @param items 用户的衣橱（当前筛选后的）
 * @param knowledge 潮流知识库（含 trendInfo / matchTemplates）
 * @param targetOccasion 目标场合
 * @param riskLevel 配色风险值 1-5（1 最保守，5 最大胆），默认 3
 * @returns AI 生成的穿搭推荐，或 null（API 不可用）
 */
export async function aiGenerateOutfits(
  items: ClothingItem[],
  knowledge: FashionKnowledge,
  targetOccasion?: string,
  riskLevel = 3,
): Promise<OutfitSuggestion[] | null> {
  // 先检查 API 是否可用
  const apiKey = getApiKey();
  if (!apiKey) return null;

  // 构建给 AI 的衣橱描述
  const itemsDesc = items.map(i =>
    `- ${i.name}（分类: ${i.category}，颜色: ${i.color}，风格: ${i.style.join('/')}，季节: ${i.season.join('/')}）`
  ).join('\n');

  // 构建配色规则描述
  const colorRulesDesc = knowledge.colorRules.map(r =>
    `${r.color1}+${r.color2}: ${r.description}（评分: ${r.score}）`
  ).join('\n');

  // 构建场合模板描述
  const occasionsDesc = knowledge.occasions.map(o =>
    `${o.name}: 推荐风格 ${o.style.join('/')}，${o.description}`
  ).join('\n');

  // 构建禁忌描述
  const taboosDesc = knowledge.taboos.map(t =>
    `${t.description}（原因: ${t.reason}）`
  ).join('\n');

  // ===== 构建季节潮流描述 =====
  const trendInfoDesc = (knowledge.trendInfo || []).map(t =>
    `${t.yearQuarter} ${t.season}季：流行色 ${t.popularColors.join('、')}，推荐风格 ${t.styles.join('、')}，禁忌 ${t.taboos.join('、')}`
  ).join('\n');

  // ===== 构建自定义搭配模板描述 =====
  const matchTemplatesDesc = (knowledge.matchTemplates || []).map(m =>
    `模板"${m.name}"：场合 ${m.occasion}，季节 ${m.season}，风格 ${m.style}，上装可选 ${m.topRange.join('/')}，下装可选 ${m.bottomRange.join('/')}，外套可选 ${m.outerwearRange.join('/')}，鞋子可选 ${m.shoesRange.join('/')}，说明：${m.description}`
  ).join('\n');

  // 构建风险等级描述
  const riskTexts: Record<number, string> = {
    1: '1（保守经典）：配色安全协调，回避撞色，如黑白、蓝白、大地色系',
    2: '2（稳健）：以安全协调配色为主，最多少量低对比点缀',
    3: '3（均衡）：安全与大胆平衡，可适度使用撞色',
    4: '4（大胆）：鼓励高对比撞色（如红蓝、蓝橙、紫黄），配色个性鲜明',
    5: '5（前卫）：追求强视觉冲击，大胆使用撞色与高对比，不要保守',
  };
  const riskText = riskTexts[riskLevel] || riskTexts[3];

  // 构建提示词 —— 强制 JSON 输出
  const prompt = `请根据以下用户的衣橱和潮流知识库，生成穿搭推荐。

【潮流配色规则】
${colorRulesDesc}

【场合穿搭指南】
${occasionsDesc}

【穿搭禁忌】
${taboosDesc}

${trendInfoDesc ? `【季节流行趋势】\n${trendInfoDesc}\n` : ''}
${matchTemplatesDesc ? `【用户自定义搭配模板】\n${matchTemplatesDesc}\n` : ''}

${targetOccasion ? `【目标场合】${targetOccasion}` : ''}

【风险等级】${riskText}

【用户的衣橱】
${itemsDesc}

请从衣橱中选择合适的单品，组成完整的穿搭（至少包含上装+下装+鞋）。
请严格遵守以下规则：
1. 不要违反穿搭禁忌
2. 衣服的季节要匹配
3. 配色要与风险等级匹配（见【风险等级】）：≤2 用保守协调配色，≥4 用大胆撞色但保持整体和谐
4. 符合目标场合（如果有指定）
5. 参考季节流行趋势，优先使用流行色
6. 如果有搭配模板命中目标场合，优先按照模板推荐

只输出以下 JSON 格式，不要输出任何其他文字：
{
  "outfits": [
    {
      "id": "ai-1",
      "items": ["单品名称1", "单品名称2", "单品名称3"],
      "score": 85,
      "reason": "搭配理由（20字以内）",
      "occasion": "适用场合",
      "style": "整体风格",
      "colorHarmony": "配色说明"
    }
  ]
}

请生成 3-5 套不同的搭配方案。`;

  try {
    const response = await axios.post(
      `${config.deepseek.baseUrl}/chat/completions`,
      {
        model: config.deepseek.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的时尚穿搭顾问。必须严格遵守用户要求，只输出标准 JSON，不要输出任何其他文字。',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        stream: false,
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    let text = response.data.choices?.[0]?.message?.content;
    if (!text) return null;

    // 清理可能包裹的 markdown 代码块围栏
    text = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

    // 从返回文本中提取 JSON
    const jsonMatch = text.match(/\{[^]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.outfits || !Array.isArray(parsed.outfits)) return null;

    // 转换为 OutfitSuggestion 格式
    return parsed.outfits.map((o: any) => ({
      id: o.id || `ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      itemIds: [] as string[], // AI 返回的是名称，无法映射到 ID，用空数组
      score: o.score || 70,
      reason: o.reason || 'AI 推荐搭配',
      occasion: o.occasion || '日常',
      style: o.style || '休闲',
      colorHarmony: o.colorHarmony || '',
    }));
  } catch (error: any) {
    console.warn('[AI Service] DeepSeek 调用失败:', error.message);
    return null;
  }
}
