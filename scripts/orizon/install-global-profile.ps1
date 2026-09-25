$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir "..\..")).Path
$sourceOrizon = Join-Path $repoRoot "orizon"
$portableRoot = Join-Path $HOME ".orizon-ecc"

New-Item -ItemType Directory -Force -Path $portableRoot | Out-Null
Copy-Item -Path (Join-Path $sourceOrizon "*") -Destination $portableRoot -Recurse -Force
Write-Host "Installed Orizon portable handbook: $portableRoot"

$block = @'
<!-- ORIZON-ECC:BEGIN -->
# Orizon Tech Global Engineering Profile

When the current Git repository has a remote under `github.com/orizontech-startup/`,
or the user explicitly identifies the project as an Orizon Tech project:

- Use the Orizon handbook at `~/.orizon-ecc/standards/README.md`.
- Load only the standards relevant to the current task from `~/.orizon-ecc/standards/`.
- Apply `orizon-engineering-profile`; use `orizon-project-bootstrap` for first-time onboarding.
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
'@

function Install-OrizonBlock {
    param([Parameter(Mandatory=$true)][string]$Path)
    $dir = Split-Path -Parent $Path
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
