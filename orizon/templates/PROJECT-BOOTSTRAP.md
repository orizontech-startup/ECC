# Orizon Project Bootstrap

Copy these assets into every Orizon repository.

## Required project metadata
Create `.orizon/project.json` with:
- repository
- product
- owner
- production_url
- staging_url
- stack
- current_phase
- assurance_class
- critical_flows

## Required CI
Install `.github/workflows/orizon-engineering-gate.yml` calling the reusable gate in `orizontech-startup/ECC`.

## Required lifecycle
1. Bootstrap current state.
2. Freeze scope/roadmap.
3. Execute through Orizon Engineering OS.
4. Capture evidence, metrics and learnings.
5. Close with go-live state and blockers.
