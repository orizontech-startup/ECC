# Backup and Disaster Recovery Standard

- Define what data is authoritative and what can be rebuilt from source or external systems.
- Back up production databases and critical object storage according to business impact.
- Use PITR or equivalent for systems where data-loss windows must be small.
- A backup policy is incomplete until restore has been tested.
- Document recovery order for database, storage, secrets, infrastructure and application services.
- Keep deployment artifacts/source history sufficient to restore a known-good release.
- Protect backups with access controls separate from normal application credentials where possible.
- Define retention and deletion rules that match product/legal requirements.
- Capture recovery point and recovery time expectations for critical systems.
- Rehearse recovery for high-value platforms rather than discovering procedures during an outage.
