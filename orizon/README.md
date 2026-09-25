# Orizon Engineering Profile

This directory contains Orizon Tech's company-wide engineering layer on top of ECC.

## Scope

The profile is intended for existing and future repositories in the `orizontech-startup` organization and for other repositories explicitly adopted by Orizon Tech.

## Architecture

ECC remains the upstream engineering engine. Orizon-specific policy is kept as a thin additive layer so upstream ECC updates can continue to be merged with minimal conflict.

Primary surfaces:
- `skills/orizon-engineering-profile/` — company-wide execution policy.
- `skills/orizon-project-bootstrap/` — onboarding for new and brownfield projects.
- `commands/orizon.md` — manual activation entry point.
- `orizon/PROJECT-PROFILE.template.md` — per-project context template.
- `orizon/GO-LIVE-CHECKLIST.md` — production readiness baseline.

## Precedence

Explicit project requirements and stricter repository rules override this global profile.
The profile must not mix code, secrets, databases or deployment state between projects.

## Update Strategy

Keep Orizon customizations additive. Sync upstream ECC into the fork, resolve only real conflicts, validate the plugin, then update the installed marketplace/plugin.
