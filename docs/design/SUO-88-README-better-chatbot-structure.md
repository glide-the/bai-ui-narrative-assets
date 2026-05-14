# SUO-88：根目录 README 结构设计（对齐 better-chatbot）

**关联 Issue**：SUO-88（文档编写）  
**参考**：[`cgoinglove/better-chatbot` README](https://github.com/cgoinglove/better-chatbot/blob/main/README.md)  
**设计真相源**：本文档；实现侧按本文更新仓库根 `README.md`，并与 `docs/README.md` 分工不冲突。

---

## 1. 背景与目标

### 1.1 背景

- 当前根 `README.md` 以「白族文化叙事 UI 资产 + Next.js 工程门面」为主，缺少类似 better-chatbot 的 **快速上手、目录导航、环境变量索引、外链式 Guides** 结构。
- Issue 要求：**参考 better-chatbot 的 README 结构**，为本项目编写（或重构）根 README。

### 1.2 目标

- 让读者在 **2 分钟内** 完成：理解项目是什么 → 知道如何安装/启动 → 知道去哪里读深度文档与配置环境。
- 结构上与 better-chatbot **同构**（徽章区 / 一句话价值 / 目录 / Quick Start / 环境变量 / Guides / Roadmap 或等价模块），内容上与 **本仓库实际技术栈与文档体系** 一致。

---

## 2. 范围界定

### 2.1 在本 Issue 内（设计阶段）

- 定义根 `README.md` 的 **章节树、每节职责、与现有 `docs/` 的链接关系**。
- 定义 **验收标准** 与 **不做的内容**（避免 README 变成第二份 PRD）。

### 2.2 不在本 Issue 设计范围内

- 不修改 `docs/issue/`、`docs/task/`、`docs/stage/`（DesignArchitect 边界）。
- 不在设计稿中规定具体营销文案或品牌句式的最终措辞（可由实现 PR 微调，但不得削弱信息架构）。
- 不强制引入 better-chatbot 才有的能力描述（例如 Discord、多模型路由矩阵），除非本仓库 **已真实具备** 或可明确标注为「规划中」。

### 2.3 与现有文档的关系

| 文档 | 角色（建议） |
| --- | --- |
| 根 `README.md` | **门面 + Quick Start + 脚本索引 + 环境变量摘要 + TOC** |
| `docs/README.md` | **文档中心**：资源表、业务读档、设计资产导航（根 README 用 1 段话 + 表格链接过去） |
| `docs/design/工程设计稿.md` | 工程/交互规格权威；根 README 「架构/规格」链到此 |
| `docs/architecture/` | 信息架构与模块边界；根 README 链 1 个总入口即可 |

---

## 3. 方案摘要（对齐 better-chatbot 的「骨架」）

将 better-chatbot README 的骨架映射为本仓库版本：

1. **顶部可选徽章区**（按需）：技术栈徽章（Next.js、React、TypeScript、pnpm）+ 许可证（如有）+ 「文档中心」链接。不强制 Discord / Deploy 按钮，除非有稳定 URL。
2. **一句话定位 + 要点列表**（bullet）：3–6 条，对应本仓库真实能力（PWA、客户/待办/对话、Claude Agent、PostgreSQL + Drizzle 等），避免复制 better-chatbot 功能列表。
3. **Table of Contents**：锚点链接到下文各主章节（与 better-chatbot 同级体验）。
4. **Preview / 产品截图（可选）**：若有稳定截图或录屏链接可放；无则本节标题可改为「界面预览（可选）」并注明 TBD，不阻塞发布。
5. **Quick Start**：`pnpm install` → 数据库（`docker` 脚本或 compose）→ `.env.local` 从模板复制 → `pnpm dev`；附 **本仓库默认 dev URL**（以 `package.json` 脚本为准：`next dev -H 0.0.0.0`，默认端口 3000）。
6. **Environment Variables**：表格或分块列出 **关键变量名** + 一句用途 + 是否必填；细节可链到 `AGENTS.md` 或单独 `docs/` 页面，避免 README 无限膨胀。
7. **Guides（手册索引）**：模仿 better-chatbot 的「📘 Guides」列表形式，但每一项链接到 **本仓库已有** 的 Markdown（如 `AGENTS.md`、`docs/README.md`、`docs/design/` 中选 2–4 个高频入口）。无对应文档时不得造链，改为在 Roadmap/TODO 标明「待补充」。
8. **Roadmap（可选）**：短列表区分「已有 / 进行中 / 规划」，与 `CLAUDE.md` 或产品文档对齐口径，避免与代码事实冲突。
9. **Contributing**：指向 Conventional Commits + `pnpm lint && pnpm test:run`（与仓库规则一致）；若有 `CONTRIBUTING.md` 再链，没有则保持简短规则段落。

---

## 4. 详细设计

### 4.1 建议根 README 目录（可复制为写作大纲）

```markdown
# <项目名称> · <可选副标题>

> 可选：1–2 行警告/状态（仅在有真实约束时添加，避免无来源告警）

[徽章可选]

## 一句话介绍
## 核心特性（要点列表）
## Table of Contents
## 预览（可选）
## Quick Start
### 前置要求（Node、pnpm、Docker 等）
### 安装与启动（逐步命令）
## 环境变量（摘要 + 外链）
## 文档与 Guides
## 开发与测试（lint / test / e2e 命令表）
## Roadmap（可选）
## Contributing / License
```

### 4.2 Quick Start 必须覆盖的命令（与当前 `package.json` 对齐）

- 包管理：`pnpm@9.15.0`（可注明 `corepack enable` 或 `npm i -g pnpm`）。
- 安装：`pnpm install`
- 数据库：指向现有脚本（`pnpm docker:up` / `pnpm docker:down` / `pnpm docker:logs` 等，以仓库 `package.json` 为准）。
- 开发：`pnpm dev`
- 生产构建：`pnpm build` + `pnpm start`
- 质量闸：`pnpm lint`、`pnpm test:run`、`pnpm test:e2e`（在 Contributing 或独立小节出现即可）。

### 4.3 环境变量小节的信息层级

- **必填**：数据库连接（`DATABASE_URL` 或项目约定的 `PGHOST` 族）、运行 AI/Agent 所需的密钥类变量——**仅列变量名与用途**，默认值与样例放在 `.env.local.example` 旁白说明（不在这里粘贴秘密）。
- **可选**：对象存储、外部搜索、仅生产特性等。
- 明确写一句：**复制 `.env.local.example` → `.env.local`**（若文件名不同以仓库实际为准）。

### 4.4 「叙事/UI 资产」与「Next 应用」双主线表述

当前根 README 已存在「白族文化叙事 + `docs/` 资产」定位；重构时建议：

- 在 **一句话介绍** 中并列或分段说明 **设计资产仓库** 与 **可运行的 Next 应用** 的关系，避免新读者误以为仅为静态站。
- **仓库结构** 树保留，但与 better-chatbot 风格统一：简短 + 链接到 `docs/architecture/` 深度说明。

### 4.5 与 better-chatbot 的刻意不对齐点（记录原因）

- 不复制其「多 LLM 提供商矩阵」全文，改为本仓库实际集成（Claude Agent SDK、Vercel AI 等以代码为准）。
- 不复制其 Docker Compose 文件路径（`docker/compose.yml` 等），一律以 **本仓库** 路径描述。

---

## 5. 验收标准

1. **结构同构**：根 `README.md` 含 **TOC、Quick Start、环境变量摘要、Guides 列表、Contributing/测试命令** 五类区块（Preview/Roadmap 可选但目录中需显式标记或删除空节）。
2. **命令可执行**：Quick Start 中的命令与根目录 `package.json` `scripts` **一致**，无虚构脚本名。
3. **链接有效**：Guides 区外链到仓库内路径的链接在合并前 **相对路径可解析**（或绝对 URL 可访问）。
4. **不重复权威规格**：工程交互细节仍以 `docs/design/工程设计稿.md` 等为权威；README 只摘要 + 链接。
5. **双语/语气**：默认 **中文简体** 主文档（与项目现状一致）；若保留英文小标题（如 Quick Start）需全篇风格统一。
6. **篇幅控制**：根 README 建议 **800–2000 汉字当量**（不含大段粘贴的 env 样例）；超长配置表移到 `docs/` 子页并在 README 单列链接。

---

## 6. 风险与依赖

| 风险 | 缓解 |
| --- | --- |
| 仓库「叙事资产」与 `package.json` 中 `nationality-pwa-app` 命名并存，读者困惑 | README 显式解释命名/历史迁移（SUO-84 等可在一句「背景」中链到 `plans/` 或架构文档），避免单一名称掩盖另一主线 |
| 环境变量样例文件受工具链保护，无法在 README 粘贴完整模板 | README 只写「见 `.env.local.example`」与变量名索引；实现侧保证模板文件与文档同步 |
| better-chatbot 结构「重营销轻事实」 | 要点列表必须可追溯到功能或文档，禁止纯口号 |
| 截图/演示 URL 缺失 | Preview 节标注 optional，不阻塞合并 |
| Paperclip 在 **disposition 评论**后偶发将 Issue 从 `done` 打回 `in_progress`，触发无新内容的 `issue_commented` wake | board/harness **勿**对 SUO-88 做「评论即重开」自动化；设计交付仍以本文为准，幂等 `done` 仅作状态对齐，不视为新设计迭代 |

**依赖**：实现该 README 的 Agent/PR 需能读取 `package.json`、`docker/` 目录名、`docs/README.md` 当前结构；重大产品口径变更需产品 Owner 确认。

---

## 7. 关键决策记录

| ID | 决策 | 状态 | 说明 |
| --- | --- | --- | --- |
| D1 | 采用 better-chatbot 的 **信息架构骨架**，而非逐段翻译英文 README | 已采纳 | 保证「像」其结构，内容为仓库定制 |
| D2 | 深度文档留在 `docs/`，根 README 做 **索引 + Quick Start** | 已采纳 | 防止 README 与 `docs/README.md` 重复失控 |
| D3 | Preview/Roadmap 为 **可选节** | 已采纳 | 避免无素材时硬填造成维护债 |
| D4 | 环境变量以 **摘要表 + 外链** 为主 | 已采纳 | 安全与可维护性 |
| DEC-005 | **根 `README.md` 正文实现**由执行侧 Agent 完成；DesignArchitect 仅维护本文档真相源 | 已采纳 | 触发：board 评论 `95f9f0ce`（`issue_reopened_via_comment`）明确需要其它智能体协作；派发与子 Issue 开立由 `@CEOOrchestrator` 负责，DesignArchitect 不拆 Issue |

---

## 8. 变更记录

| 日期 | 作者 | 说明 |
| --- | --- | --- |
| 2026-05-14 | DesignArchitect | 初版：SUO-88 需求落地为可执行 README 信息架构与验收口径 |
| 2026-05-14 | DesignArchitect | §6 增补：Paperclip 状态漂移 / disposition 评论 wake 的协作风险与缓解（board 侧） |
| 2026-05-14 | DesignArchitect | board 评论 `95f9f0ce`：确认需多智能体协作；§7 增补 **DEC-005**；新增 §9 |
| 2026-05-14 | DesignArchitect | §9 增补：`3546bfde` 为 disposition 镜像 wake 的 **dedup 口径**（不追加线程评论、维持 `in_review`） |

---

## 9. 增量变更说明（board `95f9f0ce`）

- **输入**：`local-board` 评论「看起来你需要其它智能体协作」，wake 原因为 `issue_reopened_via_comment`（相对此前纯 disposition 镜像链，本条为**实质性编排信号**）。
- **设计侧结论**：README **信息架构与验收口径**已在本文 §1–§6 冻结；**无待补充的设计缺口**。
- **下游动作（非 DesignArchitect 职责）**：请 **`@CEOOrchestrator`** 将「根 `README.md` 按 better-chatbot 骨架落地」派发为 **子 Issue 或改派**，由 **`FrontendTaskAgent`**（或仓库约定的文档/前端执行角色）实现；实现方 **只读** 消费本文，合并后自检 §5 验收标准。
- **与 DEC-005 交叉引用**：派发单/子 Issue 描述中应引用 **DEC-005** 与本文路径，避免执行侧另起冲突信息架构。

### 协作侧 dedup（评论 `3546bfde`）

- **性质**：`3546bfde` 为 DesignArchitect 对 `95f9f0ce` 处置时写入线程的 **disposition 正文**；随后 `issue_commented` wake **无新增输入**。
- **处置**：**不**再向 Issue 追加 disposition 评论、**不**为纯镜像 wake 做无意义 `PATCH`（避免再次触发评论链）；工单 **维持 `in_review`**，等待 **`@CEOOrchestrator`** 派发子任务或 board 实质性新评论。
