#!/usr/bin/env node
/**
 * ORIZON NOTIFY — Canonical Notification Runtime & Completion Gate (ECC)
 *
 * Provides the executable capability for all ECC-governed agents, projects and automations:
 * - ecc-loaded: Immediate operational handshake upon loading/reloading ECC
 * - stage-completed: Formal completion of an engineering stage/task
 * - phase-completed: Formal completion of a major project phase/milestone
 * - work-completed: General material work unit completion
 *
 * Features:
 * - Multi-tier token resolution (Environment, User Store, OS environment)
 * - Idempotency & deduplication ledger in .orizon/completion-ledger.json
 * - Automatic retries with exponential backoff on transient failures
 * - Factual decoupling: WORK_COMPLETED vs NOTIFICATION_SENT / NOTIFICATION_FAILED
 * - Zero secrets in repositories; zero hardcoded phone numbers
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const DEFAULT_ENDPOINT = 'https://api.useorizon.com/internal/task-notifications';

// 1. Token Resolution (Multi-Tier Centralized & Secure, Zero Secrets in Git)
function resolveToken(explicitToken) {
  if (explicitToken) return explicitToken.trim();
  if (process.env.TASK_NOTIFICATION_TOKEN) return process.env.TASK_NOTIFICATION_TOKEN.trim();

  const home = os.homedir();

  // Check ~/.orizon/credentials.json
  const credPath = path.join(home, '.orizon', 'credentials.json');
  if (fs.existsSync(credPath)) {
    try {
      const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      const token = creds.TASK_NOTIFICATION_TOKEN || creds.taskNotificationToken || creds.task_notification_token;
      if (token) return String(token).trim();
    } catch {} // ignore parse failure
  }

  // Check ~/.orizon/task-token
  const rawTokenPath = path.join(home, '.orizon', 'task-token');
  if (fs.existsSync(rawTokenPath)) {
    try {
      const token = fs.readFileSync(rawTokenPath, 'utf8').trim();
      if (token) return token;
    } catch {}
  }

  // Check ~/.orizon-ecc/credentials.json
  const eccCredPath = path.join(home, '.orizon-ecc', 'credentials.json');
  if (fs.existsSync(eccCredPath)) {
    try {
      const creds = JSON.parse(fs.readFileSync(eccCredPath, 'utf8'));
      const token = creds.TASK_NOTIFICATION_TOKEN || creds.taskNotificationToken;
      if (token) return String(token).trim();
    } catch {}
  }

  // On Windows, check User Environment Store
  if (process.platform === 'win32') {
    try {
      const out = execSync('powershell -NoProfile -Command "[Environment]::GetEnvironmentVariable(\'TASK_NOTIFICATION_TOKEN\', \'User\')"',
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 2500 }
      ).trim();
      if (out) return out;
    } catch {}
  }

  return null;
}

// 2. Project Name Auto-Discovery
function discoverProject(explicitProject) {
  if (explicitProject) return explicitProject.trim();
  if (process.env.ORIZON_PROJECT_NAME) return process.env.ORIZON_PROJECT_NAME.trim();
  if (process.env.PROJECT_NAME) return process.env.PROJECT_NAME.trim();

  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 1500 }).trim();
    const match = remoteUrl.match(/[/\\]([^/\\]+?)(\.git)?$/);
    if (match && match[1]) {
      const cleanName = match[1].replace(/\.git$/, '').toUpperCase();
      if (cleanName === 'ORIZONAGENTS' || cleanName === 'ORIZON-AGENTS') return 'ORIZON AGENTES';
      if (cleanName === 'ECC') return 'ECC';
      if (cleanName === 'ATLETA360') return 'ATLETA 360';
      if (cleanName === 'BALAGUERIMOVEIS26') return 'BALAGUER';
      return cleanName;
    }
  } catch {}

  try {
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (pkg.name) return String(pkg.name).toUpperCase();
    }
  } catch {}

  return path.basename(process.cwd()).toUpperCase();
}

// 3. Executor Auto-Discovery
function discoverExecutor(explicitExecutor) {
  if (explicitExecutor) return explicitExecutor.trim();
  if (process.env.ORIZON_EXECUTOR) return process.env.ORIZON_EXECUTOR.trim();
  if (process.env.CLAUDE_PROJECT_DIR || process.env.CLAUDE_CODE) return 'Opus 5 Code';
  if (process.env.CODEX_HOME || process.env.OPENAI_API_KEY) return 'Codex';
  return 'Opus 5 Code';
}

// 4. Git Ref Auto-Discovery
function discoverRef(explicitRef) {
  if (explicitRef) return explicitRef.trim();
  try {
    const sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 1500 }).trim();
    if (sha) return `commit ${sha}`;
  } catch {}
  return undefined;
}

// 5. Completion Ledger & Idempotency
function getLedgerPath() {
  const dir = path.join(process.cwd(), '.orizon');
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch {}
  }
  return path.join(dir, 'completion-ledger.json');
}

function readLedger() {
  const p = getLedgerPath();
  if (fs.existsSync(p)) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {}
  }
  return { version: 1, entries: [] };
}

function writeLedger(ledger) {
  const p = getLedgerPath();
  try {
    fs.writeFileSync(p, JSON.stringify(ledger, null, 2) + '\n', 'utf8');
  } catch {}
}

function computeIdempotencyKey(eventType, project, name, ref) {
  const input = `${eventType}:${project.trim().toLowerCase()}:${name.trim().toLowerCase()}:${ref || new Date().toISOString().slice(0, 10)}`;
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 16);
}

function checkIdempotency(key) {
  const ledger = readLedger();
  const existing = ledger.entries.find((e) => e.idempotencyKey === key && e.notificationStatus === 'NOTIFICATION_SENT');
  if (existing) {
    const ageHours = (Date.now() - new Date(existing.occurredAt).getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) return existing;
  }
  return null;
}

function recordInLedger(entry) {
  const ledger = readLedger();
  ledger.entries.unshift(entry);
  if (ledger.entries.length > 100) ledger.entries = ledger.entries.slice(0, 100);
  writeLedger(ledger);
}

// 6. Resilient Dispatch with Retries and Backoff
async function dispatchNotificationWithRetry(event, token, endpoint, maxRetries = 2) {
  const payload = {
    project: event.project,
    task: event.task,
    status: event.status || 'COMPLETED',
    executor: event.executor,
    result: event.result,
    ref: event.ref,
  };

  let lastErr = null;
  let lastData = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Task-Notification-Token': token,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await response.json().catch(() => null);
      lastData = data;

      if (response.ok && data?.ok) {
        return { ok: true, data, attempts: attempt };
      }

      lastErr = new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
    } catch (err) {
      lastErr = err;
    }

    if (attempt <= maxRetries) {
      const delayMs = attempt * 1000;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return { ok: false, error: lastErr?.message, data: lastData, attempts: maxRetries + 1 };
}

// CLI Entrypoint
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    console.log(`
ORIZON NOTIFY — Canonical Notification Runtime & Completion Gate (ECC)

Commands:
  ecc-loaded         Emit immediate operational handshake after loading ECC
  stage-completed    Emit completion notification for an engineering stage/task
  phase-completed    Emit completion notification for a major project phase/milestone
  work-completed     Emit material completion notification for any work unit
  ledger             Display local completion and notification ledger

Options:
  --stage <name>     Stage name (required for stage-completed)
  --phase <name>     Phase name (required for phase-completed)
  --task <title>     Task or work unit title (required for work-completed)
  --result <summary> Outcome summary of what was accomplished and verified
  --next-stage <name> Next stage to be executed (optional)
  --next-phase <name> Next phase to be executed (optional)
  --project <name>   Project name (auto-discovered from git/dir if omitted)
  --status <status>  Status: COMPLETED | BLOCKED | FAILED (default: COMPLETED)
  --executor <name>  Agent or system name (auto-discovered if omitted)
  --ref <ref>        Traceability reference (commit SHA, PR number, deploy ID)
  --force            Bypass idempotency deduplication check
  --token <token>    Explicit token override (otherwise resolved securely from stores)
  --endpoint <url>   Override endpoint (default: canonical production endpoint)
`);
    process.exit(0);
  }

  function getArg(name) {
    const idx = args.indexOf(`--${name}`);
    if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
    const prefix = `--${name}=`;
    const match = args.find((a) => a.startsWith(prefix));
    return match ? match.slice(prefix.length) : undefined;
  }

  if (command === 'ledger') {
    const ledger = readLedger();
    console.log(JSON.stringify(ledger, null, 2));
    process.exit(0);
  }

  const explicitToken = getArg('token');
  const token = resolveToken(explicitToken);

  if (!token) {
    console.error(JSON.stringify({
      ok: false,
      workStatus: 'WORK_COMPLETED',
      notificationStatus: 'NOTIFICATION_FAILED',
      error: 'TASK_NOTIFICATION_TOKEN_NOT_CONFIGURED',
      message: 'TASK_NOTIFICATION_TOKEN was not found in environment, ~/.orizon/credentials.json, or OS user store.',
    }));
    process.exit(1);
  }

  const endpoint = getArg('endpoint') || process.env.TASK_NOTIFICATION_URL || DEFAULT_ENDPOINT;
  const project = discoverProject(getArg('project'));
  const executor = discoverExecutor(getArg('executor'));
  const ref = discoverRef(getArg('ref'));
  const force = args.includes('--force');

  // Command: ecc-loaded
  if (command === 'ecc-loaded') {
    const task = 'ECC Orizon carregado';
    const status = 'COMPLETED';
    const result = 'Acabei de ler o ECC da ORIZON. A partir desta execução, ao final de cada etapa/fase material concluída, enviarei uma mensagem informando o que foi realizado.';

    const key = computeIdempotencyKey('ECC_LOADED', project, task, ref);
    if (!force) {
      const dup = checkIdempotency(key);
      if (dup) {
        console.log(JSON.stringify({
          ok: true,
          event: 'ECC_LOADED',
          idempotent: true,
          wamid: dup.wamid,
          project,
          executor,
          message: 'Idempotent handshake acknowledged (already sent within 24h).',
        }));
        process.exit(0);
      }
    }

    const res = await dispatchNotificationWithRetry({ project, task, status, executor, result, ref }, token, endpoint);
    const notifStatus = res.ok ? 'NOTIFICATION_SENT' : 'NOTIFICATION_FAILED';
    const wamid = res.data?.wamid ?? null;

    recordInLedger({
      id: crypto.randomUUID(),
      idempotencyKey: key,
      event: 'ECC_LOADED',
      project,
      task,
      status,
      executor,
      ref,
      notificationStatus: notifStatus,
      wamid,
      error: res.ok ? null : res.error,
      attempts: res.attempts,
      occurredAt: new Date().toISOString(),
    });

    if (res.ok) {
      console.log(JSON.stringify({
        ok: true,
        event: 'ECC_LOADED',
        notificationStatus: 'NOTIFICATION_SENT',
        wamid,
        project,
        executor,
      }));
      process.exit(0);
    } else {
      console.error(JSON.stringify({
        ok: false,
        event: 'ECC_LOADED',
        notificationStatus: 'NOTIFICATION_FAILED',
        error: res.error,
        data: res.data,
      }));
      process.exit(1);
    }
  }

  // Command: stage-completed
  if (command === 'stage-completed') {
    const stage = getArg('stage') || getArg('task');
    const rawResult = getArg('result');
    const nextStage = getArg('next-stage');
    const status = (getArg('status') || 'COMPLETED').toUpperCase();

    if (!stage) {
      console.error(JSON.stringify({ ok: false, error: 'MISSING_STAGE', message: '--stage <name> is required for stage-completed' }));
      process.exit(1);
    }
    if (!rawResult) {
      console.error(JSON.stringify({ ok: false, error: 'MISSING_RESULT', message: '--result <summary> is required for stage-completed' }));
      process.exit(1);
    }

    const taskTitle = `Etapa concluída: ${stage}`;
    const resultFormatted = nextStage
      ? `${rawResult} | Próximo passo: ${nextStage}`
      : rawResult;

    const key = computeIdempotencyKey('STAGE_COMPLETED', project, stage, ref);
    if (!force) {
      const dup = checkIdempotency(key);
      if (dup) {
        console.log(JSON.stringify({
          ok: true,
          event: 'STAGE_COMPLETED',
          workStatus: 'WORK_COMPLETED',
          notificationStatus: 'NOTIFICATION_SENT',
          idempotent: true,
          wamid: dup.wamid,
          project,
          stage,
          executor,
          message: 'Stage completion already notified (idempotent skipped).',
        }));
        process.exit(0);
      }
    }

    const res = await dispatchNotificationWithRetry({
      project,
      task: taskTitle,
      status,
      executor,
      result: resultFormatted,
      ref,
    }, token, endpoint);

    const notifStatus = res.ok ? 'NOTIFICATION_SENT' : 'NOTIFICATION_FAILED';
    const wamid = res.data?.wamid ?? null;

    recordInLedger({
      id: crypto.randomUUID(),
      idempotencyKey: key,
      event: 'STAGE_COMPLETED',
      project,
      stage,
      status,
      executor,
      result: resultFormatted,
      ref,
      notificationStatus: notifStatus,
      wamid,
      error: res.ok ? null : res.error,
      attempts: res.attempts,
      occurredAt: new Date().toISOString(),
    });

    console.log(JSON.stringify({
      ok: res.ok,
      event: 'STAGE_COMPLETED',
      workStatus: 'WORK_COMPLETED',
      notificationStatus: notifStatus,
      wamid,
      project,
      stage,
      status,
      executor,
      attempts: res.attempts,
      error: res.ok ? null : res.error,
    }));
    process.exit(res.ok ? 0 : 1);
  }

  // Command: phase-completed
  if (command === 'phase-completed') {
    const phase = getArg('phase') || getArg('task');
    const rawResult = getArg('result');
    const nextPhase = getArg('next-phase');
    const status = (getArg('status') || 'COMPLETED').toUpperCase();

    if (!phase) {
      console.error(JSON.stringify({ ok: false, error: 'MISSING_PHASE', message: '--phase <name> is required for phase-completed' }));
      process.exit(1);
    }
    if (!rawResult) {
      console.error(JSON.stringify({ ok: false, error: 'MISSING_RESULT', message: '--result <summary> is required for phase-completed' }));
      process.exit(1);
    }

    const taskTitle = `Fase concluída: ${phase}`;
    const resultFormatted = nextPhase
      ? `${rawResult} | Próximo passo: ${nextPhase}`
      : rawResult;

    const key = computeIdempotencyKey('PHASE_COMPLETED', project, phase, ref);
    if (!force) {
      const dup = checkIdempotency(key);
      if (dup) {
        console.log(JSON.stringify({
          ok: true,
          event: 'PHASE_COMPLETED',
          workStatus: 'WORK_COMPLETED',
          notificationStatus: 'NOTIFICATION_SENT',
          idempotent: true,
          wamid: dup.wamid,
          project,
          phase,
          executor,
          message: 'Phase completion already notified (idempotent skipped).',
        }));
        process.exit(0);
      }
    }

    const res = await dispatchNotificationWithRetry({
      project,
      task: taskTitle,
      status,
      executor,
      result: resultFormatted,
      ref,
    }, token, endpoint);

    const notifStatus = res.ok ? 'NOTIFICATION_SENT' : 'NOTIFICATION_FAILED';
    const wamid = res.data?.wamid ?? null;

    recordInLedger({
      id: crypto.randomUUID(),
      idempotencyKey: key,
      event: 'PHASE_COMPLETED',
      project,
      phase,
      status,
      executor,
      result: resultFormatted,
      ref,
      notificationStatus: notifStatus,
      wamid,
      error: res.ok ? null : res.error,
      attempts: res.attempts,
      occurredAt: new Date().toISOString(),
    });

    console.log(JSON.stringify({
      ok: res.ok,
      event: 'PHASE_COMPLETED',
      workStatus: 'WORK_COMPLETED',
      notificationStatus: notifStatus,
      wamid,
      project,
      phase,
      status,
      executor,
      attempts: res.attempts,
      error: res.ok ? null : res.error,
    }));
    process.exit(res.ok ? 0 : 1);
  }

  // Command: work-completed
  if (command === 'work-completed') {
    const task = getArg('task');
    const result = getArg('result');
    const status = (getArg('status') || 'COMPLETED').toUpperCase();

    if (!task) {
      console.error(JSON.stringify({ ok: false, error: 'MISSING_TASK', message: '--task <title> is required for work-completed' }));
      process.exit(1);
    }
    if (!result) {
      console.error(JSON.stringify({ ok: false, error: 'MISSING_RESULT', message: '--result <summary> is required for work-completed' }));
      process.exit(1);
    }

    const key = computeIdempotencyKey('WORK_UNIT_COMPLETED', project, task, ref);
    if (!force) {
      const dup = checkIdempotency(key);
      if (dup) {
        console.log(JSON.stringify({
          ok: true,
          event: 'WORK_UNIT_COMPLETED',
          workStatus: 'WORK_COMPLETED',
          notificationStatus: 'NOTIFICATION_SENT',
          idempotent: true,
          wamid: dup.wamid,
          project,
          task,
          executor,
          message: 'Work unit already notified (idempotent skipped).',
        }));
        process.exit(0);
      }
    }

    const res = await dispatchNotificationWithRetry({ project, task, status, executor, result, ref }, token, endpoint);
    const notifStatus = res.ok ? 'NOTIFICATION_SENT' : 'NOTIFICATION_FAILED';
    const wamid = res.data?.wamid ?? null;

    recordInLedger({
      id: crypto.randomUUID(),
      idempotencyKey: key,
      event: 'WORK_UNIT_COMPLETED',
      project,
      task,
      status,
      executor,
      result,
      ref,
      notificationStatus: notifStatus,
      wamid,
      error: res.ok ? null : res.error,
      attempts: res.attempts,
      occurredAt: new Date().toISOString(),
    });

    console.log(JSON.stringify({
      ok: res.ok,
      event: 'WORK_UNIT_COMPLETED',
      workStatus: 'WORK_COMPLETED',
      notificationStatus: notifStatus,
      wamid,
      project,
      task,
      status,
      executor,
      attempts: res.attempts,
      error: res.ok ? null : res.error,
    }));
    process.exit(res.ok ? 0 : 1);
  }

  console.error(JSON.stringify({ ok: false, error: 'UNKNOWN_COMMAND', message: `Unknown command "${command}". Use ecc-loaded, stage-completed, phase-completed, or work-completed.` }));
  process.exit(1);
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: 'UNHANDLED_EXCEPTION', message: err.message }));
  process.exit(1);
});
