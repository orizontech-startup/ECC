# Remote Engineering Tools

Use this standard when Orizon engineers or agents operate authorized machines and browser sessions remotely.

- Confirm the exact target machine, repository and production surface before acting.
- Prefer direct filesystem/terminal tools for code and system work; use browser automation for browser-only validation.
- Use Playwright or equivalent for repeatable user-flow validation when available.
- Use visible/manual browser sessions only when human-observable behavior is part of the test.
- Never treat tool access as permission to cross project, account or environment boundaries.
- Capture commands/results needed to reproduce important fixes.
- Avoid destructive commands unless the requested task requires them and rollback is understood.
- When a remote tool fails, distinguish connectivity/tooling failure from application failure.
- Keep secrets out of screenshots, logs and command history where possible.
- End with the exact machine/environment that was tested so evidence is not misattributed.
