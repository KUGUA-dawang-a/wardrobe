/**
 * 衣橱网格组件
 *
 * 展示衣服卡片列表，支持加载、空状态、错误状态。
 */

import { ClothingItem } from '../types';
import { ClothingCard } from './ClothingCard';
import { SkeletonGrid } from './SkeletonCard';
import { Shirt } from 'lucide-react';

interface WardrobeGridProps {
  items: ClothingItem[];
  loading: boolean;
  error: string | null;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archived: boolean) => void;
}

export function WardrobeGrid({ items, loading, error, onEdit, onDelete, onArchive }: WardrobeGridProps) {
  // 加载中 → 骨架屏
  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  // 错误状态
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400 mb-2">加载失败</p>
        <p className="text-slate-500 text-sm">{error}</p>
      </div>
    );
  }

  // 空状态
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Shirt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">还没有衣服，快上传一件吧！</p>
      </div>
    );
  }

  // 正常展示
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <ClothingCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
