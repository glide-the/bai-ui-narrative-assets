# 洱海边的三重回声 · `bai_ui_narrative_assets`

本仓库承载 **白族文化 × 现代文明** 叙事型 UI 的 **设计资产与规格**：章节叙事、界面结构、符号体系与体验约束均以 `docs/` 下的 Markdown / CSV 等形式维护，供产品与实现侧对齐阅读。

---

## 项目目标（摘要）

1. **叙事与体验**：七章横向故事板，单主视口桌面优先；通过顶栏、叙事面板、场景画布、章节轨与符号热点完成文化叙事。
2. **符号体系**：身份 / 生活 / 仪式三类符号（A/B/C 编号资产）与叙事稿、资产表一致。
3. **视觉与交付原则**：主视觉须来自本仓库约定资产或项目内可控绘制；交付形态与禁止项以设计文档为准，不在此重复罗列。

更完整背景、资源表与读档映射见 **[`docs/README.md`](docs/README.md)**。

---

## 文档入口

| 文档 | 说明 |
| --- | --- |
| [`docs/README.md`](docs/README.md) | 文档中心：背景摘要、资源导航、业务读档 |
| [`docs/design-system.md`](docs/design-system.md) | 设计系统：Tokens、组件规范、符号命名、章节结构、交互状态 |
| [`docs/design/工程设计稿.md`](docs/design/工程设计稿.md) | 浏览器原型工程与交互规格（实现侧权威） |
| [`docs/architecture/项目架构设计说明.md`](docs/architecture/项目架构设计说明.md) | 仓库信息架构与模块边界 |

---

## 仓库结构（门面）

```text
.
├── README.md          ← 本文件：叙事摘要 + 文档入口
├── app/               ← Next.js 16 应用：Claude Agent API 切片（SUO-84，见 plans/）
├── docs/              ← 设计资产、架构说明与落地方案（含上游 Agent 设计文档增量合并）
├── plans/             ← 跨角色共享的迁移 / 排期类计划（Paperclip 等引用）
├── drizzle/           ← 数据库 schema / 迁移（随上游运行时）
├── package.json       ← 根级 pnpm 工程（与上游 kit 对齐）
└── …                  ← docker、tests、工具链配置等（见各目录）
```

实现落地后的 **叙事与 UI 规格** 以 **`docs/design/工程设计稿.md`** 与 **`docs/architecture/项目架构设计说明.md`** 为准。需要本地起 **Claude Agent API** 时：在仓库根目录执行 `pnpm install`，复制 **`.env.local.example`** → **`.env.local`** 并填写密钥后执行 **`pnpm dev`**。上游原版 README 已归档至 **`docs/solution/claude-agent-next-kit-upstream-README.md`**。
