---
name: mykit
description: "seungjoonH's personal engineering playbook and Claude Code skill. Use this whenever writing, reviewing, or refactoring code, and whenever adding or changing UI (components, forms, TextField, ChipButton, settings, screens, pages) or specifying a meaning unit like NameTextForm. feature/page must not assemble TextField with an outside label. Also use for Korean-output conventions, new-file headers, commit hygiene, reading errors instead of guessing, and scaffolding (mykit init, CLAUDE.md/AGENTS.md/playbook)."
license: MIT
---

# mykit

개인용 엔지니어링 플레이북이자 프로젝트 스캐폴딩 도구. CLAUDE.md/AGENTS.md에는 항상
지켜야 할 최소 원칙만 남겨두고, 나머지 상세 행동 지침과 스택별 참고 문서는 여기서
필요할 때 불러온다.

**Tradeoff:** 이 지침들은 속도보다 신중함 쪽으로 치우쳐 있다. 사소한 작업에는 판단력을
발휘한다.

이 SKILL.md는 인덱스다. 슬래시 커맨드가 없어도 아래 표의 요청에 맞는 액션을 먼저 연다.
작업마다 `skills/<name>/SKILL.md`를 복제하지 않는다. `/mykit:add-component`처럼 커맨드로
부른다.

`mustHold`. 필드는 `NameTextForm`처럼 의미 단위로 닫는다. `feature`/`page`는 `TextField`를
직접 쓰지 않는다. UI, 폼, 화면 작업은 `references/philosophy/meaning-unit.md`와
`component-layers.md`의 계층 표를 읽는다. `component-layers.md` 전체와 훅/Store 장은
기본 로드가 아니다.

## 행동 원칙

Think Before Coding, Extensibility First, Scoped Changes, Goal-Driven Execution은 mykit
문장이다.

- 추측하지 말고, 해석이 갈리면 고르지 말고, 모르면 묻는다.
- 최소 코드가 목표가 아니다. 한 곳에서만 써도 유틸/훅/의미 단위면 분리한다. 구조는 확장
  가능하게, 지금 없는 variant는 미리 넣지 않는다.
- 확인은 범위만 받는다. 합의한 범위 안에서는 원칙대로 만들고 사후에 보고한다. 새 파일
  이름을 만들기 전에 따로 묻지 않는다. 범위 밖은 고치지 않고 보고만 한다.
- 성공 기준을 정하고 검증한다.

### 1. 콜론으로 문장을 끝내지 않는다 (한국어 출력)

**한국어 문장은 콜론이 아니라 마침표로 끝낸다.**

사용자가 한국어로 쓰면 출력도 한국어다.
- 다음 줄이 목록이나 예시라도 `:`으로 문장을 끝내지 않는다.
- 영어 문서로 학습된 LLM은 콜론 습관을 한국어에 흘린다. 잡아낸다.
- 테스트: 모든 한국어 문장 종결부는 `.`, `?`, `!` 중 하나여야 한다. `:`이 아니다.
- 코드, 키-값 쌍, 라벨 안의 콜론은 괜찮다. 문장 종결자로만 안 된다.

### 2. 새 파일 첫 줄에 한국어 주석

**새로 만드는 소스 파일 첫 줄에 그 파일의 역할을 한 줄 한국어 주석으로 남긴다.**

새 파일을 만들 때.
- TypeScript/JavaScript: `// 사용자 인증 상태를 관리하는 Context Provider`
- Python: `# KIS API 호출을 비동기로 래핑하는 클라이언트`
- SQL: `-- 일별 집계 결과를 저장하는 머티리얼라이즈드 뷰`
- 필수 지시문(`'use client'`, `'use server'`, shebang) 바로 아래에 둔다.
- 설정 파일(`*.config.ts`, `package.json` 등)은 생략한다.

### 3. 완료 선언 전에 테스트를 돌린다

**코드를 건드렸으면 "완료"라고 말하기 전에 테스트를 돌린다.**

- `npm test`, `pytest`, `cargo test`, 프로젝트가 쓰는 게 뭐든 돌린다.
- 통과하면 결과를 보고한다. 실패하면 고치고 다시 돌린다.
- 테스트 세트가 없으면 최소한 빌드/컴파일은 확인한다.

### 4. 커밋은 명시적 승인이 있을 때만

**사용자가 명시적으로 요청하기 전엔 절대 커밋하지 않는다.**

- 사용자의 직접 요청 없이 `git add`, `git commit`, `git push`를 실행하지 않는다.
- 커밋 메시지를 제안할 수는 있지만 승인 없이 확정하지 않는다.

### 5. 에러를 읽는다, 추측하지 않는다

**실제 에러/로그 줄을 읽는다. 기억으로 패턴 매칭하지 않는다.**

뭔가 실패하면.
- 전체 에러 메시지와 스택 트레이스를 읽는다.
- 원인을 확인하기 전에 "흔한 수정법"을 적용하지 않는다.

## 새 프로젝트 세팅 (스캐폴딩)

"새 프로젝트에 AGENTS.md/CLAUDE.md/PLAYBOOK 세팅해줘", "mykit 초기화해줘", "스택 맞춰서
코딩 가이드라인 만들어줘" 같은 요청이 오면 이 절차를 따른다.

1. **스택 확인** — 아래 표를 참고해 대화로 선택지를 확인한다.

   | 옵션 | 값 | 비고 |
   |---|---|---|
   | `--lang` | `en`, `ko` | 기본 언어. 다른 하나는 항상 추가로 생성됨 |
   | `--frontend` | `nextjs`, `react-vite`, `vue-nuxt`, `sveltekit`, `vanilla-js` | 필수 |
   | `--css` | `tailwindcss`, `css-module` | 기본 `tailwindcss` |
   | `--backend` | `express`, `nestjs`, `spring` | 생략하면 프론트엔드 전용 |
   | `--db` | `postgres`, `mysql`, `mongodb`, `redis`, `supabase` | 반복 가능, 생략 가능 |
   | `--infra` | `aws`, `gcp`, `azure`, `vercel`, `kubernetes` | 반복 가능, 생략 가능 |
   | `--doc` | `security`, `testing` | 반복 가능 |
   | `--ai` | `agents`, `claude`, `cursor-rules`, `examples`, `all` | 반복 가능 |
   | `--commit` | `auto`, `manual` | 기본 `auto` |

2. **미리보기** — 타깃 프로젝트 디렉토리에서 다음을 실행해 생성될 파일 목록을 먼저
   확인하고 사용자에게 보여준다.
   ```bash
   node "$CLAUDE_PLUGIN_ROOT/bin/mykit.js" init --dry-run --frontend <..> --backend <..> \
     --db <..> --infra <..> --doc <..> --ai <..> --lang <..> --commit <..>
   ```
   `$CLAUDE_PLUGIN_ROOT`가 비어 있으면 이 SKILL.md 파일 자신의 경로에서 두 단계 위
   (`skills/mykit/` → plugin 루트)를 추론해 그 경로의 `bin/mykit.js`를 사용한다.

3. **의존성 확인** — `"$CLAUDE_PLUGIN_ROOT/node_modules/yaml"`가 없으면 실행 전에
   `(cd "$CLAUDE_PLUGIN_ROOT" && npm install --omit=dev)`를 먼저 돌린다.

4. **확정 생성** — 사용자가 미리보기를 승인하면 `--dry-run` 없이 같은 명령을 다시
   실행해 실제로 파일을 만든다.

5. **결과 보고** — `[mykit] Generated N files.` 출력과 생성된 파일 목록을 요약해 보여준다.

## 액션 프롬프트 (`actions/`)

사용자의 요청이 구체적인 개발 행위라면 먼저 해당 액션 문서를 읽는다. 액션은 dispatcher다.
철학 본문을 복사하지 않는다. `mustHold`와 서브액션 포인터와 체크리스트만 읽는다.

| 요청 | 먼저 열 문서 |
|---|---|
| primitive/재사용 컴포넌트/기존 화면의 제한된 UI 조각 추가, 폼 필드 Specify, feature/page에서 TextField나 ChipButton 직접 조립 | `actions/add-component.md` |
| 새 화면/route/dashboard/settings/list-detail/form workflow/화면 전체 layout 구현 | `actions/build-screen.md` |
| 코드 스타일 점검/mykit style/lint 전 리뷰/PR 전 스타일 확인 | `actions/review-code-style.md` |
| 기존 코드 전면 리팩토링. 기존 작품에 원칙을 심는 일 | `actions/code-refactoring.md` |
| 컴포넌트/훅/Store 계층 경계만 점검 | `actions/audit-hooks.md` |
| 데이터 요청 계층만 점검 | `actions/audit-api-layer.md` |
| 디자인 시스템 SSOT만 점검 | `actions/audit-a11y-ssot.md` |
| 컴포넌트 props/variant/타입 설계, 의미 단위 닫힘(`NameTextForm`) 점검 | `actions/audit-component-api.md` |
| 데이터 설계/사이드이펙트/정리(utils)/성능 위생만 점검 | `actions/audit-hygiene.md` |
| 가드/인가/RLS만 점검 | `actions/audit-auth.md` |
| README/API docs/playbook/ADR/사용자 가이드 수정 | `actions/update-docs.md` |
| mykit 자체 code-quality.md/규칙 문서 추가 또는 수정 | `actions/update-rules.md` |
| 버전 릴리즈/release 진행/배포 버전 올리기/develop→main 릴리즈 커밋 | `actions/release-version.md` |

각 행은 `commands/<파일명>.md`로도 노출돼 있어 `/mykit:add-component`,
`/mykit:code-refactoring`처럼 슬래시 커맨드로 바로 부를 수 있다.
기존 코드에 원칙을 심는 일은 `/mykit:code-refactoring`이다.

위 표에 없는 개발 작업은 전용 action 없이 이 SKILL.md의 행동 원칙과 아래 도메인
reference만 적용한다.

확인은 범위만 받는다. 합의한 범위 안에서는 원칙대로 만들고 사후에 보고한다. 새 파일
이름을 만들기 전에 따로 묻지 않는다. typo, 누락 import, 명백한 lint/type error처럼 좁고
되돌리기 쉬운 작업은 관례 확인 후 바로 진행할 수 있다. 기존 패턴과 동일한 단일 prop이라도
그 패턴이 위반이면 복제하지 않는다.

## 도메인별 참고 문서 (`references/`)

`references/en/`, `references/ko/`에 스택별 상세 지침이 있다. 지금 하려는 변경의 종류에
따라 아래 표에서 해당하는 파일만 열어본다. 전체를 순회하지 않는다.

문서 소유 관계는 다음과 같다.

- `skills/mykit/references/`는 에이전트가 작업 중 읽는 상세 행동 규칙이며 canonical source다.
- `templates/`는 새 프로젝트가 mykit 없이도 이해할 수 있게 생성하는 독립적인 축약 규칙이다.
- `playbook/`은 generator 산출물이다. 직접 복사해 맞추지 않고 template과 generator를 통해 갱신한다.

상세 reference와 template은 문장 전체가 같을 필요는 없지만 핵심 contract의 의미는 같아야 한다.

| 변경 종류 | 먼저 열 문서 |
|---|---|
| 요구사항/유저 플로우/범위 변경 | `references/en/core/readability.md`, `references/en/core/code-style.md` |
| API 스펙/에러 포맷/요청 응답 스키마 변경 | `references/en/backend/<스택>.md`, `references/en/core/error-handling.md`, `references/en/security.md`, `references/en/testing.md` |
| 엔터티/테이블/인덱스/관계 변경 | `references/en/core/data-design.md`, `references/en/database/<DB>.md`, `references/en/backend/<스택>.md` |
| 컴포넌트 구조/접근성/SVG 아이콘 변경, 폼 필드 추가, TextField를 화면에 조립 | `actions/add-component.md`, `references/philosophy/meaning-unit.md`, `references/philosophy/component-layers.md`(계층 표), `references/en/frontend/ui/component.md` |
| 폼 필드/입력/TextField/ChipButton을 feature나 page에서 직접 쓰거나 의미 단위로 닫기 | `actions/add-component.md`, `references/philosophy/meaning-unit.md`, `references/en/frontend/ui/component.md` |
| 새 화면/route/dashboard/settings/list-detail/form workflow/주요 page layout 변경 | `actions/build-screen.md`, `references/philosophy/meaning-unit.md`, `references/philosophy/component-layers.md`(계층 표), `references/en/frontend/ui/screen.md` |
| Tailwind/CSS Module/테마 변경 | `references/en/frontend/styling/<css>.md`, `references/en/frontend/styling/theme.md` |
| React Query 캐시/동기화/로딩 전략 변경 | `references/en/frontend/data/react-query.md`, `references/en/core/error-handling.md` |
| 번역 키/locale/SEO 메타데이터 변경 | `references/philosophy/i18n.md`, `references/en/frontend/content/i18n.md`, `references/en/frontend/content/seo.md` |
| 보안 정책/테스트 기준 변경 | `references/en/security.md`, `references/en/testing.md` |
| 배포/인프라/런타임 설정 변경 | `references/en/infra/<인프라>.md` |
| 반응형 레이아웃/동작 변경 | `references/philosophy/responsive.md`, `references/en/frontend/styling/<css>.md`, `references/en/frontend/ui/component.md` |
| 코드 스타일/문서 작업 | 해당 `actions/*.md`를 먼저 읽고 필요한 domain reference만 추가로 읽는다 |

한국어로 작업 중이면 같은 경로에서 `en`을 `ko`로 바꿔 읽는다.
