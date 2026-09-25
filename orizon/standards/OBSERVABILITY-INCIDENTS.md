# Observability and Incident Standard

- Production services need enough telemetry to answer what failed, where, for whom and since when.
- Use structured logs with timestamps, request/session correlation and severity.
- Do not log secrets or sensitive personal payloads.
- Add health/readiness checks for deployable services where useful.
- Monitor error rate, latency, availability and resource pressure on critical paths.
- Track deployment identifiers so regressions can be tied to a release.
- Maintain audit logs for privileged or security-sensitive actions when required.
- Alert only on actionable conditions; noisy alerts are operational debt.
- Define a rollback/containment path before risky launches.
- During incidents: stabilize first, preserve evidence, communicate impact, then fix root cause.
- After material incidents, capture root cause, contributing factors, corrective actions and prevention.
- Observability is part of go-live; a system that cannot be diagnosed is not fully production-ready.
