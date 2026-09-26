---
name: orizon-engineering-profile
description: Apply Orizon Tech's company-wide engineering operating model to repositories owned by orizontech-startup or explicitly designated as Orizon projects.
metadata:
  origin: Orizon Tech
---

# Orizon Engineering Profile

Use this skill for every engineering task in an Orizon Tech repository.
Also apply `orizon-engineering-handbook` and load only the company standards relevant to the current task.

## Operating Model

1. Apply `orizon/policies/ORIZON-ECC-MANDATORY-SESSION-ENTRY.md`: before material work, load the latest available `main` of `orizontech-startup/ECC`, read `ORIZON-START-HERE.md`, and preserve any valid active mission.
2. Inspect the repository, current branch, docs, architecture, tests, CI and deployment path before changing code.
3. Preserve the existing product direction and active mission; never invent scope when a roadmap, handoff, issue or requirement already exists. Loading ECC must not reset an in-progress mission or force re-authorization of already-authorized reversible work.
4. Plan material changes before implementation and identify backend, frontend, database, infrastructure and security impact.
5. Keep frontend and backend capabilities synchronized. A backend capability is not complete if the user-facing surface cannot use it when one is required.
6. Implement the smallest production-grade change that satisfies the requirement; avoid unrelated refactors.
7. Validate with the repository's real test, typecheck, lint, build and E2E commands when available.
8. Review security-sensitive changes for auth, authorization, secrets, input validation, data exposure, rate limits and rollback risk.
9. Use GitHub as the source of truth for code changes. Do not use visual builders to mutate source when a repository is authoritative.
10. Record meaningful architecture or operational decisions in the project's existing documentation structure.
11. Finish with a production/go-live checklist and state remaining blockers explicitly.
12. Apply `orizon/policies/ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md`: ECC is the current governing authority; legacy Strategy, Central Office, Hub, Birth Lifecycle, superseded Bootstrap, Official Resume, and historical governance hooks are non-blocking unless explicitly re-adopted by current ECC.
13. Apply `orizon/policies/ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md`: once a mission is authorized, continue autonomously through fixable failures until acceptance criteria are met or a genuine human gate is reached. Verify instead of asking, fix instead of reporting, and never create artificial approval checkpoints.
14. Apply `orizon/policies/ORIZON-TASK-COMPLETION-NOTIFICATION-POLICY.md`: upon genuine completion of a material engineering mission, emit an automated completion notification through the canonical Orizon notification service without creating an artificial approval checkpoint. Decouple notification transport from task completion status, and never expose notification tokens.

## ECC Orchestration

Use ECC capabilities as needed: planner -> architect -> tdd-guide -> implementation -> code-reviewer -> security-reviewer -> e2e-runner -> verify.
Parallelize only independent work. Never report a test, deploy or validation as successful unless it was actually executed and passed.

ECC gates are validation gates, not conversational pause points. A failed test/build/runtime check should trigger diagnose -> fix -> retest -> continue whenever the work is within scope and existing authority.

## Project Overrides

Current project-specific instructions may be more restrictive only when they are current, applicable, ECC-compatible, and not merely inherited from superseded legacy governance. The ECC supremacy policy controls conflicts with historical Strategy, Central Office, Hub, Birth Lifecycle, Bootstrap, Official Resume, or legacy hooks.
