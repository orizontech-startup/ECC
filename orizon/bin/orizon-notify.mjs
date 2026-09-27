#!/usr/bin/env node
/**
 * ORIZON NOTIFY — Canonical Notification Runtime for Orizon Engineering OS / ECC
 *
 * Provides the executable capability for all ECC-governed agents and automations:
 * - ecc-loaded: Immediate operational handshake upon loading/reloading ECC
 * - work-completed: Material work unit completion notification
 *
 * Resolves TASK_NOTIFICATION_TOKEN securely from environment, user credential store,
 * or OS environment without requiring manual copy-pasting or hard-coding secrets.
 * Centralized recipient management: agents emit events to the canonical service,
 * and Orizon notification infrastructure handles routing and delivery.
 *
 * Usage:
 *   node orizon-notify.mjs ecc-loaded [--project <name>] [--executor <name>] [--ref <ref>]
 *   node orizon-notify.mjs work-completed --task <title> --result <summary> [--project <name>] [--status <status>] [--ref <ref>]
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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

  // Try discovering from git remote
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 1500 }).trim();
    const match = remoteUrl.match(/[/\\]([^/\\]+?)(\.git)?$/);
    if (match && match[1]) {
      const cleanName = match[1].replace(/\.git$/, '').toUpperCase();
      // Map known repositories to friendly product names
      if (cleanName === 'ORIZONAGENTS') return 'ORIZON AGENTES';
      if (cleanName === 'ECC') return 'ECC';
      if (cleanName === 'ATLETA360') return 'ATLETA 360';
      return cleanName;
    }
  } catch {}

  // Try discovering from package.json
  try {
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (pkg.name) return String(pkg.name).toUpperCase();
    }
  } catch {}

  // Fallback to directory name
  const cwd = process.cwd();
  return path.basename(cwd).toUpperCase();
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

// 5. Send Event to Canonical Service
async function dispatchNotification(event, token, endpoint) {
  const payload = {
    project: event.project,
    task: event.task,
    status: event.status || 'COMPLETED',
    executor: event.executor,
    result: event.result,
    ref: event.ref,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Task-Notification-Token': token,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const err = new Error(`Notification failed with HTTP ${response.status}: ${JSON.stringify(data)}`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// CLI Parser
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    console.log(`
ORIZON NOTIFY — Canonical Notification Runtime (ECC)

Commands:
  ecc-loaded         Emit immediate operational handshake after loading ECC
  work-completed     Emit material completion notification after finishing a work unit

Options:
  --project <name>   Project name (auto-discovered from git/dir if omitted)
  --task <title>     Task or work unit title (required for work-completed)
  --status <status>  Status: COMPLETED | BLOCKED | FAILED (default: COMPLETED)
  --executor <name>  Agent or system name (auto-discovered if omitted)
  --result <summary> Outcome summary (required for work-completed)
  --ref <ref>        Traceability reference (commit, PR, deploy, etc.)
  --token <token>    Explicit token (otherwise resolved securely from environment/store)
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

  const explicitToken = getArg('token');
  const token = resolveToken(explicitToken);

  if (!token) {
    console.error(JSON.stringify({
      ok: false,
      error: 'TASK_NOTIFICATION_TOKEN_NOT_CONFIGURED',
      message: 'TASK_NOTIFICATION_TOKEN was not found in environment, ~/.orizon/credentials.json, or OS user store.',
    }));
    process.exit(1);
  }

  const endpoint = getArg('endpoint') || process.env.TASK_NOTIFICATION_URL || DEFAULT_ENDPOINT;
  const project = discoverProject(getArg('project'));
  const executor = discoverExecutor(getArg('executor'));
  const ref = discoverRef(getArg('ref'));

  if (command === 'ecc-loaded') {
    const task = 'ECC Orizon carregado';
    const status = 'COMPLETED';
    const result = 'Acabei de ler o ECC da ORIZON. A partir desta execução, ao final de cada etapa/fase material concluída, enviarei uma mensagem informando o que foi realizado.';

    try {
      const res = await dispatchNotification({ project, task, status, executor, result, ref }, token, endpoint);
      console.log(JSON.stringify({
        ok: true,
        event: 'ECC_LOADED',
        wamid: res.wamid,
        project,
        executor,
      }));
      process.exit(0);
    } catch (err) {
      console.error(JSON.stringify({
        ok: false,
        event: 'ECC_LOADED',
        error: err.message,
        data: err.data,
      }));
      process.exit(1);
    }
  }

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

    try {
      const res = await dispatchNotification({ project, task, status, executor, result, ref }, token, endpoint);
      console.log(JSON.stringify({
        ok: true,
        event: 'WORK_UNIT_COMPLETED',
        wamid: res.wamid,
        project,
        task,
        status,
        executor,
      }));
      process.exit(0);
    } catch (err) {
      console.error(JSON.stringify({
        ok: false,
        event: 'WORK_UNIT_COMPLETED',
        error: err.message,
        data: err.data,
      }));
      process.exit(1);
    }
  }

  console.error(JSON.stringify({ ok: false, error: 'UNKNOWN_COMMAND', message: `Unknown command "${command}". Use ecc-loaded or work-completed.` }));
  process.exit(1);
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: 'UNHANDLED_EXCEPTION', message: err.message }));
  process.exit(1);
});
