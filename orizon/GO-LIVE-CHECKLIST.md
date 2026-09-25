# Orizon Tech Go-Live Checklist

Use the applicable checks for every production release.

- [ ] Requested scope is implemented and no unrelated scope was introduced.
- [ ] Frontend and backend contracts are synchronized.
- [ ] Database migrations are reviewed, reversible where practical, and tested.
- [ ] Authentication and authorization paths are validated.
- [ ] No secrets, tokens or credentials are committed.
- [ ] Input validation and sensitive-data exposure are reviewed.
- [ ] Typecheck/lint passes where configured.
- [ ] Unit and integration tests pass where configured.
- [ ] Critical user journeys pass E2E or equivalent runtime validation.
- [ ] Production build succeeds.
- [ ] Environment variables and external integrations are verified.
- [ ] Deployment target and rollback path are known.
- [ ] Monitoring/logging is sufficient to detect regressions.
- [ ] Existing production routes not in scope remain unaffected.
- [ ] Documentation/handoff reflects the deployed state.
- [ ] Remaining risks or blockers are explicitly reported.

A release is not marked production-ready solely because code was committed.
