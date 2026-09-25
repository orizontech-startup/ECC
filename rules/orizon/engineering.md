# Orizon Tech Engineering Rules

These rules mirror the portable Orizon profile for harnesses that support rule packs.

- GitHub is the source of truth for repository-backed application code.
- Inspect the codebase and existing project instructions before editing.
- Respect frozen scope, roadmap and handoff state.
- Keep backend, frontend, database and infrastructure changes coordinated.
- Prefer minimal production-grade changes over broad rewrites.
- Never hardcode secrets or expose credentials in logs, commits or documentation.
- Run available validation commands before declaring work complete.
- Treat authentication, authorization, remote-control, billing and personal-data code as security-sensitive.
- Validate critical user flows at runtime when tooling is available.
- Preserve unrelated production routes and infrastructure.
- Record material architecture and deployment decisions in canonical project docs.
- End material work with go-live status, evidence and blockers.

Project-local stricter rules take precedence.
