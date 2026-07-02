/**
 * 潮流知识库管理页面
 *
 * 查看和编辑配色规则、场合模板、穿搭禁忌。
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, put } from '../api/client';
import { FashionKnowledge } from '../types';
import { KnowledgeManager } from '../components/KnowledgeManager';
import { BookOpen } from 'lucide-react';

export function KnowledgePage() {
  const queryClient = useQueryClient();

  // 获取知识库
  const { data: knowledge, isLoading, error } = useQuery<FashionKnowledge>({
    queryKey: ['knowledge'],
    queryFn: () => get('/knowledge'),
  });

  // 保存知识库
  const saveMutation = useMutation({
    mutationFn: (data: FashionKnowledge) => put('/knowledge', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });

  // 加载中
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">潮流知识库</h2>
        <div className="bg-slate-800 rounded-xl p-8 animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3" />
          <div className="h-64 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !knowledge) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">潮流知识库</h2>
        <div className="bg-slate-800 rounded-xl p-8 text-center">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-red-400 text-sm">加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">潮流知识库</h2>
      <p className="text-slate-400 text-xs">
        管理配色规则、场合穿搭模板和禁忌规则，用于本地穿搭推荐引擎。
      </p>
      <KnowledgeManager
        knowledge={knowledge}
        onSave={async (data) => {
          await saveMutation.mutateAsync(data);
        }}
      />
    </div>
  );
}
