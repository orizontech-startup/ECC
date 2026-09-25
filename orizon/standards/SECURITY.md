# Security Standard

- Security is a delivery gate, not a post-release cleanup phase.
- Threat-model new auth, payment, remote-control, admin, upload, webhook and external-integration surfaces.
- Never commit secrets, credentials, private keys or production tokens.
- Validate all untrusted input at the system boundary and encode output for its context.
- Enforce server-side authorization for every protected object/action.
- Prevent SQL/NoSQL injection, XSS, CSRF, SSRF, path traversal and unsafe deserialization.
- Configure CORS, CSP and security headers intentionally rather than using permissive defaults.
- Rate-limit login, recovery, scraping, expensive AI actions and abuse-prone APIs.
- Keep dependencies patched; use Dependabot or equivalent and review supply-chain risk.
- Run secret scanning and static security checks in CI where practical.
- Redact tokens, passwords, personal data and sensitive payloads from logs.
- Use least-privilege service accounts, database roles and cloud permissions.
- For high-risk changes, require an explicit security review and production rollback plan.
- Rotate any credential suspected of exposure; deleting it from code is not sufficient.
- Security-sensitive go-live requires runtime validation, not only code review.
