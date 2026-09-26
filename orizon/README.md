# Orizon Engineering Profile

This directory contains Orizon Tech's company-wide engineering layer on top of ECC.

## Scope

The profile is intended for existing and future repositories in the `orizontech-startup` and `orizontech-hq` organizations and for other repositories explicitly adopted by Orizon Tech.

## Architecture

ECC remains the upstream engineering engine. Orizon-specific policy is kept as a thin additive layer so upstream ECC updates can continue to be merged with minimal conflict.

Primary surfaces:
- `skills/orizon-engineering-profile/` â€” company-wide execution policy.
- `skills/orizon-engineering-handbook/` â€” routes work to the relevant Orizon standards.
- `skills/orizon-project-bootstrap/` â€” onboarding for new and brownfield projects.
- `orizon/standards/` â€” reusable API, cloud, data, auth, mobile, security, QA, operations and go-live standards.
- `commands/orizon.md` â€” manual activation entry point.
- `orizon/PROJECT-PROFILE.template.md` â€” per-project context template.
- `orizon/GO-LIVE-CHECKLIST.md` â€” production readiness baseline.

## Precedence

Explicit project requirements and stricter repository rules override this global profile.
The profile must not mix code, secrets, databases or deployment state between projects.

## Update Strategy

Keep Orizon customizations additive. Sync upstream ECC into the fork, resolve only real conflicts, validate the plugin, then update the installed marketplace/plugin.

## Global activation

To make the Orizon profile available automatically across existing and future Orizon repositories on an engineer workstation, run one installer after installing the ECC plugin:

Windows PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/orizon/install-global-profile.ps1
```

macOS/Linux:
```bash
bash scripts/orizon/install-global-profile.sh
```

The installer is idempotent. It copies the portable company handbook to `~/.orizon-ecc/`, then writes a bounded Orizon block into the user-level Claude Code and Codex instruction files. This gives both harnesses a stable handbook path independent of plugin cache layout. It activates the company profile for `orizontech-startup` and `orizontech-hq` repositories, plus projects explicitly identified as Orizon Tech.

## Engineering OS v1

The Orizon layer adds 12 corporate engineering roles on top of the ECC base agent roster, bringing this fork to 80 agent definitions. It also adds the `orizon-engineering-os` orchestration skill, task commands, an adaptive GitHub quality gate and automated upstream-sync validation.

The private project registry, metrics, institutional knowledge and command center live in `orizontech-startup/orizon-engineering-os` so private project metadata is not stored in this public fork.

