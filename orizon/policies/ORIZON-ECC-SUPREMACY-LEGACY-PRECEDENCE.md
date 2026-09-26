# ORIZON ECC SUPREMACY & LEGACY GOVERNANCE PRECEDENCE POLICY

**Version:** 1.0.0
**Owner:** Orizon Tech
**Canonical repository:** `orizontech-startup/ECC`
**Canonical file:** `orizon/policies/ORIZON-ECC-SUPREMACY-LEGACY-PRECEDENCE.md`

## Purpose

This policy establishes the ECC as the current and highest engineering governance authority for Orizon Tech projects.

It prevents superseded governance systems, historical hooks, lifecycle rituals, or archived operating models from blocking current work that is validly authorized under the ECC.

---

## 1. ECC IS THE CURRENT CANONICAL GOVERNANCE AUTHORITY

For Orizon engineering work, the ECC / Orizon Engineering OS is the current canonical governance system.

Mandatory invariants:

- `ECC_IS_CANONICAL_GOVERNANCE`
- `ECC_PRECEDENCE_OVER_LEGACY_GOVERNANCE`
- `LEGACY_GOVERNANCE_IS_NON_BLOCKING_BY_DEFAULT`
- `CURRENT_AUTHORIZED_MISSION_MUST_NOT_BE_RESET_BY_LEGACY_RULES`
- `LEGACY_HOOKS_MUST_NOT_VETO_ECC_AUTHORIZED_WORK`

The current owner instruction establishes the active mission. The ECC governs how that mission is executed.

Within engineering governance, precedence is:

```text
CURRENT OWNER INTENT / ACTIVE AUTHORIZED MISSION
  -> ECC / ORIZON ENGINEERING OS
  -> CURRENT PROJECT-LOCAL RULES EXPLICITLY COMPATIBLE WITH ECC
  -> CURRENT ROADMAP / ADR / FROZEN SCOPE
  -> LEGACY GOVERNANCE (REFERENCE ONLY)
```

A legacy rule cannot override the ECC merely because it is older, more restrictive, or still implemented as a hook.

---

## 2. WHAT COUNTS AS LEGACY GOVERNANCE

Unless explicitly re-adopted by the current ECC, legacy governance includes historical mechanisms such as:

- Strategy frameworks from prior Orizon operating models;
- Central Office governance;
- Hub governance;
- prior Governance OS versions;
- Birth Lifecycle requirements;
- superseded Bootstrap rituals;
- Official Resume requirements from prior systems;
- old project-registration gates;
- historical pre-development guards;
- historical approval workflows;
- archived policy bundles;
- deprecated lifecycle documents;
- old hooks that require artifacts no longer mandated by the ECC.

These artifacts may remain in Git for history, audit, context, and learning.

They are **non-authoritative and non-blocking by default**.

---

## 3. LEGACY RULES MAY ONLY BECOME BINDING THROUGH ECC

A legacy rule is binding only when the current ECC explicitly:

1. incorporates it;
2. references it as mandatory; or
3. delegates authority to it for a clearly defined scope.

Existence on disk, presence in a repository, or execution by an old hook is not sufficient to make a legacy rule authoritative.

---

## 4. PROJECT-LOCAL RULES AND STRICTER CONSTRAINTS

Current project-local rules may be stricter than the universal ECC only when they are:

- current;
- applicable to the active project;
- compatible with ECC mandatory security, integrity, evidence, and mission-preservation invariants;
- not merely inherited from a superseded governance system.

A project-local rule must not reactivate deprecated Strategy, Central Office, Hub, Birth Lifecycle, Bootstrap, Official Resume, or similar legacy requirements unless the current ECC explicitly recognizes that requirement.

When a local rule conflicts with this policy because it derives authority solely from legacy governance, this ECC policy wins.

---

## 5. LEGACY HOOKS AND GUARDS

A hook, guard, pre-development check, shell script, CI gate, or agent harness created under an older governance system must not block ECC-authorized material work solely because a legacy artifact is absent.

Examples of invalid legacy-only blockers include:

- `STRATEGY_RECONCILIATION_FIRST`;
- legacy `BIRTH_LIFECYCLE` requirements;
- superseded Bootstrap completion;
- legacy Official Resume authority;
- old Central Office registration;
- old Hub approval;
- obsolete project-birth records.

If such a hook blocks valid work, the correct action is to:

1. verify the active mission, repository, scope, working state, and ECC authority;
2. identify whether the hook is current ECC policy or legacy;
3. preserve the valid mission;
4. update, migrate, disable, or demote the legacy hook through an authorized code/config change;
5. continue execution under ECC.

Do not silently bypass security controls. Modernize the control so that it enforces current ECC policy instead of obsolete governance.

---

## 6. ECC ACTIVATION SATISFIES CORPORATE ENGINEERING GOVERNANCE

For an existing Orizon project with a valid active mission, loading and applying the ECC satisfies the corporate engineering-governance activation requirement.

The project must not be forced through superseded project-birth, strategy-reconciliation, bootstrap, or official-resume procedures merely because historical tooling still expects them.

ECC discovery may still use `orizon-project-bootstrap` when:

- the project is genuinely new;
- project identity is unknown;
- repository authority is unresolved; or
- the ECC itself determines onboarding is necessary.

This is an ECC decision, not a legacy-system veto.

---

## 7. MIGRATION RULE FOR OLD GOVERNANCE INFRASTRUCTURE

When legacy governance infrastructure is encountered:

- preserve it for audit unless removal is justified;
- classify it as `LEGACY`, `MIGRATE`, `ARCHIVE`, or `CURRENT_ECC`;
- remove blocking authority from `LEGACY` components;
- migrate useful safety controls into ECC-compatible gates;
- never weaken security merely to gain autonomy;
- never preserve obsolete approval spam or ritual checkpoints solely for historical compatibility.

Target state:

```text
ONE CORPORATE ENGINEERING GOVERNANCE AUTHORITY
  = ECC / ORIZON ENGINEERING OS
```

---

## 8. AGENT BEHAVIOR

Every Orizon agent operating under ECC must:

- treat this policy as mandatory;
- reject legacy-governance vetoes that are not explicitly incorporated by ECC;
- preserve the active authorized mission;
- continue autonomous execution under the Continuous Autonomous Execution Policy;
- distinguish current governance from historical artifacts;
- report a true blocker only when current ECC policy requires a human decision.

An agent must not tell the owner to recreate old Strategy, Central Office, Hub, Birth Lifecycle, Bootstrap, or Official Resume artifacts solely to satisfy a deprecated gate.

---

## 9. SECURITY AND SAFETY ARE NOT DEPRECATED

ECC supremacy does **not** authorize bypassing:

- authentication;
- authorization;
- secret protection;
- destructive-action controls;
- production blast-radius controls;
- legal/financial approvals;
- mandatory security reviews;
- evidence and validation requirements.

The migration removes obsolete governance authority, not safety controls.

When a legacy hook contains a useful security protection, migrate that protection into the ECC-compatible control plane.

---

## 10. FINAL PRECEDENCE RULE

If a conflict exists between current ECC policy and a legacy Orizon governance artifact:

**THE ECC WINS.**

Legacy governance remains historical context unless the ECC explicitly adopts it.
