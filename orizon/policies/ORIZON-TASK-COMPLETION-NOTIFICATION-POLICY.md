# ORIZON TASK COMPLETION & OPERATIONAL NOTIFICATION POLICY

**Version:** 3.0.0  
**Owner:** Orizon Tech  
**Canonical repository:** `orizontech-startup/ECC`  
**Canonical file:** `orizon/policies/ORIZON-TASK-COMPLETION-NOTIFICATION-POLICY.md`

## Purpose

This policy establishes the universal task completion notification standard across the entire Orizon Tech ecosystem.

Notifications via WhatsApp are a human-to-human communication layer between the engineering team/agents and the owner (Ricardo). They must be sent **only** upon REAL MATERIAL COMPLETIONS, using natural, cordial Brazilian Portuguese, commercial project names, and clean bullet points without technical noise or jargon.

---

## 1. MANDATORY INVARIANTS

- `WHATSAPP_ONLY_FOR_REAL_MATERIAL_DELIVERIES`
- `NO_WHATSAPP_ON_INTERNAL_OR_INTERMEDIATE_ACTIVITY`
- `ECC_LOADED_DOES_NOT_DISPATCH_WHATSAPP`
- `USE_COMMERCIAL_HUMAN_PROJECT_NAMES`
- `HUMAN_CONVERSATIONAL_LANGUAGE_WITHOUT_TECHNICAL_NOISE`
- `FORBIDDEN_WHATSAPP_TERMS: COMPLETED, EXACT_MATCH, SHA, COMMIT_HASH, BRANCH_NAMES, PIPES`
- `EVERY_COMPLETED_MATERIAL_WORK_UNIT_EMITS_NOTIFICATION`
- `NO_MICRO_ACTION_SPAM`
- `IDEMPOTENT_24H_DEDUPLICATION_GUARD`
- `NOTIFICATION_FAILURE_MUST_BE_OBSERVABLE_AND_RECORDED`
- `TECHNICAL_TRACIBILITY_PRESERVED_INTERNALLY_IN_DB_AND_LOGS`

---

## 2. EVENT 1 — `ECC_LOADED` (INTERNAL OPERATIONAL HANDSHAKE ONLY)

When an agent loads or reloads the canonical ECC:
1. It may record the operational handshake locally and log it internally;
2. **IT MUST NEVER DISPATCH A WHATSAPP MESSAGE TO THE OWNER.**
Loading the ECC is an internal initialization step, not a customer/owner-facing deliverable.

---

## 3. EVENTS 2 & 3 — `STAGE_COMPLETED`, `PHASE_COMPLETED` & `WORK_UNIT_COMPLETED` (MATERIAL COMPLETIONS)

WhatsApp notifications are strictly reserved for REAL, VERIFIED DELIVERABLES:
- Etapa material concluída;
- Fase do projeto ou milestone relevante concluído;
- Missão ou tarefa principal concluída;
- Entrega significativa de funcionalidade;
- Go-live / Deploy de produção homologado;
- Certificação / Homologação técnica aprovada.

### Commercial Project Names
Messages must use commercial/human project names:
- `Orizon Control` (never `orizon-control` or `agent-connect`)
- `Orizon Agentes` (never `orizon-engineering` or repo slugs)
- `ConnectMAR` (never `connect-mar`)
- `Atleta 360` (never `atleta-360`)
- `Balaguer Imóveis` (never `balaguerimoveis26`)
- `Orizon Engineering OS` (never bare `ecc`)

### Tone, Style & Structure
- Natural, friendly and professional Brazilian Portuguese, speaking directly to Ricardo.
- 3 to 5 clear bullet points summarizing the real business and engineering outcome.
- Free of technical jargon (no `COMPLETED`, `EXACT_MATCH`, SHA-1, commit hashes, branches, payloads, or pipe separators).

```text
Olá Ricardo, o agente do projeto [Nome Humano] da Orizon Tech concluiu a execução: Encerrei uma etapa importante do trabalho: [Título Limpo].

Os principais pontos foram:
- [ponto 1 em linguagem simples];
- [ponto 2 em linguagem simples];
- [ponto 3 em linguagem simples].

Essa etapa foi concluída com sucesso. Veja os detalhes no painel.
```

---

## 4. STRICT ANTI-SPAM RULE (`NO_MICRO_ACTION_SPAM`)

WhatsApp notifications are strictly FORBIDDEN for:
- Reading or reloading ECC;
- Running shell commands (`git status`, `ls`, `curl`, `tsc`);
- Reading files or updating context;
- Individual test runs or typechecks;
- Intermediate commits or checkpoints;
- Bootstraps and internal synchronizations;
- Minor edits that do not constitute a material delivery.

---

## 5. RESILIENCE, IDEMPOTENCY & COMPLETION LEDGER

- Idempotency is enforced within a 24-hour window using `.orizon/completion-ledger.json` and database deduplication keys.
- If a transient network failure occurs, the runtime retries with backoff.
- If delivery fails permanently, the technical deliverable remains completed, while the notification status is recorded as `NOTIFICATION_FAILED` in the ledger and API, remaining fully observable and reprocessable.
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
