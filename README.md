# Inspiration-website

个人灵感网站收藏夹管理工具 — Neumorphism 新拟物化风格

---

## 技术栈

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion（动画）

---

## 上传到 GitHub

### 1. 在 GitHub 创建新仓库
- 登录 https://github.com
- 点击右上角 **+** → **New repository**
- Repository name 填 `inspiration-website`
- 选择 **Public**（公开）
- 点击 **Create repository**

### 2. 推送代码

```bash
# 进入项目目录
cd app

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/inspiration-website.git

# 推送
git branch -M main
git push -u origin main
```

---

## 部署到 Vercel

### 1. 导入项目
- 登录 https://vercel.com（可用 GitHub 账号直接登录）
- 点击 **Add New...** → **Project**
- 选择你的 `inspiration-website` 仓库
- 点击 **Import**

### 2. 配置构建设置
Vercel 会自动识别，一般不需要修改：
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. 部署
- 点击 **Deploy**
- 等待构建完成
- 完成后会给你一个 `.vercel.app` 的域名

### 4. 自定义域名（可选）
- 在项目设置里找到 **Domains**
- 添加你自己的域名

---

## 后续更新数据流程

### 更新网站数据

网站数据存储在 `src/App.tsx` 中的 `defaultSites` 数组里。

**在页面上操作后同步到代码：**

1. 在页面上添加/编辑/删除网站，上传截图
2. 点击 **【导出】** 按钮，下载 JSON 文件
3. 把 JSON 文件内容替换 `src/App.tsx` 中的 `defaultSites` 数组
4. 提交并推送：

```bash
git add .
git commit -m "Update site data"
git push
```

5. Vercel 会自动重新构建部署

---

## Google Analytics 配置

### 1. 注册账号
- 访问 https://analytics.google.com
- 用 Google 账号登录
- 点击 **开始衡量**

### 2. 创建属性
- 属性名称：填 `Inspiration-website`
- 时区：选择你的时区
- 货币：选择货币

### 3. 创建数据流
- 选择 **网站**
- 网站网址：填你的 Vercel 域名或自定义域名
- 数据流名称：默认即可
- 点击 **创建数据流**

### 4. 获取 Measurement ID
- 创建后会显示 **Measurement ID**（格式：`G-XXXXXXXXXX`）
- 复制这个 ID

### 5. 填入代码
打开 `src/lib/analytics.ts`：

```typescript
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← 替换为你的真实 ID
```

### 6. 重新部署

```bash
git add .
git commit -m "Add Google Analytics"
git push
```

Vercel 会自动重新构建部署，之后即可在 GA 后台看到访问数据。

---

## 项目结构

```
app/
├── src/
│   ├── App.tsx              # 主应用（网站数据在这里）
│   ├── main.tsx             # 入口文件
│   ├── index.css            # 全局样式（Neumorphism 阴影系统）
│   ├── types/
│   │   └── site.ts          # 数据类型定义
│   ├── sections/
│   │   ├── Toolbar.tsx      # 工具栏（筛选+搜索+添加+导出）
│   │   ├── AddSiteForm.tsx  # 添加/编辑弹窗表单
│   │   ├── SiteCard.tsx     # 网站卡片
│   │   ├── SiteCardGrid.tsx # 卡片网格布局
│   │   └── ManageCategoriesDialog.tsx  # 分类管理（当前未使用）
│   ├── components/ui/       # shadcn/ui 组件库
│   └── lib/
│       ├── analytics.ts     # Google Analytics 配置
│       └── utils.ts         # 工具函数
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── index.html
```

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```
