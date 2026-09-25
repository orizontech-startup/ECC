# Orizon Platform Reference Architecture

Use as a baseline, not a mandatory topology.

- Source: GitHub with reviewed changes and traceable releases.
- CI/CD: GitHub Actions or the repository's canonical automation.
- Edge/web: Cloudflare DNS, CDN, SSL, WAF, Pages/Workers where appropriate.
- Frontend: responsive web/mobile-first client delivered independently or with the product as designed.
- Backend: containerized or serverless services with explicit APIs and health checks.
- Primary relational data: Supabase/PostgreSQL when selected by the project.
- Async work: queues/workers for non-blocking and retryable jobs.
- Cache/ephemeral state: Redis or equivalent when workload evidence requires it.
- Object storage: R2/S3-compatible storage for files/media when appropriate.
- Cross-cutting: auth, secrets, observability, backups, security and cost controls.
- Environments: DEV -> STAGING -> PRODUCTION with isolated credentials and risk-appropriate data separation.
- Existing projects may use different components; do not migrate solely to match this reference.
