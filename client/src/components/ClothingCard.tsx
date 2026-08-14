/**
 * 衣服卡片组件
 *
 * 展示单件衣服的图片、标签和操作按钮。
 */

import { ClothingItem } from '../types';
import { Pencil, Trash2, Archive, RefreshCw } from 'lucide-react';

interface ClothingCardProps {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archived: boolean) => void;
}

/** 标签颜色映射（衣物真实颜色，保持本色） */
const colorMap: Record<string, string> = {
  white: 'bg-white text-black',
  black: 'bg-gray-800 text-white',
  gray: 'bg-gray-500 text-white',
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  pink: 'bg-pink-400 text-white',
  purple: 'bg-purple-500 text-white',
  brown: 'bg-amber-800 text-white',
  beige: 'bg-amber-200 text-black',
  multicolor: 'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-black',
};

/** 分类中文名 */
const categoryLabel: Record<string, string> = {
  top: '上衣', bottom: '下装', outerwear: '外套', shoes: '鞋', accessory: '配饰', dress: '连衣裙',
};

/** 季节中文名 */
const seasonLabel: Record<string, string> = {
  spring: '春', summer: '夏', autumn: '秋', winter: '冬', all: '四季',
};

export function ClothingCard({ item, onEdit, onDelete, onArchive }: ClothingCardProps) {
  const imgSrc = item.imagePath.startsWith('http') ? item.imagePath : item.imagePath;

  return (
    <div className={`bg-surface rounded-2xl overflow-hidden border border-border shadow-card transition-all hover:shadow-card group ${item.isArchived ? 'opacity-60' : ''}`}>
      {/* 图片 */}
      <div className="aspect-[3/4] bg-surface-2 relative overflow-hidden">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* 操作按钮（悬停显示） */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="bg-black/60 hover:bg-black/80 rounded-full p-1.5"
            title="编辑"
          >
            <Pencil className="w-3.5 h-3.5 text-white" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="bg-black/60 hover:bg-danger rounded-full p-1.5"
            title="删除"
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* 归档标签 */}
        {item.isArchived && (
          <div className="absolute top-2 left-2 bg-warning-soft text-warning-on-soft text-xs px-2 py-0.5 rounded-full">
            已归档
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-ink font-medium text-sm truncate">{item.name}</h4>
          <span className="text-xs text-ink-2">{categoryLabel[item.category] || item.category}</span>
        </div>

        {/* 颜色标签 */}
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${colorMap[item.color] || 'bg-ink-3 text-white'}`}>
          {item.color}
        </span>

        {/* 季节标签 */}
        <div className="flex gap-1">
          {item.season.map(s => (
            <span key={s} className="text-xs bg-surface-2 text-ink-2 px-1.5 py-0.5 rounded">
              {seasonLabel[s] || s}
            </span>
          ))}
        </div>

        {/* 归档/恢复按钮 */}
        <button
          onClick={() => onArchive(item.id, !item.isArchived)}
          className={`flex items-center gap-1 text-xs mt-1 ${
            item.isArchived ? 'text-success-on-soft hover:text-success' : 'text-warning-on-soft hover:text-warning'
          }`}
        >
          {item.isArchived ? <RefreshCw className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
          {item.isArchived ? '恢复' : '归档'}
        </button>
      </div>
    </div>
  );
}
