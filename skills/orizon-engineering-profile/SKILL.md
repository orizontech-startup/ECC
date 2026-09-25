---
name: orizon-engineering-profile
description: Apply Orizon Tech's company-wide engineering operating model to repositories owned by orizontech-startup or explicitly designated as Orizon projects.
metadata:
  origin: Orizon Tech
---

# Orizon Engineering Profile

Use this skill for every engineering task in an Orizon Tech repository.

## Operating Model

1. Inspect the repository, current branch, docs, architecture, tests, CI and deployment path before changing code.
2. Preserve the existing product direction; never invent scope when a roadmap, handoff, issue or requirement already exists.
3. Plan material changes before implementation and identify backend, frontend, database, infrastructure and security impact.
4. Keep frontend and backend capabilities synchronized. A backend capability is not complete if the user-facing surface cannot use it when one is required.
5. Implement the smallest production-grade change that satisfies the requirement; avoid unrelated refactors.
6. Validate with the repository's real test, typecheck, lint, build and E2E commands when available.
7. Review security-sensitive changes for auth, authorization, secrets, input validation, data exposure, rate limits and rollback risk.
8. Use GitHub as the source of truth for code changes. Do not use visual builders to mutate source when a repository is authoritative.
9. Record meaningful architecture or operational decisions in the project's existing documentation structure.
10. Finish with a production/go-live checklist and state remaining blockers explicitly.

## ECC Orchestration

Use ECC capabilities as needed: planner -> architect -> tdd-guide -> implementation -> code-reviewer -> security-reviewer -> e2e-runner -> verify.
Parallelize only independent work. Never report a test, deploy or validation as successful unless it was actually executed and passed.

## Project Overrides

Project-specific instructions beat this profile when they are more restrictive. Never let a global rule silently erase an explicit repository constraint.
