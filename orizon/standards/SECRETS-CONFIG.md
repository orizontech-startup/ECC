# Secrets and Configuration Standard

- No production secret belongs in source control, screenshots, build artifacts or committed config.
- Use GitHub Secrets/Environments, Cloudflare secrets, Supabase secret management or another approved secret store.
- Keep client-exposed public keys separate from privileged service credentials.
- Validate required environment variables at service startup and fail clearly when missing.
- Use different credentials across development, staging and production.
- Grant each service only the minimum secrets and permissions it needs.
- Avoid reusable production credentials on developer disks when a managed identity/secret flow exists.
- Redact credentials from logs, exceptions, telemetry and support tooling.
- Rotate exposed or shared credentials and invalidate old sessions/tokens when applicable.
- Keep a documented variable-name inventory without storing secret values in documentation.
