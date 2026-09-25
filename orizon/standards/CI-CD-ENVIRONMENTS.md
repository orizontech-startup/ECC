# CI/CD and Environment Standard

- Maintain clear DEV, STAGING and PRODUCTION boundaries for production systems.
- Environments must use separate secrets and should use separate databases, APIs, storage and logs where risk justifies it.
- CI should install from lockfiles, typecheck/lint, test and build using reproducible commands.
- Production deployment should follow a known artifact or commit, not an untracked local state.
- Run database migrations in a controlled step with failure handling.
- Staging must be representative enough to validate critical integrations before production.
- Use approval gates for high-risk production changes when the repository/workflow supports them.
- Deployment automation must expose a rollback or fast forward-repair path.
- Do not mark a deployment successful until health checks and smoke tests pass.
- Keep environment variables documented by name and purpose without exposing values.
- Infrastructure changes should be versioned or otherwise auditable.
- Prevent preview/test configuration from silently leaking into production.
- Record the production commit/deployment identifier for incident traceability.
