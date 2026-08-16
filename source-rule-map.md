# Source Rule Map

This file maps `code-quality.md` into reusable mykit playbook modules.

## Generic Core

- `0. 핵심 철학` -> `core/readability.md`.
- `1.1`, `1.2`, `1.3`, `1.4`, `1.6`, `1.9` -> `core/code-style.md`.
- `2.1`, `2.2`, `2.4`, `2.5` -> `core/code-hygiene.md`.
- `3.x` -> `core/naming.md`.
- `6.1` -> `core/performance.md`.
- `7` -> `core/error-handling.md`.
- `9` -> `core/data-design.md`.
- `11` -> excluded (project-specific checklist hints; not used in mykit).

## Frontend

- `1.5`, `1.7`, `1.8`, `5.x` -> `frontend/component.md`.
- `4.1` -> `frontend/css-module.md`.
- `4.2` + `4.3` -> `frontend/theme.md`.
- `4.4` -> `frontend/svg-icon.md`.
- `8` -> `frontend/accessibility.md`.
- Additional modular options not in source but requested by user: `frontend/tailwindcss.md`, `frontend/i18n.md`, `frontend/seo.md`.

## Backend

- Derived from source principles (small units, explicit rules, no workaround):
  - `backend/express.md`
  - `backend/nestjs.md`
  - `backend/spring.md`

## Database

- Source principles projected into data layer style/operations:
  - `database/postgres.md`
  - `database/mysql.md`
  - `database/mongodb.md`
  - `database/redis.md`

## Infra

- Source principles projected into deploy/runtime operations:
  - `infra/aws.md`
  - `infra/gcp.md`
  - `infra/azure.md`
  - `infra/vercel.md`
  - `infra/kubernetes.md`

## Cross-Cutting

- `api.md`: consistent contract and handler boundaries.
- `security.md`: fail-closed, no hidden errors.
- `testing.md`: goal-driven verification and scope split.

## Excluded

- Entire `10. Prova 언어 확장 규칙` section is excluded as project-specific.
