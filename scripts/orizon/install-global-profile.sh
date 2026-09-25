#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PORTABLE_ROOT="$HOME/.orizon-ecc"

mkdir -p "$PORTABLE_ROOT"
cp -R "$REPO_ROOT/orizon/." "$PORTABLE_ROOT/"
echo "Installed Orizon portable handbook: $PORTABLE_ROOT"

read -r -d '' BLOCK <<'EOF' || true
<!-- ORIZON-ECC:BEGIN -->
# Orizon Tech Global Engineering Profile

When the current Git repository has a remote under `github.com/orizontech-startup/` or `github.com/orizontech-hq/`,
or the user explicitly identifies the project as an Orizon Tech project:

- Use the Orizon handbook at `~/.orizon-ecc/standards/README.md`.
- Load only the standards relevant to the current task from `~/.orizon-ecc/standards/`.
- Apply `orizon-engineering-profile` and `orizon-engineering-os`; use `orizon-project-bootstrap` for first-time onboarding.
- Delivery order: Database -> Security -> Backend -> Frontend -> Tests -> Observability -> Staging -> Production.
- GitHub is the source of truth for repository-backed code.
- Keep frontend/backend/data/infrastructure changes synchronized.
- Never mix project-specific code, secrets, databases, deployment state or assumptions between repositories.
- Never claim tests, deploys, browser flows or go-live succeeded unless they actually ran and passed.
- Project-local stricter rules always take precedence.

Core routing: APIs -> API-ENGINEERING; Cloudflare -> CLOUDFLARE-PLATFORM; Supabase -> SUPABASE-DATA;
auth -> IDENTITY-AUTH + SECURITY; mobile -> MOBILE-FIRST-UX; remote access -> REMOTE-ACCESS;
security/secrets/privacy -> SECURITY + SECRETS-CONFIG + DATA-PRIVACY; production -> GO-LIVE-PRODUCTION.

Outside Orizon Tech repositories, do not apply this profile unless the user explicitly asks for it.
<!-- ORIZON-ECC:END -->
EOF

install_block() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  python3 - "$path" "$BLOCK" <<'PY'
import pathlib, re, sys
path = pathlib.Path(sys.argv[1]).expanduser()
block = sys.argv[2].strip()
text = path.read_text(encoding="utf-8-sig") if path.exists() else ""
pattern = r"(?s)<!-- ORIZON-ECC:BEGIN -->.*?<!-- ORIZON-ECC:END -->"
if re.search(pattern, text):
    out = re.sub(pattern, block, text)
elif text.strip():
    out = text.rstrip() + "\n\n" + block + "\n"
else:
    out = block + "\n"
path.write_text(out, encoding="utf-8")
print(f"Installed Orizon global profile: {path}")
PY
}

install_block "$HOME/.claude/CLAUDE.md"
install_block "${CODEX_HOME:-$HOME/.codex}/AGENTS.md"
