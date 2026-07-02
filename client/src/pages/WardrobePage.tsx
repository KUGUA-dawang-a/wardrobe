/**
 * 衣橱主页
 *
 * 包含：筛选栏 + 上传表单 + 衣橱网格 + 编辑弹窗
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '../api/client';
import { ClothingItem } from '../types';
import { UploadForm } from '../components/UploadForm';
import { WardrobeGrid } from '../components/WardrobeGrid';
import { EditItemModal } from '../components/EditItemModal';
import { SeasonFilter } from '../components/SeasonFilter';

export function WardrobePage() {
  const queryClient = useQueryClient();

  // 筛选条件
  const [seasonFilter, setSeasonFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // 编辑状态
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  // 获取衣橱数据
  const { data: items = [], isLoading, error } = useQuery<ClothingItem[]>({
    queryKey: ['items', seasonFilter, colorFilter, styleFilter, showArchived],
    queryFn: () => {
      const params = new URLSearchParams();
      if (seasonFilter) params.set('season', seasonFilter);
      if (colorFilter) params.set('color', colorFilter);
      if (styleFilter) params.set('style', styleFilter);
      if (showArchived) params.set('archived', 'true');
      // 每次筛选变更时，让服务端过滤
      return get<ClothingItem[]>(`/items?${params.toString()}`);
    },
  });

  // 编辑衣物
  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClothingItem> }) =>
      put<ClothingItem>(`/items/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  // 删除衣物
  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  // 归档/恢复
  const archiveMutation = useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      put(`/items/${id}`, { isArchived: archived }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  // 一键归档季节
  const archiveSeasonMutation = useMutation({
    mutationFn: ({ season, archived }: { season: string; archived: boolean }) =>
      post('/items/archive', { season, archived }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  // 上传处理
  const handleUpload = useCallback(async (data: any) => {
    // 先上传图片到 /api/upload
    const formData = new FormData();
    formData.append('image', data.image);
    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    if (!uploadRes.ok) {
      const errData = await uploadRes.json();
      throw new Error(errData.error || '上传失败');
    }
    const { imagePath } = await uploadRes.json();

    // 创建衣物
    await post('/items', {
      name: data.name,
      category: data.category,
      color: data.color,
      season: data.season,
      style: data.style,
      imagePath,
    });
    queryClient.invalidateQueries({ queryKey: ['items'] });
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">我的衣橱</h2>

      {/* 筛选栏 */}
      <SeasonFilter
        seasonFilter={seasonFilter}
        colorFilter={colorFilter}
        styleFilter={styleFilter}
        showArchived={showArchived}
        onSeasonChange={setSeasonFilter}
        onColorChange={setColorFilter}
        onStyleChange={setStyleFilter}
        onShowArchivedChange={setShowArchived}
        onArchiveSeason={(season, archived) => archiveSeasonMutation.mutate({ season, archived })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 上传表单 */}
        <div className="lg:col-span-1">
          <UploadForm onUpload={handleUpload} />
        </div>

        {/* 衣橱网格 */}
        <div className="lg:col-span-3">
          <WardrobeGrid
            items={items}
            loading={isLoading}
            error={error ? (error as any).message || '加载失败' : null}
            onEdit={setEditingItem}
            onDelete={id => deleteMutation.mutate(id)}
            onArchive={(id, archived) => archiveMutation.mutate({ id, archived })}
          />
        </div>
      </div>

      {/* 编辑弹窗 */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={async (id, data) => {
            await editMutation.mutateAsync({ id, data });
          }}
        />
      )}
    </div>
  );
}
