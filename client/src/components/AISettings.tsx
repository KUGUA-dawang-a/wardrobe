/**
 * AI 设置面板
 *
 * 在穿搭页面内嵌，配置 DeepSeek API Key。
 * Key 保存在后端 aiConfig.json（gitignore 排除），
 * 保存后立即生效并刷新 AI 状态。
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyRound, Check, AlertCircle } from 'lucide-react';
import { get, put } from '../api/client';

export function AISettings() {
  const queryClient = useQueryClient();
  const [value, setValue] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  const { data: config } = useQuery<{ configured: boolean }>({
    queryKey: ['ai-config'],
    queryFn: () => get('/outfits/ai-config'),
  });

  const saveMutation = useMutation({
    mutationFn: (apiKey: string) => put('/outfits/ai-config', { apiKey }),
    onSuccess: () => {
      setValue('');
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
      queryClient.invalidateQueries({ queryKey: ['ai-config'] });
      queryClient.invalidateQueries({ queryKey: ['ai-status'] });
    },
  });

  const configured = config?.configured ?? false;

  return (
    <div className="bg-surface rounded-2xl p-4 sm:p-5 space-y-3 border border-border shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-ink font-medium flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          AI 设置
        </h3>
        {configured ? (
          <span className="inline-flex items-center gap-1 text-xs text-success-on-soft bg-success-soft px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" /> 已配置
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-ink-2 bg-surface-2 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> 未配置
          </span>
        )}
      </div>

      <p className="text-xs text-ink-2">填入 DeepSeek API Key 后即可启用 AI 增强推荐。</p>

      <div className="flex gap-2">
        <input
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && value.trim() && !saveMutation.isPending) {
              saveMutation.mutate(value.trim());
            }
          }}
          placeholder={configured ? '输入新 Key 以覆盖' : '粘贴你的 DeepSeek API Key'}
          className="flex-1 min-w-0 bg-surface text-ink rounded-lg px-3 py-2 text-sm border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
        />
        <button
          onClick={() => saveMutation.mutate(value.trim())}
          disabled={!value.trim() || saveMutation.isPending}
          className="shrink-0 bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          {saveMutation.isPending ? '保存中...' : '保存'}
        </button>
      </div>

      {justSaved && (
        <p className="text-xs text-success-on-soft">✓ 已保存，AI 增强立即生效</p>
      )}
      {saveMutation.isError && (
        <p className="text-xs text-warning-on-soft">
          保存失败：{saveMutation.error?.message || '请重试'}
        </p>
      )}
    </div>
  );
}
