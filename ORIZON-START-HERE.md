# ORIZON ECC — START HERE

If you are an AI agent, engineer, or new chat working on any Orizon Tech project, start here.

## Canonical ECC repository

`orizontech-startup/ECC`

## Mandatory universal policy

Read and apply:

1. `orizon/policies/ORIZON-ENGINEERING-OS-UNIVERSAL.md`
2. `orizon/policies/ORIZON-ECC-MANDATORY-SESSION-ENTRY.md`
3. `orizon/policies/ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md`
4. `orizon/policies/ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md`
5. `orizon/policies/ORIZON-TASK-COMPLETION-NOTIFICATION-POLICY.md`
6. `orizon/policies/ORIZON-ZERO-OPERATIONAL-FAKE-DATA-POLICY.md`

Then apply the ECC skills:

1. `orizon-engineering-profile`
2. `orizon-engineering-os`
3. `orizon-project-bootstrap` when the project has not yet been onboarded or its state is unknown

## Important

- This policy is universal for existing and future Orizon Tech projects.
- Every Orizon agent, project, repository, and material work session must enter through the latest ECC `main` before material work.
- Every Orizon project must carry a local agent-facing pointer back to the canonical ECC so agents encounter these rules on project entry.
- Do not assume the stack.
- Discover the current project before acting.
- Load only relevant standards and specialists.
- The ECC is the current highest corporate engineering-governance authority.
- Legacy Strategy, Central Office, Hub, Birth Lifecycle, superseded Bootstrap, Official Resume and historical governance hooks are non-blocking unless explicitly re-adopted by the current ECC.
- Current project-local stricter rules may take precedence only when they are current, ECC-compatible, and not merely inherited from legacy governance.
- Never claim successful validation without executed evidence.
- Loading ECC does **not** reset or replace an active mission.
- Preserve the current project, scope, roadmap, phase, working tree and already-authorized reversible work unless evidence proves they are invalid.
- Do not ask the owner to re-authorize work that was already authorized merely because ECC was loaded.
- Once a mission is authorized, continue autonomously until its exit criteria are met or a genuine human gate is reached.
- Verify with tools instead of asking the owner when the fact is directly observable.
- Fix in-scope failures instead of stopping to report them when they can be remediated safely.
- On loading/reloading ECC, immediately emit the mandatory ECC_LOADED handshake notification to the canonical Orizon notification service without resetting the active mission or creating artificial pauses.
- On completing any material work unit (task, milestone, phase, release), automatically emit the WORK_UNIT_COMPLETED notification without spamming micro-actions.

## Minimal instruction for a new chat

The preferred human trigger is simply:

> **Veja o ECC da Orizon no Git.**

If a user says this phrase, or a clear equivalent such as `veja o repo ECC`, `abra o ECC da Orizon` or `carregue o ECC`, treat it as an instruction to:

1. use this repository as the canonical ECC source;
2. read this `ORIZON-START-HERE.md` file;
3. load mandatory policies: `ORIZON-ENGINEERING-OS-UNIVERSAL.md`, `ORIZON-ECC-MANDATORY-SESSION-ENTRY.md`, `ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md`, `ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md` and `ORIZON-TASK-COMPLETION-NOTIFICATION-POLICY.md`;
4. apply `orizon-engineering-profile` and `orizon-engineering-os`;
5. identify the current project/repository, executor, and active environment;
6. discover required capabilities from `orizon/bootstrap/CAPABILITY-MANIFEST.json` and immediately emit the `ECC_LOADED` handshake notification via the canonical adapter for the active environment (CLI / Opus 5 Code / Codex: `node ~/.orizon-ecc/bin/orizon-notify.mjs ecc-loaded`; standard ChatGPT: navigate with browser tool to `https://api.useorizon.com/handshake/ecc-loaded?project=<PROJECT>&executor=ChatGPT`; Custom GPT Action: `eccLoadedHandshake`);
7. preserve the active mission, frozen scope/roadmap, current phase and already-authorized reversible work;
8. inspect any current working tree/uncommitted state;
9. continue the current task from the exact point where it was before ECC activation, now under the Orizon Engineering OS;
10. keep executing through fixable failures and intermediate gates until the mission is complete or a genuine blocker requires human intervention;
11. upon real material completion, automatically emit the WORK_UNIT_COMPLETED notification before final close.

Do not interpret ECC activation as a new target. Do not stop valid in-progress work only because ECC was loaded. Do not require the user to remember or repeat a longer bootstrap prompt, and do not ask the user to restate the ECC instructions when this short trigger is used.

The default operating mode is continuous autonomous execution: execute, verify, fix, retest and continue. Technical failures are work to resolve, not reasons to hand control back to the owner.
