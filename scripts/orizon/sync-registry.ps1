Set-Location 'C:\Projetos\Orizon-ECC'
$orgs=@('orizontech-startup','orizontech-hq')
$existing=Get-Content 'orizon\registry\PROJECTS.json' -Raw | ConvertFrom-Json
$roles=@{}
foreach($p in $existing.projects){$roles[$p.repo]=$p.role}
$projects=@()
foreach($org in $orgs){
  $items=gh repo list $org --limit 200 --json nameWithOwner,isArchived,defaultBranchRef,isFork | ConvertFrom-Json
  foreach($r in $items){
    if($r.isArchived){continue}
    $name=($r.nameWithOwner -split '/')[1]
    if($name -in @('.github','credenciais')){continue}
    if($name -match 'backup|acceptance'){continue}
    $role=if($roles.ContainsKey($r.nameWithOwner)){$roles[$r.nameWithOwner]}elseif($name -match 'engineering-os|ECC'){'engineering-os'}elseif($name -match 'caio'){'caio'}elseif($name -match 'strategy'){'strategy'}else{'product-or-platform'}
    $projects += [ordered]@{repo=$r.nameWithOwner;role=$role;default_branch=$r.defaultBranchRef.name;fork=[bool]$r.isFork}
  }
}
$out=[ordered]@{generated_at=(Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK');organizations=$orgs;projects=($projects|Sort-Object repo)}
$json=$out|ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText((Join-Path (Resolve-Path 'orizon\registry').Path 'PROJECTS.json'),$json + [Environment]::NewLine,(New-Object System.Text.UTF8Encoding($false)))
Write-Host ('REGISTRY_PROJECTS=' + $projects.Count)