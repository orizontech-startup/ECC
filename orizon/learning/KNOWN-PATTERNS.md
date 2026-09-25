# Orizon Institutional Engineering Learnings

These are reusable patterns already proven in Orizon projects.

## Meta social publishing
Instagram media may not be publishable immediately after creation. Treat media processing as asynchronous, retry transient `media_publish` readiness failures with bounded backoff, and retry only failed targets so Facebook/Instagram success is not duplicated.

## Cloudflare distributed pairing
Do not use process RAM as the authority for distributed pairing/session requests. Durable shared state such as KV/database is the source of truth; in-memory cache is only a fallback/optimization. Polling must not erase a pending request.

## Authentication redirects
Successful authentication is not completion. Validate the post-login redirect into the intended workspace and test expired/invalid session behavior.

## AI branding
Never rely on generative models to reconstruct official Orizon wordmarks. Compose approved logo assets deterministically after generation when necessary and reject pseudo-text/misspelled branding.

## Remote control
Treat video transport, input injection and privileged native actions as separate systems. Measure click-to-effect latency and frame stability end-to-end; do not infer control quality from viewer rendering alone.

## Project takeover
Before feature execution, prove which repository, database, domain and deployment are actually live. Baseline failures belong to takeover evidence, not to the next feature's regression count.
