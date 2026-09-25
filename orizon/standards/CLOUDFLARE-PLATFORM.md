# Cloudflare Platform Standard

- Cloudflare is the preferred edge layer when a project uses the Orizon web platform stack.
- Enforce HTTPS and preserve the canonical production hostname and unaffected routes.
- Use Pages for static/frontend delivery where appropriate and Workers for edge/server logic where appropriate.
- Keep production, staging and development bindings, secrets and routes isolated.
- Use DNS, CDN/cache rules and compression deliberately; do not cache personalized or sensitive responses.
- Apply WAF, DDoS protection, bot controls and rate limits to exposed attack surfaces.
- Use Turnstile or equivalent protection on abuse-prone public forms when appropriate.
- Use Zero Trust for internal/admin surfaces that should not be public.
- Use R2 when object storage at the edge is a good fit; define retention and access rules.
- Store secrets in Cloudflare/GitHub-managed secret stores, never in source.
- Treat Worker routes and proxy rules as production-critical infrastructure.
- Test route precedence so a new Worker does not hijack unrelated homepage or application traffic.
- Keep a rollback path for Workers/Pages deployments and configuration changes.
- Verify the final public URL after deploy; a successful build alone is not production validation.
