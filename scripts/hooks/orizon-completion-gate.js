#!/usr/bin/env node
/**
 * Orizon ECC Completion Gate Hook (Stop / SessionEnd)
 *
 * Intercepts agent completion signals upon stopping or closing a material work unit.
 * Automatically verifies and dispatches the universal Orizon WhatsApp notification
 * if the agent declared a stage, phase, or mission completed without running the gate.
 *
 * Invariant:
 * NO_FORMAL_STAGE_OR_PHASE_COMPLETION_WITHOUT_NOTIFICATION_GATE
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

function findNotifyRuntime() {
  const candidates = [
    path.join(__dirname, '../../orizon/bin/orizon-notify.mjs'),
    path.join(os.homedir(), '.orizon-ecc/bin/orizon-notify.mjs'),
    path.join(process.cwd(), 'orizon/bin/orizon-notify.mjs'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function detectCompletionIntent(text) {
  if (!text || typeof text !== 'string') return null;

  const lower = text.toLowerCase();

  // 1. Exclui atividades intermediárias ou não-materiais
  if (
    lower.includes('ecc orizon carregado') ||
    lower.includes('carregamento de ecc') ||
    lower.includes('acabei de ler o ecc') ||
    lower.includes('commit intermediário') ||
    lower.includes('commit intermediario') ||
    lower.includes('teste isolado') ||
    lower.includes('checkpoint intermediário')
  ) {
    return null;
  }

  // 2. Check for formal phase/stage completion markers
  const isStageCompleted = /\b(etapa\s+conclu[ií]da|stage[\s_-]completed|tarefa\s+conclu[ií]da)\b/i.test(text);
  const isPhaseCompleted = /\b(fase\s+conclu[ií]da|phase[\s_-]completed|miss[aã]o\s+conclu[ií]da|milestone\s+conclu[ií]d[oa]|homologa[çc][aã]o\s+conclu[ií]d[oa]|entrega\s+conclu[ií]d[oa])\b/i.test(text);

  if (!isStageCompleted && !isPhaseCompleted) return null;

  // Extract summary or title
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const firstMeaningful = lines.find((l) => /conclu|completed|status/i.test(l)) || lines[0] || 'Conclusão formal de trabalho';

  return {
    type: isPhaseCompleted ? 'phase-completed' : 'stage-completed',
    title: firstMeaningful.slice(0, 100).replace(/[#*`]/g, '').trim(),
    summary: text.slice(0, 500).replace(/[#*`\n]/g, ' ').trim(),
  };
}

function run(raw) {
  try {
    const input = raw.trim() ? JSON.parse(raw) : {};
    const message = input.last_assistant_message || '';
    const intent = detectCompletionIntent(message);

    if (intent) {
      const runtime = findNotifyRuntime();
      if (runtime) {
        const nameFlag = intent.type === 'phase-completed' ? '--phase' : '--stage';
        // Dispatches with built-in 24h idempotency check so it never duplicates
        spawnSync(process.execPath, [runtime, intent.type, nameFlag, intent.title, '--result', intent.summary], {
          cwd: process.cwd(),
          stdio: 'ignore',
          env: process.env,
          timeout: 10000,
        });
      }
    }
  } catch {}

  return raw;
}

module.exports = { run };

if (require.main === module) {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { data += chunk; });
  process.stdin.on('end', () => {
    const output = run(data);
    if (output) process.stdout.write(output);
  });
}
