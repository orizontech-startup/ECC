# Orizon Engineering Profile

This directory contains Orizon Tech's company-wide engineering layer on top of ECC.

## Scope

The profile is intended for existing and future repositories in the `orizontech-startup` organization and for other repositories explicitly adopted by Orizon Tech.

## Architecture

ECC remains the upstream engineering engine. Orizon-specific policy is kept as a thin additive layer so upstream ECC updates can continue to be merged with minimal conflict.

Primary surfaces:
- `skills/orizon-engineering-profile/` — company-wide execution policy.
- `skills/orizon-engineering-handbook/` — routes work to the relevant Orizon standards.
- `skills/orizon-project-bootstrap/` — onboarding for new and brownfield projects.
- `orizon/standards/` — reusable API, cloud, data, auth, mobile, security, QA, operations and go-live standards.
- `commands/orizon.md` — manual activation entry point.
- `orizon/PROJECT-PROFILE.template.md` — per-project context template.
- `orizon/GO-LIVE-CHECKLIST.md` — production readiness baseline.

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

The installer is idempotent and writes a bounded Orizon block into the user-level Claude Code and Codex instruction files. It only activates the company profile for `orizontech-startup` repositories or projects explicitly identified as Orizon Tech.
