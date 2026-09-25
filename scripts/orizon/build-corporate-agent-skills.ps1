Set-Location 'C:\Projetos\Orizon-ECC'
git checkout -B orizon/engineering-os-max-v1 origin/main
$agents = Get-ChildItem 'agents\orizon-*.md'
foreach ($a in $agents) {
  $raw = Get-Content -Raw $a.FullName
  $name = [regex]::Match($raw, '(?m)^name:\s*(.+)$').Groups[1].Value.Trim()
  $desc = [regex]::Match($raw, '(?m)^description:\s*(.+)$').Groups[1].Value.Trim()
  $body = ($raw -split '---', 3)[2].Trim()
  $dir = Join-Path 'skills' $name
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $content = "---`nname: $name`ndescription: $desc`nmetadata:`n  origin: Orizon Tech`n  role: corporate-agent`n---`n`n$body`n`n## Execution contract`nUse the Orizon Engineering OS, project-local rules, evidence gates and relevant company standards. Act autonomously within authorized project boundaries and hand off concrete evidence, blockers and next actions.`n"
  Set-Content -Path (Join-Path $dir 'SKILL.md') -Value $content -Encoding utf8
}
Write-Host ('CREATED_AGENT_SKILLS=' + $agents.Count)