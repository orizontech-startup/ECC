---
name: orizon-project-bootstrap
description: Onboard an existing or new Orizon Tech repository into the Orizon Engineering Profile without changing application behavior.
metadata:
  origin: Orizon Tech
---

# Orizon Project Bootstrap

Use this skill when Orizon Tech adopts a project or creates a new repository.

Before bootstrap work, apply `orizon/policies/ORIZON-ECC-MANDATORY-SESSION-ENTRY.md`. Every new or adopted Orizon repository must receive a local agent-facing ECC pointer using `orizon/templates/ORIZON-ECC-PROJECT-ENTRYPOINT.md` (or equivalent harness-native instruction) so future agents automatically return to the canonical ECC.

1. Identify product purpose, users, environments, repositories, owners and deployment URLs.
2. Map frontend, backend, database, auth, storage, integrations, queues, scheduled jobs and infrastructure.
3. Locate current roadmap, handoff, issues, migrations, CI/CD and operational documentation.
4. Run a non-destructive baseline: install/restore dependencies when appropriate, typecheck, lint, tests and build.
5. Document existing failures separately from failures introduced by new work.
6. Create or update the project's existing engineering context file; do not create duplicate top-level documentation when a canonical location already exists.
7. Define acceptance criteria for the next phase and a go-live checklist.
8. Do not rewrite architecture during bootstrap unless a confirmed blocker requires it.
9. Install or update the repository's harness-native ECC entrypoint (`CLAUDE.md`, `AGENTS.md`, or equivalent) so it points to the canonical `orizontech-startup/ECC` latest `main` and the mandatory session-entry policy.

## Required Output

Produce: current-state summary, architecture map, risk register, test baseline, deployment map, next executable phase, and explicit blockers.
