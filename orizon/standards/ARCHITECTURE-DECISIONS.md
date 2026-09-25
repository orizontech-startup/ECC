# Architecture Decision Standard

- Understand and baseline the existing architecture before proposing replacement.
- Prefer evolution over rewrite unless product, security or operability evidence justifies a rewrite.
- Make service boundaries follow ownership, deployability or scaling needs rather than fashion.
- Keep domain logic separated from provider-specific SDK details where practical.
- Use explicit interfaces/adapters for databases, AI providers, social platforms and cloud services.
- Define failure behavior, retries, idempotency and consistency at integration boundaries.
- Record material decisions with context, chosen option, alternatives and consequences.
- Avoid infrastructure that has no demonstrated need.
- Evaluate security, observability, rollback, mobile impact, latency and recurring cost.
- For projects adopted by Orizon, stabilize and document before large restructuring.
