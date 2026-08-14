/**
 * 穿搭生成控制面板
 *
 * 选择场合、切换 AI/Toggle、生成穿搭推荐。
 */

import { Sparkles, Bot } from 'lucide-react';

interface OutfitGeneratorProps {
  occasion: string;
  useAI: boolean;
  generating: boolean;
  aiAvailable: boolean;
  onOccasionChange: (v: string) => void;
  onUseAIChange: (v: boolean) => void;
  onGenerate: () => void;
}

const OCCASION_OPTIONS = [
  { value: '', label: '不限场合' },
  { value: '日常', label: '日常出行' },
  { value: '上班', label: '上班通勤' },
  { value: '约会', label: '约会' },
  { value: '运动', label: '运动' },
  { value: '校园', label: '校园' },
  { value: '正式', label: '正式场合' },
];

export function OutfitGenerator({
  occasion, useAI, generating, aiAvailable,
  onOccasionChange, onUseAIChange, onGenerate,
}: OutfitGeneratorProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 sm:p-6 space-y-4 border border-border shadow-card">
      <h3 className="text-ink font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        生成穿搭推荐
      </h3>

      {/* 场合选择 */}
      <select
        value={occasion}
        onChange={e => onOccasionChange(e.target.value)}
        className="w-full bg-surface text-ink rounded-lg px-3 py-2 text-sm border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
      >
        {OCCASION_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* AI 开关 */}
      <label className="flex items-center gap-2 text-sm text-ink-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={useAI}
          onChange={e => onUseAIChange(e.target.checked)}
          className="rounded accent-primary"
        />
        <Bot className="w-4 h-4" />
        AI 增强推荐（需启动 Ollama）
      </label>

      {/* AI 状态 */}
      {!aiAvailable && useAI && (
        <p className="text-xs text-warning-on-soft bg-warning-soft px-3 py-2 rounded-lg">
          ⚠️ AI 助手未连接，当前使用本地规则推荐
        </p>
      )}

      {/* 生成按钮 */}
      <button
        onClick={onGenerate}
        disabled={generating}
        className="w-full bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        {generating ? '生成中...' : '生成穿搭推荐'}
      </button>
    </div>
  );
}
