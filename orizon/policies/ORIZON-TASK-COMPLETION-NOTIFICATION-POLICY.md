# ORIZON TASK COMPLETION & ECC HANDSHAKE NOTIFICATION POLICY

**Version:** 2.0.0  
**Owner:** Orizon Tech  
**Canonical repository:** `orizontech-startup/ECC`  
**Canonical file:** `orizon/policies/ORIZON-TASK-COMPLETION-NOTIFICATION-POLICY.md`

## Purpose

This policy establishes the universal operational handshake and task completion notification standard across the entire Orizon Tech ecosystem.

Every agent (Opus 5 Code, ChatGPT/GPT, Codex, internal agents, CI/CD pipelines, or autonomous systems) governed by the Orizon Engineering OS / ECC, in any current or future repository, and across any material engineering or operational front, must emit notifications through the canonical Orizon notification service for two mandatory lifecycle events:

1. **`ECC_LOADED`**: Immediate handshake upon loading or reloading the canonical ECC.
2. **`WORK_UNIT_COMPLETED`**: Notification upon genuine completion of a material work unit.

---

## 1. MANDATORY INVARIANTS

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

## 3. EVENT 2 — `WORK_UNIT_COMPLETED` (MATERIAL COMPLETION)

Every agent must emit a `WORK_UNIT_COMPLETED` notification whenever a **material unit of work** is genuinely finished.

### What Counts as a Material Work Unit
A material work unit includes:
- A completed user-assigned task or defect fix;
- A completed phase or milestone of an active roadmap;
- A completed architecture, infrastructure, or database migration;
- A verified production release or deployment;
- An end-to-end verified subsystem delivery.

### Strict Anti-Spam Rule (`NO_MICRO_ACTION_SPAM`)
Notifications must **never** be dispatched for micro-actions or routine intermediate operations:
- Shell command executions (`git status`, `ls`, `curl`, `tsc`);
- Single file reads or routine edits;
- Individual test runs during development loops;
- Diagnostic tool calls;
- Partial, unfinished implementations;
- Intermediate progress reporting.

### Payload Semantics for `WORK_UNIT_COMPLETED`
- **`project`**: Current project name.
- **`task`**: Title of the completed material work unit.
- **`status`**: `"COMPLETED"` (or terminal `"BLOCKED"` / `"FAILED"`).
- **`executor`**: Name of the agent.
- **`result`**: Factual summary of the outcome and verified evidence.
- **`ref`** (optional): Commit SHA, PR number, deployment version ID, or evidence reference.

---

## 4. CANONICAL NOTIFICATION SERVICE & ROUTING

All events must be dispatched via HTTP POST to the centralized service:

- **Service Endpoint:** `POST https://api.useorizon.com/internal/task-notifications`
- **Headers:** `Content-Type: application/json; charset=utf-8`
- **Authentication:** `X-Task-Notification-Token: <TASK_NOTIFICATION_TOKEN>` or `Authorization: Bearer <TASK_NOTIFICATION_TOKEN>`

### Zero Secrets in Repositories
Authentication credentials (`TASK_NOTIFICATION_TOKEN`) must come exclusively from secure environment variables or secret vaults. They must never be committed to Git, hard-coded in markdown files, or printed to terminal stdout/stderr.

### Centralized Routing Invariant (No Hard-Coded Numbers in ECC)
Client projects and agents do not manage recipient phone numbers. The agent sends the event to the centralized Orizon notification service, which handles fan-out, contact lists, and delivery channels. No personal phone numbers or contact details may be recorded in the ECC or project documentation.

---

## 5. COMPLETION SEMANTICS & EXECUTION LIFECYCLE

A material completion notification must **never** be dispatched prematurely.

The universal delivery sequence is:

```text
EXECUTE
  -> VERIFY
  -> FIX / RETEST
  -> SATISFY EXIT CRITERIA
  -> CAPTURE EVIDENCE
  -> EMIT WORK_UNIT_COMPLETED NOTIFICATION
  -> RECORD NOTIFICATION RESULT
  -> CLOSE
```

Emitting the notification is an automated final step of work unit closure. It must not introduce an artificial pause, checkpoint, or confirmation request to the user.

---

## 6. INDEPENDENCE OF TASK STATUS AND NOTIFICATION DELIVERY

The validity of engineering work is decoupled from third-party notification transport:

1. **Task Integrity:** If all acceptance criteria are met and verified, the work unit is `COMPLETED`, regardless of transient transport issues.
2. **Failure Handling:** If the notification endpoint returns an error, times out, or fails:
   - The work unit status remains `COMPLETED`.
   - The agent must record the notification attempt outcome in its final summary.
   - The agent may retry the notification once if safe and non-blocking.
   - The agent must never roll back or invalidate completed, verified engineering deliverables due to a notification transport failure.
   - The agent must never claim successful notification delivery without positive confirmation from the service.

---

## 7. CURRENT BOUNDARIES (OUTBOUND NOTIFICATION SCOPE)

This policy governs **outbound lifecycle notifications** (`ECC_LOADED` and `WORK_UNIT_COMPLETED`).

The following extended capabilities are reserved for future phases and must not be assumed active under this standard:
- Inbound bidirectional command execution via messaging;
- Interactive execution continuation via messaging replies;
- Audio voice note transcription or synthesis for task control;
- Command Bus routing between chat apps and local daemons.

---

## 8. UNIVERSAL APPLICATION

This policy is binding upon:
- Every current Orizon Tech repository and project upon reloading ECC;
- Every future Orizon Tech repository and project upon creation;
- Every AI coding agent (Opus 5 Code, ChatGPT/GPT, Codex, etc.), subagent, and automated pipeline operating under the ECC.
