$ErrorActionPreference = "Stop"

$block = @"
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
"@

function Install-OrizonBlock {
    param([Parameter(Mandatory=$true)][string]$Path)    $dir = Split-Path -Parent $Path
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $existing = if (Test-Path $Path) { Get-Content -Raw -Path $Path } else { "" }
    $pattern = "(?s)<!-- ORIZON-ECC:BEGIN -->.*?<!-- ORIZON-ECC:END -->"
    if ($existing -match $pattern) {
        $updated = [regex]::Replace($existing, $pattern, $block.Trim())
    } elseif ([string]::IsNullOrWhiteSpace($existing)) {
        $updated = $block.Trim() + [Environment]::NewLine
    } else {
        $updated = $existing.TrimEnd() + [Environment]::NewLine + [Environment]::NewLine + $block.Trim() + [Environment]::NewLine
    }
    Set-Content -Path $Path -Value $updated -Encoding utf8
    Write-Host "Installed Orizon global profile: $Path"
}

Install-OrizonBlock (Join-Path $HOME ".claude\CLAUDE.md")
Install-OrizonBlock (Join-Path $HOME ".codex\AGENTS.md")
