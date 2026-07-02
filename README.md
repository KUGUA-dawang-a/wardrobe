# 虚拟衣帽间 + AI 穿搭推荐

一个全栈 Web 应用，帮你管理线上衣橱、记录衣物、生成穿搭推荐。

## 功能一览

- **JWT 用户系统**：注册 / 登录，每个用户数据完全隔离
- **衣物管理**：上传衣服照片（自动压缩为 WebP），标注分类 / 颜色 / 季节 / 风格
- **多条件筛选**：按季节、颜色、风格筛选衣橱
- **换季归档**：将某季节衣物一键归档，归档衣物不出现在穿搭推荐中
- **本地穿搭规则引擎**：根据配色规则、风格兼容性自动匹配穿搭（无需联网）
- **Ollama AI 增强推荐**：如果本地启动了 Ollama，自动使用 AI 生成更智能的搭配建议
- **穿搭收藏**：收藏喜欢的搭配方案
- **潮流知识库管理**：可视化编辑配色规则、场合模板、穿搭禁忌

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query |
| 后端 | Node.js + Express + TypeScript |
| 鉴权 | JWT (jsonwebtoken) + bcryptjs |
| 图片 | Multer + Sharp (WebP 压缩) |
| AI | Ollama (本地运行, 可选, 自动降级) |
| 数据 | JSON 文件存储（无需安装数据库） |

## 目录结构

```
wardrobe/
├── server/                        # 后端代码
│   ├── src/
│   │   ├── index.ts               # Express 入口
│   │   ├── config.ts              # 配置（端口、JWT密钥等）
│   │   ├── types.ts               # 类型定义
│   │   ├── middleware/auth.ts     # JWT 鉴权中间件
│   │   ├── data/                  # JSON 数据文件
│   │   │   ├── users.json         # 用户数据
│   │   │   ├── wardrobe-*.json    # 各用户衣橱（自动生成）
│   │   │   └── fashionKnowledge.json  # 潮流知识库
│   │   ├── services/              # 业务逻辑
│   │   │   ├── wardrobeService.ts # 衣橱 CRUD
│   │   │   ├── fashionEngine.ts   # 本地穿搭规则引擎
│   │   │   ├── aiService.ts       # Ollama AI 接口
│   │   │   └── imageService.ts    # 图片压缩与删除
│   │   └── routes/                # API 路由
│   │       ├── auth.ts            # 注册 / 登录
│   │       ├── items.ts           # 衣物增删改查
│   │       ├── upload.ts          # 图片上传
│   │       ├── outfits.ts         # 穿搭生成 + 收藏
│   │       └── knowledge.ts       # 知识库管理
│   └── package.json
├── client/                        # 前端代码
│   ├── src/
│   │   ├── main.tsx / App.tsx     # 入口 + 路由
│   │   ├── types/index.ts         # 前端类型定义
│   │   ├── api/client.ts          # API 请求封装
│   │   ├── context/AuthContext.tsx # 登录状态管理
│   │   ├── components/            # UI 组件
│   │   │   ├── Layout.tsx         # 导航布局
│   │   │   ├── UploadForm.tsx     # 拖拽上传表单
│   │   │   ├── ClothingCard.tsx   # 衣服卡片
│   │   │   ├── WardrobeGrid.tsx   # 衣橱网格（含骨架屏）
│   │   │   ├── EditItemModal.tsx  # 编辑弹窗
│   │   │   ├── SeasonFilter.tsx   # 筛选 + 归档
│   │   │   ├── OutfitGenerator.tsx# 穿搭控制面板
│   │   │   ├── OutfitResult.tsx   # 穿搭推荐结果
│   │   │   ├── SavedOutfits.tsx   # 收藏列表
│   │   │   └── KnowledgeManager.tsx # 知识库管理
│   │   └── pages/
│   │       ├── LoginPage.tsx      # 登录 / 注册
│   │       ├── WardrobePage.tsx   # 衣橱主页
│   │       ├── OutfitPage.tsx     # 穿搭推荐
│   │       └── KnowledgePage.tsx  # 知识库管理
│   └── package.json
└── README.md
```

## 安装与启动

### 前置要求

- **Node.js 18+**（推荐 20 LTS）
- **npm**（随 Node.js 一起安装）
- **Ollama**（可选，用于 AI 增强推荐）

### 1. 启动后端

```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 启动后端开发服务器（默认 http://localhost:3001）
npm run dev
```

看到以下输出说明启动成功：

```
🧥 衣帽间服务器已启动：http://localhost:3001
📡 注册：POST http://localhost:3001/api/auth/register
📡 登录：POST http://localhost:3001/api/auth/login
📡 衣橱：GET  http://localhost:3001/api/items
```

### 2. 启动前端（新开一个终端）

```bash
# 进入前端目录
cd client

# 安装依赖
npm install

# 启动前端开发服务器
npm run dev
```

浏览器打开终端显示的地址（通常是 http://localhost:5173）。

### 3. 初始化数据

服务端首次启动后，**请先访问潮流知识库页面**（顶部导航 → 知识库），它会自动初始化默认的配色规则、场合模板和穿搭禁忌。

或者直接使用已有的默认数据（`server/src/data/fashionKnowledge.json`）。

### 4. 可选：安装 Ollama（AI 增强推荐）

如果要使用 AI 生成穿搭推荐：

```bash
# 1. 安装 Ollama
#    Windows: 从 https://ollama.com 下载安装包
#    macOS:   brew install ollama
#    Linux:   curl -fsSL https://ollama.com/install.sh | sh

# 2. 拉取推荐模型（约 2GB）
ollama pull llama3.2

# 3. 启动 Ollama 服务
ollama serve

# 4. 重启后端，AI 功能自动生效
#    前端穿搭页面会显示 "✨ AI 增强" 标签
```

> 如果 Ollama 未启动，系统会自动降级为本地规则引擎，不影响正常使用。

## 使用指南

### 注册与登录

1. 打开浏览器访问前端地址
2. 点击"注册"标签，输入用户名和密码（密码至少 4 位）
3. 注册成功后自动登录，进入衣橱页面

### 上传衣服

1. 在衣橱页面左侧的"上传新衣服"区域拖拽或点击选择图片
2. 填写衣服名称
3. 选择分类（上衣/下装/外套/鞋/配饰/连衣裙）
4. 选择颜色
5. 选择适用季节（可多选）
6. 选择风格（可多选）
7. 点击"上传"按钮

> 上传的图片会自动压缩为 WebP 格式，减小存储空间。

### 管理知识库

1. 点击顶部导航的"知识库"
2. 有三个标签页：
   - **配色规则**：管理颜色搭配组合和评分
   - **场合模板**：定义不同场合的穿搭要求
   - **穿搭禁忌**：记录需要避免的搭配

### 生成穿搭推荐

1. 点击顶部导航的"穿搭"
2. 选择目标场合（可选）
3. 打开"AI 增强推荐"开关（如果启动了 Ollama）
4. 点击"生成穿搭推荐"
5. 查看推荐结果，点击心形图标收藏

### 换季归档

1. 在衣橱页面，筛选栏下方有"换季归档"按钮
2. 点击某季节的归档按钮，该季节所有衣物会被标记为"已归档"
3. 归档衣物不出现在穿搭推荐中
4. 勾选"显示已归档"可以查看归档衣物

## API 接口一览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| GET | `/api/items` | 获取衣橱列表（支持筛选） |
| POST | `/api/items` | 添加衣物 |
| PUT | `/api/items/:id` | 修改衣物 |
| DELETE | `/api/items/:id` | 删除衣物 |
| POST | `/api/items/archive` | 批量归档 |
| POST | `/api/upload` | 上传图片 |
| GET | `/api/knowledge` | 获取知识库 |
| PUT | `/api/knowledge` | 更新知识库 |
| GET | `/api/outfits/generate` | 生成穿搭推荐 |
| GET | `/api/outfits/saved` | 获取收藏穿搭 |
| POST | `/api/outfits/saved` | 收藏穿搭 |
| DELETE | `/api/outfits/saved/:id` | 取消收藏 |
| GET | `/api/outfits/ai-status` | 检查 Ollama 状态 |

## 常见问题

**Q: 上传图片失败怎么办？**
A: 检查图片格式（支持 JPG/PNG/GIF/WebP）和大小（最大 5MB）。

**Q: 收藏穿搭后在哪查看？**
A: 在穿搭推荐页面的左侧"收藏的穿搭"区域查看。

**Q: 如何切换用户？**
A: 点击右上角的退出按钮，重新登录其他账号。

**Q: 忘记密码怎么办？**
A: 目前没有密码重置功能，建议在知识库文件中手动删除用户重新注册。

**Q: AI 推荐不生效？**
A: 确保已安装 Ollama 并运行 `ollama serve`。可以在穿搭页面查看 AI 状态。
