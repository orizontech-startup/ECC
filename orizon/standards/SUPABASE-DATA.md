# Supabase and Data Standard

- PostgreSQL/Supabase is the default managed relational data platform when selected by the project.
- Every schema change must be represented by a migration or the repository's canonical migration mechanism.
- Enable Row Level Security on client-accessible tables and write policies from least privilege.
- Do not use service-role credentials in browsers or mobile clients.
- Separate development, staging and production databases and credentials.
- Add indexes based on real access patterns; verify query plans for expensive queries.
- Use connection pooling for serverless/high-concurrency workloads.
- Define foreign keys, uniqueness, nullability and lifecycle rules explicitly.
- Preserve auditability for sensitive or operationally important changes.
- Configure backups/PITR according to project criticality; test restore procedures before relying on them.
- Use replicas only when workload evidence justifies them.
- Multi-tenant data must be scoped by tenant/organization at both query and authorization layers.
- Treat destructive migrations as high risk; define rollback or forward-repair strategy.
- Never declare a migration safe without testing against representative staging data.
