/**
 * 穿搭推荐页面
 *
 * 生成穿搭推荐 + 显示结果 + 收藏管理 + AI 状态检测
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, del } from '../api/client';
import { OutfitSuggestion, ClothingItem, SavedOutfit } from '../types';
import { OutfitGenerator } from '../components/OutfitGenerator';
import { OutfitResult } from '../components/OutfitResult';
import { SavedOutfits } from '../components/SavedOutfits';

// 穿搭生成 API 返回类型
interface GenerateResponse {
  outfits: OutfitSuggestion[];
  aiOutfits: OutfitSuggestion[] | null;
  source: string;
  aiAvailable: boolean;
  message?: string;
}

export function OutfitPage() {
  const queryClient = useQueryClient();

  // 控制状态
  const [occasion, setOccasion] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [generated, setGenerated] = useState<GenerateResponse | null>(null);

  // AI 可用性检测
  const { data: aiStatus } = useQuery<{ available: boolean }>({
    queryKey: ['ai-status'],
    queryFn: () => get('/outfits/ai-status'),
    refetchInterval: 30000, // 每 30 秒检查一次
  });

  // 获取所有衣物（用于展示名称）
  const { data: allItems = [] } = useQuery<ClothingItem[]>({
    queryKey: ['items'],
    queryFn: () => get('/items'),
  });

  // 获取收藏
  const { data: savedOutfits = [] } = useQuery<SavedOutfit[]>({
    queryKey: ['saved-outfits'],
    queryFn: () => get('/outfits/saved'),
  });

  // 收藏 ID 集合（用于快速判断）
  const savedIds = new Set(savedOutfits.flatMap((s: SavedOutfit) => [s.suggestion.id]));

  // 生成穿搭
  const generateMutation = useMutation({
    mutationFn: () => {
      const params = new URLSearchParams();
      if (occasion) params.set('occasion', occasion);
      if (useAI) params.set('useAI', 'true');
      return get<GenerateResponse>(`/outfits/generate?${params.toString()}`);
    },
    onSuccess: (data) => {
      setGenerated(data);
    },
  });

  // 收藏穿搭
  const saveMutation = useMutation({
    mutationFn: (suggestion: OutfitSuggestion) =>
      post('/outfits/saved', {
        suggestion,
        itemIds: suggestion.itemIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-outfits'] });
    },
  });

  // 取消收藏
  const removeSaveMutation = useMutation({
    mutationFn: (id: string) => del(`/outfits/saved/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-outfits'] });
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">穿搭推荐</h2>

      {/* AI 状态横幅 */}
      {aiStatus && !aiStatus.available && useAI && (
        <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-3 text-xs text-yellow-400">
          💡 AI 助手未连接（Ollama 未运行），当前使用本地规则推荐
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：生成器 */}
        <div className="lg:col-span-1 space-y-6">
          <OutfitGenerator
            occasion={occasion}
            useAI={useAI}
            generating={generateMutation.isPending}
            aiAvailable={aiStatus?.available || false}
            onOccasionChange={setOccasion}
            onUseAIChange={setUseAI}
            onGenerate={() => generateMutation.mutate()}
          />

          {/* 收藏列表 */}
          <SavedOutfits
            saved={savedOutfits}
            onRemove={(id) => removeSaveMutation.mutate(id)}
          />
        </div>

        {/* 右侧：推荐结果 */}
        <div className="lg:col-span-2">
          {generateMutation.isPending ? (
            <div className="bg-slate-800 rounded-xl p-8 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-slate-700 rounded-lg h-24" />
              ))}
            </div>
          ) : generated ? (
            <OutfitResult
              outfits={generated.outfits}
              aiOutfits={generated.aiOutfits}
              source={generated.source}
              aiAvailable={generated.aiAvailable}
              items={allItems}
              savedIds={savedIds}
              onSave={(suggestion) => saveMutation.mutate(suggestion)}
            />
          ) : (
            <div className="bg-slate-800 rounded-xl p-12 text-center">
              <p className="text-slate-400">点击左侧按钮生成穿搭推荐</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
