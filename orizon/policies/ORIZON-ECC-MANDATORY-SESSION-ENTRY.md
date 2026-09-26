# ORIZON ECC MANDATORY SESSION ENTRY POLICY

**Version:** 1.0.0
**Owner:** Orizon Tech
**Canonical repository:** `orizontech-startup/ECC`
**Canonical file:** `orizon/policies/ORIZON-ECC-MANDATORY-SESSION-ENTRY.md`

## Purpose

This policy makes ECC loading the mandatory first governance action for every Orizon Tech engineering agent, chat, harness, repository, project, and material work session.

The purpose is to ensure that no agent begins or resumes Orizon project work under stale, local-only, or legacy governance.

---

## 1. MANDATORY SESSION ENTRY

Before any material engineering work on an Orizon Tech project, every agent must load the current ECC from the canonical repository:

`orizontech-startup/ECC`

Mandatory invariants:

- `EVERY_ORIZON_SESSION_STARTS_WITH_ECC`
- `FETCH_LATEST_ECC_MAIN_BEFORE_MATERIAL_WORK`
- `READ_ORIZON_START_HERE`
- `READ_UNIVERSAL_POLICY`
- `READ_ECC_SUPREMACY_POLICY`
- `READ_CONTINUOUS_AUTONOMOUS_EXECUTION_POLICY`
- `APPLY_ORIZON_ENGINEERING_PROFILE`
- `APPLY_ORIZON_ENGINEERING_OS`
- `PRESERVE_ACTIVE_MISSION_AND_WORKING_STATE`

This applies when an agent:

- starts a new Orizon project;
- opens an existing Orizon repository;
- resumes an interrupted session;
- enters an Orizon project from another chat;
- receives a handoff;
- changes machines or harnesses;
- starts implementation, debugging, testing, deployment, audit, incident, go-live, or documentation work;
- invokes a specialist or subagent for material work.

---

## 2. REQUIRED LOAD ORDER

The canonical load order is:

```text
FETCH latest main from orizontech-startup/ECC
  -> ORIZON-START-HERE.md
  -> ORIZON-ENGINEERING-OS-UNIVERSAL.md
  -> ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md
  -> ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md
  -> orizon-engineering-profile
  -> orizon-engineering-os
  -> current project-local context
  -> preserve/continue active mission
```

If the active mission already exists, loading ECC must not reset it.

---

## 3. NO MATERIAL WORK BEFORE ECC LOAD

Material work includes:

- source-code edits;
- schema changes;
- infrastructure changes;
- deployment;
- production mutation;
- installer/package generation;
- migrations;
- secrets/config changes;
- release actions;
- architecture changes;
- test-fix loops that mutate code;
- generated artifacts intended for production.

Before ECC is loaded, only read-only discovery required to identify the project/repository is permitted.

---

## 4. PROJECT ENTRYPOINT REQUIREMENT

Every Orizon project repository must contain a local agent-facing entrypoint that points back to the canonical ECC.

At least one harness-native entrypoint must exist, and repositories used by multiple harnesses should carry both:

- `CLAUDE.md` for Claude Code;
- `AGENTS.md` for Codex/agent harnesses;

or an equivalent supported harness instruction file.

The local entrypoint must instruct the agent to:

1. fetch/read the latest ECC `main`;
2. read `ORIZON-START-HERE.md`;
3. apply the mandatory ECC policies;
4. preserve current mission, scope, roadmap, phase, and reversible authorizations;
5. continue under ECC.

A local project file must not copy the entire ECC policy body. It should point to the canonical ECC so projects do not drift.

---

## 5. SUBAGENT INHERITANCE

Any specialist, subagent, delegated worker, or parallel agent spawned for an Orizon project inherits the active ECC governance context.

The parent agent must pass enough context to make this explicit.

A subagent must not reintroduce legacy governance or local rules that conflict with ECC supremacy.

---

## 6. FRESHNESS

The canonical reference is the latest available `main` of `orizontech-startup/ECC`.

If network access is temporarily unavailable:

- use the latest locally verified ECC checkout/cache;
- record that freshness could not be confirmed;
- do not invent policy changes;
- refresh as soon as connectivity returns.

Do not block low-risk read-only work solely because GitHub is temporarily unavailable when a verified local ECC copy exists.

---

## 7. LEGACY GOVERNANCE

After mandatory session entry, apply:

`orizon/policies/ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md`

Therefore legacy Strategy, Central Office, Hub, Birth Lifecycle, superseded Bootstrap, Official Resume, and historical hooks are non-blocking unless explicitly re-adopted by current ECC.

---

## 8. CONTINUOUS EXECUTION AFTER ENTRY

ECC loading is a startup governance action, not a conversational checkpoint.

After the required ECC context is loaded, the agent must continue under:

`orizon/policies/ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md`

Do not stop merely to announce that ECC was loaded.

---

## 9. NEW PROJECTS

When a new Orizon repository is created, bootstrap must install the local ECC entrypoint as part of project creation.

A new Orizon repository is not considered fully onboarded until it has a durable pointer to the canonical ECC.

---

## 10. FINAL RULE

For Orizon Tech engineering:

**NO MATERIAL WORK WITHOUT ECC ENTRY.**

**EVERY AGENT. EVERY PROJECT. EVERY MATERIAL SESSION.**
