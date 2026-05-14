# SUO-84 项目迁移设计

## 1. 背景与目标
- 继承 `SUO-84 项目迁移` 的目标：从 `https://github.com/glide-the/claude-agent-next-kit` 复制工程实现，但只保留其中 `app/api/claude-agent` 及其相关公共模块的设计，移除 `PRD.md` 里列出的前端/后端需求。
- 该设计稿定位为 `design` 阶段的真相源，输出给下游 IssueDispatcher/TaskAgent，指明可迁移的工程结构、模块关系、数据流与全局约定。
- 目标是把工程框架与模块设计按目录结构落在**仓库根目录**（与 `docs/` 同级），以便实现阶段直接对照 `app/` 与配置树对齐，避免重复讨论边界。

## 2. 范围界定
- 设计只描述 `app/api/claude-agent` 这一块：SSE 链路、流式消息、工具确认、会话持久化、附件管线、工作空间与共享工具模块，**不**进入前端页面、PRD.md 中定义的视觉/交互体验、后端以外的 API。
- 不新建 Issue/Task/Stage 文档，所有产物只写在 `docs/design/` 下；若后续细化需创建子 issue，也以该设计稿为源。
- 所有“全局变量”必须通过 config/data 模块集中管理（比如 `DEFAULT_CHAT_MODEL`、`MAX_TURNS`、`SSE_HEARTBEAT_INTERVAL_MS` 等），避免散落硬编码，符合用户要求“全局变量不硬编码，统一管理”。
- 设计输出保留下一步移植的目录/文件映射，明确哪些模块需要同步，哪些直接跳过（例如 `app/(page|ui|layout)` 等前端目录、PRD 区块直接丢弃）。

## 3. 方案摘要
- 入口是 `app/api/claude-agent/route.ts`，通过 Next.js Edge API（`NextRequest` + `createUIMessageStream`）接收客户端请求，使用聊天 schema 校验并输出 SSE（含 heartbeat），流式写入 `ai` SDK 产生的消息、思考、工具事件，最终将会话与附件存入 `lib/db`。
- `claude-agent-kit` 提供的 `ClaudeAgentRunner`（`agent-runner.ts`）封装了 `@anthropic-ai/claude-agent-sdk`，实现 streaming callback、工具确认、允许工具列表、token/usage 统计，配合 `SimpleClaudeAgentSDKClient` 与 session 文件读写，构成核心 Agent 运行时。
- `tool-confirm` 子路由 + `tool-confirmation-store` 保证 manual tool mode 下的用户审批流，所有 tool call 都在数据库/内存中产生 `pending` 条目，前端确认后再由 API resume。
- `app/lib` 中的 `chat-schema`、`chat-attachment-processing`、`message-parts`、`workspace`、`db` 等模块承担请求校验、附件处理、工作空间管理、消息持久化等横切职责。设计稿要把这些模块都列出并说明它们如何串联。
- 目录迁移计划：按 `claude-agent-next-kit` 目录结构在仓库根下保留 `app/api/claude-agent`、`app/lib/claude-agent-kit` 等模块（路径形如 `app/api/claude-agent`、`app/lib/claude-agent-kit`），其余前端/PRD 内容置于 “scope 外”。

## 4. 详细设计
### 4.1 `app/api/claude-agent/route.ts` 入口
- 请求接受：使用 `chatApiSchemaRequestBodySchema` 校验 `conversationId`、`message`、`toolChoice` 等字段，遇到空 message 或 schema 错误直接返回 400。
- SSE Streaming：调用 `createUIMessageStream`，内部通过 `writer` 写入 `message-metadata`、`text-delta`、`tool-input-start` 等事件，最后用 `createClaudeAgentSSEStreamResponse` 包装成 `text/event-stream`，并在 header 中注入 `X-Conversation-Id`。
- 心跳与写入策略：定期写入 `: heartbeat …` 或 `event: ping` 片段（`SSE_HEARTBEAT_MODE_EVENT`、`SSE_HEARTBEAT_INTERVAL_MS` 可通过 env 调整），所有写入都先通过 `safeWritePart`/`safeWriteSSE` 路径，失败时停止心跳并根据 abort 状态记录日志。
- 数据追踪：在 `streamedParts` 数组中完整记录每个流事件，便利下游保存到 DB；`convertToStorageParts` 将 `UIMessage` 的 parts 转为 `MessagePart[]`，形如 `text`、`reasoning`、`tool-*`、`file` 等，直接用于 `createConversation`/`updateConversation`。
- Tool events：在 `onToolEvent` 中分离 `text`、`tool_use`、`tool_result`、`thought`，并根据 `toolChoice` 管控 manual 模式（例如不由 `onToolEvent` 发送 `tool-input-start`，而在 `onToolConfirmationRequest` 中封闭处理）。

### 4.2 数据与附件
- `chat-schema.ts` 定义 `ChatAttachment`、`WorkspaceFilePathPart`、`DEFAULT_CHAT_MODEL`、`ToolChoiceMode`、`MANUAL_REJECT_RESPONSE_PROMPT` 等，所有 schema 与默认值需集中导出，避免在 `route.ts` 内部硬编码。
- 附件处理链：`processChatAttachmentsForMessage` 负责下载 `attachments`、生成 workspace 文件、返回 `workspaceFilePathParts` 和 preview；同时在流中调用 `injectAttachmentMessageParts`，将附件元数据插入 `UIMessage.parts`，供 `convertToStorageParts` 保存和 `message`/`conversation` 显示。
- 表示持久化：`mapChatAttachmentToDbAttachment` 为 `Attachment` 数组生成 DB 对象（包含 `id`、`mediaType`），`createConversation`/`updateConversation` 使用 `MessagePart[]` 与 `Attachment[]` 构成 `Conversation`，并记录 `claude_session_id` 以便后续 resume，最后调用 `db` 层。
- Workspace 管理：`getOrCreateWorkspace` 读取 `app/lib/workspace`，在 `workspaceRoot/conversationId` 下生成目录，附件下载与工具生成的文件都写入这个 workspace（`workspace-upload.ts` + `workspace-file-sync.ts` 提供工具）。

### 4.3 Claude Agent 运行时（`claude-agent-kit/server/agent-runner.ts`）
- `ClaudeAgentRunner.runStreaming` 封装 SDK 的 `queryStream`，构建 `SDKUserMessage` 并通过 `generateMessages()` 生成流产物，`allowedTools` 默认包含 `Task`、`Bash`、`WebFetch` 等（`DEFAULT_ALLOWED_TOOLS` 列表），可被 `toolChoice="none"` 禁用。
- Streaming 回调：`processMessage` 会根据 `message.type`（`assistant`、`stream_event`、`user`、`tool_progress`、`result`）拆分事件，向 `callbacks.onTextDelta`、`onToolEvent` 传递 `text-delta`、`tool_result` 等，同时累计 token usage。
- Manual tool confirmation：在 `canUseTool` 回调中将 `pendingToolCalls` 暂存，并调用 `callbacks.onToolConfirmationRequest` 等待前端通过 `/tool-confirm` 提交结果，得到 `approved` 后返回 `behavior: 'allow'` 或 `deny`。
- Session 管理：`SimpleClaudeAgentSDKClient` 通过 `query` 生成消息，同时支持 `loadMessages`（查找 `~/.claude/projects/{sessionId}.jsonl`）用于重新加载对话；`normalizeSessionId` 保证扩展名一致，一旦找到则返回消息列表给 `ClaudeAgentRunner`。

### 4.4 工具确认路由与存储
- `tool-confirm/route.ts` 实现 `POST /api/claude-agent/tool-confirm`，校验 `{ toolCallId, approved, reason, answers }`，调用 `getPendingToolConfirmation` / `resolvePendingToolConfirmation`，并返回 `success: true`。该路由只在 `toolChoice="manual"` 的时候会被触发。
- `tool-confirmation-store.ts` 维护 `pendingConfirmations` 字典，提供 `createPendingToolConfirmation`（返回 Promise）、`resolvePendingToolConfirmation`、`getPendingToolConfirmation`，保证 `route.ts` 与 Agent Runner 之间的同步。所有 `toolCallId` 必须在 store 中唯一，解决 pending Promise 后再把 `answers`/`approved` 返回给 Agent。

### 4.5 工作空间与文件同步
- `workspace.ts` 提供 `getOrCreateWorkspace`、`syncWorkspaceFiles`（依赖 `workspace-file-sync.ts`）、`writeUploadedFile` 等方法，保证每次请求都有独立目录；`processChatAttachmentsForMessage` 需要传入 `workspacePath`，而工具（如 `WorkspaceFilePathPart`）会使用 `workspacePath` 路径，后续也可被 `file-storage` 读取。
- `file-storage` 模块负责与后端存储交互（可能是本地 FS 或对象存储），`workspace-upload.ts` 将外部附件下载后写入 `workspace`（并同步到 `file-storage`），`workspace-file-sync.ts` 则依据 `WORKSPACE_SYNC_INTERVAL` 触发定时持久化。
- 该流程允许生成/读取、上传多个附件以及 `Tool` 生成的文件（例如 `mcp__user__ask_user` 或 `Read` 指令），`route.ts` 中的 `attachmentProcessingResult.workspaceSyncError` 会在失败时警告但继续运行。

### 4.6 目录与模块迁移映射
| 源代码路径 | 迁移落点（建议） | 说明 |
| --- | --- | --- |
| `app/api/claude-agent/route.ts` | `app/api/claude-agent/route.ts`（仓库根） | SSE entry + `createUIMessageStream` 实现 |
| `app/api/claude-agent/tool-confirm/route.ts` | `app/api/claude-agent/tool-confirm/route.ts` | manual tool approval |
| `app/lib/chat-schema.ts`、`const.ts` | `app/lib/chat-schema.ts` | schema + default model/token |
| `app/lib/claude-agent-kit` | `app/lib/claude-agent-kit` | `ClaudeAgentRunner` + `SimpleClaudeAgentSDKClient` + session utilities |
| `app/lib/db.ts`、`db-mappers.ts`、`queries.ts` | `app/lib/db.ts` 等 | 会话/消息持久化 |
| `app/lib/message-parts.ts`、`chat-attachment-processing.ts` | `app/lib/message-parts.ts` 等 | 输入拆分 + 附件处理 |
| `app/lib/tool-confirmation-store.ts` | `app/lib/tool-confirmation-store.ts` | tool approval store |
| `app/lib/workspace.ts`、`workspace-upload.ts`、`workspace-file-sync.ts` | `app/lib/workspace*.ts` | 工作空间管理 |
| `app/lib/file-storage` | `app/lib/file-storage` | 附件下载/上传协议 |
| `app/lib/id.ts`、`logger.ts`、`utils.ts` | `app/lib/id.ts` 等 | 支撑函数 |
- 前端、`PRD.md` 中提到的界面/体验/测试、不在上述表格内。只有 `claude-agent` 相关的 API 路径需要同步，其他 `app/(layout|page|client)`、`docs/`、`tests/ui` 等可忽略。
- 迁移过程中保留 `pnpm` 工作区、`tsconfig`、`.eslint` 等基础配置，避免重新搞包管理。

### 4.7 全局配置与运行约定
- 由 `chat-schema.ts` 导出 `DEFAULT_CHAT_MODEL`、`ManualToolConfirmTag`、`MANUAL_REJECT_RESPONSE_PROMPT`；`route.ts`、`agent-runner` 不得直接写死字符串，而应 `import` 这些值。
- 环境变量（`MAX_TURNS`、`SSE_HEARTBEAT_INTERVAL_MS`、`SSE_HEARTBEAT_MODE`、`DEFAULT_CHAT_MODEL`）需在 `app/lib/const.ts`（或 `config`）模块集中读取，并在 `route.ts` 中调用 `resolveHeartbeatIntervalMs()`/`resolveHeartbeatFrameMode()`，以便未来只需改 config 就能统一调整。
- `createId("msg")`、`createId("approval")` 等 ID 工具集中于 `lib/id.ts`，保证各处 ID 规范一致，且没有硬编码前缀。

## 5. 验收标准
- 设计稿列出了所有要迁移的目录和模块，明确了哪些 `app/api/claude-agent` 的文件需要复制，哪些 `PRD.md` 所在的内容要舍弃。
- 说明了 SSE 流、heartbeat、`streamedParts` 记录、tool 事件、manual confirmation、`db`/`workspace` 的协调流程；下游 TaskAgent 可以根据此设计搭建 API。
- 文档标出必须的 config/value（`DEFAULT_CHAT_MODEL`、`MAX_TURNS`、工具列表等），并表明这些变量由共享 config 模块管理，避免“全局变量硬编码”。
- 风险/依赖清单和关键决策被记录，可以让后续实现者快速判断是否需要改动 `@anthropic-ai/claude-agent-sdk`、Next.js `ai`、本地工作空间等。

## 6. 风险与依赖
- 依赖 `@anthropic-ai/claude-agent-sdk` 和 `ai` 提供的 streaming 接口，若 SDK API 改动（字段名、tool event 格式），需要同步更新 `ClaudeAgentRunner` 和 `route.ts` 的 `processMessage` 逻辑。
- SSE 流必须保持持续写入 `data: ...`、`[DONE]` 结尾，且心跳间隔需调优；服务器超时或前端断开会导致 `AbortController`，需要在 `route.ts` 中妥善捕获并停止 heartbeat。
- 附件管线依赖 `workspace`（本地磁盘路径）、`file-storage`（云存储或模拟），部署环境必须具备写权限；附件同步失败只记录警告但不阻塞主流程。
- Manual tool confirmation 的 Promise 需要与 `tool-confirm` 路由同步，若前端长时间不确认会造成请求阻塞；需要设置超时或重试策略（可列为后续 task）。
- **协作 / 工单状态**：若 Paperclip 或 harness 在「评论驱动 wake」后将 [SUO-84](/SUO/issues/SUO-84) 自动置回 `in_progress`，会与「design 已交付、本稿为真相源」的事实不一致；**应调整自动化或另开实现类 issue 承载代码迁移**，避免在同一 issue 上镜像叠评触发无意义心跳与预算消耗。

## 7. 关键决策记录
- 保留 `claude-agent-next-kit` 的 `DEFAULT_ALLOWED_TOOLS` 列表，只在必要时通过 config/环境关闭某些工具；`toolChoice="none"` 时彻底禁用工具，`manual` 时通过 store/route 实现审批流。
- SSE response 采用 `createClaudeAgentSSEStreamResponse` 包裹的 heartbeat + `data: ...` 模式，避免直接写 `WritableStream`，并在 `writer` 抛错时记录 `isClosed`/`isAborted` 状态。
- 全局变量（模型名、heartbeat interval、tool choice）由 `chat-schema.ts`/`const.ts` export 并统一引用，防止不同模块写入不同默认值，满足“全局变量统一管理”要求。
- 目录迁移必须保持“工程 → 模块 → 目录” 分层，与 `docs/architecture/项目架构设计说明.md` 保持一致，便于下游 TaskAgent 精确找到 `core`、`ui`、`assets`、`storage` 等模块。
- 将 Paperclip / harness 在评论 wake 后把工单打回 `in_progress` 的现象，作为**协作层风险**写入本稿 **§6**（而非仅靠线程叠评），便于 board 调规则与下游区分「design 真相源」与「实现交付」工单。
