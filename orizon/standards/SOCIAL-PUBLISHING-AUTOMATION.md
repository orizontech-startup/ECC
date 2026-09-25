# Social Publishing & Automation

Use this standard for Instagram, Facebook and other social publishing automations.

- Treat each target network as an independent delivery target with its own result state.
- Fan out independent publishes in parallel when provider limits allow it.
- Retry only transient provider failures with bounded backoff; fail fast on permanent errors.
- Never duplicate a target that already published successfully when retrying partial failures.
- Persist provider media/post IDs as soon as they become available.
- Separate content generation approval from network delivery approval when the product requires review.
- Scheduled/autopilot runs must be idempotent and auditable by schedule, content, target and result.
- Validate media readiness before final publish calls; some providers process media asynchronously.
- Surface per-network success/failure clearly instead of collapsing into one generic status.
- Keep OAuth tokens server-side, refresh safely and record permission/scope problems explicitly.
