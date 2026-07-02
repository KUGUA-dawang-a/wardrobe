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
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">还没有收藏的穿搭</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-white font-medium flex items-center gap-2">
        <Heart className="w-4 h-4 text-pink-400" />
        收藏的穿搭（{saved.length}）
      </h3>
      {saved.map(s => (
        <div key={s.id} className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium mb-1">
                {s.items.map(i => i.name).join(' + ')}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span>{s.suggestion.style}</span>
                <span>{s.suggestion.occasion}</span>
                <span className="text-indigo-300">{s.suggestion.colorHarmony}</span>
                <span className={`font-bold ${
                  s.suggestion.score >= 85 ? 'text-green-400' : s.suggestion.score >= 70 ? 'text-yellow-400' : 'text-slate-400'
                }`}>
                  {s.suggestion.score}分
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(s.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <button
              onClick={() => onRemove(s.id)}
              className="shrink-0 p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
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
