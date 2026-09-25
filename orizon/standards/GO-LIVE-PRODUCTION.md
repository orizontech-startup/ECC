# Go-Live and Production Standard

- Follow the delivery order: Database -> Security -> Backend -> Frontend -> Tests -> Observability -> Staging -> Production.
- Confirm the requested scope and identify unrelated production surfaces that must remain unchanged.
- Build and test the exact commit/artifact intended for production.
- Review migrations, environment variables, secrets and external integrations.
- Deploy to staging and validate critical journeys with representative configuration.
- Run security review for high-risk surfaces before production.
- Require production deployment traceability to a commit/release identifier.
- After deploy, run health checks and real smoke tests against the public production route.
- Verify frontend/backend parity and mobile behavior when applicable.
- Confirm logs/alerts can detect the most likely regressions.
- Keep an executable rollback or forward-fix path.
- Do not call go-live complete while known critical blockers remain.
- Document residual risk, validation evidence and the exact production state.
