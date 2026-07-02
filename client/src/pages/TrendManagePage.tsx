/**
 * 潮流库管理页面
 *
 * 左右分栏：
 *   左：季节潮流管理（增删改查）
 *   右：自定义搭配模板管理（增删改查）
 *
 * 所有操作直接读写 fashionKnowledge.json，提交后实时生效。
 */

import { useState, useEffect, useCallback } from 'react';
import { get, post, put, del } from '../api/client';
import { TrendInfo, MatchTemplate, SEASON_OPTIONS, COLOR_OPTIONS, STYLE_OPTIONS, CATEGORY_OPTIONS, Season, Style, ClothingColor, ClothingCategory } from '../types';
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

// ========== 提示弹窗 ==========
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 ${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-in`}>
      <Icon className="w-4 h-4" />
      {message}
    </div>
  );
}

// ========== 骨架屏 ==========
function SkeletonBlock() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-slate-700 rounded-lg" />
      ))}
    </div>
  );
}

// ========== 季节潮流表单（新增/编辑） ==========
function TrendInfoForm({ initial, onSave, onCancel }: {
  initial?: TrendInfo;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [season, setSeason] = useState<string>(initial?.season || 'spring');
  const [yearQuarter, setYearQuarter] = useState(initial?.yearQuarter || `${new Date().getFullYear()}-Q1`);
  const [popularColors, setPopularColors] = useState<ClothingColor[]>(initial?.popularColors || []);
  const [styles, setStyles] = useState<Style[]>(initial?.styles || []);
  const [taboos, setTaboos] = useState(initial?.taboos?.join('；') || '');
  const [saving, setSaving] = useState(false);

  const toggleColor = (c: ClothingColor) => {
    setPopularColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };
  const toggleStyle = (s: Style) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        season,
        yearQuarter,
        popularColors,
        styles,
        taboos: taboos.split('；').filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 bg-slate-700/50 rounded-lg p-3">
      <div className="grid grid-cols-2 gap-2">
        <select value={season} onChange={e => setSeason(e.target.value)}
          className="bg-slate-600 text-white rounded px-2 py-1.5 text-xs">
          {SEASON_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input type="text" value={yearQuarter} onChange={e => setYearQuarter(e.target.value)}
          placeholder="2025-Q1" className="bg-slate-600 text-white rounded px-2 py-1.5 text-xs" />
      </div>

      {/* 流行色多选 */}
      <div>
        <p className="text-xs text-slate-400 mb-1">流行色</p>
        <div className="flex flex-wrap gap-1">
          {COLOR_OPTIONS.map(c => (
            <button key={c.value} onClick={() => toggleColor(c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${popularColors.includes(c.value) ? 'bg-indigo-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 风格多选 */}
      <div>
        <p className="text-xs text-slate-400 mb-1">推荐风格</p>
        <div className="flex flex-wrap gap-1">
          {STYLE_OPTIONS.map(s => (
            <button key={s.value} onClick={() => toggleStyle(s.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${styles.includes(s.value) ? 'bg-indigo-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <input type="text" value={taboos} onChange={e => setTaboos(e.target.value)}
        placeholder="穿搭禁忌，用中文分号；分隔" className="w-full bg-slate-600 text-white rounded px-2 py-1.5 text-xs" />

      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 text-white rounded py-1.5 text-xs">
          {saving ? '保存中...' : initial ? '更新' : '新增'}
        </button>
        <button onClick={onCancel} className="px-3 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs">取消</button>
      </div>
    </div>
  );
}

// ========== 搭配模板表单（新增/编辑） ==========
function MatchTemplateForm({ initial, onSave, onCancel }: {
  initial?: MatchTemplate;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [occasion, setOccasion] = useState(initial?.occasion || '');
  const [season, setSeason] = useState<string>(initial?.season || 'all');
  const [style, setStyle] = useState<string>(initial?.style || 'casual');
  const [topRange, setTopRange] = useState<ClothingCategory[]>(initial?.topRange || []);
  const [bottomRange, setBottomRange] = useState<ClothingCategory[]>(initial?.bottomRange || []);
  const [outerwearRange, setOuterwearRange] = useState<ClothingCategory[]>(initial?.outerwearRange || []);
  const [shoesRange, setShoesRange] = useState<ClothingCategory[]>(initial?.shoesRange || []);
  const [description, setDescription] = useState(initial?.description || '');
  const [saving, setSaving] = useState(false);

  const toggleCategory = (arr: ClothingCategory[], setArr: (v: ClothingCategory[]) => void, val: ClothingCategory) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleSubmit = async () => {
    if (!name || !occasion) return;
    setSaving(true);
    try {
      await onSave({ name, occasion, season, style, topRange, bottomRange, outerwearRange, shoesRange, description });
    } finally {
      setSaving(false);
    }
  };

  const catOptions = CATEGORY_OPTIONS.filter(c => ['top', 'bottom', 'outerwear', 'shoes', 'dress'].includes(c.value));

  return (
    <div className="space-y-3 bg-slate-700/50 rounded-lg p-3">
      <div className="grid grid-cols-2 gap-2">
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="模板名称" className="bg-slate-600 text-white rounded px-2 py-1.5 text-xs" />
        <input type="text" value={occasion} onChange={e => setOccasion(e.target.value)}
          placeholder="适用场合" className="bg-slate-600 text-white rounded px-2 py-1.5 text-xs" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select value={season} onChange={e => setSeason(e.target.value)}
          className="bg-slate-600 text-white rounded px-2 py-1.5 text-xs">
          {SEASON_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={style} onChange={e => setStyle(e.target.value)}
          className="bg-slate-600 text-white rounded px-2 py-1.5 text-xs">
          {STYLE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* 上装可选范围 */}
      <div>
        <p className="text-xs text-slate-400 mb-1">上装可选</p>
        <div className="flex flex-wrap gap-1">
          {catOptions.map(c => (
            <button key={c.value} onClick={() => toggleCategory(topRange, setTopRange, c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${topRange.includes(c.value) ? 'bg-indigo-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 下装可选范围 */}
      <div>
        <p className="text-xs text-slate-400 mb-1">下装可选</p>
        <div className="flex flex-wrap gap-1">
          {catOptions.map(c => (
            <button key={c.value} onClick={() => toggleCategory(bottomRange, setBottomRange, c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${bottomRange.includes(c.value) ? 'bg-indigo-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 外套可选范围 */}
      <div>
        <p className="text-xs text-slate-400 mb-1">外套可选</p>
        <div className="flex flex-wrap gap-1">
          {catOptions.map(c => (
            <button key={c.value} onClick={() => toggleCategory(outerwearRange, setOuterwearRange, c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${outerwearRange.includes(c.value) ? 'bg-indigo-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 鞋子可选范围 */}
      <div>
        <p className="text-xs text-slate-400 mb-1">鞋子可选</p>
        <div className="flex flex-wrap gap-1">
          {catOptions.map(c => (
            <button key={c.value} onClick={() => toggleCategory(shoesRange, setShoesRange, c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${shoesRange.includes(c.value) ? 'bg-indigo-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <textarea value={description} onChange={e => setDescription(e.target.value)}
        placeholder="搭配说明（如：浅色衬衫 + 西裤 + 低跟皮鞋）"
        className="w-full bg-slate-600 text-white rounded px-2 py-1.5 text-xs h-16 resize-none" />

      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={saving || !name || !occasion}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 text-white rounded py-1.5 text-xs">
          {saving ? '保存中...' : initial ? '更新' : '新增'}
        </button>
        <button onClick={onCancel} className="px-3 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs">取消</button>
      </div>
    </div>
  );
}

// ========== 主页面 ==========
export function TrendManagePage() {
  const [trends, setTrends] = useState<TrendInfo[]>([]);
  const [templates, setTemplates] = useState<MatchTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // 新增/编辑状态
  const [editingTrend, setEditingTrend] = useState<TrendInfo | undefined>(undefined);
  const [showTrendForm, setShowTrendForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MatchTemplate | undefined>(undefined);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  // 加载数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [trendData, templateData] = await Promise.all([
        get<TrendInfo[]>('/trends/info'),
        get<MatchTemplate[]>('/trends/templates'),
      ]);
      setTrends(trendData);
      setTemplates(templateData);
    } catch {
      showToast('加载失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  // ===== 季节潮流操作 =====
  const handleCreateTrend = async (data: any) => {
    try {
      await post('/trends/info', data);
      showToast('季节潮流已添加', 'success');
      setShowTrendForm(false);
      loadData();
    } catch { showToast('添加失败', 'error'); }
  };

  const handleUpdateTrend = async (id: string, data: any) => {
    try {
      await put(`/trends/info/${id}`, data);
      showToast('季节潮流已更新', 'success');
      setEditingTrend(undefined);
      loadData();
    } catch { showToast('更新失败', 'error'); }
  };

  const handleDeleteTrend = async (id: string) => {
    try {
      await del(`/trends/info/${id}`);
      showToast('季节潮流已删除', 'success');
      loadData();
    } catch { showToast('删除失败', 'error'); }
  };

  // ===== 搭配模板操作 =====
  const handleCreateTemplate = async (data: any) => {
    try {
      await post('/trends/templates', data);
      showToast('搭配模板已添加', 'success');
      setShowTemplateForm(false);
      loadData();
    } catch { showToast('添加失败', 'error'); }
  };

  const handleUpdateTemplate = async (id: string, data: any) => {
    try {
      await put(`/trends/templates/${id}`, data);
      showToast('搭配模板已更新', 'success');
      setEditingTemplate(undefined);
      loadData();
    } catch { showToast('更新失败', 'error'); }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await del(`/trends/templates/${id}`);
      showToast('搭配模板已删除', 'success');
      loadData();
    } catch { showToast('删除失败', 'error'); }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h2 className="text-xl font-bold text-white">潮流库管理</h2>
        <p className="text-slate-400 text-xs mt-1">
          管理季节流行趋势和自定义搭配模板，修改后穿搭推荐实时生效。
        </p>
      </div>

      {/* 左右分栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ====== 左：季节潮流 ====== */}
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm">季节潮流</h3>
            <button onClick={() => { setShowTrendForm(true); setEditingTrend(undefined); }}
              className="flex items-center gap-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg">
              <Plus className="w-3 h-3" /> 新增
            </button>
          </div>

          {showTrendForm && (
            <div className="mb-4">
              <TrendInfoForm onSave={handleCreateTrend} onCancel={() => setShowTrendForm(false)} />
            </div>
          )}

          {loading ? <SkeletonBlock /> : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {trends.length === 0 && <p className="text-slate-500 text-xs text-center py-4">暂无季节潮流数据</p>}
              {trends.map(t => (
                <div key={t.id} className="bg-slate-700/50 rounded-lg p-3">
                  {editingTrend?.id === t.id ? (
                    <TrendInfoForm
                      initial={editingTrend}
                      onSave={(data) => handleUpdateTrend(t.id, data)}
                      onCancel={() => setEditingTrend(undefined)}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">
                            {SEASON_OPTIONS.find(s => s.value === t.season)?.label || t.season}
                          </span>
                          <span className="text-xs text-slate-400">{t.yearQuarter}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {t.popularColors.map(c => (
                            <span key={c} className="text-xs bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded">
                              {COLOR_OPTIONS.find(o => o.value === c)?.label || c}
                            </span>
                          ))}
                        </div>
                        {t.taboos.length > 0 && (
                          <p className="text-xs text-red-400 mt-1">禁忌：{t.taboos.join('；')}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingTrend(t)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteTrend(t.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ====== 右：搭配模板 ====== */}
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm">搭配模板</h3>
            <button onClick={() => { setShowTemplateForm(true); setEditingTemplate(undefined); }}
              className="flex items-center gap-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg">
              <Plus className="w-3 h-3" /> 新增
            </button>
          </div>

          {showTemplateForm && (
            <div className="mb-4">
              <MatchTemplateForm onSave={handleCreateTemplate} onCancel={() => setShowTemplateForm(false)} />
            </div>
          )}

          {loading ? <SkeletonBlock /> : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {templates.length === 0 && <p className="text-slate-500 text-xs text-center py-4">暂无搭配模板数据</p>}
              {templates.map(m => (
                <div key={m.id} className="bg-slate-700/50 rounded-lg p-3">
                  {editingTemplate?.id === m.id ? (
                    <MatchTemplateForm
                      initial={editingTemplate}
                      onSave={(data) => handleUpdateTemplate(m.id, data)}
                      onCancel={() => setEditingTemplate(undefined)}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{m.name}</span>
                          <span className="text-xs text-slate-400">{m.occasion}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {SEASON_OPTIONS.find(s => s.value === m.season)?.label || m.season} · {STYLE_OPTIONS.find(s => s.value === m.style)?.label || m.style}
                        </div>
                        {m.description && <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingTemplate(m)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteTemplate(m.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast 提示 */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
