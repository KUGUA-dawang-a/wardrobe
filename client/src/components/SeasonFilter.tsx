/**
 * 季节筛选 + 归档管理
 *
 * 按季节筛选衣橱 + 一键归档/恢复季节。
 */

import { Season } from '../types';
import { Archive, RefreshCw } from 'lucide-react';

export const SEASON_FILTERS: { value: Season | ''; label: string }[] = [
  { value: '', label: '全部' },
  { value: 'spring', label: '春' },
  { value: 'summer', label: '夏' },
  { value: 'autumn', label: '秋' },
  { value: 'winter', label: '冬' },
];

export const COLOR_FILTERS = [
  { value: '', label: '全部颜色' },
  { value: 'white', label: '白色' },
  { value: 'black', label: '黑色' },
  { value: 'gray', label: '灰色' },
  { value: 'red', label: '红色' },
  { value: 'blue', label: '蓝色' },
  { value: 'multicolor', label: '花色' },
];

export const STYLE_FILTERS = [
  { value: '', label: '全部风格' },
  { value: 'casual', label: '休闲' },
  { value: 'business', label: '商务' },
  { value: 'sporty', label: '运动' },
  { value: 'sweet', label: '甜美' },
];

interface SeasonFilterProps {
  seasonFilter: string;
  colorFilter: string;
  styleFilter: string;
  showArchived: boolean;
  onSeasonChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onStyleChange: (v: string) => void;
  onShowArchivedChange: (v: boolean) => void;
  onArchiveSeason: (season: Season, archived: boolean) => void;
}

const selectClass =
  'bg-surface text-ink rounded-lg px-3 py-2 text-sm border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft';

export function SeasonFilter({
  seasonFilter, colorFilter, styleFilter, showArchived,
  onSeasonChange, onColorChange, onStyleChange, onShowArchivedChange,
  onArchiveSeason,
}: SeasonFilterProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 space-y-3 border border-border shadow-card">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select value={seasonFilter} onChange={e => onSeasonChange(e.target.value)} className={selectClass}>
          {SEASON_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select value={colorFilter} onChange={e => onColorChange(e.target.value)} className={selectClass}>
          {COLOR_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select value={styleFilter} onChange={e => onStyleChange(e.target.value)} className={selectClass}>
          {STYLE_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-ink-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={e => onShowArchivedChange(e.target.checked)}
            className="rounded accent-primary"
          />
          显示已归档
        </label>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <span className="text-xs text-ink-2 mr-1 self-center">换季归档：</span>
        {SEASON_FILTERS.filter(f => f.value).map(f => (
          <button
            key={f.value}
            onClick={() => onArchiveSeason(f.value as Season, true)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-surface-2 text-warning-on-soft hover:bg-border-strong"
          >
            <Archive className="w-3 h-3" />
            归档{f.label}
          </button>
        ))}
        <button
          onClick={() => {
            (['spring', 'summer', 'autumn', 'winter'] as Season[]).forEach(s => onArchiveSeason(s, false));
          }}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-surface-2 text-success-on-soft hover:bg-border-strong"
        >
          <RefreshCw className="w-3 h-3" />
          全部恢复
        </button>
      </div>
    </div>
  );
}
