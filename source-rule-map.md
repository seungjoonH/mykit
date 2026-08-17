# Source Rule Map

This file maps `code-quality.md` into reusable mykit playbook modules.

## Generic Core

- `0. 핵심 철학` -> `core/readability.md`.
- `0` 확장성 우선, 1인 작품, 확인은 범위만 -> `core/code-style.md`, `AGENTS.md`.
- `1.1`, `1.2`, `1.3`, `1.4`, `1.6`, `1.9` -> `core/code-style.md`. `1.3` 한 줄/100자/`printWidth` 100, `1.5`/`1.9` handleXxx와 `SubmitEvent`, try는 persist 하나도 여기.
- `1.5` JSX 핸들러, `3.1` -> `core/code-style.md`, `frontend/component.md`.
- `2.1`, `2.2`, `2.4`, `2.5` -> `core/code-hygiene.md`. `2.5`는 유틸 성격이면 한 곳이어도 분리.
- `3.x` -> `core/naming.md`.
- `6.1` -> `core/performance.md`.
- `7` -> `core/error-handling.md`. 가드/인가, API 코드 vs `t()`, searchParams 스키마, 포털 복제 금지도 여기.
- `7` 사용자 범위 세션+RLS, service-role 예외 -> `database/supabase.md`, `security.md`.
- `9` -> `core/data-design.md`.
- `11` -> excluded (project-specific checklist hints; not used in mykit).

## Frontend

- `1.5`, `1.7`, `1.8`, `5.x` -> `frontend/component.md`.
- `5.4`, `5.7` meaning-unit Specify (`NameTextForm`) also live in `references/philosophy/meaning-unit.md`. Index routes `frontend-ui-change`, `frontend-form-meaning-unit`, and `frontend-screen-change` must open `frontend/ui/component.md` and keep `mustHold`. `component-layers.md` is the layer table. Hook/Store live in `hooks-store.md`.
- `4.1` -> `frontend/css-module.md`.
- `4.2` + `4.3` -> `frontend/theme.md`.
- `4.4` -> `frontend/svg-icon.md`. 반복 아이콘은 `Icon`. 화면 고유 illustration은 feature.
- `8` -> `frontend/accessibility.md`. a11y는 의미가 생기는 계층에서 보장.
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
