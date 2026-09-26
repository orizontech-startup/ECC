const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../');
const POLICY = 'orizon/policies/ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md';

test('ECC supremacy policy exists and declares mandatory precedence', () => {
  const p = path.join(ROOT, POLICY);
  assert.ok(fs.existsSync(p), 'ECC supremacy policy must exist');
  const c = fs.readFileSync(p, 'utf8');
  assert.ok(c.includes('ECC IS THE CURRENT CANONICAL GOVERNANCE AUTHORITY'));
  assert.ok(c.includes('ECC_PRECEDENCE_OVER_LEGACY_GOVERNANCE'));
  assert.ok(c.includes('LEGACY_GOVERNANCE_IS_NON_BLOCKING_BY_DEFAULT'));
  assert.ok(c.includes('LEGACY HOOKS AND GUARDS'));
  assert.ok(c.includes('THE ECC WINS'));
});

test('canonical ECC entry points reference supremacy policy', () => {
  for (const rel of [
    'ORIZON-START-HERE.md',
    'orizon/policies/ORIZON-ENGINEERING-OS-UNIVERSAL.md',
    'skills/orizon-engineering-profile/SKILL.md',
    'skills/orizon-engineering-os/SKILL.md'
  ]) {
    const c = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert.ok(c.includes('ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md'), rel + ' must reference supremacy policy');
  }
});

test('continuous execution project override language cannot reactivate legacy governance', () => {
  const c = fs.readFileSync(path.join(ROOT, 'orizon/policies/ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md'), 'utf8');
  assert.ok(c.includes('legacy governance'));
  assert.ok(c.includes('ECC supremacy'));
});
