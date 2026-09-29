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

/**
 * Mapeia diretórios e slugs para os nomes comerciais oficiais de projetos.
 */
function normalizeProjectName(rawProject, cwd) {
  const text = `${rawProject || ''} ${cwd || ''}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

  if (text.includes('orizon-control') || text.includes('orizoncontrol') || text.includes('orizon control') || text.includes('orizon-engineering') || text.includes('orizon engineering')) return 'Orizon Control';
  if (text.includes('atleta360') || text.includes('atleta-360') || text.includes('atleta 360')) return 'Atleta 360';
  if (text.includes('crmfolegodevida') || text.includes('folego de vida') || text.includes('folegodevida') || text.includes('folego-de-vida')) return 'Fôlego de Vida';
  if (text.includes('connectbr') || text.includes('connect-br') || text.includes('connect br') || text.includes('connectmar') || text.includes('connect-mar') || text.includes('connect mar')) return 'ConnectBR';
  if (text.includes('orizon-strategy') || text.includes('orizon strategy')) return 'Orizon Strategy';
  if (text.includes('orizon-station') || text.includes('orizon station')) return 'Orizon Station';
  if (text.includes('orizon-caio') || text.includes('orizon caio')) return 'Orizon CAIO';
  if (text.includes('orizon-ai-platform') || text.includes('ai platform') || text.includes('ai-platform')) return 'Orizon AI Platform';
  if (text.includes('orizon-central-office') || text.includes('central office') || text.includes('central-office')) return 'Orizon Central Office';
  if (text.includes('goyta')) return 'Goyta';
  if (text.includes('two') || text.includes('vempratwo')) return 'Two Telecom';
  if (text.includes('balaguer')) return 'Balaguer Imóveis';
  if (text.includes('ecc') || text.includes('orizon-ecc') || text.includes('engineering os')) return 'Orizon Engineering OS';
  if (text.includes('orizonagents') || text.includes('orizon-agents') || text.includes('orizon agentes') || text.includes('orizon tech') || text.includes('orizon-tech')) return 'Orizon Agentes';

  return 'Orizon Agentes';
}

/**
 * Registra auditoria persistente de toda avaliação do gate (zero falha silenciosa).
 */
function recordGateAudit(entry) {
  try {
    const auditDir = path.join(os.homedir(), '.orizon');
    if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });
    const auditFile = path.join(auditDir, 'completion-gate-audit.jsonl');
    fs.appendFileSync(auditFile, JSON.stringify(entry) + '\n', 'utf8');
  } catch {}
}

/**
 * Extrai o texto da última resposta substantiva do assistente diretamente do transcript da sessão.
 * Prioriza mensagens com stop_reason === 'end_turn' e ignora blocos de preflight/gate transitórios.
 */
function getLastAssistantMessageFromTranscript(transcriptPath) {
  if (!transcriptPath || typeof transcriptPath !== 'string') return '';
  // Normaliza caminhos com barras no Windows
  const cleanPath = transcriptPath.replace(/\\/g, '/');
  if (!fs.existsSync(cleanPath)) return '';

  try {
    const lines = fs.readFileSync(cleanPath, 'utf8').trim().split('\n');

    // 1. Primeira passagem: Procura de trás para frente a última mensagem real com end_turn
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const entry = JSON.parse(lines[i]);
        if (entry.type === 'assistant' && entry.message && entry.message.stop_reason === 'end_turn') {
          const textBlocks = (entry.message.content || [])
            .filter((c) => c && c.type === 'text' && typeof c.text === 'string')
            .map((c) => c.text.trim())
            .filter((t) => t.length > 0 && !t.startsWith('**Fact-Forcing Gate:**'));
          if (textBlocks.length > 0) {
            return textBlocks.join('\n\n');
          }
        }
      } catch {}
    }

    // 2. Segunda passagem (fallback): Mensagem substantiva mais recente descartando preflights
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const entry = JSON.parse(lines[i]);
        if (entry.type === 'assistant' && entry.message && Array.isArray(entry.message.content)) {
          const textBlocks = entry.message.content
            .filter((c) => c && c.type === 'text' && typeof c.text === 'string')
            .map((c) => c.text.trim())
            .filter((t) => t.length > 50 && !t.startsWith('**Fact-Forcing Gate:**'));
          if (textBlocks.length > 0) {
            return textBlocks.join('\n\n');
          }
        }
      } catch {}
    }
  } catch {}
  return '';
}

/**
 * Detecta intenção formal de conclusão material real.
 */
function detectCompletionIntent(text) {
  if (!text || typeof text !== 'string') return null;

  const lower = text.toLowerCase();

  // 1. Exclui estritamente atividades intermediárias ou não-materiais
  if (
    lower.includes('ecc orizon carregado') ||
    lower.includes('carregamento de ecc') ||
    lower.includes('acabei de ler o ecc') ||
    lower.includes('carregar ecc') ||
    lower.includes('reler ecc') ||
    lower.includes('commit intermediário') ||
    lower.includes('commit intermediario') ||
    lower.includes('teste isolado') ||
    lower.includes('typecheck isolado') ||
    lower.includes('checkpoint intermediário') ||
    lower.includes('salvo progresso')
  ) {
    return null;
  }

  // 2. Marcadores positivos de conclusão material (expressos)
  const isStageCompleted =
    /\b(etapa\s+conclu[ií]da|stage[\s_-]completed|tarefa\s+conclu[ií]da|conclus[aã]o\s+da\s+etapa|etapa\s+finalizada)\b/i.test(text);

  const isPhaseCompleted =
    /\b(fase\s+conclu[ií]da|phase[\s_-]completed|miss[aã]o\s+conclu[ií]da|conclus[aã]o\s+da\s+fase|conclus[aã]o\s+da\s+miss[aã]o|fase\s+finalizada|miss[aã]o\s+finalizada|milestone\s+(atingido|conclu[ií]d[oa])|homologa[çc][aã]o\s+(conclu[ií]da|aprovada)|entrega\s+(conclu[ií]da|finalizada)|deploy\s+(realizado|conclu[ií]do)|closed_pass)\b/i.test(text);

  // 3. Marcadores de engenharia substantiva (ex: PR de hardening, 100% pass no CI, lista de checks aprovados)
  const has100Pass = /\b(100%\s+pass|100%\s+verdes?|all\s+checks?\s+pass(ing)?|100%\s+aprovad[oa]s?)\b/i.test(text);
  const hasPhaseOrPR = /\b(fase\s+\d+|phase\s+\d+|hardening\s+da\s+fase|pr\s+#\d+|release\s+f\d+|m[oó]dulo\s+de)\b/i.test(text);
  const checksCount = (text.match(/`[^`]+`:\s*\*\*PASS\*\*/gi) || text.match(/\bPASS\b/g) || []).length;
  const isEngineeringCompletion = (has100Pass && hasPhaseOrPR) || (checksCount >= 3 && hasPhaseOrPR);

  if (!isStageCompleted && !isPhaseCompleted && !isEngineeringCompletion) return null;

  // Extrai título e linhas principais da conclusão
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const firstMeaningful = lines.find((l) => /pr\s+#\d+|conclu|finaliz|hardening|status|entrega|homologa|closed_pass/i.test(l)) || lines[0] || 'Conclusão formal de trabalho';

  // Extrai bullets da mensagem para resumir o resultado
  const bullets = lines
    .filter((l) => /^[\s-•*]+\s*/.test(l) || /^[0-9]+\./.test(l))
    .map((l) => l.replace(/^[\s-•*0-9.]+\s*/, '').trim())
    .filter((l) => l.length > 10)
    .slice(0, 4);

  const summaryText = bullets.length > 0
    ? bullets.join('; ')
    : text.slice(0, 400).replace(/[#*`\n]/g, ' ').trim();

  const resolvedType = (isPhaseCompleted || isEngineeringCompletion) ? 'phase-completed' : 'stage-completed';

  return {
    type: resolvedType,
    title: firstMeaningful.slice(0, 100).replace(/[#*`:]/g, '').trim(),
    summary: summaryText.slice(0, 500),
  };
}

function run(raw) {
  const now = new Date().toISOString();
  let input = {};
  try {
    input = raw.trim() ? JSON.parse(raw) : {};
  } catch {}

  const sessionId = input.session_id || 'unknown';
  const cwd = input.cwd || process.cwd();
  const projectName = normalizeProjectName(input.project_id || input.repository, cwd);

  try {
    let message = input.last_assistant_message || '';

    // Se a mensagem não veio pronta no payload, lê do transcript path da sessão
    if (!message && input.transcript_path) {
      message = getLastAssistantMessageFromTranscript(input.transcript_path);
    }

    const intent = detectCompletionIntent(message);

    if (intent) {
      recordGateAudit({
        timestamp: now,
        sessionId,
        project: projectName,
        status: 'COMPLETION_GATE_EVALUATED',
        intent: intent.type,
        isMaterial: true,
        title: intent.title,
        summarySnippet: intent.summary.slice(0, 150),
      });

      const runtime = findNotifyRuntime();
      if (runtime) {
        const nameFlag = intent.type === 'phase-completed' ? '--phase' : '--stage';
        const projectFlag = ['--project', projectName];

        // Dispara o runtime oficial com garantia de idempotência em 24h
        spawnSync(process.execPath, [runtime, intent.type, nameFlag, intent.title, '--result', intent.summary, ...projectFlag], {
          cwd,
          stdio: 'ignore',
          env: process.env,
          timeout: 10000,
        });
      }
    } else {
      // Registra avaliação de turno sem conclusão material (auditoria permanente de zero falha silenciosa)
      recordGateAudit({
        timestamp: now,
        sessionId,
        project: projectName,
        status: 'COMPLETION_GATE_EVALUATED',
        intent: null,
        isMaterial: false,
        reason: 'no_material_completion_marker_or_intermediate',
        snippet: message ? message.slice(0, 120).replace(/[\r\n]/g, ' ') : 'no_assistant_text',
      });
    }
  } catch (err) {
    recordGateAudit({
      timestamp: now,
      sessionId,
      project: projectName,
      status: 'GATE_EXECUTION_ERROR',
      error: err.message,
    });
  }

  return raw;
}

module.exports = { run, detectCompletionIntent, getLastAssistantMessageFromTranscript, normalizeProjectName };

if (require.main === module) {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { data += chunk; });
  process.stdin.on('end', () => {
    const output = run(data);
    if (output) process.stdout.write(output);
  });
}
