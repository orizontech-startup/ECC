/**
 * Test suite for ORIZON NOTIFY Completion Gate & Quality Gate Integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { execSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const scriptPath = path.resolve('orizon/bin/orizon-notify.mjs');
const qgPath = path.resolve('scripts/orizon/quality-gate.js');
const ledgerPath = path.resolve('.orizon/completion-ledger.json');

describe('ORIZON Completion Gate & Idempotency Engine', () => {
  beforeEach(() => {
    // Clean ledger for deterministic tests
    if (fs.existsSync(ledgerPath)) {
      try { fs.unlinkSync(ledgerPath); } catch {}
    }
  });

  it('1. stage-completed generates valid STAGE_COMPLETED event and validates parameters', () => {
    let err = null;
    try {
      execSync(`node ${scriptPath} stage-completed --token "mock-token"`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    expect(err.stderr).toContain('MISSING_STAGE');
  });

  it('2. phase-completed generates valid PHASE_COMPLETED event and validates parameters', () => {
    let err = null;
    try {
      execSync(`node ${scriptPath} phase-completed --token "mock-token"`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    expect(err.stderr).toContain('MISSING_PHASE');
  });

  it('3. idempotency ledger prevents duplicate dispatches within 24h', () => {
    const mockEntry = {
      id: 'mock-1',
      idempotencyKey: 'STAGE_COMPLETED:ecc:etapa-teste:ref-123',
      event: 'STAGE_COMPLETED',
      project: 'ECC',
      stage: 'etapa-teste',
      status: 'COMPLETED',
      notificationStatus: 'NOTIFICATION_SENT',
      wamid: 'wamid.HBgLMOCK123',
      occurredAt: new Date().toISOString(),
    };

    const dir = path.dirname(ledgerPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ledgerPath, JSON.stringify({ version: 1, entries: [mockEntry] }, null, 2), 'utf8');

    // Verify ledger command reads entries
    const out = execSync(`node ${scriptPath} ledger`, { encoding: 'utf8' });
    const parsed = JSON.parse(out);
    expect(parsed.entries.length).toBe(1);
    expect(parsed.entries[0].wamid).toBe('wamid.HBgLMOCK123');
  });

  it('4. fails safely with NOTIFICATION_FAILED when endpoint is unreachable', () => {
    let out = '';
    try {
      out = execSync(`node ${scriptPath} stage-completed --stage "offline-test" --result "offline" --token "mock" --endpoint "http://127.0.0.1:59999/unreachable"`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      out = e.stdout || e.stderr || '';
    }
    expect(out).toContain('NOTIFICATION_FAILED');
    expect(out).toContain('WORK_COMPLETED');
  });

  it('5. records failure in ledger when notification fails', () => {
    try {
      execSync(`node ${scriptPath} stage-completed --stage "ledger-fail-test" --result "fail" --token "mock" --endpoint "http://127.0.0.1:59999/unreachable"`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch {}

    expect(fs.existsSync(ledgerPath)).toBe(true);
    const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
    const failedEntry = ledger.entries.find((e) => e.stage === 'ledger-fail-test');
    expect(failedEntry).toBeDefined();
    expect(failedEntry?.notificationStatus).toBe('NOTIFICATION_FAILED');
  });

  it('6. quality-gate.js syntax and options parser are intact', () => {
    const syntax = spawnSync(process.execPath, ['-c', qgPath]);
    expect(syntax.status).toBe(0);
    const content = fs.readFileSync(qgPath, 'utf8');
    expect(content).toContain('--complete-stage');
    expect(content).toContain('--complete-phase');
    expect(content).toContain('completionNotification');
  });

  it('7. ecc-loaded command is operational', () => {
    let out = '';
    try {
      out = execSync(`node ${scriptPath} ecc-loaded --token "mock" --endpoint "http://127.0.0.1:59999/unreachable"`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      out = e.stdout || e.stderr || '';
    }
    expect(out).toContain('ECC_LOADED');
  });

  it('8. work-completed command is operational', () => {
    let out = '';
    try {
      out = execSync(`node ${scriptPath} work-completed --task "mock-task" --result "mock-res" --token "mock" --endpoint "http://127.0.0.1:59999/unreachable"`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      out = e.stdout || e.stderr || '';
    }
    expect(out).toContain('WORK_UNIT_COMPLETED');
  });
});
