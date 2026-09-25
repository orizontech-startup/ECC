#!/usr/bin/env bash
set -euo pipefail

read -r -d '' BLOCK <<'EOF' || true
<!-- ORIZON-ECC:BEGIN -->
# Orizon Tech Global Engineering Profile

When the current Git repository has a remote under `github.com/orizontech-startup/`,
or the user explicitly identifies the project as an Orizon Tech project:

- Apply the ECC skill `orizon-engineering-profile` as the company baseline.
- If the repository has not been onboarded under the profile, also apply `orizon-project-bootstrap`.
- Inspect repository-local instructions first; stricter project rules take precedence.
- Never carry project-specific code, secrets, databases, deployment state, or assumptions into another repository.
- Use GitHub as the source of truth for repository-backed application code.
- Do not report tests, deploys, runtime checks, or go-live status as successful unless they were actually verified.

Outside Orizon Tech repositories, do not apply this profile unless the user explicitly asks for it.
<!-- ORIZON-ECC:END -->
EOF

install_block() {
  local path="$1"
  mkdir -p "$(dirname "$path")"  python3 - "$path" "$BLOCK" <<'PY'
import pathlib, re, sys
path = pathlib.Path(sys.argv[1]).expanduser()
block = sys.argv[2].strip()
text = path.read_text(encoding="utf-8") if path.exists() else ""
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
