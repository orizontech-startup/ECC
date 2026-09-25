# Identity and Authentication Standard

- Authentication proves identity; authorization independently proves permission.
- Support verified email/password and OAuth providers only when the product requires them.
- Require email verification for account flows where impersonation or recovery risk matters.
- Use MFA/2FA for privileged, administrative or otherwise sensitive roles when practical.
- Prefer short-lived access tokens and secure refresh/session handling.
- Track sessions/devices where account security or remote access requires revocation capability.
- Use RBAC or explicit permission models; do not hide authorization only in UI controls.
- Scope organization/tenant access on every protected operation.
- For native/public clients and connectors, prefer OAuth 2.1 patterns with PKCE where supported.
- Do not persist reusable bearer tokens in source, logs or unprotected local files.
- Protect password reset, invite, magic-link and account recovery flows against replay and enumeration.
- Use secure cookie attributes when cookies are used: HttpOnly, Secure and appropriate SameSite.
- Re-authenticate or require stronger confirmation for high-risk account or infrastructure actions.
- Test authorization bypass attempts, not only successful login.
