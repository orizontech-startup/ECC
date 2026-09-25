# AI Agent Engineering Standard

- AI agents may execute substantial work autonomously, but autonomy never removes verification gates.
- Inspect the current repository, remotes, instructions, roadmap and deployment model before acting.
- Use plan -> implement -> review -> verify for material changes.
- Delegate to specialized ECC agents/skills when specialization reduces risk or improves throughput.
- Parallelize independent work; keep coupled backend/frontend/database changes coordinated.
- Never claim a command, test, deploy, browser flow or external action succeeded unless it actually ran and passed.
- Preserve context with structured handoffs at phase boundaries and when moving to a new chat/session.
- Do not invent missing product requirements; use the frozen roadmap or surface the gap.
- Keep destructive actions and elevated tool permissions bounded by the current task.
- Prefer direct execution over long explanation when implementation has already been authorized.
- Use fresh review context for security-sensitive or architecture-heavy changes when practical.
- Treat generated code as untrusted until tested and reviewed.
