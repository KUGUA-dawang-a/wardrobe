/**
 * 潮流知识库管理面板
 *
 * 以表格形式展示配色规则、场合模板、穿搭禁忌，支持新增、编辑、删除操作。
 */

import { useState } from 'react';
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { FashionKnowledge, ColorRule, OccasionTemplate, Taboo, COLOR_OPTIONS, STYLE_OPTIONS } from '../types';

interface KnowledgeManagerProps {
  knowledge: FashionKnowledge;
  onSave: (knowledge: FashionKnowledge) => Promise<void>;
}

const miniInput =
  'bg-surface text-ink rounded px-2 py-1 text-xs border border-border focus:border-primary';

// ===== 配色规则管理 =====
function ColorRulesEditor({ rules, onUpdate }: { rules: ColorRule[]; onUpdate: (r: ColorRule[]) => void }) {
  const [editing, setEditing] = useState<number | null>(null);
  const [newRule, setNewRule] = useState<ColorRule>({ color1: 'white', color2: 'black', score: 80, description: '' });

  const addRule = () => {
    if (!newRule.description) return;
    onUpdate([...rules, { ...newRule }]);
    setNewRule({ color1: 'white', color2: 'black', score: 80, description: '' });
  };

  const updateRule = (index: number, data: Partial<ColorRule>) => {
    const updated = rules.map((r, i) => i === index ? { ...r, ...data } : r);
    onUpdate(updated);
    setEditing(null);
  };

  const deleteRule = (index: number) => {
    onUpdate(rules.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ink-2 text-xs border-b border-border">
              <th className="text-left py-2 px-2">颜色 A</th>
              <th className="text-left py-2 px-2">颜色 B</th>
              <th className="text-left py-2 px-2">评分</th>
              <th className="text-left py-2 px-2">说明</th>
              <th className="py-2 px-2 w-20">操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, i) => (
              <tr key={i} className="border-b border-border">
                {editing === i ? (
                  <>
                    <td className="py-2 px-2">
                      <select value={rule.color1} onChange={e => updateRule(i, { color1: e.target.value as any })}
                        className={`${miniInput} w-full`}>
                        {COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <select value={rule.color2} onChange={e => updateRule(i, { color2: e.target.value as any })}
                        className={`${miniInput} w-full`}>
                        {COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      <input type="number" defaultValue={rule.score} onBlur={e => updateRule(i, { score: +e.target.value })}
                        className={`${miniInput} w-16`} min={0} max={100} />
                    </td>
                    <td className="py-2 px-2">
                      <input type="text" defaultValue={rule.description} onBlur={e => updateRule(i, { description: e.target.value })}
                        className={`${miniInput} w-full`} />
                    </td>
                    <td className="py-2 px-2">
                      <button onClick={() => setEditing(null)} className="text-success-on-soft hover:text-success p-1"><Check className="w-3.5 h-3.5" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-2 text-ink">{COLOR_OPTIONS.find(o => o.value === rule.color1)?.label || rule.color1}</td>
                    <td className="py-2 px-2 text-ink">{COLOR_OPTIONS.find(o => o.value === rule.color2)?.label || rule.color2}</td>
                    <td className="py-2 px-2"><span className={`${rule.score >= 80 ? 'text-success-on-soft' : rule.score >= 60 ? 'text-warning-on-soft' : 'text-ink-2'}`}>{rule.score}</span></td>
                    <td className="py-2 px-2 text-ink-2">{rule.description}</td>
                    <td className="py-2 px-2 flex gap-1">
                      <button onClick={() => setEditing(i)} className="text-ink-2 hover:text-primary p-1"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteRule(i)} className="text-ink-2 hover:text-danger p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新增 */}
      <div className="flex flex-wrap gap-2 mt-3 items-center">
        <select value={newRule.color1} onChange={e => setNewRule({ ...newRule, color1: e.target.value as any })}
          className={miniInput}>
          {COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="text-ink-3">+</span>
        <select value={newRule.color2} onChange={e => setNewRule({ ...newRule, color2: e.target.value as any })}
          className={miniInput}>
          {COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="number" value={newRule.score} onChange={e => setNewRule({ ...newRule, score: +e.target.value })}
          className={`${miniInput} w-16`} min={0} max={100} placeholder="评分" />
        <input type="text" value={newRule.description} onChange={e => setNewRule({ ...newRule, description: e.target.value })}
          className={`${miniInput} flex-1 min-w-[120px]`} placeholder="配色说明" />
        <button onClick={addRule} disabled={!newRule.description}
          className="bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded px-2 py-1 text-xs flex items-center gap-1">
          <Plus className="w-3 h-3" /> 添加
        </button>
      </div>
    </div>
  );
}

// ===== 场合模板管理 =====
function OccasionsEditor({ occasions, onUpdate }: { occasions: OccasionTemplate[]; onUpdate: (o: OccasionTemplate[]) => void }) {
  const [newItem, setNewItem] = useState<OccasionTemplate>({ name: '', style: [], forbidden: [], description: '' });

  const addItem = () => {
    if (!newItem.name) return;
    onUpdate([...occasions, { ...newItem }]);
    setNewItem({ name: '', style: [], forbidden: [], description: '' });
  };

  const deleteItem = (index: number) => {
    onUpdate(occasions.filter((_, i) => i !== index));
  };

  const toggleStyle = (item: OccasionTemplate, style: any) => {
    item.style = item.style.includes(style) ? item.style.filter(s => s !== style) : [...item.style, style];
    onUpdate([...occasions]);
  };

  return (
    <div>
      <div className="space-y-2">
        {occasions.map((o, i) => (
          <div key={i} className="bg-surface-2 rounded-lg p-3 flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-ink text-sm font-medium">{o.name}</div>
              <div className="text-xs text-ink-2 mt-1">
                风格：{o.style.map(s => STYLE_OPTIONS.find(so => so.value === s)?.label || s).join('、') || '不限'}
              </div>
              {o.description && <div className="text-xs text-ink-3 mt-0.5">{o.description}</div>}
              {o.forbidden.length > 0 && (
                <div className="text-xs text-danger-on-soft mt-0.5">禁忌：{o.forbidden.join('、')}</div>
              )}
            </div>
            <button onClick={() => deleteItem(i)} className="text-ink-2 hover:text-danger p-1"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>

      {occasions.length === 0 && <p className="text-ink-3 text-xs py-4 text-center">暂无场合模板</p>}

      {/* 新增 */}
      <div className="flex flex-wrap gap-2 mt-3">
        <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          className={`${miniInput} w-24`} placeholder="场合名" />
        <input type="text" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
          className={`${miniInput} flex-1 min-w-[120px]`} placeholder="穿搭建议" />
        <button onClick={addItem} disabled={!newItem.name}
          className="bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded px-2 py-1 text-xs flex items-center gap-1">
          <Plus className="w-3 h-3" /> 添加
        </button>
      </div>
    </div>
  );
}

// ===== 穿搭禁忌管理 =====
function TaboosEditor({ taboos, onUpdate }: { taboos: Taboo[]; onUpdate: (t: Taboo[]) => void }) {
  const [newItem, setNewItem] = useState<Taboo>({ description: '', reason: '' });

  const addItem = () => {
    if (!newItem.description) return;
    onUpdate([...taboos, { ...newItem }]);
    setNewItem({ description: '', reason: '' });
  };

  const deleteItem = (index: number) => {
    onUpdate(taboos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="space-y-2">
        {taboos.map((t, i) => (
          <div key={i} className="bg-surface-2 rounded-lg p-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-ink text-sm">{t.description}</div>
              {t.reason && <div className="text-xs text-ink-3 mt-0.5">原因：{t.reason}</div>}
            </div>
            <button onClick={() => deleteItem(i)} className="shrink-0 text-ink-2 hover:text-danger p-1"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>

      {taboos.length === 0 && <p className="text-ink-3 text-xs py-4 text-center">暂无禁忌规则</p>}

      <div className="flex flex-wrap gap-2 mt-3">
        <input type="text" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
          className={`${miniInput} flex-1 min-w-[150px]`} placeholder="禁忌描述" />
        <input type="text" value={newItem.reason} onChange={e => setNewItem({ ...newItem, reason: e.target.value })}
          className={`${miniInput} flex-1 min-w-[150px]`} placeholder="原因" />
        <button onClick={addItem} disabled={!newItem.description}
          className="bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded px-2 py-1 text-xs flex items-center gap-1">
          <Plus className="w-3 h-3" /> 添加
        </button>
      </div>
    </div>
  );
}

// ===== 主组件 =====
export function KnowledgeManager({ knowledge, onSave }: KnowledgeManagerProps) {
  const [tab, setTab] = useState<'color' | 'occasion' | 'taboo'>('color');
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState<FashionKnowledge>(structuredClone(knowledge));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(local);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'color' as const, label: `配色规则 (${local.colorRules.length})` },
    { key: 'occasion' as const, label: `场合模板 (${local.occasions.length})` },
    { key: 'taboo' as const, label: `穿搭禁忌 (${local.taboos.length})` },
  ];

  return (
    <div className="bg-surface rounded-2xl p-4 sm:p-6 space-y-4 border border-border shadow-card">
      {/* 标签页 */}
      <div className="flex gap-1 bg-surface-2 rounded-lg p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'text-ink-2 hover:text-ink'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 内容 */}
      {tab === 'color' && <ColorRulesEditor rules={local.colorRules} onUpdate={r => setLocal({ ...local, colorRules: r })} />}
      {tab === 'occasion' && <OccasionsEditor occasions={local.occasions} onUpdate={o => setLocal({ ...local, occasions: o })} />}
      {tab === 'taboo' && <TaboosEditor taboos={local.taboos} onUpdate={t => setLocal({ ...local, taboos: t })} />}

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded-lg py-2 text-sm font-medium transition-colors"
      >
        {saving ? '保存中...' : '保存知识库'}
      </button>
    </div>
  );
}
