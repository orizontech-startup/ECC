# Third-Party Integration Standard

- Wrap external APIs behind explicit adapters/services instead of scattering provider logic across the codebase.
- Use OAuth or provider-supported delegated auth when available; minimize long-lived static credentials.
- Verify webhook signatures and protect replay-sensitive events.
- Make webhook handlers idempotent because providers retry.
- Apply bounded retries with backoff only to transient failures.
- Track per-target success/failure for fan-out operations; do not duplicate already successful actions on retry.
- Respect provider rate limits and surface actionable failure reasons.
- Store external IDs needed for reconciliation and retry.
- Treat provider response timing as nondeterministic; use polling/backoff or async jobs where required.
- Add sandbox/staging validation before changing production integrations.
- Never claim simultaneous multi-provider success unless each target is confirmed.
- Keep provider-specific behavior out of core domain logic where practical.
