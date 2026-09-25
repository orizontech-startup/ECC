# Performance and Cost Standard

- Define performance goals for user-critical paths before optimizing blindly.
- Measure end-to-end latency, not only server execution time.
- Track slow database queries, network calls, bundle size and rendering bottlenecks.
- Prefer caching only when correctness, invalidation and privacy are understood.
- Avoid over-provisioning infrastructure before load evidence justifies it.
- Use queues/workers for work that should not block the user request.
- Set timeouts and concurrency bounds on external/AI workloads.
- Track AI/token usage and model choice for cost-sensitive pipelines.
- Escalate model/infrastructure tier only when a lower-cost option fails required quality or latency.
- Performance regressions on critical workflows block go-live.
- For remote access, optimize capture, transport, decode and input feedback as one latency budget.
