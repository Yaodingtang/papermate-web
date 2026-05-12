# PaperMate Web - 前端项目

基于 Next.js 14 + React 18 + shadcn/ui + Tailwind CSS 的论文阅读管理系统前端。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: React 18 + shadcn/ui + Tailwind CSS
- **状态管理**: Zustand + React Query
- **PDF 渲染**: PDF.js
- **HTTP 客户端**: Axios

## 项目结构

```
papermate-web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   │   ├── login/
│   │   └── register/
│   ├── (main)/            # 主要功能页面
│   │   ├── discover/      # 发现页
│   │   ├── bookshelf/     # 书架页
│   │   ├── reading/       # 阅读页
│   │   ├── cards/         # 卡片页
│   │   ├── review/        # 综述页
│   │   ├── experiment/    # 实验页
│   │   ├── submit/        # 投稿页
│   │   ├── track/         # 追踪页
│   │   └── team/          # 团队页
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── layout/           # 布局组件
│   ├── paper/            # 论文相关组件
│   └── reader/           # PDF 阅读器组件
├── lib/                   # 工具库
│   ├── api.ts            # API 客户端
│   ├── auth.ts           # 认证工具
│   └── utils.ts          # 通用工具
├── stores/               # Zustand 状态
├── hooks/                # 自定义 Hooks
├── types/                # TypeScript 类型
├── public/               # 静态资源
├── styles/               # 样式
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 依赖配置
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start
```

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## 部署

项目可部署到 Vercel，一键部署：

```bash
vercel deploy
```

## License

MIT