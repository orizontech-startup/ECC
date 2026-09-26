# ORIZON TASK COMPLETION NOTIFICATION POLICY

**Version:** 1.0.0  
**Owner:** Orizon Tech  
**Canonical repository:** `orizontech-startup/ECC`  
**Canonical file:** `orizon/policies/ORIZON-TASK-COMPLETION-NOTIFICATION-POLICY.md`

## Purpose

This policy establishes the universal requirement for automated task completion notifications across the entire Orizon Tech ecosystem.

Every agent (Opus 5 Code, ChatGPT/GPT, Codex, internal agents, CI/CD pipelines, or autonomous systems) governed by the Orizon Engineering OS / ECC, in any current or future repository, must emit a formal task completion notification through the canonical Orizon notification service whenever a material engineering mission reaches genuine completion.

---

## 1. MANDATORY INVARIANTS

- `EVERY_COMPLETED_ORIZON_TASK_EMITS_COMPLETION_NOTIFICATION`
- `NOTIFY_ONLY_AFTER_REAL_COMPLETION`
- `PROJECT_AGENT_TASK_AND_RESULT_MUST_BE_IDENTIFIABLE`
- `USE_CANONICAL_ORIZON_NOTIFICATION_SERVICE`
- `NOTIFICATION_FAILURE_DOES_NOT_REVERSE_REAL_TASK_COMPLETION`
- `NOTIFICATION_FAILURE_MUST_BE_RECORDED_AND_RETRIED_WHEN_SAFE`
- `NEVER_EXPOSE_NOTIFICATION_OR_META_SECRETS`
- `DO_NOT_DUPLICATE_THE_SAME_COMPLETION_EVENT`

---

## 2. CANONICAL NOTIFICATION SERVICE

All completion events must be dispatched to the centralized Orizon notification endpoint:

- **Service URL:** `POST https://api.useorizon.com/internal/task-notifications`
- **Headers:** `Content-Type: application/json; charset=utf-8`
- **Authentication:** `X-Task-Notification-Token: <TASK_NOTIFICATION_TOKEN>` or `Authorization: Bearer <TASK_NOTIFICATION_TOKEN>`

### Recipient and Routing Decoupling
Individual recipients, phone numbers, and delivery channels are managed centrally by the Orizon notification infrastructure. The ECC policy strictly prohibits hard-coding recipient phone numbers, personal contact details, or webhook tokens in client repositories or within the ECC itself. Centralized routing enables multi-channel fan-out and recipient management without mutating project repositories.

### Secret Safety Invariant
Authentication tokens and vendor credentials must never be committed to Git, stored in unencrypted repository files, or displayed in terminal output. Tokens must always be resolved from secure environment variables or secret managers.

---

## 3. COMPLETION EVENT PAYLOAD CONTRACT

The completion event payload must be a JSON object with strict UTF-8 encoding:

```json
{
  "project": "<PROJECT_NAME>",
  "task": "<TASK_TITLE>",
  "status": "COMPLETED",
  "executor": "<EXECUTOR_IDENTITY>",
  "result": "<SUMMARY_OF_OUTCOME>",
  "ref": "<OPTIONAL_REFERENCE>"
}
```

### Field Definitions
- **`project`** (string, required): Canonical name of the project or development front (e.g. `"ORIZON AGENTES"`, `"ORIZON CONTROL"`, `"CONNECTMAR"`, `"ATLETA 360"`, `"BALAGUER"`).
- **`task`** (string, required): Concrete title of the completed mission or milestone.
- **`status`** (string, required): Execution state. Must be `"COMPLETED"` (or `"BLOCKED"` / `"FAILED"` when terminal status is reached).
- **`executor`** (string, required): Identity of the agent or system that performed the work (e.g. `"Opus 5 Code"`, `"ChatGPT"`, `"GitHub Actions"`).
- **`result`** (string, required): Factual summary of the outcome, evidence, or verified deliverables.
- **`ref`** (string, optional): Traceability reference such as commit SHA, PR number, or issue key.

---

## 4. COMPLETION SEMANTICS & EXECUTION LIFECYCLE

A completion notification must **never** be dispatched prematurely.

An isolated commit, a partial code edit, a started build, a passing intermediate test, or a generated provider receipt does **not** signify that a material engineering mission has finished.

The universal delivery sequence is:

```text
EXECUTE
  -> VERIFY
  -> FIX / RETEST
  -> SATISFY EXIT CRITERIA
  -> CAPTURE EVIDENCE
  -> EMIT COMPLETION NOTIFICATION
  -> RECORD NOTIFICATION RESULT
  -> CLOSE
```

Dispatching the completion notification is an automated final step of mission closure. It must not introduce an artificial pause, checkpoint, or confirmation request to the user.

---

## 5. INDEPENDENCE OF TASK STATUS AND NOTIFICATION DELIVERY

The validity of engineering work is decoupled from third-party notification transport:

1. **Task Integrity:** If all mission acceptance criteria are met, validated, and verified, the task is **COMPLETED**, regardless of transient transport issues.
2. **Failure Handling:** If the notification endpoint returns an error, times out, or reports delivery degradation:
   - The task status remains `COMPLETED`.
   - The agent must record the notification attempt outcome in its final summary.
   - The agent may retry the notification once if safe and non-blocking.
   - The agent must never roll back or invalidate completed, verified engineering deliverables due to a notification transport failure.
   - The agent must never claim successful notification delivery without positive confirmation from the service.

---

## 6. CURRENT BOUNDARIES (OUTBOUND COMPLETION SCOPE)

This policy governs **outbound task completion notifications**.

The following extended capabilities are reserved for future phases and must not be assumed active under this standard:
- Inbound bidirectional command execution via WhatsApp.
- Interactive execution continuation via messaging replies.
- Audio voice note transcription or synthesis for task control.
- Command Bus routing between chat apps and local daemons.

---

## 7. UNIVERSAL APPLICATION

This policy is binding upon:
- Every current Orizon Tech repository and project.
- Every future Orizon Tech repository and project upon creation.
- Every AI coding agent, subagent, and automated pipeline operating under the ECC.
