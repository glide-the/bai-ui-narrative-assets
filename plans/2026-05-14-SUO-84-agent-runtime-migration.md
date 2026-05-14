# SUO-84：Agent Runtime 提升至仓库根目录

**日期**：2026-05-14  
**父单**：SUO-84（项目迁移）  
**后续验收单**：SUO-85

## 背景

- 已将 Next.js 16 工程壳与 `app/api/claude-agent` 相关实现对齐至仓库根（`app/`、`package.json`、`drizzle/` 等），不再使用单独的 `agent-runtime/` 子目录。
- 业务 PRD 相关前后端路由已按 SUO-84 范围剔除；通用约束见 `AGENTS.md` 与 `docs/architecture/`。

## 本地验收清单（SUO-85）

1. **环境变量**：自 `.env.local.example` 复制为 `.env.local`，填写 `DATABASE_URL` 及存储、模型等密钥（勿提交 `.env.local`）。
2. **数据库**：启动 `docker compose up -d postgres`（默认 `postgresql://ai4sales:ai4sales@127.0.0.1:5433/ai4sales` 与根目录 `docker-compose.yml` 一致），执行 `pnpm db:migrate`（`drizzle-kit push`）对齐 schema。
3. **Smoke**：`pnpm dev` 后对本机 `POST /api/claude-agent` 发一条最小合法请求（见 `app/lib/chat-schema.ts` 中 `chatApiSchemaRequestBodySchema`），确认流式或错误响应符合预期（含有效模型密钥时走通 happy path）。
4. **可选**：按需收敛 `app/globals.css` / Tailwind 主题，避免与叙事站点设计冲突。

## CEO / Agent runner 侧说明

- 在无 Docker 或无法绑定本机 `127.0.0.1:5433` 的执行环境中，**第 2–3 项须在 Board 本机完成**；runner 可承担静态检查（如 `pnpm lint`）与本文档维护。

## 参考

- `app/api/claude-agent/route.ts`
- `docker-compose.yml`
- `docs/architecture/项目架构设计说明.md`
