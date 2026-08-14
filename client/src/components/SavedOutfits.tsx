/**
 * 收藏穿搭列表
 *
 * 展示用户收藏的穿搭，支持取消收藏。
 */

import { SavedOutfit } from '../types';
import { Heart, Trash2, Calendar } from 'lucide-react';

interface SavedOutfitsProps {
  saved: SavedOutfit[];
  onRemove: (id: string) => void;
}

export function SavedOutfits({ saved, onRemove }: SavedOutfitsProps) {
  if (saved.length === 0) {
    return (
      <div className="bg-surface rounded-2xl p-8 text-center border border-border shadow-card">
        <Heart className="w-10 h-10 text-ink-3 mx-auto mb-2" />
        <p className="text-ink-2 text-sm">还没有收藏的穿搭</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-ink font-medium flex items-center gap-2">
        <Heart className="w-4 h-4 text-danger" />
        收藏的穿搭（{saved.length}）
      </h3>
      {saved.map(s => (
        <div key={s.id} className="bg-surface rounded-2xl p-4 border border-border shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-ink text-sm font-medium mb-1">
                {s.items.map(i => i.name).join(' + ')}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-ink-2">
                <span>{s.suggestion.style}</span>
                <span>{s.suggestion.occasion}</span>
                <span className="text-primary-on-soft">{s.suggestion.colorHarmony}</span>
                <span className={`font-bold ${
                  s.suggestion.score >= 85 ? 'text-success-on-soft' : s.suggestion.score >= 70 ? 'text-warning-on-soft' : 'text-ink-2'
                }`}>
                  {s.suggestion.score}分
                </span>
              </div>
              <p className="text-xs text-ink-3 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(s.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <button
              onClick={() => onRemove(s.id)}
              className="shrink-0 p-2 rounded-lg bg-surface-2 text-ink-2 hover:bg-danger-soft hover:text-danger transition-colors"
              title="取消收藏"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
