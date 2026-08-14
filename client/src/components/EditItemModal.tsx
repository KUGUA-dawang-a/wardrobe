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

const fieldClass =
  'w-full bg-surface text-ink rounded-lg px-3 py-2 text-sm border border-border focus:border-primary focus:ring-2 focus:ring-primary-soft outline-none';

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
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md border border-border shadow-card" onClick={e => e.stopPropagation()}>
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ink font-medium">编辑衣物</h3>
          <button onClick={onClose} className="text-ink-2 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 名称 */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className={`${fieldClass} mb-3`}
        />

        {/* 分类 & 颜色 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select value={category} onChange={e => setCategory(e.target.value as ClothingCategory)}
            className={fieldClass}>
            {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={color} onChange={e => setColor(e.target.value as ClothingColor)}
            className={fieldClass}>
            {COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* 季节 */}
        <div className="mb-3">
          <p className="text-xs text-ink-2 mb-2">季节</p>
          <div className="flex flex-wrap gap-2">
            {SEASON_OPTIONS.map(s => (
              <button key={s.value} onClick={() => toggleSeason(s.value)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  seasons.includes(s.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 风格 */}
        <div className="mb-4">
          <p className="text-xs text-ink-2 mb-2">风格</p>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map(s => (
              <button key={s.value} onClick={() => toggleStyle(s.value)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  styles.includes(s.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}
