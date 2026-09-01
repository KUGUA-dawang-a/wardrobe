/**
 * 穿搭推荐结果展示
 *
 * 展示规则引擎 / AI 生成的穿搭推荐卡片，支持点赞收藏。
 */

import { OutfitSuggestion, ClothingItem } from '../types';
import { Heart, Sparkles, Shirt, Sun } from 'lucide-react';

interface OutfitResultProps {
  outfits: OutfitSuggestion[];
  aiOutfits: OutfitSuggestion[] | null;
  source: string;
  aiAvailable: boolean;
  items: ClothingItem[];
  savedIds: Set<string>;
  onSave: (suggestion: OutfitSuggestion) => void;
}

/** 获取搭配中某件衣服的名称 */
function getItemNames(itemIds: string[], allItems: ClothingItem[]): string {
  return itemIds
    .map(id => allItems.find(i => i.id === id)?.name)
    .filter(Boolean)
    .join(' + ');
}

/** 评分颜色 */
function scoreColor(score: number): string {
  if (score >= 85) return 'text-success-on-soft';
  if (score >= 70) return 'text-warning-on-soft';
  return 'text-ink-2';
}

/** 评分条宽度 */
function scoreBar(score: number): string {
  return `${score}%`;
}

export function OutfitResult({ outfits, aiOutfits, source, aiAvailable, items, savedIds, onSave }: OutfitResultProps) {
  const hasOutfits = outfits.length > 0;
  const hasAi = aiOutfits && aiOutfits.length > 0;

  if (!hasOutfits && !hasAi) {
    if (source === 'empty') {
      return (
        <div className="bg-surface rounded-2xl p-8 text-center border border-border shadow-card">
          <Shirt className="w-12 h-12 text-ink-3 mx-auto mb-3" />
          <p className="text-ink-2">衣橱中衣服太少，请先上传至少 2 件衣服</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 规则引擎推荐 */}
      {hasOutfits && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-ink font-medium">推荐搭配</h3>
            <span className="text-xs text-ink-3">（本地规则引擎）</span>
          </div>
          <div className="grid gap-3">
            {outfits.slice(0, 6).map(o => (
              <OutfitCard key={o.id} outfit={o} items={items} savedIds={savedIds} onSave={onSave} />
            ))}
          </div>
        </div>
      )}

      {/* AI 推荐 */}
      {hasAi && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-4 h-4 text-warning" />
            <h3 className="text-ink font-medium">AI 推荐搭配</h3>
            <span className="text-xs text-success-on-soft">✨ AI 增强</span>
          </div>
          <div className="grid gap-3">
            {aiOutfits!.map(o => (
              <OutfitCard key={o.id} outfit={o} items={items} savedIds={savedIds} onSave={onSave} isAI />
            ))}
          </div>
        </div>
      )}

      {!aiAvailable && source !== 'empty' && (
        <p className="text-xs text-warning-on-soft bg-warning-soft px-3 py-2 rounded-lg text-center">
          💡 AI 助手未连接（DeepSeek API 不可用），当前使用本地规则推荐
        </p>
      )}
    </div>
  );
}

/** 单条推荐卡片 */
function OutfitCard({ outfit, items, savedIds, onSave, isAI }: {
  outfit: OutfitSuggestion;
  items: ClothingItem[];
  savedIds: Set<string>;
  onSave: (suggestion: OutfitSuggestion) => void;
  isAI?: boolean;
}) {
  const isSaved = savedIds.has(outfit.id);

  return (
    <div className="bg-surface rounded-2xl p-4 border border-border shadow-card">
      <div className="flex items-start justify-between gap-4">
        {/* 左侧：搭配信息 */}
        <div className="flex-1 min-w-0">
          <p className="text-ink text-sm font-medium mb-1">
            {getItemNames(outfit.itemIds, items) || outfit.reason}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-ink-2 mb-2">
            <span className="flex items-center gap-1">
              <Shirt className="w-3 h-3" />
              {outfit.style}
            </span>
            <span>{outfit.occasion}</span>
            <span className="text-primary-on-soft">{outfit.colorHarmony}</span>
          </div>

          {/* 评分条 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  outfit.score >= 85 ? 'bg-success' : outfit.score >= 70 ? 'bg-warning' : 'bg-ink-3'
                }`}
                style={{ width: scoreBar(outfit.score) }}
              />
            </div>
            <span className={`text-xs font-bold ${scoreColor(outfit.score)}`}>{outfit.score}分</span>
          </div>
        </div>

        {/* 右侧：收藏按钮 */}
        <button
          onClick={() => onSave(outfit)}
          disabled={isSaved}
          className={`shrink-0 p-2 rounded-lg transition-colors ${
            isSaved
              ? 'bg-danger-soft text-danger cursor-not-allowed'
              : 'bg-surface-2 text-ink-2 hover:bg-danger-soft hover:text-danger'
          }`}
          title={isSaved ? '已收藏' : '收藏搭配'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
