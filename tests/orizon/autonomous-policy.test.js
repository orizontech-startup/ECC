const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../../');

test('ORIZON CONTINUOUS AUTONOMOUS EXECUTION POLICY exists and has mandatory invariants', () => {
  const policyPath = path.join(ROOT, 'orizon/policies/ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md');
  assert.ok(fs.existsSync(policyPath), 'Policy file must exist');
  const content = fs.readFileSync(policyPath, 'utf8');

  assert.ok(content.includes('CORE OPERATING PRINCIPLE'), 'Must state core operating principle');
  assert.ok(content.includes('PROHIBITED ARTIFICIAL PAUSES'), 'Must state prohibited artificial pauses');
  assert.ok(content.includes('AUTONOMOUS RECOVERY STANDARD'), 'Must state recovery standard');
  assert.ok(content.includes('PERMITTED HUMAN BLOCKERS'), 'Must state permitted human blockers');
  assert.ok(content.includes('BLOCKER REAL'), 'Must format real blockers explicitly');
  assert.ok(content.includes('Authorization Persistence'), 'Must establish Authorization Persistence');
  assert.ok(content.includes('Mission Completion Bias'), 'Must establish Mission Completion Bias');
  assert.ok(content.includes('Verify Instead of Ask'), 'Must establish Verify Instead of Ask');
  assert.ok(content.includes('Fix Instead of Report'), 'Must establish Fix Instead of Report');
  assert.ok(content.includes('No Artificial Checkpoints'), 'Must establish No Artificial Checkpoints');
});

test('ORIZON-START-HERE.md references the autonomous execution policy', () => {
  const startPath = path.join(ROOT, 'ORIZON-START-HERE.md');
  const content = fs.readFileSync(startPath, 'utf8');
  assert.ok(
    content.includes('orizon/policies/ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md'),
    'ORIZON-START-HERE.md must reference the policy'
  );
});

test('orizon-engineering-profile and orizon-engineering-os reference the autonomous execution policy', () => {
  const profilePath = path.join(ROOT, 'skills/orizon-engineering-profile/SKILL.md');
  const profileContent = fs.readFileSync(profilePath, 'utf8');
  assert.ok(
    profileContent.includes('ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md'),
    'orizon-engineering-profile must reference the policy'
  );

  const osPath = path.join(ROOT, 'skills/orizon-engineering-os/SKILL.md');
  const osContent = fs.readFileSync(osPath, 'utf8');
  assert.ok(
    osContent.includes('ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md'),
    'orizon-engineering-os must reference the policy'
  );
});
