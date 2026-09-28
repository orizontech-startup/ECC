#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = process.cwd();
const report = { generatedAt: new Date().toISOString(), root, checks: [], state: 'QUALITY_GATE_PASS' };
let failed = false;

function exe(name) {
  return process.platform === 'win32' && ['npm','npx','pnpm','yarn','bun'].includes(name) ? name + '.cmd' : name;
}

function run(name, command, args = [], options = {}) {
  const started = Date.now();
  const result = spawnSync(exe(command), args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, CI: 'true', ...options.env }
  });
  const ok = result.status === 0;
  report.checks.push({
    name,
    ok,
    warning: !ok && Boolean(options.soft),
    durationMs: Date.now() - started,
    command: [command, ...args].join(' ')
  });
  if (!ok && !options.soft) failed = true;
  return ok;
}

run('git-diff-check', 'git', ['diff', '--check']);

const packagePath = path.join(root, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const scripts = pkg.scripts || {};
  const shouldInstall = String(process.env.ORIZON_GATE_INSTALL || 'true').toLowerCase() !== 'false';

  let manager = 'npm';
  let installArgs = ['ci'];
  if (fs.existsSync(path.join(root, 'bun.lock')) || fs.existsSync(path.join(root, 'bun.lockb'))) {
    manager = 'bun';
    installArgs = ['install', '--frozen-lockfile'];
  } else if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) {
    manager = 'pnpm';
    installArgs = ['install', '--frozen-lockfile'];
    run('corepack-enable', 'corepack', ['enable']);
  } else if (fs.existsSync(path.join(root, 'yarn.lock'))) {
    manager = 'yarn';
    installArgs = ['install', '--immutable'];
    run('corepack-enable', 'corepack', ['enable']);
  } else if (!fs.existsSync(path.join(root, 'package-lock.json'))) {
    installArgs = ['install'];
  }

  let dependenciesOk = true;
  if (shouldInstall) {
    dependenciesOk = run('dependencies-primary', manager, installArgs, { soft: true });
    if (!dependenciesOk) {
      const fallbackArgs = manager === 'npm'
        ? ['install', '--no-audit', '--no-fund']
        : manager === 'pnpm'
          ? ['install', '--no-frozen-lockfile']
          : ['install'];
      dependenciesOk = run('dependencies-fallback', manager, fallbackArgs);
    }
  }

  const preferred = [
    ['lint', 'lint'],
    ['typecheck', 'typecheck'],
    ['test', 'test'],
    ['build', 'build']
  ];
  for (const [checkName, script] of preferred) {
    if (!dependenciesOk && shouldInstall) {
      report.checks.push({ name: checkName, ok: false, skipped: true, blocked: true, detail: 'dependency installation failed' });
    } else if (scripts[script]) {
      run(checkName, manager, ['run', script]);
    } else {
      report.checks.push({ name: checkName, ok: true, skipped: true, detail: 'script not configured' });
    }
  }
} else {
  report.checks.push({ name: 'node-project', ok: true, skipped: true, detail: 'package.json not present' });
}

if (fs.existsSync(path.join(root, 'pyproject.toml')) || fs.existsSync(path.join(root, 'pytest.ini'))) {
  const py = process.platform === 'win32' ? 'python' : 'python3';
  const probe = spawnSync(exe(py), ['-m', 'pytest', '--version'], { cwd: root, stdio: 'ignore' });
  if (probe.status === 0) run('pytest', py, ['-m', 'pytest', '-q']);
  else report.checks.push({ name: 'pytest', ok: true, skipped: true, detail: 'pytest unavailable' });
}

report.state = failed ? 'QUALITY_GATE_FAIL' : 'QUALITY_GATE_PASS';
const outDir = path.join(root, '.orizon');
try { fs.mkdirSync(outDir, { recursive: true }); } catch (error) { console.warn(error.message); }
// --- Universal Completion Gate Hook ---
const cliArgs = process.argv.slice(2);
function getCliOption(flag) {
  const idx = cliArgs.indexOf(flag);
  return idx !== -1 && idx + 1 < cliArgs.length ? cliArgs[idx + 1] : undefined;
}
const completeStage = getCliOption('--complete-stage');
const completePhase = getCliOption('--complete-phase');
const resultSummary = getCliOption('--result') || 'Quality Gate validado e aprovado com sucesso.';
const nextStep = getCliOption('--next-stage') || getCliOption('--next-phase');
const refArg = getCliOption('--ref');

if (!failed && (completeStage || completePhase)) {
  const os = require('os');
  const notifyScript = path.join(__dirname, '../../orizon/bin/orizon-notify.mjs');
  const portableScript = path.join(os.homedir(), '.orizon-ecc/bin/orizon-notify.mjs');
  const targetScript = fs.existsSync(notifyScript) ? notifyScript : portableScript;

  if (fs.existsSync(targetScript)) {
    const eventType = completeStage ? 'stage-completed' : 'phase-completed';
    const nameArgs = completeStage ? ['--stage', completeStage] : ['--phase', completePhase];
    const extraArgs = [];
    if (nextStep) extraArgs.push(completeStage ? '--next-stage' : '--next-phase', nextStep);
    if (refArg) extraArgs.push('--ref', refArg);

    const res = spawnSync(process.execPath, [targetScript, eventType, ...nameArgs, '--result', resultSummary, ...extraArgs], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    report.completionNotification = {
      triggered: true,
      eventType,
      ok: res.status === 0,
      exitCode: res.status,
    };
  } else {
    report.completionNotification = { triggered: false, reason: 'notify_runtime_not_found' };
  }
} else if (failed && (completeStage || completePhase)) {
  report.completionNotification = { triggered: false, reason: 'quality_gate_failed' };
}

try { fs.writeFileSync(path.join(outDir, 'gate-report.json'), JSON.stringify(report, null, 2) + '\n'); } catch (error) { console.warn(error.message); }

console.log('\n=== ORIZON QUALITY GATE ===');
for (const check of report.checks) {
  const status = check.warning ? 'WARN' : check.ok ? 'PASS' : 'FAIL';
  console.log(`${status}  ${check.name}${check.skipped ? ' (skipped)' : ''}`);
}
console.log(report.state);
process.exit(failed ? 1 : 0);
