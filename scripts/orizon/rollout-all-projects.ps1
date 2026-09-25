$ErrorActionPreference = 'Continue'
$orgs = @('orizontech-startup','orizontech-hq')
$skip = @('ECC','.github','credenciais')
$tmpRoot = Join-Path $env:TEMP 'orizon-ecc-rollout'
New-Item -ItemType Directory -Force -Path $tmpRoot | Out-Null
$repos = @()
foreach ($org in $orgs) {
  $json = gh repo list $org --limit 200 --json nameWithOwner,isArchived | ConvertFrom-Json
  $repos += $json | Where-Object { -not $_.isArchived } | Select-Object -ExpandProperty nameWithOwner
}
$repos = $repos | Where-Object {
  $name = ($_ -split '/')[1]
  ($skip -notcontains $name) -and ($name -notmatch 'backup') -and ($name -notmatch 'acceptance')
} | Sort-Object -Unique
$results = @()
foreach ($repo in $repos) {
  $name = ($repo -split '/')[1]
  $dir = Join-Path $tmpRoot ($repo -replace '/','__')
  if (Test-Path $dir) { Remove-Item -Recurse -Force $dir }
  Write-Host "=== $repo ==="
  gh repo clone $repo $dir -- --depth 1 | Out-Host
  if ($LASTEXITCODE -ne 0) { $results += [pscustomobject]@{repo=$repo;state='CLONE_FAIL'}; continue }
  Push-Location $dir
  git checkout -b chore/orizon-engineering-os | Out-Host
  New-Item -ItemType Directory -Force -Path '.orizon','.github\workflows' | Out-Null
  $project = [ordered]@{schema_version=1;repository=$repo;product=$name;owner='Orizon Tech';production_url='';staging_url='';stack=@();current_phase='bootstrap';assurance_class='E2';critical_flows=@();go_live_state='NOT_ASSESSED'}
  $project | ConvertTo-Json -Depth 5 | Set-Content '.orizon\project.json' -Encoding utf8
  $workflow = @'
name: Orizon Engineering Gate
on:
  pull_request:
  push:
    branches: [main, master]
  workflow_dispatch:
jobs:
  orizon:
    uses: orizontech-startup/ECC/.github/workflows/orizon-reusable-quality-gate.yml@main
    with:
      node-version: "20"
'@
  Set-Content '.github\workflows\orizon-engineering-gate.yml' $workflow -Encoding utf8
  git add .orizon/project.json .github/workflows/orizon-engineering-gate.yml
  git commit -m 'chore: onboard Orizon Engineering OS' | Out-Host
  if ($LASTEXITCODE -ne 0) { Pop-Location; $results += [pscustomobject]@{repo=$repo;state='NO_CHANGE'}; continue }
  git push -u origin chore/orizon-engineering-os --force-with-lease | Out-Host
  if ($LASTEXITCODE -ne 0) { Pop-Location; $results += [pscustomobject]@{repo=$repo;state='PUSH_FAIL'}; continue }
  $existing = gh pr list --repo $repo --head chore/orizon-engineering-os --state open --json url --jq '.[0].url'
  if (-not $existing) {
    $existing = gh pr create --repo $repo --base (gh repo view $repo --json defaultBranchRef --jq '.defaultBranchRef.name') --head chore/orizon-engineering-os --title 'chore: onboard Orizon Engineering OS' --body 'Adds the Orizon project metadata surface and company quality-gate workflow. This connects the repository to the central Orizon Engineering OS in orizontech-startup/ECC.'
  }
  $results += [pscustomobject]@{repo=$repo;state='PR_OPEN';url=$existing}
  Pop-Location
}
$results | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $tmpRoot 'rollout-results.json') -Encoding utf8
$results | Format-Table -AutoSize