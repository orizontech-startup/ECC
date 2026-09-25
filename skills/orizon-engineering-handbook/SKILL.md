---
name: orizon-engineering-handbook
description: Route Orizon Tech engineering work to the relevant company standards for APIs, Cloudflare, Supabase, auth, mobile, remote access, security, CI/CD, testing, observability, go-live and related domains.
metadata:
  origin: Orizon Tech
---

# Orizon Engineering Handbook

Use this skill together with `orizon-engineering-profile`.

Read only the standards relevant to the task from the plugin-root `orizon/standards/` directory. In Codex, resolve from `$PLUGIN_ROOT`; in Claude Code, resolve from `$CLAUDE_PLUGIN_ROOT`. From this skill directory, the relative path is `../../orizon/standards/`.

## Routing

- APIs/contracts -> API-ENGINEERING.md + FRONTEND-BACKEND-PARITY.md
- Cloudflare/edge/deploy -> CLOUDFLARE-PLATFORM.md + CI-CD-ENVIRONMENTS.md
- Supabase/Postgres -> SUPABASE-DATA.md + BACKUP-DR.md
- Login/auth/permissions -> IDENTITY-AUTH.md + SECURITY.md
- Mobile/responsive UI -> MOBILE-FIRST-UX.md + BRAND-ASSETS-UI.md
- ORIZON CONTROL/remote access -> REMOTE-ACCESS.md + SECURITY.md + PERFORMANCE-COST.md
- Security/privacy/secrets -> SECURITY.md + SECRETS-CONFIG.md + DATA-PRIVACY.md
- Tests/QA -> QA-TESTING.md
- Monitoring/incidents -> OBSERVABILITY-INCIDENTS.md
- GitHub/repository workflow -> GITHUB-SOURCE-CONTROL.md
- Third-party providers/webhooks/social -> THIRD-PARTY-INTEGRATIONS.md
- Architecture -> ARCHITECTURE-DECISIONS.md + PLATFORM-REFERENCE-ARCHITECTURE.md
- AI-agent development -> AI-AGENT-ENGINEERING.md
- Roadmap/phases/handoff -> PRODUCT-DELIVERY.md + DOCUMENTATION-HANDOFF.md
- Production launch -> GO-LIVE-PRODUCTION.md
- Multi-tenant SaaS -> MULTI-TENANT-SAAS.md + SECURITY.md + DATA-PRIVACY.md
- Social publishing/autopilot -> SOCIAL-PUBLISHING-AUTOMATION.md + THIRD-PARTY-INTEGRATIONS.md
- AI-generated marketing/branding -> AI-MEDIA-BRANDING.md + BRAND-ASSETS-UI.md
- Windows desktop/native client -> WINDOWS-NATIVE-CLIENT.md + PERFORMANCE-COST.md
- Project takeover/audit -> PROJECT-TAKEOVER-AUDIT.md + PRODUCT-DELIVERY.md
- Vendor/platform cost -> VENDOR-COST-GOVERNANCE.md + PERFORMANCE-COST.md
- Remote engineering tools -> REMOTE-ENGINEERING-TOOLS.md + SECURITY.md

Always apply project-local stricter rules first and load no unrelated standard merely because it exists.
