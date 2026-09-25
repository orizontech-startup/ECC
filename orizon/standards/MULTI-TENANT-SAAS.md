# Multi-Tenant SaaS

Use this standard for products serving more than one customer, workspace or tenant.

- Tenant identity must be explicit at every data-access and authorization boundary.
- Never trust client-supplied tenant IDs without server-side membership verification.
- Prefer database constraints and RLS/policies that make cross-tenant leakage difficult by construction.
- Separate platform-admin privileges from tenant-admin privileges.
- Background jobs, webhooks, storage paths and caches must preserve tenant context.
- Logs and analytics must include safe tenant identifiers without exposing private data.
- Migrations must preserve tenant isolation and backfill deterministically.
- Test negative cases: authenticated user from tenant A cannot read or mutate tenant B.
- Billing, quotas and usage metering must bind to the correct tenant/workspace.
- Support export/deletion/offboarding without impacting neighboring tenants.
