const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../');
const POLICY = 'orizon/policies/ORIZON-ECC-MANDATORY-SESSION-ENTRY.md';
const TEMPLATE = 'orizon/templates/ORIZON-ECC-PROJECT-ENTRYPOINT.md';

test('mandatory ECC session entry policy exists with required invariants', () => {
  const c = fs.readFileSync(path.join(ROOT, POLICY), 'utf8');
  for (const token of [
    'EVERY_ORIZON_SESSION_STARTS_WITH_ECC',
    'FETCH_LATEST_ECC_MAIN_BEFORE_MATERIAL_WORK',
    'READ_ORIZON_START_HERE',
    'PROJECT ENTRYPOINT REQUIREMENT',
    'NO MATERIAL WORK WITHOUT ECC ENTRY',
    'EVERY AGENT. EVERY PROJECT. EVERY MATERIAL SESSION.'
  ]) assert.ok(c.includes(token), 'missing: ' + token);
});

test('canonical agent entry surfaces force ECC session entry', () => {
  for (const rel of ['ORIZON-START-HERE.md', 'AGENTS.md', 'CLAUDE.md', 'skills/orizon-project-bootstrap/SKILL.md']) {
    const c = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.ok(c.includes('ORIZON-ECC-MANDATORY-SESSION-ENTRY.md'), rel + ' must reference mandatory ECC entry policy');
  }
});

test('universal policy and project entry template reference the session entry contract', () => {
  const universal = fs.readFileSync(path.join(ROOT, 'orizon/policies/ORIZON-ENGINEERING-OS-UNIVERSAL.md'), 'utf8');
  assert.ok(universal.includes('MANDATORY ECC SESSION ENTRY'));
  const template = fs.readFileSync(path.join(ROOT, TEMPLATE), 'utf8');
  assert.ok(template.includes('orizontech-startup/ECC'));
  assert.ok(template.includes('ORIZON-ECC-MANDATORY-SESSION-ENTRY.md'));
});
