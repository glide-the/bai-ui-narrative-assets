# 文档中心（bai_ui_narrative_assets）

本目录收录 **「洱海边的三重回声：白族文化与现代文明叙事型 UI 设计」** 的可版本化设计资产与工程说明。仓库以 Markdown、CSV 等文本为主，便于 diff、评审与多角色协作；**工程架构与目录边界**见 [`architecture/项目架构设计说明.md`](architecture/项目架构设计说明.md)，本页侧重 **项目背景** 与 **资源导航**。

---

## 项目背景（摘要）

基于民族图案符号资产，将静态图录重构为具有故事感、文化深度与现代交互逻辑的 **单屏横向故事板 UI**：以「身份符号 / 生活符号 / 仪式符号」为线索，呈现白族文化与现代文明之间的延续、冲突、转化与共生。设计目标包括：七章叙事结构、单屏内完成探索（章节轨、符号弹层、详情面板等）、向设计师 / 前端 / 策划 / 项目负责人交付统一文本规格。完整背景、受众与章节说明见 **[design/任务说明.md](design/任务说明.md)**。

---

## 文档三层结构

| 目录 | 职责 | 入口 |
| --- | --- | --- |
| **architecture** | 仓库定位、文档信息架构、与上游体例对齐、演进边界 | [项目架构设计说明.md](architecture/项目架构设计说明.md) |
| **design** | 叙事全文、UI 规格、符号表、原型工程稿 | [任务说明.md](design/任务说明.md)、[工程设计稿.md](design/工程设计稿.md)、[UI设计资产说明.md](design/UI设计资产说明.md)、[design-system.md](design-system.md) |
| **solution** | 从资产到实现的方案、布局状态映射、验收清单 | [solution/README.md](solution/README.md) |

---

## 常用资源链接

| 资源 | 路径 |
| --- | --- |
| 设计系统（Tokens / 组件 / 交互状态） | [design-system.md](design-system.md) |
| 浏览器原型工程规格（实现权威） | [design/工程设计稿.md](design/工程设计稿.md) |
| 项目任务与章节目标 | [design/任务说明.md](design/任务说明.md) |
| UI 区域与交互规格 | [design/UI设计资产说明.md](design/UI设计资产说明.md) |
| 完整叙事文本 | [design/完整叙事设计资产.md](design/完整叙事设计资产.md) |
| 符号表（mask / 坐标系） | [design/民族图案_身份生活仪式符号表_mask坐标系.md](design/民族图案_身份生活仪式符号表_mask坐标系.md) |
| 符号表（CSV） | [design/民族图案_身份生活仪式符号表.csv](design/民族图案_身份生活仪式符号表.csv) |
| 前端布局与状态（草案） | [solution/前端布局与状态映射草案.md](solution/前端布局与状态映射草案.md) |
| MVP 验收 | [solution/MVP验收清单.md](solution/MVP验收清单.md) |

---

## 业务叙事与文档映射

> 产品侧「读哪份文档、从哪条数据入口跟进」由此表维护；**仓库结构与边界**仍以 [`architecture/项目架构设计说明.md`](architecture/项目架构设计说明.md) 为准。

| 叙事块 | 主要读者文档 | 数据/规格入口 |
| --- | --- | --- |
| 章节 1–7 故事推进 | [完整叙事设计资产.md](design/完整叙事设计资产.md)、[任务说明.md](design/任务说明.md) | 章节标题与顺序以任务说明为准 |
| Header / Canvas / Chapter Rail 等 | [UI设计资产说明.md](design/UI设计资产说明.md) | 尺寸、间距、交互状态 |
| 符号点击、弹层、详情面板 | [UI设计资产说明.md](design/UI设计资产说明.md) | 与符号表 CSV / mask 文档交叉引用 |
| 工程化落地 | `docs/solution/` | [前端布局与状态映射草案.md](solution/前端布局与状态映射草案.md)、[MVP验收清单.md](solution/MVP验收清单.md) |

---

## 上游体例参考（工程架构文档）

本仓 `docs/architecture` 的分层与表格化写法对齐参考仓库中的架构说明文档（Next.js 应用为对方事实栈；本仓为 **文档与数据资产仓**，差异见架构说明正文）：

* [claude-agent-next-kit · feat/claude-agent-kit · 项目架构设计说明.md](https://github.com/glide-the/claude-agent-next-kit/blob/feat/claude-agent-kit/docs/architecture/%E9%A1%B9%E7%9B%AE%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1%E8%AF%B4%E6%98%8E.md)

---

## 维护提示

新增体验与叙事内容默认落在 `design/`；新增实现路径或 Spike 落在 `solution/` 并更新 `solution/README.md`；**业务叙事与文档映射**变更时更新本页对应表。变更根目录结构或引入代码包时须同步更新 `architecture/项目架构设计说明.md`（仅工程架构，不回填产品外链）。
