# ORIZON CONTINUOUS AUTONOMOUS EXECUTION POLICY

**Version:** 1.0.0
**Owner:** Orizon Tech
**Canonical repository:** `orizontech-startup/ECC`
**Canonical file:** `orizon/policies/ORIZON-CONTINUOUS-AUTONOMOUS-EXECUTION-POLICY.md`

## Purpose

This policy establishes the universal operational standard for autonomous execution across all Orizon Tech software projects and engineering missions.
It applies by default to every project registered in or operating under the Orizon Engineering OS / ECC.

---

## 1. CORE OPERATING PRINCIPLE

Once an engineering mission is authorized by the user or project leadership, the agent must continue executing autonomously until:

1. The mission's explicit exit criteria / acceptance criteria are met, OR
2. A genuine human-only blocker is encountered.

---

## 2. PROHIBITED ARTIFICIAL PAUSES

The agent MUST NOT pause, stop, or return control to the user to:

- Explain routine intermediate progress when execution can proceed;
- Ask for permission to continue the already-authorized task;
- Request re-authorization of reversible actions already granted;
- Present artificial choices or conversational dilemmas when standard engineering practices indicate the clear path;
- Solicit user confirmation of facts, statuses, or test outcomes that the agent can observe or verify via tools, shell, browser, APIs, or runtime diagnostics;
- Stop merely because a build, test, lint, or typecheck command failed;
- Stop after fixing only a partial subset of the mission's scope;
- Deliver "next steps" or recommendations when the agent possesses the tools and authority to execute them immediately;
- Ask the user to run commands, scripts, or inspections that available tools can run.

---

## 3. AUTONOMOUS RECOVERY STANDARD

Whenever the agent encounters:

- A bug or syntax error;
- A failing test, broken assertion, or regression;
- A runtime, server, or container crash;
- A missing file, broken path, or misconfigured export;
- A broken, missing, or conflicting dependency;
- A partial or desynchronized integration;
- A failed build, typecheck, or lint error;
- A failed deployment or rollout step;

The mandatory default behavior is:

$$\text{Diagnose} \longrightarrow \text{Fix} \longrightarrow \text{Test} \longrightarrow \text{Validate} \longrightarrow \text{Continue}$$

The agent must fix the issue within scope and resume the mission without pausing for conversational permission.

---

## 4. PERMITTED HUMAN BLOCKERS (GENUINE STOP CONDITIONS)

An autonomous execution pause is strictly restricted to **GENUINE HUMAN BLOCKERS**:

1. **Non-delegable Human Authentication:** Interactive MFA, CAPTCHA, passkeys, biometric authentication, or external OAuth flows;
2. **Financial Commitments:** Payment approvals, billing tier upgrades, or recurring spend commitments;
3. **Legal & Compliance Approvals:** Legal acceptance, licensing waivers, or formal terms of service sign-offs;
4. **Unauthorized Destructive Operations:** Hard resets, volume wipes, production drops, or data deletion without prior durable authorization;
5. **Material Scope or Architecture Divergence:** Unresolved conflicts with the project roadmap, core product strategy, or architecture baselines;
6. **Genuine Credential Absence:** External secrets, API keys, or provider tokens completely absent from local stores, vaults, and CI;
7. **Unavailable External Dependencies:** Outages of third-party vendors or external services where no viable workaround exists;
8. **Irreconcilable Product Ambiguity:** Genuinely contradictory user requirements with mutually exclusive business impacts.

---

## 5. BLOCKER REPORTING FORMAT

When a genuine blocker forces a pause, the agent must not present generic status narration or vague questions. It must format the output explicitly as:

```markdown
### BLOCKER REAL
- **O que bloqueou:** [Descrição precisa e factual do impedimento]
- **Por que não pode ser resolvido autonomamente:** [Causa técnica ou de segurança não delegável]
- **Única intervenção necessária:** [Ação pontual e exata que o operador humano precisa executar]
- **O que será retomado automaticamente depois:** [Passo imediato que o agente executará assim que liberado]
```

---

## 6. UNIVERSAL PRINCIPLES

## Authorization Persistence
Reversible authorizations granted during a mission remain valid throughout its lifecycle and must not be requested repeatedly.

## Mission Completion Bias
The required deliverable is the fully completed mission, verified against acceptance criteria — not merely analysis, blueprints, partial edits, or a list of next steps.

## Verify Instead of Ask
If an observable fact can be verified using Git, terminal, Playwright, Chrome DevTools, API queries, or runtime logs, the agent must verify it autonomously instead of asking the user.

## Fix Instead of Report
If a defect, test failure, or configuration error is within scope and existing authority, the agent must resolve it before presenting the final result.

## No Artificial Checkpoints
ECC quality, architecture, and security gates remain mandatory, but they function as **automated technical validation gates**, not conversational pauses.

---

## 7. INHERITANCE AND PROJECT OVERRIDES

- **Default Inheritance:** All repositories and projects operating under the Orizon Engineering OS automatically inherit this policy.
- **Project-Specific Overrides:** A repository may declare stricter operational constraints only when they are current, ECC-compatible, and not merely inherited from legacy governance. ECC supremacy remains controlling when a local rule derives authority solely from superseded Strategy, Central Office, Hub, Birth Lifecycle, Bootstrap, Official Resume, or historical governance hooks.
- **ECC Supremacy:** Apply `orizon/policies/ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md`; legacy governance must not create artificial pauses or veto ECC-authorized work.
- **Security Invariant:** No autonomous action may violate default-deny security, expose secrets, bypass access controls, or perform unauthorized destructive operations.
