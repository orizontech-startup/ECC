# GitHub and Source Control Standard

- The canonical GitHub repository is the source of truth for repository-backed code.
- Do not mutate canonical source through visual builders when GitHub is authoritative.
- Protect production branches and require reviewed PRs for material changes.
- Use conventional, scoped commit messages that describe the real change.
- Keep commits coherent and avoid mixing unrelated cleanup with production fixes.
- Use GitHub Actions or the repository's canonical CI for repeatable validation and deployment.
- Keep secrets in GitHub Environments/Secrets or approved secret managers.
- Use CODEOWNERS, branch protection and required checks on critical repositories where appropriate.
- Use issues/projects/milestones when the project needs durable execution tracking.
- Use release tags and CHANGELOG/release notes for production milestones when the product lifecycle benefits.
- Dependabot or equivalent dependency monitoring should be enabled for maintained production repositories.
- Existing repositories may be monorepos or split by deployable boundary; do not restructure solely to satisfy a generic preference.
- Never force-push shared production branches as part of normal delivery.
- Preserve traceability from requirement -> PR/commit -> test evidence -> deployment.
