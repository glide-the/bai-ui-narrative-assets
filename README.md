# 洱海边的三重回声 · `nationality-pwa-app`

`bai_ui_narrative_assets` 同时承载 **白族文化 × 现代文明** 叙事型 UI 资产，以及已提升到仓库根目录的 **Next.js 16 PWA / Claude Agent API** 工程壳。根 README 只做快速入口；深度背景、规格与架构事实请进入 `docs/`。

[文档中心](docs/README.md) · [工程架构](docs/architecture/项目架构设计说明.md) · [实现权威设计稿](docs/design/工程设计稿.md) · [SUO-88 README 设计](docs/design/SUO-88-README-better-chatbot-structure.md)

## 项目定位

- **叙事 UI 资产**：维护七章横向故事板、符号体系、章节文案、Mask 坐标与交互约束。
- **可运行应用**：根目录包含 Next.js App Router、PWA manifest、Claude Agent route、PostgreSQL / Drizzle、文件存储与测试配置。
- **协作入口**：`docs/README.md` 负责资源导航，根 README 负责安装、启动、环境变量与 Guides 索引。

## 核心特性

- 白族文化叙事、身份 / 生活 / 仪式符号与 UI 规格同仓维护。
- `app/api/claude-agent` 提供 Claude Agent 接入与流式工具交互能力。
- `app/lib` 集中沉淀 DB、chat schema、文件存储、WeKnora、workspace 等通用能力。
- PostgreSQL 16 + Drizzle ORM，配套 Vitest、Playwright 与 ESLint 质量闸。

## Table of Contents

- [Quick Start](#quick-start)
- [环境变量](#环境变量)
- [文档与 Guides](#文档与-guides)
- [开发与测试](#开发与测试)
- [仓库结构](#仓库结构)
- [Contributing / License](#contributing--license)

## Quick Start

### 前置要求

- Node.js 20+（建议启用 Corepack）
- `pnpm@9.15.0`
- Docker / Docker Compose（用于 PostgreSQL、MinIO 或完整应用容器）

### 本地开发

```bash
corepack enable
pnpm install
cp .env.local.example .env.local
docker compose up -d postgres minio minio-init
pnpm db:migrate
pnpm dev
```

默认开发地址是 `http://localhost:3000`。使用根 `docker-compose.yml` 启动依赖时，本机数据库默认可配为 `postgres://nationality:nationality@localhost:5433/nationality`；如改用 `docker/compose.yml`，请按 `docker/.env.example` 中的服务名与端口配置。

完整 Docker 应用可执行：`cp docker/.env.example docker/.env` 后运行 `pnpm docker:up`；日志与停止分别用 `pnpm docker:logs`、`pnpm docker:down`。

## 环境变量

复制 `.env.local.example` 到 `.env.local` 后只填写真实值，不提交密钥。

| 变量 | 必填 | 用途 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_BASE_URL` | 运行 Claude Agent happy path 时必填 | Claude Agent SDK 接入 |
| `DATABASE_URL` 或 `PGHOST` 等 `PG*` | 必填 | PostgreSQL / Drizzle 数据库连接 |
| `FILE_STORAGE_TYPE` + Blob / S3 相关变量 | 视存储类型而定 | Vercel Blob、S3 或 MinIO 文件存储 |
| `EXA_API_KEY` | 可选 | Exa MCP 搜索能力 |
| `WEKNORA_*` | 可选 | WeKnora 知识库检索 |
| `AGENT_CWD`、`MAX_BUDGET_USD`、`MAX_TURNS` | 可选 | Agent workspace 与运行限制 |

## 文档与 Guides

- [AGENTS.md](AGENTS.md)：仓库级 AI 编辑、API / lib / UI 分层与测试规则。
- [docs/README.md](docs/README.md)：项目背景、资源导航与业务读档映射。
- [docs/design/工程设计稿.md](docs/design/工程设计稿.md)：叙事 UI 原型与交互规格权威。
- [docs/architecture/项目架构设计说明.md](docs/architecture/项目架构设计说明.md)：仓库信息架构、迁移背景与目录边界。
- [plans/2026-05-14-SUO-84-agent-runtime-migration.md](plans/2026-05-14-SUO-84-agent-runtime-migration.md)：Agent runtime 提升到根目录的验收上下文。

## 开发与测试

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | Next dev server（`next dev -H 0.0.0.0`） |
| `pnpm build` / `pnpm start` | 生产构建与启动 |
| `pnpm lint` | ESLint |
| `pnpm test` / `pnpm test:run` / `pnpm test:coverage` | Vitest 交互、单测批跑与覆盖率 |
| `pnpm test:e2e` / `pnpm test:all` | Playwright E2E / 单测 + E2E |
| `pnpm db:generate` / `pnpm db:migrate` | Drizzle 迁移生成 / push |
| `pnpm docker:build` / `pnpm docker:up` / `pnpm docker:down` / `pnpm docker:logs` | `docker/compose.yml` 应用编排 |

## 仓库结构

```text
.
├── app/               # Next.js App Router、Claude Agent API、lib 通用能力
├── docs/              # 设计资产、架构说明、solution 与 SUO-88 README 设计稿
├── docker/            # 完整应用容器编排
├── docker-compose.yml # 本地 PostgreSQL / MinIO 依赖编排
├── drizzle/           # Drizzle schema / migration 输出
├── plans/             # Paperclip / 迁移验收类共享计划
├── tests/             # Playwright E2E 与测试辅助
└── README.md          # 本文件：门面、Quick Start、环境变量与 Guides
```

## Contributing / License

提交遵循 Conventional Commits，并在 PR 中记录改动点、UI 截图（如有）与至少 `pnpm lint` + `pnpm test:run` 的结果；高风险或端到端改动补跑 `pnpm test:e2e` / `pnpm test:all`。当前仓库未声明开源许可证（未发现 `LICENSE` 文件），对外分发前需先补齐授权说明。
