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
import { AISettings } from '../components/AISettings';

interface GenerateResponse {
  outfits: OutfitSuggestion[];
  aiOutfits: OutfitSuggestion[] | null;
  source: string;
  aiAvailable: boolean;
  message?: string;
}

export function OutfitPage() {
  const queryClient = useQueryClient();

  const [occasion, setOccasion] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [riskLevel, setRiskLevel] = useState(3);
  const [generated, setGenerated] = useState<GenerateResponse | null>(null);

  const { data: aiStatus } = useQuery<{ available: boolean }>({
    queryKey: ['ai-status'],
    queryFn: () => get('/outfits/ai-status'),
    refetchInterval: 30000,
  });

  const { data: allItems = [] } = useQuery<ClothingItem[]>({
    queryKey: ['items'],
    queryFn: () => get('/items'),
  });

  const { data: savedOutfits = [] } = useQuery<SavedOutfit[]>({
    queryKey: ['saved-outfits'],
    queryFn: () => get('/outfits/saved'),
  });

  const savedIds = new Set(savedOutfits.flatMap((s: SavedOutfit) => [s.suggestion.id]));

  const generateMutation = useMutation({
    mutationFn: () => {
      const params = new URLSearchParams();
      if (occasion) params.set('occasion', occasion);
      if (useAI) params.set('useAI', 'true');
      params.set('risk', String(riskLevel));
      return get<GenerateResponse>(`/outfits/generate?${params.toString()}`);
    },
    onSuccess: (data) => {
      setGenerated(data);
    },
  });

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

  const removeSaveMutation = useMutation({
    mutationFn: (id: string) => del(`/outfits/saved/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-outfits'] });
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">穿搭推荐</h2>

      {/* AI 状态横幅 */}
      {aiStatus && !aiStatus.available && useAI && (
        <div className="bg-warning-soft border border-border rounded-xl px-4 py-3 text-xs text-warning-on-soft">
          💡 AI 助手未连接（DeepSeek API 不可用），当前使用本地规则推荐
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：AI 设置 + 生成器 */}
        <div className="lg:col-span-1 space-y-6">
          <AISettings />

          <OutfitGenerator
            occasion={occasion}
            useAI={useAI}
            riskLevel={riskLevel}
            generating={generateMutation.isPending}
            aiAvailable={aiStatus?.available || false}
            onOccasionChange={setOccasion}
            onUseAIChange={setUseAI}
            onRiskLevelChange={setRiskLevel}
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
            <div className="bg-surface rounded-2xl p-8 space-y-4 border border-border shadow-card">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-surface-2 rounded-lg h-24" />
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
            <div className="bg-surface rounded-2xl p-12 text-center border border-border shadow-card">
              <p className="text-ink-2">点击左侧按钮生成穿搭推荐</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
