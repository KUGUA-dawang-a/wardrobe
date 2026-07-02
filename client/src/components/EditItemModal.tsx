/**
 * 编辑衣物弹窗
 *
 * 点击衣物卡片的编辑按钮时弹出，修改衣物的标签信息。
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { ClothingItem, Season, Style, ClothingCategory, ClothingColor } from '../types';
import { CATEGORY_OPTIONS, COLOR_OPTIONS, SEASON_OPTIONS, STYLE_OPTIONS } from '../types';

interface EditItemModalProps {
  item: ClothingItem;
  onClose: () => void;
  onSave: (id: string, data: Partial<ClothingItem>) => Promise<void>;
}

export function EditItemModal({ item, onClose, onSave }: EditItemModalProps) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<ClothingCategory>(item.category);
  const [color, setColor] = useState<ClothingColor>(item.color);
  const [seasons, setSeasons] = useState<Season[]>(item.season);
  const [styles, setStyles] = useState<Style[]>(item.style);
  const [saving, setSaving] = useState(false);

  const toggleSeason = (s: Season) => {
    setSeasons(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleStyle = (s: Style) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(item.id, { name, category, color, season: seasons, style: styles });
      onClose();
    } catch {
      // 错误由父组件处理
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">编辑衣物</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 名称 */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-indigo-400 outline-none mb-3"
        />

        {/* 分类 & 颜色 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select value={category} onChange={e => setCategory(e.target.value as ClothingCategory)}
            className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-indigo-400 outline-none">
            {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={color} onChange={e => setColor(e.target.value as ClothingColor)}
            className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-indigo-400 outline-none">
            {COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* 季节 */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-2">季节</p>
          <div className="flex flex-wrap gap-2">
            {SEASON_OPTIONS.map(s => (
              <button key={s.value} onClick={() => toggleSeason(s.value)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  seasons.includes(s.value) ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 风格 */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">风格</p>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map(s => (
              <button key={s.value} onClick={() => toggleStyle(s.value)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  styles.includes(s.value) ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}
