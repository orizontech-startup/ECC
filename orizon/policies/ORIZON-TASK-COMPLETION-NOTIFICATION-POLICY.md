# ORIZON TASK COMPLETION & ECC HANDSHAKE NOTIFICATION POLICY

**Version:** 2.1.0  
**Owner:** Orizon Tech  
**Canonical repository:** `orizontech-startup/ECC`  
**Canonical file:** `orizon/policies/ORIZON-TASK-COMPLETION-NOTIFICATION-POLICY.md`

## Purpose

This policy establishes the universal operational handshake and task completion notification standard across the entire Orizon Tech ecosystem.

Every agent (Opus 5 Code, ChatGPT/GPT, Codex, internal agents, CI/CD pipelines, or autonomous systems) governed by the Orizon Engineering OS / ECC, in any current or future repository, and across any material engineering or operational front, must emit notifications through the canonical Orizon notification service for mandatory lifecycle events:

1. **`ECC_LOADED`**: Immediate handshake upon loading or reloading the canonical ECC.
2. **`STAGE_COMPLETED`**: Completion of a defined engineering or operational stage.
3. **`PHASE_COMPLETED`**: Completion of a major roadmap phase or strategic milestone.
4. **`WORK_UNIT_COMPLETED`**: General material work unit delivery.

---

## 1. MANDATORY INVARIANTS

- `NO_FORMAL_STAGE_OR_PHASE_COMPLETION_WITHOUT_NOTIFICATION_GATE`
- `ECC_LOADED_EMITTED_IMMEDIATELY_AFTER_BOOTSTRAP`
- `EVERY_COMPLETED_ORIZON_WORK_UNIT_EMITS_NOTIFICATION`
- `ECC_HANDSHAKE_DOES_NOT_RESET_ACTIVE_MISSION`
- `NO_MICRO_ACTION_SPAM`
- `NOTIFY_ONLY_AFTER_REAL_MATERIAL_COMPLETION`
- `PROJECT_AGENT_TASK_AND_RESULT_MUST_BE_IDENTIFIABLE`
- `USE_CANONICAL_ORIZON_NOTIFICATION_SERVICE`
- `NOTIFICATION_FAILURE_DOES_NOT_REVERSE_REAL_WORK`
- `NOTIFICATION_FAILURE_MUST_BE_RECORDED_AND_RETRIED_WHEN_SAFE`
- `NEVER_EXPOSE_NOTIFICATION_OR_META_SECRETS`
- `DO_NOT_DUPLICATE_THE_SAME_COMPLETION_EVENT`

---

## 2. EVENT 1 — `ECC_LOADED` (OPERATIONAL HANDSHAKE)

Whenever an agent loads, reloads, or initializes the canonical Orizon ECC, it must **immediately** emit an `ECC_LOADED` handshake event via the canonical notification service.

### Objective
The owner must know immediately that the agent:
1. Located and read the canonical ECC;
2. Recognized corporate engineering governance and universal policies;
3. Identified the active project and repository;
4. Identified its own executor identity;
5. Acknowledges the obligation to notify subsequent material completions.

### Timing
`ECC_LOADED` must fire **immediately** upon successful ECC load/reload. It must NOT wait for task completion.

### Active Mission Invariant
Emitting `ECC_LOADED` must **never** reset the active mission, discard working state, forget the current phase, or create an artificial confirmation checkpoint. The agent emits the handshake and immediately proceeds with execution.

### Payload Semantics for `ECC_LOADED`
- **`project`**: Current project name (e.g. `"ORIZON CONTROL"`, `"CONNECTMAR"`, `"ORIZON AGENTES"`, `"ATLETA 360"`, `"BALAGUER"`).
- **`task`**: `"ECC Orizon carregado"`.
- **`status`**: `"COMPLETED"`.
- **`executor`**: Name of the agent (e.g. `"Opus 5 Code"`, `"ChatGPT"`, `"Codex"`).
- **`result`**: `"Acabei de ler o ECC da ORIZON. A partir desta execução, ao final de cada etapa/fase material concluída, enviarei uma mensagem informando o que foi realizado."`
- **`ref`** (optional): Current ECC commit ref or local HEAD SHA.

---

## 3. EVENTS 2 & 3 — `STAGE_COMPLETED` & `PHASE_COMPLETED` (COMPLETION GATE)

**Universal Governance Rule:**
> *Uma etapa ou fase governada pelo ECC não pode atingir estado formal COMPLETED sem que o evento obrigatório de conclusão tenha sido emitido para o mecanismo universal de notificações.*

### Execution Flow
When an engineering stage or project phase is completed, the agent must invoke the canonical completion runtime:

```bash
# For Stage Completion:
node ~/.orizon-ecc/bin/orizon-notify.mjs stage-completed --stage "<STAGE_NAME>" --result "<SUMMARY>" [--next-stage "<NEXT_STAGE>"]

# For Phase Completion:
node ~/.orizon-ecc/bin/orizon-notify.mjs phase-completed --phase "<PHASE_NAME>" --result "<SUMMARY>" [--next-phase "<NEXT_PHASE>"]
```

### Standard Message Content
The notification dispatched to WhatsApp formats concisely:
```text
ORIZON TECH | Projeto: [PROJETO] | Etapa/Fase: [NOME] | Status: CONCLUÍDA | Executor: [AGENTE] | [RESUMO] | Próximo passo: [PRÓXIMA ETAPA, se conhecida]
```

---

## 4. STRICT ANTI-SPAM RULE (`NO_MICRO_ACTION_SPAM`)

Notifications must **never** be dispatched for micro-actions or routine intermediate operations:
- Shell command executions (`git status`, `ls`, `curl`, `tsc`);
- Single file reads or routine edits;
- Individual test runs during development loops;
- Diagnostic tool calls;
- Partial, unfinished implementations;
- Intermediate progress reporting.

Only **material work units** (a fully finished stage, milestone, phase, or production delivery) qualify for completion dispatch.

---

## 5. RESILIENCE, IDEMPOTENCY & COMPLETION LEDGER

### Idempotency (Deduplication)
The runtime maintains a local completion ledger at `.orizon/completion-ledger.json` (gitignored). Before dispatching, it computes an idempotency key based on `${eventType}:${project}:${name}:${refOrDate}`. If the identical completion event was already notified successfully within 24 hours, the transport call is skipped (`IDEMPOTENT_SKIPPED`) preventing redundant WhatsApp messages.

### Decoupled State Handling
- **`WORK_COMPLETED`**: Technical engineering work is fully verified, tested, and complete.
- **`NOTIFICATION_SENT`**: Universal notification was accepted and dispatched to WhatsApp.
- **`NOTIFICATION_FAILED`**: Transient transport failure occurred. The runtime retries up to 3 times with exponential backoff. If delivery fails permanently, the technical deliverable remains `WORK_COMPLETED`, the failure is explicitly recorded in the ledger, and the failure is highlighted in the final gate report without rolling back valid work.

---

## 6. CANONICAL NOTIFICATION SERVICE & ROUTING

All events must be dispatched via HTTP POST to the centralized service:

- **Service Endpoint:** `POST https://api.useorizon.com/internal/task-notifications`
- **Headers:** `Content-Type: application/json; charset=utf-8`
- **Authentication:** `X-Task-Notification-Token: <TASK_NOTIFICATION_TOKEN>` or `Authorization: Bearer <TASK_NOTIFICATION_TOKEN>`

### Zero Secrets in Repositories
Authentication credentials (`TASK_NOTIFICATION_TOKEN`) must come exclusively from secure environment variables or secret vaults. They must never be committed to Git, hard-coded in markdown files, or printed to terminal stdout/stderr.

### Centralized Routing Invariant (No Hard-Coded Numbers in ECC)
Client projects and agents do not manage recipient phone numbers. The agent sends the event to the centralized Orizon notification service, which handles fan-out, contact lists, and delivery channels. No personal phone numbers or contact details may be recorded in the ECC or project documentation.

---

## 7. UNIVERSAL APPLICATION

This policy is binding upon:
- Every current Orizon Tech repository and project upon reloading ECC;
- Every future Orizon Tech repository and project upon creation;
- Every AI coding agent (Opus 5 Code, ChatGPT/GPT, Codex, etc.), subagent, and automated pipeline operating under the ECC.
