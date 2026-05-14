# Design System · 洱海边的三重回声

本文档为 **设计 Tokens、组件规范、符号资产命名、章节结构、交互状态** 的单一登记点，供实现（HTML/CSS/JS、Figma、展陈）与评审对齐。细则与版式示意以 [`UI设计资产说明.md`](design/UI设计资产说明.md) 为准；浏览器原型工程约束以 [`工程设计稿.md`](design/工程设计稿.md) 为准。若三者冲突，**以 `UI设计资产说明` 的视觉与交互规格优先**，工程稿补充技术实现与数据字段。

---

## 1. Design Tokens（设计令牌）

### 1.1 色彩（CSS 变量）

与 `UI设计资产说明` / `工程设计稿` 对齐，实现侧建议在 `:root` 统一声明：

```css
:root {
  --ink-black: #11100D;
  --rice-paper: #F4EEDF;
  --bone-white: #FFF8E8;
  --warm-sand: #D8B982;
  --clay-red: #9B3F2F;
  --indigo: #263C50;
  --stone-gray: #9A968A;
  --leaf-green: #556B46;
  --shadow-brown: #4A3428;
}
```

| Token | 色值 | 用途 |
| --- | --- | --- |
| `--rice-paper` | `#F4EEDF` | 页面主底、米纸氛围 |
| `--ink-black` | `#11100D` | 符号剪影、主标题、主分割线（如 2px） |
| `--clay-red` | `#9B3F2F` | 当前章节、进度强调、仪式感重点 |
| `--bone-white` | `#FFF8E8` | 详情卡 / 弹层面底 |
| `--warm-sand` | `#D8B982` | 旧纸感、卡片底纹 |
| `--indigo` | `#263C50` | 现代信息层、副标题（控制用量） |
| `--stone-gray` | `#9A968A` | 次级线、次级文案、未强调结构 |
| `--leaf-green` | `#556B46` | 「花与日常」等章节辅助 |
| `--shadow-brown` | `#4A3428` | 硬阴影、版画式纵深 |

**原则**：符号主体保持 **墨黑剪影**；陶土红 **点题不铺底**；禁止荧光/廉价大渐变（见 UI 资产说明 §7）。

### 1.2 布局与间距（主视口基准）

| 变量名（建议） | 数值 | 说明 |
| --- | --- | --- |
| `--viewport-width` | `1440px` | 桌面主基准（工程设计稿） |
| `--viewport-height` | `900px` | 主内容区高度基准 |
| `--header-height` | `88px` | Header |
| `--narrative-width` | `360px` | 左侧叙事面板 |
| `--chapter-rail-height` | `92px` | 底部章节轨 |
| `--scene-width` | `calc(100% - 360px)` | 画布区近似（约 980px @1440） |
| `--scene-height` | `约 660px` | 场景区（UI 资产说明）；实现时扣掉 Header/Rail |

**原则**：主叙事 **不发生整页纵向滚动**；断点策略见 UI 资产说明（平板侧栏折叠、移动简化）。

### 1.3 动效与质感（语义令牌）

| 语义 | 建议 |
| --- | --- |
| `transition.chapter` | 章节切换：opacity / 轻微位移，短时长，避免炫技 |
| `transition.symbol` | 热点 hover：scale 或描边强度微调 |
| `texture.paper` | 米纸噪点极轻，不抢符号 |
| `shadow.card` | 硬阴影 + `--shadow-brown`，保持展陈级克制 |

---

## 2. 组件规范（页面模块）

命名与 [`工程设计稿.md`](design/工程设计稿.md) 中的 `src/ui/*` 建议对齐，便于代码与设计对照。

| 组件 | 职责 | 关键尺寸 / 区域 | 引用 |
| --- | --- | --- | --- |
| **HeaderBar** | 主副标题、当前章节、横向进度 | 高 `88px`；底部分割线 2px `--ink-black`；进度 `--clay-red` | UI §5.1 |
| **NarrativePanel** | 章号、标题、主题句、旁白、现代转折、关键词胶囊 | 宽 `360px` | UI §5.2 |
| **SceneCanvas** | 场景底、符号层、热点与局部动效 | 约 `980×660` @1440 | UI §5.3 |
| **SymbolDetailPopover / Detail** | 符号详情卡：编号、名称、类别、叙事功能、转喻、适用场景 | 浮层；底 `--bone-white`、边 2px `--ink-black` | UI §5.4 |
| **ChapterRail** | 七章切换、进度节点 | 高 `92px` | UI §5.5 |
| **ModernTransitionOverlay** | 「现代转折」层开关 | 覆盖叙事或全屏弱层，由数据驱动 | 工程稿 |
| **ComparisonSlider** | 第六章传统民居 ↔ 现代楼房对比 | 可拖拽滑块；双场景同框 | 工程稿 |
| **SymbolAtlasView** | 符号图谱：按身份/生活/仪式分组、筛选、返回叙事 | 全屏或 Modal | 工程稿 |

**文案语言**：界面可见中文为主（工程稿）；英文仅作副标或技术字段时少量使用。

---

## 3. 符号资产命名

### 3.1 ID 与类别

| 前缀 | 类别 | `category`（数据） | 叙事母题（摘要） |
| --- | --- | --- | --- |
| **A** | 身份符号 | `identity` | 「我们如何被看见？」 |
| **B** | 生活符号 | `daily` | 「我们如何生活？」 |
| **C** | 仪式符号 | `ritual` | 「我们如何记住时间、自然与共同体？」 |

符号 **ID** 为 `A1`…`A8`、`B1`…`B9`、`C1`…`C8`（以工程设计稿清单为准；与 CSV / mask 文档交叉引用时保持同一 ID）。

### 3.2 文件路径与文件命名

**约定**（与工程稿示例一致，可按管线调整但须全仓统一）：

* 目录：`assets/symbols/`（或 `assets/symbols/{category}/`，二选一，**manifest 为唯一权威**）。
* 文件名：`{id小写}-{kebab-case-en}.svg` 或 `.png`，例：`a1-feather-crown.svg` 对应 `A1`。
* **Manifest** 字段建议包含：`id`、`category`、`name`、`englishName`、`assetPath`、`chapters[]`、`keywords[]`、`narrativeFunction`、`description`（见工程稿 JSON 示例）。

**热点与坐标**：若使用 mask / 百分比坐标，与 [`民族图案_身份生活仪式符号表_mask坐标系.md`](design/民族图案_身份生活仪式符号表_mask坐标系.md) 及 CSV **同一 ID** 对齐。

---

## 4. 章节结构（七章）

数据层 `id` 建议与工程稿一致：`chapter-01` … `chapter-07`；展示用两位序号 `01`–`07`。

| `id` | 序号 | 短标题 | 副标题 |
| --- | --- | --- | --- |
| `chapter-01` | 01 | 古道 | 文化从流动中来 |
| `chapter-02` | 02 | 村寨 | 身份被看见 |
| `chapter-03` | 03 | 本主 | 神圣走近人间 |
| `chapter-04` | 04 | 三道茶 | 传统成为世界语言 |
| `chapter-05` | 05 | 花与日常 | 自然进入生活 |
| `chapter-06` | 06 | 民居之困 | 传统被现代挤压 |
| `chapter-07` | 07 | 新的共生 | 传统成为现代界面 |

每章数据结构至少包含：`id`、`index`、`title`、`subtitle`、`symbols[]`（符号 ID 列表）、`mainCopy`、`modernTransition`、`keywords[]`、`mood[]`（可选）（见 [`工程设计稿.md`](design/工程设计稿.md) 示例）。

---

## 5. 交互状态（状态机摘要）

### 5.1 全局 / 路由

| 状态 | 说明 | 视觉或行为 |
| --- | --- | --- |
| `boot` | 首屏未进入叙事 | 可显示封面或「进入叙事」 |
| `narrative` | 七章叙事主流程 | 默认态 |
| `atlas` | 符号图谱 | 覆盖层；`A` 快捷键开关（工程稿） |
| `dev.guide` | 开发者布局参考线 | `G` 切换；默认关 |

### 5.2 ChapterRail（章节轨）

| 状态 | 条件 | 视觉 |
| --- | --- | --- |
| `default` | 非当前章 | 节点可用 `--stone-gray` 或虚线规则（见 UI §5.5） |
| `current` | 当前章 | `--clay-red` 高亮节点与序号 |
| `visited` | 已访问过 | `--ink-black` 实线连接（与 UI「已读」一致） |
| `hover` | 指针悬停 | 可展示本章符号缩略预览（UI §5.5） |
| `focus` | 键盘焦点 | 可见 focus ring，**不完全依赖颜色**（a11y） |

### 5.3 SymbolHotspot（符号热点）

| 状态 | 说明 |
| --- | --- |
| `idle` | 可点未悬停 |
| `hover` | Tooltip 短文案（工程稿示例句） |
| `active` | 选中 / 打开详情 Popover |
| `focus` | 键盘导航焦点 |

### 5.4 ModernTransitionOverlay

| 状态 | 说明 |
| --- | --- |
| `hidden` / `visible` | 「查看现代转折」类按钮切换；`M` 全局切换（工程稿） |

### 5.5 ComparisonSlider（第六章）

| 状态 | 说明 |
| --- | --- |
| `position` | 连续值：左「传统民居」— 右「现代楼房」；拖动更新场景裁切或透明度 |

### 5.6 持久化（localStorage 键名建议）

与工程稿一致，键名须在 `SaveSystem` 或等价模块 **集中定义**，避免散落字符串：

* `lastChapterId`
* `atlasOpened`
* `layoutGuide`
* `modernOverlay`（若需要记住偏好）

---

## 6. 维护约定

1. **改色 / 改间距 / 改组件行为**：先改本文与 `UI设计资产说明`，再同步工程实现与 `工程设计稿` 中硬编码示例（若有）。
2. **增删符号或改 ID**：同步 **CSV / mask 文档**、`assetManifest`、本章 `symbols[]` 三处。
3. **增章**：属产品变更，须同时更新本文「章节结构」、`任务说明`、`工程设计稿` 数据示例与 MVP 验收项。

---

## 7. 相关文档

| 文档 | 用途 |
| --- | --- |
| [`design/UI设计资产说明.md`](design/UI设计资产说明.md) | 区域尺寸、信息层级、字体与视觉细则 |
| [`design/工程设计稿.md`](design/工程设计稿.md) | 原型目录、快捷键、数据结构与工程约束 |
| [`design/任务说明.md`](design/任务说明.md) | 章节标题与产品目标 |
| [`solution/前端布局与状态映射草案.md`](solution/前端布局与状态映射草案.md) | 组件 ↔ 状态机落地草案 |
