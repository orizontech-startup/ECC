# ORIZON UNIVERSAL BOOTSTRAP & CAPABILITY DISCOVERY

**Version:** 1.0.0  
**Owner:** Orizon Tech  
**Canonical repository:** `orizontech-startup/ECC`  
**Canonical file:** `orizon/bootstrap/README.md`

## Purpose

This specification defines how an AI agent, automated pipeline, or executor discovers, provisions, and executes mandatory corporate capabilities upon entering any Orizon Tech project.

The user triggers the entire bootstrap with a single phrase:

> **"Veja o ECC da Orizon no Git."**

The agent must never require the user to configure tokens, specify endpoints, install plugins, or remember delivery details. The agent discovers its execution environment, resolves the canonical capability adapter, performs the `ECC_LOADED` operational handshake, and immediately continues its mission.

---

## 1. CAPABILITY DISCOVERY PROTOCOL

```text
LOAD ECC
  -> READ CAPABILITY MANIFEST (orizon/bootstrap/CAPABILITY-MANIFEST.json)
  -> DETECT EXECUTION ENVIRONMENT
  -> RESOLVE ORIZON_NOTIFICATION ADAPTER
  -> EXECUTE ECC_LOADED HANDSHAKE
  -> VERIFY DISPATCH RESULT
  -> PRESERVE ACTIVE MISSION & CONTINUE WORK
  -> ON MATERIAL COMPLETION: EXECUTE WORK_UNIT_COMPLETED
```

---

## 2. ADAPTER MATRIX BY ENVIRONMENT

| Platform / Environment | Available Capabilities | Canonical Adapter | Execution Mechanism | Secret Resolution |
|---|---|---|---|---|
| **Opus 5 Code / Terminal** | Full shell, node runtime, filesystem | `cli` | `node ~/.orizon-ecc/bin/orizon-notify.mjs ecc-loaded` | Resolved securely from OS user store / `~/.orizon/credentials.json` |
| **ChatGPT (Custom GPT)** | Web reader, Custom Actions, OpenAPI | `chatgpt_action` | Action `eccLoadedHandshake` via `orizon/bootstrap/adapters/chatgpt-openapi.json` | Server-side managed in Custom GPT Action (never exposed to chat) |
| **Codex (Terminal / Daemon)** | Shell, node runtime, filesystem | `cli` | `node ~/.orizon-ecc/bin/orizon-notify.mjs ecc-loaded` | Resolved securely from OS user store / `~/.orizon/credentials.json` |
| **Opus 5 Desktop / Cursor / Zed** | MCP tool calling | `mcp` | MCP tool `orizon_notify_ecc_loaded` | Resolved via MCP server daemon |
| **GitHub Actions / CI/CD** | Linux runner, curl, environment variables | `http` / `cli` | `node scripts/notify-task-complete.mjs` or curl | Repository secret `TASK_NOTIFICATION_TOKEN` |

---

## 3. PLATFORM PROVISIONING VS. SESSION BOOTSTRAPPING

- **Platform Provisioned (One-Time):**
  - In terminal environments (Opus 5 Code / Codex): The secret is stored once per machine in the secure user store (`~/.orizon/credentials.json` or Windows User Environment). All projects on that machine inherit access automatically without per-project token duplication.
  - In ChatGPT: The Custom GPT is configured once with the OpenAPI Action pointing to `https://api.useorizon.com/openapi/notifications.json`. All future chats inherit the action without re-configuration.
- **Session Bootstrapped (Per Session):**
  - Every new chat or session reads the ECC, executes the handshake immediately, and continues without prompting the user.

---

## 4. LIFECYCLE EVENTS

### `ECC_LOADED` (Immediate Handshake)
- **Trigger:** Immediate upon loading or reloading ECC.
- **Execution:**
  - CLI: `node ~/.orizon-ecc/bin/orizon-notify.mjs ecc-loaded`
  - ChatGPT: Call action `eccLoadedHandshake({ project, executor })`
- **Rule:** Never resets the active mission, never asks user confirmation, never pauses execution.

### `WORK_UNIT_COMPLETED` (Material Completion)
- **Trigger:** Real completion of a material work unit (task, milestone, phase, deployment).
- **Execution:**
  - CLI: `node ~/.orizon-ecc/bin/orizon-notify.mjs work-completed --task "<TITLE>" --result "<SUMMARY>"`
  - ChatGPT: Call action `workUnitCompletedNotification({ project, task, status, executor, result, ref })`
- **Anti-Spam Rule:** Strictly forbidden for micro-actions (individual file edits, shell commands, intermediate tests).
