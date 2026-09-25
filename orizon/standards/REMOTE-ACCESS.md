# Remote Access Standard

Applies to ORIZON CONTROL and any future Orizon remote-control product.

- Remote control requires explicit session identity, pairing and authorization before control begins.
- The client must be able to accept or reject access and understand the active session state.
- Separate view-only and full-control capabilities; permissions must be enforced, not cosmetic.
- Mouse movement, click, wheel, drag and keyboard input must be injected reliably and mapped to the correct display coordinates.
- Special keys, modifiers, clipboard and secure-attention flows need explicit platform-safe implementations.
- Multiple monitors and resolution/scale changes must not corrupt coordinate mapping.
- Optimize end-to-end latency and visual stability; eliminate avoidable frame jitter and stale-screen behavior.
- Prefer adaptive capture/encoding rather than brute-force frame volume.
- Log session start/end, operator identity, duration and security-relevant actions without recording secrets.
- Remote-control transport and signaling must use authenticated, encrypted channels.
- Native helpers/agents must start quickly, recover cleanly and expose actionable diagnostics.
- Browser and native clients must not silently downgrade security to gain compatibility.
- Test on physically distinct operator/client machines before declaring full remote control production-ready.
- Treat remote execution, filesystem, terminal and privileged tools as approval/policy-gated capabilities.
