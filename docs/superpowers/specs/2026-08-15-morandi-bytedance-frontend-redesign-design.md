# 莫兰迪 × 字节跳动风格前端换肤设计

- 日期：2026-08-15
- 状态：已与用户确认
- 范围：`client/` 前端（React 18 + Vite + Tailwind CSS 3 + TypeScript）

## 1. 背景与目标

「我的衣帽间」当前使用深色 slate + 靛蓝（indigo）主题，视觉上冷硬、缺乏产品气质。
本次换肤目标：

1. 主色调改为**高级莫兰迪色系**（低饱和、灰调、雾感）。
2. 采用**字节跳动式（飞书向）浅色清爽风**：白卡片、柔和阴影、大圆角、充足留白。
3. 引入**中文字体**，提升排版质感。

**已确认的方向决策（用户逐项选定）：**

- 整体方向：飞书式浅色清爽风
- 点缀色：全部莫兰迪化（雾灰蓝点缀，不使用高饱和字节蓝 #3370FF）
- 字体：引入中文字体（思源黑体 Noto Sans SC）
- 配色方案：方案 A · 冷调雾灰蓝 Morandi

## 2. 设计原则

- 低饱和、灰调贯穿全局；功能色（成功/提醒/错误）同样莫兰迪化，不用刺眼纯红纯绿。
- 飞书式克制：白色卡片、发丝描边、轻阴影、大圆角、充足留白。
- 一个刻意的冒险点：功能色也低饱和，牺牲少量对比换取高级感；关键交互（按钮文字/链接）仍保证可读对比。
- 全站 Token 驱动：组件只引用语义 Token，便于后续统一调整。

## 3. 配色 Token

语义色 Token 写入 `tailwind.config.js` 的 `theme.extend.colors`，是组件唯一引用的颜色层；如实现需要，再补充同色系的浅/深档位（如 `primary-soft-strong`、`primary-hover`）。

### 中性色（莫兰迪雾灰）

| Token | 用途 | 色值 |
|---|---|---|
| `bg` | 页面底色（冷雾灰白） | `#F2F3F5` |
| `surface` | 卡片 / 面板 | `#FFFFFF` |
| `surface-2` | 次级填充、hover 底、骨架屏 | `#EDEFF3` |
| `border` | 描边 / 分隔线 | `#E4E7EC` |
| `border-strong` | 更深的描边 | `#D5DAE1` |
| `ink` | 正文 | `#24282E` |
| `ink-2` | 次要文字 | `#5F6672` |
| `ink-3` | 弱化 / 占位 | `#979EA8` |

### 主色（雾灰蓝，全部莫兰迪化）

| Token | 用途 | 色值 |
|---|---|---|
| `primary` | 主操作（按钮 / 链接 / 选中） | `#5A7594` |
| `primary-hover` | 悬停 | `#4B6481` |
| `primary-active` | 按下 | `#3F5670` |
| `primary-soft` | 浅底（选中态、标签底、色卡底） | `#EAEFF5` |
| `primary-soft-strong` | 浅底上的描边 | `#D6E0EB` |
| `primary-on-soft` | 浅底上的文字 | `#47607D` |

### 功能色（莫兰迪化）

| Token | 含义 | 主色 | 浅底 | 浅底文字 |
|---|---|---|---|---|
| `success` | 成功 | `#7C9A82` | `#EDF3EE` | `#54705A` |
| `warning` | 提醒 | `#C2A878` | `#F7F2E7` | `#8A7440` |
| `danger` | 删除 / 错误 | `#C08A82` | `#F7EDEB` | `#8F5852` |

## 4. 字体与排版

- 字体族：
  - 正文 / 标题：思源黑体 **Noto Sans SC**（400 / 500 / 600 / 700）
  - 数字 / 英文：**Inter**（与中文混排）
  - 字体栈：`'Inter', 'Noto Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`
- 字阶：
  - 页面标题：20–24px，字重 600
  - 区块标题：16–18px，字重 600
  - 正文：14px，字重 400
  - 辅助：12px
  - 标签：11px
- 加载方式（实施时确定，需保证国内可访问）：
  - 首选 Google Fonts（`display=swap`，Noto Sans SC 按 unicode-range 自动分包）
  - 备选 jsDelivr CDN / 自托管 `@fontsource`
  - 均以系统字体为回退，加载失败不影响可用性

## 5. 布局与组件规范（飞书式）

- **顶导航**：白底 + 底部发丝描边，sticky，高约 56px；激活项用 `primary-soft` 胶囊 + `primary-on-soft` 文字；右侧用户信息 + 退出图标。
- **容器**：`max-w-6xl`，水平 `px-4/6`，垂直 `py-6/8`。
- **卡片**：`surface` 白底、`rounded-2xl`、`border` 发丝描边 + 极轻柔和阴影（`0 1px 2px` + `0 8px 24px` 低透明度），避免硬阴影。
- **按钮**：
  - 主按钮：实底 `primary`，白字，hover `primary-hover`
  - 次按钮：白底 + `border` 描边，`ink` 文字
  - 幽灵按钮：透明，`ink-2` 文字，hover `surface-2`
  - 圆角 `rounded-lg`，`py-2/2.5`，字重 500
- **输入框**：白底 + `border` 描边，`rounded-lg`，聚焦时 `primary` 柔光环（`ring`）。
- **标签 / 筛选 Chip**：`primary-soft` 底 + `primary-on-soft` 字，`rounded-full`；选中态实底 `primary` 白字。
- **弹窗 / Toast**：白卡片 + `ink` 半透明遮罩，`rounded-2xl`；Toast 用成功/提醒/错误的浅底 + 对应文字色。
- **空状态 / 骨架屏**：弱化图标 + `ink-2` 文案；骨架用 `surface-2` 脉冲。
- **可访问性**：`:focus-visible` 可见焦点环；尊重 `prefers-reduced-motion`；文字与背景保持可读对比。

## 6. 签名元素（「衣橱 = 颜色」）

品牌标识由纯衬衫图标改为**圆角色卡**：`primary-soft` 圆角方块内嵌一组莫兰迪色点（雾灰蓝 / 灰绿 / 豆沙 / 燕麦），直接点题「莫兰迪」。

- 用于：顶导航 Logo、登录页。
- 注意：衣橱卡片上的衣物颜色标签展示的是衣物**真实颜色**（数据语义，红/蓝/绿等保持本色，不莫兰迪化）；仅其「圆角小色块」的造型语言与品牌色卡保持一致，实现贯穿。

## 7. 各页面改造要点

- **登录页**：软灰底 `bg` 居中卡片，色卡 Logo，登录/注册切换标签，雾灰蓝主按钮。
- **衣橱**：页头（标题 + 一句副标题）、筛选 Chip、上传卡片、白色衣物卡片网格（图上角色点）。
- **穿搭**：左生成器卡片 / 右结果卡片，收藏态用 `primary`，AI 未连接横幅改为 `warning` 浅底。
- **知识库**：分区卡片化，表单字段统一。
- **潮流库**：双栏卡片 + 列表项浅底，Toast 重做。

## 8. 实现方式（Token 驱动换肤）

1. 扩展 `client/tailwind.config.js`：写入语义色 Token、字体族、阴影、圆角。
2. 修改 `client/src/styles/index.css`：基础底色/字体/焦点环/reduced-motion/字体导入。
3. 修改 `client/index.html`：去掉 `class="dark"`，改浅色，加字体 preconnect，修正 `lang` 与 `title`。
4. 全量扫描 `client/src/**`：把 `slate-*` / `indigo-*` / `bg-slate-900` 等硬编码类替换为语义 Token（`bg` / `surface` / `ink` / `primary` / `success` / `warning` / `danger` 等）。
5. 移除 `darkMode: 'class'` 相关配置（本次为浅色单主题）。

## 9. 非目标（YAGNI）

- 不改后端逻辑与 API。
- 不新增功能页面或交互。
- 不引入组件库（继续使用 Tailwind 原子类 + 现有 lucide-react 图标）。
- 不做深色模式（本次为浅色单主题）。

## 10. 成功标准

- 全站无残留 `slate-*` / `indigo-*` 深色硬编码。
- 视觉统一为冷调雾灰蓝莫兰迪 + 飞书式浅色清爽风。
- 关键交互（按钮、链接、表单聚焦）对比度可读，键盘焦点可见。
- `npm run build`（`tsc && vite build`）通过，无类型/构建错误。
