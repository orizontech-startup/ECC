# Frontend and Backend Parity Standard

- Backend capability is incomplete when the product requires a user-facing surface that has not been updated.
- Frontend must not advertise functionality the backend cannot reliably fulfill.
- Define API/data contracts before parallel frontend/backend implementation.
- Coordinate validation, error states, loading states and permission states across both sides.
- Database changes that affect user behavior must be traced through backend contracts to frontend rendering.
- Feature flags and staged rollout must be consistent across services and UI.
- Shared types/schemas should be generated or centralized where the stack supports it.
- Test contract compatibility on both success and failure cases.
- When backend work intentionally has no frontend impact, document why.
- Do not allow long-running roadmaps where backend accumulates capabilities the product surface cannot access without an explicit reason.
