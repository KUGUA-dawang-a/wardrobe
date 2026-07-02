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
    <div className="bg-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
      <h3 className="text-white font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        生成穿搭推荐
      </h3>

      {/* 场合选择 */}
      <select
        value={occasion}
        onChange={e => onOccasionChange(e.target.value)}
        className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 outline-none focus:border-indigo-400"
      >
        {OCCASION_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* AI 开关 */}
      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={useAI}
          onChange={e => onUseAIChange(e.target.checked)}
          className="rounded bg-slate-700 border-slate-500 text-indigo-500 focus:ring-indigo-500"
        />
        <Bot className="w-4 h-4" />
        AI 增强推荐（需启动 Ollama）
      </label>

      {/* AI 状态 */}
      {!aiAvailable && useAI && (
        <p className="text-xs text-yellow-400 bg-yellow-400/10 px-3 py-2 rounded-lg">
          ⚠️ AI 助手未连接，当前使用本地规则推荐
        </p>
      )}

      {/* 生成按钮 */}
      <button
        onClick={onGenerate}
        disabled={generating}
        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        {generating ? '生成中...' : '生成穿搭推荐'}
      </button>
    </div>
  );
}
