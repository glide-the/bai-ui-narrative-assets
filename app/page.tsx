export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 640 }}>
      <h1>Agent API 运行时</h1>
      <p>
        本目录由 SUO-84 自{" "}
        <a href="https://github.com/glide-the/claude-agent-next-kit/tree/feat/claude-agent-kit">
          claude-agent-next-kit
        </a>{" "}
        迁入；已移除 PRD 业务前后端路由，仅保留 Claude Agent 相关 API 及其{" "}
        <code>app/lib</code> 依赖。
      </p>
      <ul>
        <li>
          <code>POST /api/claude-agent</code>
        </li>
        <li>
          <code>POST /api/claude-agent/tool-confirm</code>
        </li>
      </ul>
      <p>产品叙事与 UI 规格仍在仓库根目录 <code>docs/</code>。</p>
      <p>
        叙事原型（Next 内嵌版，SUO-103）：{" "}
        <a href="/narrative">/narrative</a>
      </p>
    </main>
  );
}
