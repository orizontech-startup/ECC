# ORIZON ZERO OPERATIONAL FAKE DATA POLICY

**Policy Name:** ORIZON ZERO OPERATIONAL FAKE DATA POLICY  
**Version:** 1.0.0  
**Owner:** Orizon Tech  
**Authority:** Orizon Engineering OS / Orizon ECC  
**Canonical repository:** `orizontech-startup/ECC`  
**Canonical file:** `orizon/policies/ORIZON-ZERO-OPERATIONAL-FAKE-DATA-POLICY.md`  

---

## 1. PURPOSE & SCOPE

This policy establishes the strict corporate standard that **no operational software environment of Orizon Tech may present fake, mock, placeholder, fabricated, or synthetic data as if it were real operational data**.

It applies across all existing and future Orizon Tech repositories, applications, dashboards, APIs, and client surfaces.

---

## 2. CANONICAL DEFINITION & INVARIANTS

> **Ambientes operacionais do ATLETA 360 e dos projetos Orizon Tech somente podem apresentar dados persistidos reais ou informações deterministicamente derivadas de dados reais do tenant autenticado.**
>
> **Na ausência de dados, a interface deve apresentar zero, traço ("—"), lista vazia ou empty state visualmente coerente.**
>
> **Dados DEMO, mocks, fixtures, seeds ou valores sintéticos jamais podem ser utilizados como fallback operacional silencioso.**
>
> **Dados sintéticos somente são permitidos em testes isolados ou em ambiente DEMO explicitamente separado da operação oficial.**

Mandatory invariants:
- `REAL_DATA_EXISTS -> RENDER_REAL_DATA`
- `NO_DATA_EXISTS -> RENDER_ZERO_OR_EMPTY_STATE`
- `NO_SILENT_DEMO_FALLBACK`
- `NO_ARTIFICIAL_CURVES_OR_CHARTS`
- `NO_FABRICATED_PEOPLE_OR_ACTIVITIES`
- `MATHEMATICAL_CONSISTENCY (TOTAL == SUM(SEGMENTS))`

---

## 3. PROHIBITIONS

1. **Fabricated Charts:** Prohibited to generate fake trends, artificial smooth curves (e.g. `baseline = 70 + index * 1.5`), random fluctuations, or interpolated months when no stored historical data exists;
2. **Mock Fallbacks:** Prohibited to fallback to `demoData` when queries return empty arrays or null;
3. **Fabricated Names & Plans:** Prohibited to display synthetic athlete names, fictional doctor reviews, or artificial operational plans on operational surfaces;
4. **Artificial Indicators:** If an operational indicator has no records, it must render `0` or `0%`, never a hardcoded percentage (e.g. `86%`, `92%`, `78%`);
5. **Demo Badges on Real Data:** Prohibited to label real operational data with "DEMO" badges, which misleads users into believing real records are fake.

---

## 4. MATHEMATICAL & MULTITENANT INTEGRITY

- **Totals must equal the sum of their parts:** Total athletes on a card must equal the sum of categories in the composition donut and the sum of positions in the distribution bar. If total is 0, all segments must be 0;
- **Tenant Isolation:** No operational query may return records belonging to another tenant.
