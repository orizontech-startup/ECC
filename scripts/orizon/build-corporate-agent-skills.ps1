$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Push-Location $repoRoot
try {
  $agents = Get-ChildItem 'agents\orizon-*.md'
  foreach ($a in $agents) {
    $raw = Get-Content -Raw $a.FullName
    $name = [regex]::Match($raw, '(?m)^name:\s*(.+)$').Groups[1].Value.Trim()
    $desc = [regex]::Match($raw, '(?m)^description:\s*(.+)$').Groups[1].Value.Trim()
    $body = ($raw -split '---', 3)[2].Trim()
    $dir = Join-Path 'skills' $name
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $content = "---`nname: $name`ndescription: $desc`nmetadata:`n  origin: Orizon Tech`n  role: corporate-agent`n---`n`n$body`n`n## Execution contract`nUse the Orizon Engineering OS, project-local rules, evidence gates and relevant company standards. Act autonomously within authorized project boundaries and hand off concrete evidence, blockers and next actions.`n"
    [System.IO.File]::WriteAllText((Join-Path (Resolve-Path $dir).Path 'SKILL.md'), $content, (New-Object System.Text.UTF8Encoding($false)))
  }
  Write-Host ('CREATED_AGENT_SKILLS=' + $agents.Count)
} finally { Pop-Location }