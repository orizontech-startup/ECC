# QA and Testing Standard

- Choose tests based on risk, not vanity coverage alone.
- Use unit tests for isolated logic, integration tests for service/database boundaries and E2E for critical user journeys.
- Prefer TDD for deterministic new logic and regressions when it improves confidence and speed.
- Every fixed production bug should gain a regression test when technically reasonable.
- Test failure paths, retries, permissions and invalid inputs, not only happy paths.
- Critical auth and authorization flows require negative tests.
- Frontend changes require responsive and interaction testing on supported breakpoints.
- Browser products should use Playwright or an equivalent real-browser harness for critical journeys.
- Mobile web support requires real or representative iOS/Android browser validation.
- Avoid brittle tests that only mirror implementation details.
- Do not weaken tests to make a broken implementation pass.
- Separate pre-existing test failures from failures introduced by the change.
- Production-critical flows need runtime smoke validation even when CI is green.
