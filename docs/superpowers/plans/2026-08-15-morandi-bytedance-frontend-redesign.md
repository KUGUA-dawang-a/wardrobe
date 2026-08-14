# 莫兰迪 × 字节跳动风格前端换肤 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把「我的衣帽间」前端从深色 slate+indigo 主题整体换肤为冷调雾灰蓝莫兰迪 + 飞书式浅色清爽风。

**Architecture:** Token 驱动换肤——先在 Tailwind 主题层定义语义色/字体/阴影 Token，再逐页把硬编码的 `slate-*`/`indigo-*` 等类替换为语义 Token。不新增功能、不改后端、不引入组件库。签名元素为共享组件 `BrandMark`（莫兰迪色卡）。

**Tech Stack:** React 18、Vite 5、Tailwind CSS 3.4、TypeScript 5、lucide-react。

## Global Constraints

- 组件只引用语义 Token（`bg`/`surface`/`ink`/`primary`/`success`/`warning`/`danger` 等），禁止出现 `slate-*`、`indigo-*`。
- 衣橱卡片的衣物颜色标签（`ClothingCard.colorMap`）是数据语义，保留真实颜色（红/蓝/绿等），不莫兰迪化。
- 浅色单主题：移除 `darkMode: 'class'` 与 `<html class="dark">`。
- 每次改动后 `npm run build`（`tsc && vite build`）必须通过，无类型错误。
- 不新增功能、不改任何 TS 逻辑/API/数据流。
- 字体：`'Inter','Noto Sans SC',-apple-system,'PingFang SC','Microsoft YaHei',sans-serif`，加载失败回退系统字体。

---

## Task 1: 设计 Token + 全局基础样式 + HTML 入口

**Files:**
- Modify: `client/tailwind.config.js`
- Modify: `client/src/styles/index.css`
- Modify: `client/index.html`

**Interfaces:**
- Produces: Tailwind 语义色 Token（`bg`、`surface`、`surface-2`、`border`、`ink`、`ink-2`、`ink-3`、`primary`、`primary-hover`、`primary-soft`、`primary-on-soft`、`success`、`success-soft`、`success-on-soft`、`warning`、`warning-soft`、`warning-on-soft`、`danger`、`danger-soft`、`danger-on-soft`）、`fontFamily.sans`、`boxShadow.card`。

- [ ] **Step 1: 替换 `tailwind.config.js` 全部内容**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 中性色（莫兰迪雾灰）
        bg: '#F2F3F5',
        surface: '#FFFFFF',
        'surface-2': '#EDEFF3',
        border: '#E4E7EC',
        'border-strong': '#D5DAE1',
        ink: '#24282E',
        'ink-2': '#5F6672',
        'ink-3': '#979EA8',
        // 主色（雾灰蓝）
        primary: '#5A7594',
        'primary-hover': '#4B6481',
        'primary-active': '#3F5670',
        'primary-soft': '#EAEFF5',
        'primary-soft-strong': '#D6E0EB',
        'primary-on-soft': '#47607D',
        // 功能色（莫兰迪化）
        success: '#7C9A82',
        'success-soft': '#EDF3EE',
        'success-on-soft': '#54705A',
        warning: '#C2A878',
        'warning-soft': '#F7F2E7',
        'warning-on-soft': '#8A7440',
        danger: '#C08A82',
        'danger-soft': '#F7EDEB',
        'danger-on-soft': '#8F5852',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans SC"', '-apple-system', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 24, 32, 0.04), 0 8px 24px rgba(20, 24, 32, 0.06)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: 替换 `index.css` 全部内容**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    margin: 0;
    font-family: 'Inter', 'Noto Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
    background-color: #f2f3f5;
    color: #24282e;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  :focus-visible {
    outline: 2px solid #5a7594;
    outline-offset: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: 替换 `index.html` 全部内容**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>我的衣帽间</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: 验证构建**

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run build`
Expected: `tsc` 与 `vite build` 均成功，无报错，产物输出到 `client/dist`。

- [ ] **Step 5: 提交**

```bash
git add client/tailwind.config.js client/src/styles/index.css client/index.html
git commit -m "feat: 定义莫兰迪设计 Token 与全局基础样式"
```

---

## Task 2: 共享色卡标识 BrandMark + 顶部导航 Layout + 应用加载态

**Files:**
- Create: `client/src/components/BrandMark.tsx`
- Modify: `client/src/components/Layout.tsx`
- Modify: `client/src/App.tsx`

**Interfaces:**
- Produces: `BrandMark({ size?: 'sm' | 'md' | 'lg' })` 组件，供 Task 3（LoginPage）复用。
- Consumes: Task 1 的颜色 Token。

- [ ] **Step 1: 创建 `BrandMark.tsx`**

```tsx
/**
 * 品牌色卡标识
 *
 * 莫兰迪色点矩阵，呼应「衣橱 = 颜色」。
 */
const DOTS = ['#5A7594', '#7C9A82', '#C08A82', '#C2A878'];

export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box =
    size === 'lg' ? 'w-12 h-12 rounded-2xl p-2' : size === 'sm' ? 'w-8 h-8 rounded-lg p-1' : 'w-9 h-9 rounded-xl p-1.5';
  const dot = size === 'lg' ? 'w-3.5 h-3.5' : 'w-2 h-2';

  return (
    <div className={`${box} bg-primary-soft grid grid-cols-2 gap-1`}>
      {DOTS.map(c => (
        <span key={c} className={`${dot} rounded-full`} style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: 替换 `Layout.tsx` 全部内容**

```tsx
/**
 * 页面布局组件
 *
 * 顶部导航栏 + 用户信息，包裹所有页面内容。
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shirt, Sparkles, BookOpen, LogOut, TrendingUp } from 'lucide-react';
import { BrandMark } from './BrandMark';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 当前路由高亮：雾灰蓝胶囊
  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-primary-soft text-primary-on-soft'
      : 'text-ink-2 hover:text-ink hover:bg-surface-2';

  return (
    <div className="min-h-screen bg-bg">
      {/* 顶部导航 */}
      <nav className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-ink flex items-center gap-2.5">
            <BrandMark />
            我的衣帽间
          </Link>

          <div className="flex items-center gap-1 text-sm">
            <Link to="/" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isActive('/')}`}>
              <Shirt className="w-4 h-4" />
              衣橱
            </Link>
            <Link to="/outfits" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isActive('/outfits')}`}>
              <Sparkles className="w-4 h-4" />
              穿搭
            </Link>
            <Link to="/knowledge" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isActive('/knowledge')}`}>
              <BookOpen className="w-4 h-4" />
              知识库
            </Link>
            <Link to="/trends" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isActive('/trends')}`}>
              <TrendingUp className="w-4 h-4" />
              潮流库
            </Link>

            {user && (
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-border">
                <span className="text-ink-2 text-xs">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-ink-2 hover:text-danger transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: 修改 `App.tsx` 的加载态**（仅替换 `ProtectedRoute` 内的两处 className）

把：

```tsx
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full" />
      </div>
```

替换为：

```tsx
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
```

- [ ] **Step 4: 验证构建**

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run build`
Expected: 成功，无报错。

- [ ] **Step 5: 验证残留色类**

Run: `cd C:\Users\linchenhao\wardrobe\client && Get-ChildItem src/components/Layout.tsx,src/App.tsx,src/components/BrandMark.tsx | Select-String -Pattern 'slate-|indigo-'`
Expected: 无任何输出（0 匹配）。

- [ ] **Step 6: 提交**

```bash
git add client/src/components/BrandMark.tsx client/src/components/Layout.tsx client/src/App.tsx
git commit -m "feat: 浅色导航与品牌色卡标识"
```

---

## Task 3: 登录页

**Files:**
- Modify: `client/src/pages/LoginPage.tsx`

**Interfaces:**
- Consumes: Task 1 的 Token、Task 2 的 `BrandMark`。

- [ ] **Step 1: 替换 `LoginPage.tsx` 全部内容**

```tsx
/**
 * 登录 / 注册页面
 *
 * 支持登录和注册切换，表单验证 + 错误提示。
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandMark } from '../components/BrandMark';

export function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 2) {
      setError('用户名至少 2 个字符');
      return;
    }
    if (password.length < 4) {
      setError('密码至少 4 个字符');
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl p-8 w-full max-w-sm border border-border shadow-card">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandMark size="lg" />
          </div>
          <h1 className="text-xl font-semibold text-ink">我的衣帽间</h1>
          <p className="text-ink-2 text-xs mt-1">虚拟衣橱 + AI 穿搭推荐</p>
        </div>

        {/* 切换标签 */}
        <div className="flex gap-1 bg-surface-2 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 py-2 text-sm rounded-md transition-colors ${
              !isRegister ? 'bg-primary text-white' : 'text-ink-2 hover:text-ink'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 py-2 text-sm rounded-md transition-colors ${
              isRegister ? 'bg-primary text-white' : 'text-ink-2 hover:text-ink'
            }`}
          >
            注册
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="用户名"
            className="w-full bg-surface text-ink rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:ring-2 focus:ring-primary-soft outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="密码"
            className="w-full bg-surface text-ink rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:ring-2 focus:ring-primary-soft outline-none"
          />

          {isRegister && (
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="确认密码"
              className="w-full bg-surface text-ink rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:ring-2 focus:ring-primary-soft outline-none"
            />
          )}

          {error && <p className="text-danger-on-soft text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? '处理中...' : isRegister ? '注册' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证构建**

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run build`
Expected: 成功。

- [ ] **Step 3: 验证残留色类**

Run: `cd C:\Users\linchenhao\wardrobe\client && Select-String -Path src/pages/LoginPage.tsx -Pattern 'slate-|indigo-'`
Expected: 无输出。

- [ ] **Step 4: 提交**

```bash
git add client/src/pages/LoginPage.tsx
git commit -m "feat: 登录页换肤"
```

---

## Task 4: 衣橱页及其组件

**Files:**
- Modify: `client/src/pages/WardrobePage.tsx`
- Modify: `client/src/components/SeasonFilter.tsx`
- Modify: `client/src/components/UploadForm.tsx`
- Modify: `client/src/components/WardrobeGrid.tsx`
- Modify: `client/src/components/ClothingCard.tsx`
- Modify: `client/src/components/SkeletonCard.tsx`
- Modify: `client/src/components/EditItemModal.tsx`

**Interfaces:**
- Consumes: Task 1 的 Token。
- Produces: 无（仅样式）。

- [ ] **Step 1: 替换 `WardrobePage.tsx` 的标题行**

把 `<h2 className="text-xl font-bold text-white">我的衣橱</h2>`
替换为 `<h2 className="text-xl font-bold text-ink">我的衣橱</h2>`（其余逻辑不变）。

- [ ] **Step 2: 替换 `SeasonFilter.tsx` 全部内容**

```tsx
/**
 * 季节筛选 + 归档管理
 *
 * 按季节筛选衣橱 + 一键归档/恢复季节。
 */

import { Season } from '../types';
import { Archive, RefreshCw } from 'lucide-react';

export const SEASON_FILTERS: { value: Season | ''; label: string }[] = [
  { value: '', label: '全部' },
  { value: 'spring', label: '春' },
  { value: 'summer', label: '夏' },
  { value: 'autumn', label: '秋' },
  { value: 'winter', label: '冬' },
];

export const COLOR_FILTERS = [
  { value: '', label: '全部颜色' },
  { value: 'white', label: '白色' },
  { value: 'black', label: '黑色' },
  { value: 'gray', label: '灰色' },
  { value: 'red', label: '红色' },
  { value: 'blue', label: '蓝色' },
  { value: 'multicolor', label: '花色' },
];

export const STYLE_FILTERS = [
  { value: '', label: '全部风格' },
  { value: 'casual', label: '休闲' },
  { value: 'business', label: '商务' },
  { value: 'sporty', label: '运动' },
  { value: 'sweet', label: '甜美' },
];

interface SeasonFilterProps {
  seasonFilter: string;
  colorFilter: string;
  styleFilter: string;
  showArchived: boolean;
  onSeasonChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onStyleChange: (v: string) => void;
  onShowArchivedChange: (v: boolean) => void;
  onArchiveSeason: (season: Season, archived: boolean) => void;
}

const selectClass =
  'bg-surface text-ink rounded-lg px-3 py-2 text-sm border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft';

export function SeasonFilter({
  seasonFilter, colorFilter, styleFilter, showArchived,
  onSeasonChange, onColorChange, onStyleChange, onShowArchivedChange,
  onArchiveSeason,
}: SeasonFilterProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 space-y-3 border border-border shadow-card">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select value={seasonFilter} onChange={e => onSeasonChange(e.target.value)} className={selectClass}>
          {SEASON_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select value={colorFilter} onChange={e => onColorChange(e.target.value)} className={selectClass}>
          {COLOR_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select value={styleFilter} onChange={e => onStyleChange(e.target.value)} className={selectClass}>
          {STYLE_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-ink-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={e => onShowArchivedChange(e.target.checked)}
            className="rounded accent-primary"
          />
          显示已归档
        </label>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <span className="text-xs text-ink-2 mr-1 self-center">换季归档：</span>
        {SEASON_FILTERS.filter(f => f.value).map(f => (
          <button
            key={f.value}
            onClick={() => onArchiveSeason(f.value as Season, true)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-surface-2 text-warning-on-soft hover:bg-border-strong"
          >
            <Archive className="w-3 h-3" />
            归档{f.label}
          </button>
        ))}
        <button
          onClick={() => {
            (['spring', 'summer', 'autumn', 'winter'] as Season[]).forEach(s => onArchiveSeason(s, false));
          }}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-surface-2 text-success-on-soft hover:bg-border-strong"
        >
          <RefreshCw className="w-3 h-3" />
          全部恢复
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 替换 `UploadForm.tsx` 全部内容**

```tsx
/**
 * 上传表单组件
 *
 * 拖拽/点击上传图片，选择分类/颜色/季节/风格等标签。
 */

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { CATEGORY_OPTIONS, COLOR_OPTIONS, SEASON_OPTIONS, STYLE_OPTIONS, Season, Style, ClothingCategory, ClothingColor } from '../types';

interface UploadFormProps {
  onUpload: (data: {
    name: string;
    category: ClothingCategory;
    color: ClothingColor;
    season: Season[];
    style: Style[];
    image: File;
  }) => Promise<void>;
}

const inputClass =
  'w-full bg-surface text-ink rounded-lg px-3 py-2 text-sm border border-border focus:border-primary focus:ring-2 focus:ring-primary-soft outline-none';

export function UploadForm({ onUpload }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory | ''>('');
  const [color, setColor] = useState<ClothingColor | ''>('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(f.type)) {
      setError('只支持 JPG/PNG/GIF/WebP 格式');
      return;
    }
    setError('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!name) setName(f.name.replace(/\.[^.]+$/, ''));
  }, [name]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: () => setError('文件太大（最大 5MB）或不支持的类型'),
  });

  const toggleSeason = (s: Season) => {
    setSeasons(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleStyle = (s: Style) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    if (!file || !name || !category || !color || seasons.length === 0 || styles.length === 0) {
      setError('请填写完整信息');
      return;
    }
    setUploading(true);
    setError('');
    try {
      await onUpload({ name, category: category as ClothingCategory, color: color as ClothingColor, season: seasons, style: styles, image: file });
      setFile(null);
      setPreview('');
      setName('');
      setCategory('');
      setColor('');
      setSeasons([]);
      setStyles([]);
    } catch (err: any) {
      setError(err.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview('');
  };

  return (
    <div className="bg-surface rounded-2xl p-4 sm:p-6 space-y-4 border border-border shadow-card">
      <h3 className="text-ink font-medium flex items-center gap-2">
        <Upload className="w-4 h-4 text-primary" />
        上传新衣服
      </h3>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary-soft' : 'border-border hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-ink-3 mx-auto mb-2" />
          <p className="text-ink-2 text-sm">
            {isDragActive ? '松开以上传' : '拖拽图片到此处，或点击选择'}
          </p>
          <p className="text-ink-3 text-xs mt-1">支持 JPG/PNG/GIF/WebP，最大 5MB</p>
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="预览" className="w-full h-48 object-cover rounded-lg" />
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="衣服名称（如：白色T恤）"
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={category}
          onChange={e => setCategory(e.target.value as ClothingCategory)}
          className={inputClass}
        >
          <option value="">选择分类</option>
          {CATEGORY_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={color}
          onChange={e => setColor(e.target.value as ClothingColor)}
          className={inputClass}
        >
          <option value="">选择颜色</option>
          {COLOR_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs text-ink-2 mb-2">季节（可多选）</p>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => toggleSeason(s.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                seasons.includes(s.value)
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-ink-2 hover:bg-border-strong'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-ink-2 mb-2">风格（可多选）</p>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => toggleStyle(s.value)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                styles.includes(s.value)
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-ink-2 hover:bg-border-strong'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-danger-on-soft text-xs">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={uploading || !file}
        className="w-full bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm font-medium transition-colors"
      >
        {uploading ? '上传中...' : '上传'}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: 替换 `WardrobeGrid.tsx` 全部内容**

```tsx
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
  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-danger-on-soft mb-2">加载失败</p>
        <p className="text-ink-3 text-sm">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Shirt className="w-12 h-12 text-ink-3 mx-auto mb-3" />
        <p className="text-ink-2">还没有衣服，快上传一件吧！</p>
      </div>
    );
  }

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
```

- [ ] **Step 5: 替换 `ClothingCard.tsx` 全部内容**

```tsx
/**
 * 衣服卡片组件
 *
 * 展示单件衣服的图片、标签和操作按钮。
 */

import { ClothingItem } from '../types';
import { Pencil, Trash2, Archive, RefreshCw } from 'lucide-react';

interface ClothingCardProps {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archived: boolean) => void;
}

/** 标签颜色映射（衣物真实颜色，保持本色） */
const colorMap: Record<string, string> = {
  white: 'bg-white text-black',
  black: 'bg-gray-800 text-white',
  gray: 'bg-gray-500 text-white',
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  pink: 'bg-pink-400 text-white',
  purple: 'bg-purple-500 text-white',
  brown: 'bg-amber-800 text-white',
  beige: 'bg-amber-200 text-black',
  multicolor: 'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-black',
};

/** 分类中文名 */
const categoryLabel: Record<string, string> = {
  top: '上衣', bottom: '下装', outerwear: '外套', shoes: '鞋', accessory: '配饰', dress: '连衣裙',
};

/** 季节中文名 */
const seasonLabel: Record<string, string> = {
  spring: '春', summer: '夏', autumn: '秋', winter: '冬', all: '四季',
};

export function ClothingCard({ item, onEdit, onDelete, onArchive }: ClothingCardProps) {
  const imgSrc = item.imagePath.startsWith('http') ? item.imagePath : item.imagePath;

  return (
    <div className={`bg-surface rounded-2xl overflow-hidden border border-border shadow-card transition-all hover:shadow-card group ${item.isArchived ? 'opacity-60' : ''}`}>
      {/* 图片 */}
      <div className="aspect-[3/4] bg-surface-2 relative overflow-hidden">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* 操作按钮（悬停显示） */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="bg-black/60 hover:bg-black/80 rounded-full p-1.5"
            title="编辑"
          >
            <Pencil className="w-3.5 h-3.5 text-white" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="bg-black/60 hover:bg-danger rounded-full p-1.5"
            title="删除"
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* 归档标签 */}
        {item.isArchived && (
          <div className="absolute top-2 left-2 bg-warning-soft text-warning-on-soft text-xs px-2 py-0.5 rounded-full">
            已归档
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-ink font-medium text-sm truncate">{item.name}</h4>
          <span className="text-xs text-ink-2">{categoryLabel[item.category] || item.category}</span>
        </div>

        {/* 颜色标签 */}
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${colorMap[item.color] || 'bg-ink-3 text-white'}`}>
          {item.color}
        </span>

        {/* 季节标签 */}
        <div className="flex gap-1">
          {item.season.map(s => (
            <span key={s} className="text-xs bg-surface-2 text-ink-2 px-1.5 py-0.5 rounded">
              {seasonLabel[s] || s}
            </span>
          ))}
        </div>

        {/* 归档/恢复按钮 */}
        <button
          onClick={() => onArchive(item.id, !item.isArchived)}
          className={`flex items-center gap-1 text-xs mt-1 ${
            item.isArchived ? 'text-success-on-soft hover:text-success' : 'text-warning-on-soft hover:text-warning'
          }`}
        >
          {item.isArchived ? <RefreshCw className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
          {item.isArchived ? '恢复' : '归档'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: 替换 `SkeletonCard.tsx` 全部内容**

```tsx
/**
 * 骨架屏组件
 * 在数据加载时显示占位动画
 */
export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-surface rounded-2xl overflow-hidden border border-border">
      <div className="aspect-[3/4] bg-surface-2" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-surface-2 rounded w-3/4" />
        <div className="h-3 bg-surface-2 rounded w-1/2" />
        <div className="flex gap-1">
          <div className="h-5 bg-surface-2 rounded-full w-12" />
          <div className="h-5 bg-surface-2 rounded-full w-10" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
```

- [ ] **Step 7: 替换 `EditItemModal.tsx` 全部内容**

```tsx
/**
 * 编辑衣物弹窗
 *
 * 点击衣物卡片的编辑按钮时弹出，修改衣物的标签信息。
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { ClothingItem, Season, Style, ClothingCategory, ClothingColor } from '../types';
import { CATEGORY_OPTIONS, COLOR_OPTIONS, SEASON_OPTIONS, STYLE_OPTIONS } from '../types';

interface EditItemModalProps {
  item: ClothingItem;
  onClose: () => void;
  onSave: (id: string, data: Partial<ClothingItem>) => Promise<void>;
}

const fieldClass =
  'w-full bg-surface text-ink rounded-lg px-3 py-2 text-sm border border-border focus:border-primary focus:ring-2 focus:ring-primary-soft outline-none';

export function EditItemModal({ item, onClose, onSave }: EditItemModalProps) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState<ClothingCategory>(item.category);
  const [color, setColor] = useState<ClothingColor>(item.color);
  const [seasons, setSeasons] = useState<Season[]>(item.season);
  const [styles, setStyles] = useState<Style[]>(item.style);
  const [saving, setSaving] = useState(false);

  const toggleSeason = (s: Season) => {
    setSeasons(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleStyle = (s: Style) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(item.id, { name, category, color, season: seasons, style: styles });
      onClose();
    } catch {
      // 错误由父组件处理
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md border border-border shadow-card" onClick={e => e.stopPropagation()}>
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-ink font-medium">编辑衣物</h3>
          <button onClick={onClose} className="text-ink-2 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 名称 */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className={`${fieldClass} mb-3`}
        />

        {/* 分类 & 颜色 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select value={category} onChange={e => setCategory(e.target.value as ClothingCategory)}
            className={fieldClass}>
            {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={color} onChange={e => setColor(e.target.value as ClothingColor)}
            className={fieldClass}>
            {COLOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* 季节 */}
        <div className="mb-3">
          <p className="text-xs text-ink-2 mb-2">季节</p>
          <div className="flex flex-wrap gap-2">
            {SEASON_OPTIONS.map(s => (
              <button key={s.value} onClick={() => toggleSeason(s.value)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  seasons.includes(s.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 风格 */}
        <div className="mb-4">
          <p className="text-xs text-ink-2 mb-2">风格</p>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map(s => (
              <button key={s.value} onClick={() => toggleStyle(s.value)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  styles.includes(s.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded-lg py-2 text-sm font-medium transition-colors"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: 验证构建**

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run build`
Expected: 成功。

- [ ] **Step 9: 验证残留色类**

Run: `cd C:\Users\linchenhao\wardrobe\client && Get-ChildItem src/pages/WardrobePage.tsx,src/components/SeasonFilter.tsx,src/components/UploadForm.tsx,src/components/WardrobeGrid.tsx,src/components/ClothingCard.tsx,src/components/SkeletonCard.tsx,src/components/EditItemModal.tsx | Select-String -Pattern 'slate-|indigo-'`
Expected: 无输出（ClothingCard 的 `colorMap` 已把 `to-indigo-300` 改为 `to-blue-300`，故无 indigo）。

- [ ] **Step 10: 提交**

```bash
git add client/src/pages/WardrobePage.tsx client/src/components/SeasonFilter.tsx client/src/components/UploadForm.tsx client/src/components/WardrobeGrid.tsx client/src/components/ClothingCard.tsx client/src/components/SkeletonCard.tsx client/src/components/EditItemModal.tsx
git commit -m "feat: 衣橱页及其组件换肤"
```

---

## Task 5: 穿搭页及其组件

**Files:**
- Modify: `client/src/pages/OutfitPage.tsx`
- Modify: `client/src/components/OutfitGenerator.tsx`
- Modify: `client/src/components/OutfitResult.tsx`
- Modify: `client/src/components/SavedOutfits.tsx`

**Interfaces:**
- Consumes: Task 1 的 Token。

- [ ] **Step 1: 替换 `OutfitPage.tsx` 全部内容**

```tsx
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
```

- [ ] **Step 2: 替换 `OutfitGenerator.tsx` 全部内容**

```tsx
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
```

- [ ] **Step 3: 替换 `OutfitResult.tsx` 全部内容**

```tsx
/**
 * 穿搭推荐结果展示
 *
 * 展示规则引擎 / AI 生成的穿搭推荐卡片，支持点赞收藏。
 */

import { OutfitSuggestion, ClothingItem } from '../types';
import { Heart, Sparkles, Shirt, Sun } from 'lucide-react';

interface OutfitResultProps {
  outfits: OutfitSuggestion[];
  aiOutfits: OutfitSuggestion[] | null;
  source: string;
  aiAvailable: boolean;
  items: ClothingItem[];
  savedIds: Set<string>;
  onSave: (suggestion: OutfitSuggestion) => void;
}

/** 获取搭配中某件衣服的名称 */
function getItemNames(itemIds: string[], allItems: ClothingItem[]): string {
  return itemIds
    .map(id => allItems.find(i => i.id === id)?.name)
    .filter(Boolean)
    .join(' + ');
}

/** 评分颜色 */
function scoreColor(score: number): string {
  if (score >= 85) return 'text-success-on-soft';
  if (score >= 70) return 'text-warning-on-soft';
  return 'text-ink-2';
}

/** 评分条宽度 */
function scoreBar(score: number): string {
  return `${score}%`;
}

export function OutfitResult({ outfits, aiOutfits, source, aiAvailable, items, savedIds, onSave }: OutfitResultProps) {
  const hasOutfits = outfits.length > 0;
  const hasAi = aiOutfits && aiOutfits.length > 0;

  if (!hasOutfits && !hasAi) {
    if (source === 'empty') {
      return (
        <div className="bg-surface rounded-2xl p-8 text-center border border-border shadow-card">
          <Shirt className="w-12 h-12 text-ink-3 mx-auto mb-3" />
          <p className="text-ink-2">衣橱中衣服太少，请先上传至少 2 件衣服</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 规则引擎推荐 */}
      {hasOutfits && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-ink font-medium">推荐搭配</h3>
            <span className="text-xs text-ink-3">（本地规则引擎）</span>
          </div>
          <div className="grid gap-3">
            {outfits.slice(0, 6).map(o => (
              <OutfitCard key={o.id} outfit={o} items={items} savedIds={savedIds} onSave={onSave} />
            ))}
          </div>
        </div>
      )}

      {/* AI 推荐 */}
      {hasAi && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-4 h-4 text-warning" />
            <h3 className="text-ink font-medium">AI 推荐搭配</h3>
            <span className="text-xs text-success-on-soft">✨ AI 增强</span>
          </div>
          <div className="grid gap-3">
            {aiOutfits!.map(o => (
              <OutfitCard key={o.id} outfit={o} items={items} savedIds={savedIds} onSave={onSave} isAI />
            ))}
          </div>
        </div>
      )}

      {!aiAvailable && source !== 'empty' && (
        <p className="text-xs text-warning-on-soft bg-warning-soft px-3 py-2 rounded-lg text-center">
          💡 AI 助手未连接（Ollama 未运行），当前使用本地规则推荐
        </p>
      )}
    </div>
  );
}

/** 单条推荐卡片 */
function OutfitCard({ outfit, items, savedIds, onSave, isAI }: {
  outfit: OutfitSuggestion;
  items: ClothingItem[];
  savedIds: Set<string>;
  onSave: (suggestion: OutfitSuggestion) => void;
  isAI?: boolean;
}) {
  const isSaved = savedIds.has(outfit.id);

  return (
    <div className="bg-surface rounded-2xl p-4 border border-border shadow-card">
      <div className="flex items-start justify-between gap-4">
        {/* 左侧：搭配信息 */}
        <div className="flex-1 min-w-0">
          <p className="text-ink text-sm font-medium mb-1">
            {getItemNames(outfit.itemIds, items) || outfit.reason}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-ink-2 mb-2">
            <span className="flex items-center gap-1">
              <Shirt className="w-3 h-3" />
              {outfit.style}
            </span>
            <span>{outfit.occasion}</span>
            <span className="text-primary-on-soft">{outfit.colorHarmony}</span>
          </div>

          {/* 评分条 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  outfit.score >= 85 ? 'bg-success' : outfit.score >= 70 ? 'bg-warning' : 'bg-ink-3'
                }`}
                style={{ width: scoreBar(outfit.score) }}
              />
            </div>
            <span className={`text-xs font-bold ${scoreColor(outfit.score)}`}>{outfit.score}分</span>
          </div>
        </div>

        {/* 右侧：收藏按钮 */}
        <button
          onClick={() => onSave(outfit)}
          disabled={isSaved}
          className={`shrink-0 p-2 rounded-lg transition-colors ${
            isSaved
              ? 'bg-danger-soft text-danger cursor-not-allowed'
              : 'bg-surface-2 text-ink-2 hover:bg-danger-soft hover:text-danger'
          }`}
          title={isSaved ? '已收藏' : '收藏搭配'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 替换 `SavedOutfits.tsx` 全部内容**

```tsx
/**
 * 收藏穿搭列表
 *
 * 展示用户收藏的穿搭，支持取消收藏。
 */

import { SavedOutfit } from '../types';
import { Heart, Trash2, Calendar } from 'lucide-react';

interface SavedOutfitsProps {
  saved: SavedOutfit[];
  onRemove: (id: string) => void;
}

export function SavedOutfits({ saved, onRemove }: SavedOutfitsProps) {
  if (saved.length === 0) {
    return (
      <div className="bg-surface rounded-2xl p-8 text-center border border-border shadow-card">
        <Heart className="w-10 h-10 text-ink-3 mx-auto mb-2" />
        <p className="text-ink-2 text-sm">还没有收藏的穿搭</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-ink font-medium flex items-center gap-2">
        <Heart className="w-4 h-4 text-danger" />
        收藏的穿搭（{saved.length}）
      </h3>
      {saved.map(s => (
        <div key={s.id} className="bg-surface rounded-2xl p-4 border border-border shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-ink text-sm font-medium mb-1">
                {s.items.map(i => i.name).join(' + ')}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-ink-2">
                <span>{s.suggestion.style}</span>
                <span>{s.suggestion.occasion}</span>
                <span className="text-primary-on-soft">{s.suggestion.colorHarmony}</span>
                <span className={`font-bold ${
                  s.suggestion.score >= 85 ? 'text-success-on-soft' : s.suggestion.score >= 70 ? 'text-warning-on-soft' : 'text-ink-2'
                }`}>
                  {s.suggestion.score}分
                </span>
              </div>
              <p className="text-xs text-ink-3 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(s.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <button
              onClick={() => onRemove(s.id)}
              className="shrink-0 p-2 rounded-lg bg-surface-2 text-ink-2 hover:bg-danger-soft hover:text-danger transition-colors"
              title="取消收藏"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: 验证构建**

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run build`
Expected: 成功。

- [ ] **Step 6: 验证残留色类**

Run: `cd C:\Users\linchenhao\wardrobe\client && Get-ChildItem src/pages/OutfitPage.tsx,src/components/OutfitGenerator.tsx,src/components/OutfitResult.tsx,src/components/SavedOutfits.tsx | Select-String -Pattern 'slate-|indigo-'`
Expected: 无输出。

- [ ] **Step 7: 提交**

```bash
git add client/src/pages/OutfitPage.tsx client/src/components/OutfitGenerator.tsx client/src/components/OutfitResult.tsx client/src/components/SavedOutfits.tsx
git commit -m "feat: 穿搭页及其组件换肤"
```

---

## Task 6: 知识库页及管理面板

**Files:**
- Modify: `client/src/pages/KnowledgePage.tsx`
- Modify: `client/src/components/KnowledgeManager.tsx`

**Interfaces:**
- Consumes: Task 1 的 Token。

- [ ] **Step 1: 替换 `KnowledgePage.tsx` 全部内容**

```tsx
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

  const { data: knowledge, isLoading, error } = useQuery<FashionKnowledge>({
    queryKey: ['knowledge'],
    queryFn: () => get('/knowledge'),
  });

  const saveMutation = useMutation({
    mutationFn: (data: FashionKnowledge) => put('/knowledge', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-ink">潮流知识库</h2>
        <div className="bg-surface rounded-2xl p-8 animate-pulse space-y-4 border border-border shadow-card">
          <div className="h-8 bg-surface-2 rounded w-1/3" />
          <div className="h-64 bg-surface-2 rounded" />
        </div>
      </div>
    );
  }

  if (error || !knowledge) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-ink">潮流知识库</h2>
        <div className="bg-surface rounded-2xl p-8 text-center border border-border shadow-card">
          <BookOpen className="w-10 h-10 text-ink-3 mx-auto mb-2" />
          <p className="text-danger-on-soft text-sm">加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">潮流知识库</h2>
      <p className="text-ink-2 text-xs">
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
```

- [ ] **Step 2: 替换 `KnowledgeManager.tsx` 全部内容**

```tsx
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
```

- [ ] **Step 3: 验证构建**

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run build`
Expected: 成功。

- [ ] **Step 4: 验证残留色类**

Run: `cd C:\Users\linchenhao\wardrobe\client && Get-ChildItem src/pages/KnowledgePage.tsx,src/components/KnowledgeManager.tsx | Select-String -Pattern 'slate-|indigo-'`
Expected: 无输出。

- [ ] **Step 5: 提交**

```bash
git add client/src/pages/KnowledgePage.tsx client/src/components/KnowledgeManager.tsx
git commit -m "feat: 知识库页及管理面板换肤"
```

---

## Task 7: 潮流库管理页

**Files:**
- Modify: `client/src/pages/TrendManagePage.tsx`

**Interfaces:**
- Consumes: Task 1 的 Token。

- [ ] **Step 1: 替换 `TrendManagePage.tsx` 全部内容**

```tsx
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

  const bg = type === 'success' ? 'bg-success' : 'bg-danger';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 z-50 ${bg} text-white px-4 py-3 rounded-lg shadow-card flex items-center gap-2 text-sm`}>
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
        <div key={i} className="h-16 bg-surface-2 rounded-lg" />
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

  const fieldClass = 'bg-surface text-ink rounded px-2 py-1.5 text-xs border border-border focus:border-primary';

  return (
    <div className="space-y-3 bg-surface-2 rounded-lg p-3">
      <div className="grid grid-cols-2 gap-2">
        <select value={season} onChange={e => setSeason(e.target.value)}
          className={fieldClass}>
          {SEASON_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input type="text" value={yearQuarter} onChange={e => setYearQuarter(e.target.value)}
          placeholder="2025-Q1" className={fieldClass} />
      </div>

      {/* 流行色多选 */}
      <div>
        <p className="text-xs text-ink-2 mb-1">流行色</p>
        <div className="flex flex-wrap gap-1">
          {COLOR_OPTIONS.map(c => (
            <button key={c.value} onClick={() => toggleColor(c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${popularColors.includes(c.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 风格多选 */}
      <div>
        <p className="text-xs text-ink-2 mb-1">推荐风格</p>
        <div className="flex flex-wrap gap-1">
          {STYLE_OPTIONS.map(s => (
            <button key={s.value} onClick={() => toggleStyle(s.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${styles.includes(s.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <input type="text" value={taboos} onChange={e => setTaboos(e.target.value)}
        placeholder="穿搭禁忌，用中文分号；分隔" className={`${fieldClass} w-full`} />

      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded py-1.5 text-xs">
          {saving ? '保存中...' : initial ? '更新' : '新增'}
        </button>
        <button onClick={onCancel} className="px-3 bg-surface-2 hover:bg-border-strong text-ink-2 rounded text-xs">取消</button>
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
  const fieldClass = 'bg-surface text-ink rounded px-2 py-1.5 text-xs border border-border focus:border-primary';

  return (
    <div className="space-y-3 bg-surface-2 rounded-lg p-3">
      <div className="grid grid-cols-2 gap-2">
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="模板名称" className={fieldClass} />
        <input type="text" value={occasion} onChange={e => setOccasion(e.target.value)}
          placeholder="适用场合" className={fieldClass} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select value={season} onChange={e => setSeason(e.target.value)}
          className={fieldClass}>
          {SEASON_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={style} onChange={e => setStyle(e.target.value)}
          className={fieldClass}>
          {STYLE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* 上装可选范围 */}
      <div>
        <p className="text-xs text-ink-2 mb-1">上装可选</p>
        <div className="flex flex-wrap gap-1">
          {catOptions.map(c => (
            <button key={c.value} onClick={() => toggleCategory(topRange, setTopRange, c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${topRange.includes(c.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 下装可选范围 */}
      <div>
        <p className="text-xs text-ink-2 mb-1">下装可选</p>
        <div className="flex flex-wrap gap-1">
          {catOptions.map(c => (
            <button key={c.value} onClick={() => toggleCategory(bottomRange, setBottomRange, c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${bottomRange.includes(c.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 外套可选范围 */}
      <div>
        <p className="text-xs text-ink-2 mb-1">外套可选</p>
        <div className="flex flex-wrap gap-1">
          {catOptions.map(c => (
            <button key={c.value} onClick={() => toggleCategory(outerwearRange, setOuterwearRange, c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${outerwearRange.includes(c.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 鞋子可选范围 */}
      <div>
        <p className="text-xs text-ink-2 mb-1">鞋子可选</p>
        <div className="flex flex-wrap gap-1">
          {catOptions.map(c => (
            <button key={c.value} onClick={() => toggleCategory(shoesRange, setShoesRange, c.value)}
              className={`text-xs px-2 py-0.5 rounded-full ${shoesRange.includes(c.value) ? 'bg-primary text-white' : 'bg-surface-2 text-ink-2'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <textarea value={description} onChange={e => setDescription(e.target.value)}
        placeholder="搭配说明（如：浅色衬衫 + 西裤 + 低跟皮鞋）"
        className={`${fieldClass} w-full h-16 resize-none`} />

      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={saving || !name || !occasion}
          className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-ink-3 disabled:text-ink-2 text-white rounded py-1.5 text-xs">
          {saving ? '保存中...' : initial ? '更新' : '新增'}
        </button>
        <button onClick={onCancel} className="px-3 bg-surface-2 hover:bg-border-strong text-ink-2 rounded text-xs">取消</button>
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

  const [editingTrend, setEditingTrend] = useState<TrendInfo | undefined>(undefined);
  const [showTrendForm, setShowTrendForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MatchTemplate | undefined>(undefined);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

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
        <h2 className="text-xl font-bold text-ink">潮流库管理</h2>
        <p className="text-ink-2 text-xs mt-1">
          管理季节流行趋势和自定义搭配模板，修改后穿搭推荐实时生效。
        </p>
      </div>

      {/* 左右分栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ====== 左：季节潮流 ====== */}
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-ink font-medium text-sm">季节潮流</h3>
            <button onClick={() => { setShowTrendForm(true); setEditingTrend(undefined); }}
              className="flex items-center gap-1 text-xs bg-primary hover:bg-primary-hover text-white px-2.5 py-1.5 rounded-lg">
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
              {trends.length === 0 && <p className="text-ink-3 text-xs text-center py-4">暂无季节潮流数据</p>}
              {trends.map(t => (
                <div key={t.id} className="bg-surface-2 rounded-lg p-3">
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
                          <span className="text-ink text-sm font-medium">
                            {SEASON_OPTIONS.find(s => s.value === t.season)?.label || t.season}
                          </span>
                          <span className="text-xs text-ink-2">{t.yearQuarter}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {t.popularColors.map(c => (
                            <span key={c} className="text-xs bg-surface-2 text-ink-2 px-1.5 py-0.5 rounded">
                              {COLOR_OPTIONS.find(o => o.value === c)?.label || c}
                            </span>
                          ))}
                        </div>
                        {t.taboos.length > 0 && (
                          <p className="text-xs text-danger-on-soft mt-1">禁忌：{t.taboos.join('；')}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingTrend(t)}
                          className="p-1.5 text-ink-2 hover:text-primary rounded">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteTrend(t.id)}
                          className="p-1.5 text-ink-2 hover:text-danger rounded">
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
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-ink font-medium text-sm">搭配模板</h3>
            <button onClick={() => { setShowTemplateForm(true); setEditingTemplate(undefined); }}
              className="flex items-center gap-1 text-xs bg-primary hover:bg-primary-hover text-white px-2.5 py-1.5 rounded-lg">
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
              {templates.length === 0 && <p className="text-ink-3 text-xs text-center py-4">暂无搭配模板数据</p>}
              {templates.map(m => (
                <div key={m.id} className="bg-surface-2 rounded-lg p-3">
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
                          <span className="text-ink text-sm font-medium">{m.name}</span>
                          <span className="text-xs text-ink-2">{m.occasion}</span>
                        </div>
                        <div className="text-xs text-ink-2 mt-0.5">
                          {SEASON_OPTIONS.find(s => s.value === m.season)?.label || m.season} · {STYLE_OPTIONS.find(s => s.value === m.style)?.label || m.style}
                        </div>
                        {m.description && <p className="text-xs text-ink-3 mt-0.5">{m.description}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingTemplate(m)}
                          className="p-1.5 text-ink-2 hover:text-primary rounded">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteTemplate(m.id)}
                          className="p-1.5 text-ink-2 hover:text-danger rounded">
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
```

- [ ] **Step 2: 验证构建**

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run build`
Expected: 成功。

- [ ] **Step 3: 验证残留色类**

Run: `cd C:\Users\linchenhao\wardrobe\client && Select-String -Path src/pages/TrendManagePage.tsx -Pattern 'slate-|indigo-'`
Expected: 无输出。

- [ ] **Step 4: 提交**

```bash
git add client/src/pages/TrendManagePage.tsx
git commit -m "feat: 潮流库管理页换肤"
```

---

## Task 8: 全站终验

**Files:**
- 无新增/修改（仅验证）。

**Interfaces:**
- 无。

- [ ] **Step 1: 全量构建**

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run build`
Expected: 成功，无类型错误。

- [ ] **Step 2: 全量残留色类扫描**

Run: `cd C:\Users\linchenhao\wardrobe\client && Get-ChildItem src -Recurse -Include *.tsx,*.ts | Select-String -Pattern 'slate-|indigo-'`
Expected: 无任何输出（0 匹配）。

- [ ] **Step 3: 入口 HTML 扫描**

Run: `cd C:\Users\linchenhao\wardrobe\client && Select-String -Path index.html -Pattern 'dark|text-gray|bg-page'`
Expected: 无输出。

- [ ] **Step 4: 视觉冒烟检查**（启动 dev server 手动过一遍）

Run: `cd C:\Users\linchenhao\wardrobe\client && npm run dev`

逐页检查：
- 登录页：浅灰底、白色卡片、色卡 Logo、雾灰蓝主按钮。
- 衣橱：白卡片网格、筛选 Chip、雾灰蓝选中态。
- 穿搭：生成器/结果白卡片、收藏心形为豆沙粉。
- 知识库：白卡片 + 表格 + 标签页。
- 潮流库：双栏白卡片、Toast 为灰绿/豆沙。
- 检查键盘 Tab 焦点环可见、无深色残留。

Expected: 视觉统一为冷调雾灰蓝莫兰迪 + 浅色清爽风。

- [ ] **Step 5: 提交（如有终验修正）**

```bash
git add -A
git commit -m "chore: 换肤终验修正"
```

---

## 自检记录

- **Spec 覆盖**：设计文档第 3–8 节（配色/字体/布局组件/签名/各页/实现方式）分别由 Task 1–8 覆盖；第 9 节非目标（不新增功能/不改后端/不引组件库/不做深色）由 Global Constraints 落实。
- **占位符扫描**：无 TBD/TODO/「类似 Task N」。
- **类型一致性**：`BrandMark` 在 Task 2 定义、Task 3 引用，签名一致；颜色 Token 命名在各任务一致（`primary`/`primary-soft`/`danger-on-soft` 等）。
