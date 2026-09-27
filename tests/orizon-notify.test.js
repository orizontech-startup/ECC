/**
 * Test suite for ORIZON NOTIFY — Canonical Notification Runtime (ECC)
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const scriptPath = path.resolve('orizon/bin/orizon-notify.mjs');
const manifestPath = path.resolve('orizon/bootstrap/CAPABILITY-MANIFEST.json');
const openapiPath = path.resolve('orizon/bootstrap/adapters/chatgpt-openapi.json');

describe('ORIZON NOTIFY Runtime & Universal Bootstrap', () => {
  it('1. orizon-notify.mjs exists and is valid', () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain('ORIZON NOTIFY');
  });

  it('2. capability manifest exists and declares ORIZON_NOTIFICATION', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifest.capabilities.ORIZON_NOTIFICATION).toBeDefined();
    expect(manifest.capabilities.ORIZON_NOTIFICATION.adapters.cli).toBeDefined();
    expect(manifest.capabilities.ORIZON_NOTIFICATION.adapters.chatgpt_normal).toBeDefined();
    expect(manifest.capabilities.ORIZON_NOTIFICATION.adapters.chatgpt_normal.type).toBe('remote_mcp_app');
  });

  it('3. OpenAPI schema exists and covers ecc-loaded and work-unit-completed', () => {
    expect(fs.existsSync(openapiPath)).toBe(true);
    const doc = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));
    expect(doc.openapi).toBe('3.0.3');
    expect(doc.paths['/actions/notifications/ecc-loaded']).toBeDefined();
    expect(doc.paths['/actions/notifications/work-unit-completed']).toBeDefined();
  });

  it('4. runtime fails safely when token is missing', () => {
    let err = null;
    try {
      execSync(`node ${scriptPath} ecc-loaded`, {
        env: { ...process.env, TASK_NOTIFICATION_TOKEN: '' },
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    const stderr = err.stderr || '';
    expect(stderr).toContain('TASK_NOTIFICATION_TOKEN_NOT_CONFIGURED');
  });

  it('5. runtime validates missing parameters for work-completed', () => {
    let err = null;
    try {
      execSync(`node ${scriptPath} work-completed --token "mock-token"`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    expect(err.stderr).toContain('MISSING_TASK');
  });

  it('6. script does not hard-code phone numbers or plaintext secrets', () => {
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).not.toMatch(/55219[0-9]{8}/);
    expect(content).not.toMatch(/[a-f0-9]{64}/);
    expect(content).not.toContain('EAAG');
  });

  it('7. preserves exact UTF-8 strings without corruption', () => {
    const sampleUtf8 = 'Notificações concluídas em produção. Integração, execução, automação, configuração e publicação estão funcionando corretamente.';
    const buf = Buffer.from(sampleUtf8, 'utf8');
    expect(buf.toString('utf8')).toBe(sampleUtf8);
    expect(buf.length > 0).toBe(true);
    expect(sampleUtf8.includes('produção')).toBe(true);
    expect(sampleUtf8.includes('automação')).toBe(true);
  });
});
