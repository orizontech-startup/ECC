---
description: Execute the Orizon Tech production-readiness gate for the current repository.
argument-hint: "[release, branch, commit or deployment target]"
---

# Orizon Go-Live

Use `orizon-engineering-profile`, `orizon-engineering-os`, `orizon-go-live-engineer` and the relevant standards, especially `GO-LIVE-PRODUCTION.md`.

Follow: Database -> Security -> Backend -> Frontend -> Tests -> Observability -> Staging -> Production.
Identify the exact release commit or artifact and deployment target.
Run the repository's real build, test and critical-flow validations.
Verify migrations, environment configuration, external integrations and rollback.
Validate staging before production when the project has staging.
After deploy, run public-route smoke tests and confirm monitoring/logging.
Return GO_LIVE_READY only when critical blockers are cleared; otherwise return GO_LIVE_BLOCKED with exact blockers and next actions.
