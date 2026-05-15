# SUO-92 工程架构设计

## 1. 背景与目标

SUO-92 的输入要求是在 `bai_ui_narrative_assets` 中复制 `https://github.com/glide-the/claude-agent-next-kit`，并让本项目延续 `docs/architecture/项目架构设计说明.md` 的目录结构与工程实现。

本设计稿作为 design 阶段真相源，补齐 SUO-84 之后缺失的工程架构层说明：

- SUO-84 已定义 `app/api/claude-agent` 与相关 `app/lib` 模块的 API-only 迁移边界。
- SUO-92 进一步定义整个 Next.js App Router 工程壳如何从上游复制并适配到白族文化叙事型 PWA。
- 下游应以本文判断哪些目录已经落地、哪些模块需要继续复制、哪些上游销售 CRM 业务内容只可作为结构参考。

本次上游基线经核对为 `glide-the/claude-agent-next-kit` 的 `feat/claude-agent-kit` 分支，当前 HEAD 为 `53dc2c48aede26842f9fb110fc55039f234fad42`。该分支的架构文档已在本仓另存为 `docs/architecture/上游参考_claude-agent-next-kit_项目架构设计说明.md`。

## 2. 范围界定

### 2.1 本设计覆盖

- 根级 Next.js 16 App Router 工程壳：`app/`、`package.json`、`next.config.js`、`tsconfig.json`、`vitest.config.ts`、`playwright.config.ts`、`drizzle/`、Docker 配置。
- `app/api/**` Route Handlers 与 `app/lib/**` 通用能力的职责边界。
- 上游完整复制时的目录映射、当前仓库现状、待补齐模块和业务适配规则。
- `docs/architecture/项目架构设计说明.md` 后续应如何更新为工程事实登记点。
- 下游验收口径、风险与关键决策。

### 2.2 本设计不覆盖

- 不直接修改 `docs/architecture/`、`docs/issue/`、`docs/task/`、`docs/stage/`。
- 不直接实现代码、不创建 Issue、不拆 Task、不排 Stage。
- 不把上游 AI4Sales / Customers / Todos 的销售业务语义直接作为白族叙事产品目标。
- 不重写 SUO-84 的 `claude-agent` SSE、tool confirmation、workspace、attachment 细节；这些细节仍以 `docs/design/SUO-84 项目迁移设计.md` 为准。

### 2.3 默认假设

- “复制 `claude-agent-next-kit`”默认解释为复制工程结构、运行时能力和可复用模块，而不是照搬销售 CRM 产品文案、页面目标与信息架构。
- 白族叙事产品的业务入口仍来自 `docs/design/工程设计稿.md`、`docs/design-system.md` 与 `docs/solution/**`，上游页面只提供 Next.js 分层与组件组织范式。

## 3. 方案摘要

目标工程形态应从“文档资产仓 + 局部 Agent API”收敛为“文档资产 + Next.js PWA + Claude Agent API 同仓应用”：

- `app/` 是运行时主目录，采用 Next.js App Router；页面、API、组件、hooks 与 lib 同仓组织。
- `app/api/**/route.ts` 保持薄编排：请求解析、zod 校验、调用 `app/lib/**`、返回统一结构或流。
- `app/lib` 是稳定共享能力中心：DB、schema、查询、chat 协议、Claude Agent SDK 适配、文件存储、workspace、WeKnora、工具确认均在此沉淀。
- `docs/architecture/项目架构设计说明.md` 应登记工程事实，而不是继续只描述文档路径域；本文只给出设计要求，不直接修改 architecture 目录。
- 白族叙事 UI 应复用上游的 App Router、provider、chat、file/workspace、storage 等能力，但页面文案、导航、业务实体、设计系统和叙事资产必须回到本项目自己的设计源。

## 4. 详细设计

### 4.1 架构真相源关系

| 层级 | 真相源 | 说明 |
| --- | --- | --- |
| 上游工程范式 | `glide-the/claude-agent-next-kit` `feat/claude-agent-kit` | 提供 Next.js App Router、Claude Agent API、chat/file/workspace/storage 结构 |
| 本仓工程架构登记 | `docs/architecture/项目架构设计说明.md` | 后续应登记当前仓库事实：根级 `app/`、API、lib、DB、测试与部署 |
| API 迁移设计 | `docs/design/SUO-84 项目迁移设计.md` | `claude-agent` API 与相关 lib 的细节真相源 |
| 本次工程架构设计 | `docs/design/design_092_engineering_architecture.md` | 完整复制与适配边界的设计真相源 |
| 叙事产品设计 | `docs/design/工程设计稿.md`、`docs/design-system.md` | 白族文化叙事 UI、资产、章节与交互规格 |

### 4.2 目录映射与当前状态

| 上游路径 / 模块 | 本仓目标落点 | 当前状态 | 设计要求 |
| --- | --- | --- | --- |
| `app/api/claude-agent/route.ts` | 同路径 | 已存在 | 保持 SUO-84 边界；route 只做编排，复杂处理下沉 `app/lib` |
| `app/api/claude-agent/tool-confirm/route.ts` | 同路径 | 已存在 | manual tool confirmation 继续由 store + route 协调 |
| `app/lib/claude-agent-kit/**` | 同路径 | 已存在 | 作为 SDK 适配层，禁止页面或 route 私自拼 SDK 消息 |
| `app/lib/chat-schema.ts` | 同路径 | 已存在 | 对话协议唯一入口；UI 输入组件必须按此 schema 组包 |
| `app/lib/db.ts`、`app/lib/db/schema.ts`、`app/lib/queries.ts` | 同路径 | 已存在 | DB schema 只在 `app/lib/db/**` 维护；route 不散落 SQL/Drizzle 细节 |
| `app/lib/file-storage/**` | 同路径 | 已存在 | 对象存储抽象保留；具体后端由 config/env 选择 |
| `app/lib/workspace*.ts` | 同路径 | 已存在 | 对话 workspace、附件和 Agent 产物都经此层管理 |
| `app/api/storage/**` | 同路径 | 未见完整落地 | 若需要完整上游 file upload/download 能力，应补齐 route；否则 architecture 必须标明 scope 外 |
| `app/api/workspace/files/**` | 同路径 | 未见完整落地 | 若 UI 需要文件侧栏、下载或刷新能力，应补齐 route 与测试 |
| `app/api/system-config/route.ts` | 同路径 | 未见落地 | 若系统提示词、模型、theme、workspace 开关要由 UI 管理，应复制并接入 `system_configs` |
| `app/components/chat/**`、`AIInputDock.tsx`、`FileMessagePart.tsx`、`ToolMessagePart.tsx` | 同路径 | 未见落地 | 可作为 chat/workspace UI 基础组件复制，但文案与视觉需适配本项目设计系统 |
| `app/components/dashboard/**`、`app/app/providers.tsx`、`workspace-context.tsx` | 同路径 | 未见落地 | 可复用 provider、workspace context、文件侧栏等结构；禁止照搬销售仪表盘视觉 |
| `app/(app)/customers/**`、`app/(app)/todo/**` | 同路径或改造路径 | 未见落地 | 销售 CRM 页面不是白族叙事产品目标；仅作为 App Router 页面组范式参考 |
| `app/page.tsx` | 同路径 | 已存在临时入口 | 可保留为工程运行说明页；正式 PWA 首页应由叙事 UI 设计定义 |
| `drizzle/`、`drizzle.config.ts` | 同路径 | 已存在 | 迁移产物和 schema 保持同步；新增表必须配套迁移 |
| `tests/e2e/**` | 同路径 | 已存在若干测试 | 测试必须与实际页面/API 对齐；若页面未复制，相关 e2e 应被下游同步调整 |

### 4.3 目标工程分层

```text
.
├── app/
│   ├── (app)/                       # 正式 PWA 页面组；后续承载白族叙事 UI，而非销售 CRM 目标
│   ├── api/                         # Route Handlers：薄接入、校验、编排
│   │   ├── claude-agent/
│   │   ├── storage/                 # 完整文件能力需要时补齐
│   │   ├── workspace/files/         # 完整 workspace UI 需要时补齐
│   │   └── system-config/           # 运行配置 UI 需要时补齐
│   ├── components/                  # 可复用 UI，chat/file/tool 组件可从上游复制后换肤
│   ├── hooks/                       # useFileUpload/useCopy/useDebounce 等通用 hooks
│   ├── lib/                         # 稳定共享能力中心
│   │   ├── claude-agent-kit/
│   │   ├── db/
│   │   ├── file-storage/
│   │   ├── chat-schema.ts
│   │   ├── chat-attachment-processing.ts
│   │   ├── workspace.ts
│   │   ├── queries.ts
│   │   └── types.ts
│   ├── layout.tsx
│   ├── manifest.ts
│   └── page.tsx
├── docs/
│   ├── architecture/
│   ├── design/
│   └── solution/
├── drizzle/
├── tests/
├── docker/
├── package.json
└── pnpm-lock.yaml
```

### 4.4 API 与 lib 边界

- API 层只做四件事：解析 request、按 zod schema 校验、调用 `app/lib`、返回 Response/SSE。
- `app/api/claude-agent/route.ts` 中当前仍可见 `DEFAULT_MAX_TURNS`、`DEFAULT_SSE_HEARTBEAT_INTERVAL_MS`、heartbeat frame 常量等 route 内常量；后续架构收敛时应迁入 `app/lib/const.ts` 或专用 config 模块。
- `tool-confirm`、storage、workspace、system-config 等 route 必须复用 `app/lib` 的 store、file-storage、workspace、db/schema，不得在 route 内新建平行协议。
- 错误结构应统一，至少包含 `error`、可选 `code`、可选 `details`；流式 API 还需保持 `[DONE]` 或等价完成信号与 heartbeat 策略一致。

### 4.5 UI 与产品适配

上游 UI 可复制的是组件组织和交互能力，不是销售业务目标：

- 可复用：chat message list、tool message rendering、file message rendering、AI input dock、workspace/file sidebar、provider/context、modal/toast、upload hooks。
- 需替换：AI4Sales、客户、待办、销售工作流、客户搜索、CRM 视觉与 README 中的业务叙事。
- 本项目正式 UI 应对齐 `docs/design/工程设计稿.md`：白族文化七章叙事、符号热点、章节轨、资产 manifest、现代文明转折。
- 如果下游选择保留 customers/todos 表和 API，必须在 architecture 中标为“上游遗留/技术示例/可迁移能力”，不得包装成白族叙事产品的核心业务。

### 4.6 数据与存储

- `conversations` 与 `system_configs` 是 Claude Agent 与系统配置的核心表，应保留。
- `customers`、`todos` 来自上游销售域，是否保留取决于后续产品路线；若保留，应明确其当前是通用 CRUD 示例或兼容遗留，不作为叙事 UI 必需域。
- 文件能力分三层：
  - `app/lib/file-storage/**`：Blob/S3/MinIO 兼容抽象。
  - `app/lib/workspace*.ts`：对话级 workspace、上传写入、同步。
  - `app/api/storage/**` 与 `app/api/workspace/files/**`：前端可访问的上传、下载、浏览 route；当前仓库若未补齐，文件 UI 不应被宣布为完成。
- 叙事型静态资产如生成的 SVG/PNG 应由产品设计资产管线管理；不要与对话附件、Agent workspace 文件混用同一语义。

### 4.7 架构文档更新要求

下游若执行 SUO-92，应把 `docs/architecture/项目架构设计说明.md` 更新为当前工程事实：

- 开头应明确本仓已是 Next.js 16 App Router 应用，而不是“后续可选增加应用代码”。
- 目录树应包含当前事实：`app/`、`app/api/claude-agent`、`app/lib`、`drizzle/`、`docker/`、`tests/`、`plans/`。
- 上游参考应继续链接 `feat/claude-agent-kit`，并说明 `docs/architecture/上游参考_claude-agent-next-kit_项目架构设计说明.md` 是上游原文快照。
- “业务模块”表应拆成两类：白族叙事产品域、Claude Agent 运行时域；避免把 sales customers/todos 误写成目标产品核心。
- Technologies 表要以当前 `package.json` 为准，避免出现未安装依赖或旧路径，例如 `src/lib/file-storage`。

DesignArchitect 不直接修改 `docs/architecture/`，本节是给下游的设计验收要求。

### 4.8 验证策略

- 工程架构文档更新类任务：最小验证为链接/路径自检、`rg` 确认路径存在、必要时 `pnpm lint`。
- API/lib 复制类任务：至少跑 `pnpm test:run`，并补充对应 route 或 lib 单测。
- UI 复制类任务：至少跑目标组件单测和相关 Playwright e2e；正式页面未落地前，不应把 customers/todos e2e 当作本项目验收事实。
- DB schema 变更：必须执行 `pnpm db:generate` 生成迁移，并在 PR/Issue 评论记录迁移文件。

## 5. 验收标准

- 设计稿明确 SUO-92 与 SUO-84 的关系：SUO-84 是 `claude-agent` API 迁移细节，SUO-92 是完整工程架构复制与适配边界。
- 设计稿列出上游模块到本仓目标路径的映射，并标明当前已落地、待补齐、仅作结构参考或需要产品适配的内容。
- 设计稿明确 API 薄编排、`app/lib` 稳定共享能力、`chat-schema.ts` 协议唯一入口、DB schema 集中维护等架构规则。
- 设计稿明确不应把 AI4Sales / Customers / Todos 销售业务直接复制成白族叙事产品目标。
- 设计稿给出 `docs/architecture/项目架构设计说明.md` 后续更新口径，供下游只读消费。
- 风险、依赖、关键决策和增量变更记录完整，能够支撑 IssueDispatcher 或 TaskAgent 继续拆解。

## 6. 风险与依赖

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| 上游业务语义误带入 | 白族叙事产品被 sales CRM 概念污染 | 复制工程结构，替换业务文案和页面目标 |
| 当前 architecture 文档滞后 | 下游误判本仓仍是纯文档资产仓 | 按本文 4.7 更新 architecture，但由下游在对应阶段执行 |
| 支撑 API 未补齐 | file sidebar、workspace download、system config UI 无法工作 | 将 `app/api/storage/**`、`workspace/files/**`、`system-config` 标为待补齐或 scope 外 |
| route 内配置硬编码 | 多模块默认值漂移，违反仓库规则 | 将 heartbeat、max turns、model 等迁入 `app/lib/const.ts` 或 config |
| sales DB 表遗留 | schema 与产品叙事不一致 | 标注 customers/todos 为上游遗留或重命名为真实业务域 |
| 测试与实际页面不一致 | e2e 对不存在路由失败或产生假验收 | UI 落地前同步调整测试目标 |
| 上游 SDK/API 变化 | Claude Agent streaming 和 tool event 格式失配 | 以当前上游 commit 作为复制基线，升级时另行记录 ADR/设计变更 |
| 双 lockfile 或包管理混用 | 安装结果不稳定 | 以 `pnpm@9.15.0` 和 `pnpm-lock.yaml` 为主，其他 lockfile 需由下游确认是否删除 |

## 7. 关键决策记录

- **DEC-001**：SUO-92 的上游复制基线为 `glide-the/claude-agent-next-kit` `feat/claude-agent-kit`，核对 commit `53dc2c48aede26842f9fb110fc55039f234fad42`。
- **DEC-002**：复制目标是工程结构与可复用运行时能力，不直接复制 AI4Sales 销售产品语义。
- **DEC-003**：本仓目标形态是根级 Next.js App Router 应用；`app/` 是运行时主目录，`docs/` 是设计、架构和方案真相源。
- **DEC-004**：`app/api/**/route.ts` 保持薄编排；通用能力必须沉淀在 `app/lib/**`。
- **DEC-005**：`app/lib/chat-schema.ts` 是 AI 对话协议唯一入口；UI 输入组件不得私自扩展请求字段。
- **DEC-006**：完整复制上游文件/工作区能力时，`app/api/storage/**`、`app/api/workspace/files/**`、`app/api/system-config/route.ts` 是必要支撑模块；未落地时不得宣称相关 UI 完成。
- **DEC-007**：`docs/architecture/项目架构设计说明.md` 应由下游更新为工程事实登记点；DesignArchitect 在本 issue 只写 `docs/design/`。
- **DEC-008**：`customers`、`todos` 等上游销售域只能作为遗留兼容或结构样例，除非后续产品设计明确赋予白族叙事业务含义。

## 8. 增量变更说明

- 新增 `docs/design/design_092_engineering_architecture.md` 作为 SUO-92 主设计稿。
- 本文扩展 `docs/design/SUO-84 项目迁移设计.md` 的 API-only 范围，提供完整工程复制与适配的上层设计。
- 本文不修改 `docs/architecture/项目架构设计说明.md`，仅记录其后续更新要求。
- 本文不创建下游 issue/task/stage；若需要推进，应由 `CEOOrchestrator` 或 `IssueDispatcher` 按 pipeline 继续处理。

## 9. 阻塞或澄清说明

当前无阻塞。若下游执行时需要在“完整复制 sales CRM 页面”与“只复制工程能力并重建白族叙事 UI”之间做产品取舍，默认采用 **DEC-002**：复制工程结构，不复制销售业务语义。
