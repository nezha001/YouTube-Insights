# YouTube 洞察追踪 (YouTube Insight Tracker)

这是一个基于 **Google Gemini API** 的 YouTube 频道分析仪表盘。它利用 Gemini 的强大搜索和推理能力，实时抓取并分析 YouTube 频道的订阅数、播放量和热门视频数据，并以可视化的方式呈现。

## ✨ 功能特点

*   **智能搜索**：支持搜索任意 YouTube 频道（如 "李子柒"、"MrBeast"）。
*   **实时数据**：获取最新的订阅者计数、总观看次数和视频数量。
*   **可视化图表**：使用图表直观展示热门视频的播放量对比。
*   **本地收藏**：支持收藏常看的频道，数据保存于本地浏览器。
*   **数据溯源**：提供 Gemini 抓取数据的来源链接，确保透明度。

## 🛠️ 技术栈

*   **前端框架**: React 18, Vite
*   **UI 组件**: Tailwind CSS, Lucide React
*   **图表库**: Recharts
*   **AI 引擎**: Google GenAI SDK (Gemini 2.5 Flash)
*   **容器化**: Docker, Nginx

## 🚀 快速开始

### 前置要求

你需要一个 Google Gemini API Key。
👉 [点击这里获取 API Key](https://aistudio.google.com/app/apikey)

### 方式一：使用 Docker Compose (推荐)

1.  **克隆或下载项目**

2.  **创建配置文件**
    在项目根目录创建一个 `.env` 文件，并填入你的 API Key：
    ```bash
    echo "API_KEY=你的_GEMINI_API_KEY" > .env
    ```

3.  **启动服务**
    ```bash
    docker-compose up -d --build
    ```

4.  **访问应用**
    打开浏览器访问：[http://localhost:8080](http://localhost:8080)

### 方式二：本地开发运行

1.  **安装依赖**
    ```bash
    npm install
    ```

2.  **设置环境变量**
    Linux/Mac:
    ```bash
    export API_KEY=你的_GEMINI_API_KEY
    ```
    Windows (PowerShell):
    ```powershell
    $env:API_KEY="你的_GEMINI_API_KEY"
    ```

3.  **启动开发服务器**
    ```bash
    npm run dev
    ```

## 📂 项目结构

```
.
├── Dockerfile          # 构建镜像配置
├── docker-compose.yml  # 容器编排配置
├── index.html          # 入口 HTML
├── package.json        # 依赖配置
├── vite.config.ts      # Vite 构建配置
├── src/                # (虚拟目录结构，实际在根目录)
│   ├── App.tsx         # 主应用组件
│   ├── components/     # UI 组件
│   ├── services/       # Gemini API 服务
│   └── types.ts        # TypeScript 类型定义
└── README.md           # 说明文档
```

## ⚠️ 注意事项

*   **API 配额**：Gemini API 免费层级有速率限制，请勿过于频繁刷新。
*   **数据准确性**：数据由 AI 实时搜索生成，虽然使用了 Google Search 工具增强准确性，但偶尔可能出现偏差，请以 YouTube 官方数据为准。
