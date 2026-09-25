# API Engineering Standard

- Design contracts before implementation when a public or cross-service interface is changing.
- Prefer explicit versioning for externally consumed APIs; avoid silent breaking changes.
- Validate request shape, types, ranges, ownership and authorization at the boundary.
- Use consistent JSON success/error envelopes within each product.
- Use stable machine-readable error codes in addition to human-readable messages.
- Support pagination, filtering and ordering explicitly on list endpoints.
- Make retryable write operations idempotent where duplicate execution is possible.
- Set timeouts for outbound calls and define retry/backoff only for transient failures.
- Apply authentication and object-level authorization independently.
- Rate-limit abuse-sensitive endpoints and protect expensive operations.
- Use parameterized database access; never compose SQL from untrusted input.
- Document contracts with OpenAPI or the repository's canonical API documentation.
- Add contract/integration tests for critical endpoints and breaking changes.
- Emit request correlation IDs and structured logs without sensitive payload leakage.
- A backend API is not considered complete when a required frontend/client integration is missing.
