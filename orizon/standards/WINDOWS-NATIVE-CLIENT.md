# Windows Native Client

Use this standard for downloadable Windows helpers, remote clients and desktop executables.

- Cold start should be measured from user click to usable UI; eliminate unnecessary startup work from the critical path.
- Keep installers/launchers signed when production distribution requires trust and reputation.
- Do not require elevated privileges unless a feature genuinely needs them.
- Separate update, telemetry, networking and UI startup so one slow dependency does not block the window.
- Provide explicit crash/startup logs with no secrets.
- Handle single-instance behavior intentionally and recover cleanly from stale processes.
- Validate Windows Defender/SmartScreen interactions and document expected prompts.
- Test launch from browser download flows, Explorer, shortcuts and clean user profiles.
- Native input/control features must be permission-scoped and fail closed.
- Release artifacts must be reproducible, versioned and traceable to a source commit.
