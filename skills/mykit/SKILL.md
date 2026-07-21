---
name: mykit
description: seungjoonH's personal engineering playbook and project-scaffolding toolkit. Consult this whenever writing, reviewing, or refactoring code for behavioral discipline beyond the baseline rules in CLAUDE.md/AGENTS.md — surfacing assumptions, staying simple, making surgical changes, defining verifiable goals, Korean-output conventions, commit hygiene, and reading errors instead of guessing. Also use this to scaffold a new project (stack-specific CLAUDE.md/AGENTS.md/playbook docs) whenever the user asks to set up, bootstrap, or initialize a project's coding guidelines, or says "mykit init".
license: MIT
---

# mykit

개인용 엔지니어링 플레이북이자 프로젝트 스캐폴딩 도구. CLAUDE.md/AGENTS.md에는 항상
지켜야 할 최소 원칙만 남겨두고, 나머지 상세 행동 지침과 스택별 참고 문서는 여기서
필요할 때 불러온다.

**Tradeoff:** 이 지침들은 속도보다 신중함 쪽으로 치우쳐 있다. 사소한 작업에는 판단력을
발휘한다.

## 행동 원칙

### 1. Think Before Coding

**추측하지 않는다. 헷갈리는 걸 숨기지 않는다. 트레이드오프를 드러낸다.**

구현 전에.
- 가정을 명시적으로 말한다. 확신이 없으면 묻는다.
- 여러 해석이 가능하면 제시한다 — 조용히 하나를 골라잡지 않는다.
- 더 단순한 방법이 있으면 말한다. 필요하면 되받아친다.
- 뭔가 불명확하면 멈춘다. 뭐가 헷갈리는지 이름 붙인다. 묻는다.

### 2. Simplicity First

**문제를 푸는 최소한의 코드. 추측성 코드는 없다.**

- 요청받지 않은 기능은 넣지 않는다.
- 한 번만 쓰는 코드에 추상화를 만들지 않는다.
- 요청받지 않은 "유연성"이나 "설정 가능성"은 넣지 않는다.
- 일어날 수 없는 시나리오에 대한 에러 처리는 하지 않는다.
- 200줄을 썼는데 50줄로 될 것 같으면 다시 쓴다.

스스로에게 묻는다: "시니어 엔지니어가 이걸 보면 과하다고 할까?" 그렇다면 단순화한다.

### 3. Surgical Changes

**꼭 필요한 것만 건드린다. 내가 어지른 것만 치운다.**

기존 코드를 고칠 때.
- 인접한 코드/주석/포맷팅을 "개선"하지 않는다.
- 망가지지 않은 걸 리팩터링하지 않는다.
- 스타일이 다르더라도 기존 스타일에 맞춘다.
- 관련 없는 죽은 코드를 발견하면 언급만 한다 — 지우지 않는다.

내 변경이 고아를 만들면.
- 내 변경 때문에 안 쓰이게 된 import/변수/함수는 제거한다.
- 원래 있던 죽은 코드는 요청받지 않으면 지우지 않는다.

테스트 기준은 바뀐 줄 하나하나가 사용자 요청으로 직접 추적되는 것이다.

### 4. Goal-Driven Execution

**성공 기준을 정의한다. 검증될 때까지 반복한다.**

작업을 검증 가능한 목표로 바꾼다.
- "검증 추가" → "잘못된 입력에 대한 테스트를 쓰고, 통과시킨다"
- "버그 고쳐줘" → "버그를 재현하는 테스트를 쓰고, 통과시킨다"
- "X 리팩터링" → "리팩터링 전후로 테스트가 통과하는지 확인한다"

여러 단계짜리 작업이면 간단한 계획을 말한다.
```
1. [단계] → 검증: [확인할 것]
2. [단계] → 검증: [확인할 것]
3. [단계] → 검증: [확인할 것]
```

성공 기준이 명확하면 혼자 반복할 수 있다. 기준이 약하면("되게 해줘") 계속 되물어야 한다.

### 5. 콜론으로 문장을 끝내지 않는다 (한국어 출력)

**한국어 문장은 콜론이 아니라 마침표로 끝낸다.**

사용자가 한국어로 쓰면 출력도 한국어다.
- 다음 줄이 목록이나 예시라도 `:`으로 문장을 끝내지 않는다.
- 영어 문서로 학습된 LLM은 콜론 습관을 한국어에 흘린다. 잡아낸다.
- 테스트: 모든 한국어 문장 종결부는 `.`, `?`, `!` 중 하나여야 한다 — `:`이 아니다.
- 코드, 키-값 쌍, 라벨 안의 콜론은 괜찮다. 문장 종결자로만 안 된다.

### 6. 새 파일 첫 줄에 한국어 주석

**새로 만드는 소스 파일 첫 줄에 그 파일의 역할을 한 줄 한국어 주석으로 남긴다.**

새 파일을 만들 때.
- TypeScript/JavaScript: `// 사용자 인증 상태를 관리하는 Context Provider`
- Python: `# KIS API 호출을 비동기로 래핑하는 클라이언트`
- SQL: `-- 일별 집계 결과를 저장하는 머티리얼라이즈드 뷰`
- 필수 지시문(`'use client'`, `'use server'`, shebang) 바로 아래에 둔다.
- 설정 파일(`*.config.ts`, `package.json` 등)은 생략한다.

이유: 에이전트는 코드베이스 전체가 아니라 필요한 파일만 골라 읽는다. 한 줄짜리 한국어
헤더가 있으면 다음 세션(사람이든 에이전트든)이 전체를 다시 읽지 않고도 즉시 맥락을
파악할 수 있다.

### 7. Plan + Checklist + Context Notes

**중요한 작업 전엔 세 가지 산출물을 먼저 만든다. 없이 코딩부터 시작하지 않는다.**

- **Plan** — 뭘 왜 만드는지.
- **Checklist**(`checklist.md`) — 체크박스로 된 구체적 작업 목록. 진행하며 체크한다.
- **Context Notes**(`context-notes.md`) — 작업 중 내린 결정과 그 이유. 계속 append한다.

사용자가 계획만 주고 코딩을 시작하라고 하면 멈추고 묻는다: "체크리스트랑 컨텍스트
노트부터 만들까요?" 다음 세션(나 자신이든 다른 사람이든)이 모든 결정을 다시 추론하지
않고도 이어받으려면 이 노트가 필요하다.

### 8. 완료 선언 전에 테스트를 돌린다

**코드를 건드렸으면 "완료"라고 말하기 전에 테스트를 돌린다.**

- `npm test`, `pytest`, `cargo test`, 프로젝트가 쓰는 게 뭐든 돌린다.
- 통과하면 결과를 보고한다. 실패하면 고치고 다시 돌린다.
- 테스트 세트가 없으면 최소한 빌드/컴파일은 확인한다.
- 사용자가 "끝", "완료", "다 됐어"라고 신호를 보내기 전에 먼저 돌린다.

LLM이 가장 자주 건너뛰는 단계다. 타협 없이 지킨다.

### 9. Semantic Commits

**논리적 변경 하나가 끝나면 커밋한다. 사용자가 물어볼 때까지 기다리지 않는다.**

- 테스트: "이 커밋을 한 문장으로 설명할 수 있나?" 그렇다면 커밋한다. 아니라면 아직
  변경이 섞여 있는 것 — 나눈다.
- 좋음: "auth 미들웨어 추가". 나쁨: "auth 추가하고 UI도 고치고 버그도 수정"(3개로 나눌 것).
- 관련 없는 수정 20개를 쌓아두고 개별적으로 되돌릴 수 없게 만들지 않는다.
- 커밋을 위한 커밋은 하지 않는다 — 의미 있는 단위만.

Note: 혼자 하는 프로토타입이나 버릴 스크립트라면 커밋을 느슨하게 묶어도 된다. 핵심은
가역성이지 격식이 아니다.

### 10. 에러를 읽는다, 추측하지 않는다

**실제 에러/로그 줄을 읽는다. 기억으로 패턴 매칭하지 않는다.**

뭔가 실패하면.
- 전체 에러 메시지와 스택 트레이스를 읽는다.
- 실제 로그 출력을 확인한다, 이래야 할 거라고 짐작한 내용이 아니라.
- 원인을 확인하기 전에 "흔한 수정법"을 적용하지 않는다.
- 불명확하면 상태를 확인할 print/log를 추가한 뒤 고친다.

"테스트 돌리기" 다음으로 LLM이 가장 자주 건너뛰는 단계다. 에러 키워드로 짐작하고
가장 최근에 봤던 패턴을 적용한다. 그렇게 한 줄짜리 버그가 세 파일짜리 리팩터링이 된다.

---

**이 원칙들이 잘 작동하고 있다는 신호**: diff에 불필요한 변경이 줄어든다, 과설계 때문에
다시 쓰는 일이 줄어든다, 실수 이후가 아니라 구현 전에 명확화 질문이 나온다.

## 새 프로젝트 세팅 (스캐폴딩)

"새 프로젝트에 AGENTS.md/CLAUDE.md/PLAYBOOK 세팅해줘", "mykit 초기화해줘", "스택 맞춰서
코딩 가이드라인 만들어줘" 같은 요청이 오면 이 절차를 따른다.

1. **스택 확인** — 아래 표를 참고해 대화로 선택지를 확인한다(원래 CLI의 인터랙티브
   프롬프트를 대체하는 것).

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
   `$CLAUDE_PLUGIN_ROOT`가 비어 있으면(플러그인 스킬 본문 실행 경로에서 주입이 안 되는
   경우), 이 SKILL.md 파일 자신의 경로에서 두 단계 위(`skills/mykit/` → plugin 루트)를
   추론해 그 경로의 `bin/mykit.js`를 사용한다.

3. **의존성 확인** — `"$CLAUDE_PLUGIN_ROOT/node_modules/yaml"`가 없으면 실행 전에
   `(cd "$CLAUDE_PLUGIN_ROOT" && npm install --omit=dev)`를 먼저 돌린다.

4. **확정 생성** — 사용자가 미리보기를 승인하면 `--dry-run` 없이 같은 명령을 다시
   실행해 실제로 파일을 만든다.

5. **결과 보고** — `[mykit] Generated N files.` 출력과 생성된 파일 목록을 요약해 보여준다.

## 액션 프롬프트 (`actions/`)

사용자의 요청이 구체적인 개발 행위라면 먼저 해당 액션 문서를 읽는다. 액션 문서는
사용자에게 긴 폼을 요구하지 않고, 에이전트가 기본안을 제안한 뒤 확인 또는 수정을 받는
절차를 정의한다.

| 요청 | 먼저 열 문서 |
|---|---|
| 도메인 기능/사용자 기능/프로젝트 기능 추가. 예: 알림, 검색, 북마크, 관리자 초대, 장바구니 | `actions/add-feature.md` |
| 컴포넌트/폼/모달/카드/필터/리스트/패널/툴바/컨트롤 추가 | `actions/add-component.md` |
| 페이지/라우트/화면/섹션/navigation target 추가 | `actions/add-page.md` |
| API/endpoint/controller/handler/resolver/procedure 추가 | `actions/add-api-endpoint.md` |
| DB schema/entity/model/migration/index/relation 변경 | `actions/change-data-model.md` |
| 테스트 추가/보강/회귀 테스트/접근성 테스트/성능 테스트 | `actions/test-code.md` |
| 코드 스타일 점검/mykit style/lint 전 리뷰/PR 전 스타일 확인 | `actions/review-code-style.md` |
| 리팩터링/구조 정리/중복 제거/책임 분리 | `actions/refactor-code.md` |
| 버그/에러/이상 동작/flaky behavior 수정 | `actions/fix-bug.md` |
| 성능 개선/최적화/느린 렌더링/느린 query 개선 | `actions/improve-performance.md` |
| 보안 검토/auth/permission/secret/rate limit 점검 | `actions/review-security.md` |
| 라이브러리/SDK/외부 API/UI kit/payment/auth provider 연동 | `actions/integrate-library.md` |
| cron/queue/worker/scheduler/batch/background job 추가 | `actions/add-background-job.md` |
| PR/diff/branch/staged changes 리뷰 | `actions/review-pr.md` |
| README/API docs/playbook/ADR/사용자 가이드 수정 | `actions/update-docs.md` |

사용자가 `mykit add-component`처럼 명시적으로 말하지 않아도 자연어 요청을 보고 적절한
액션을 고른다. 액션 문서가 안내하는 범위 안에서 필요한 철학 문서만 추가로 읽는다. 예를
들어 UI 컴포넌트 작업은 `references/philosophy/component-layers.md`,
`references/philosophy/accessibility.md`, `references/philosophy/responsive.md`,
`references/philosophy/i18n.md`를 선택적으로 참조한다.

모든 액션은 먼저 해당 프로젝트의 관례를 확인한다. framework, package manager, directory
structure, nearby files, test style, error/i18n/a11y/responsive/security 패턴을 읽고 그
프로젝트에 맞춘 preview를 만든다. 특정 stack이나 API style을 기본값으로 고정하지 않는다.

새 surface area, public contract, 데이터 모델, 보안, 성능, 테스트 기준에 영향을 주는 작업은
preview 확인을 받는다. typo, 누락 import 제거, 명백한 lint/type error, 기존 패턴과 동일한
단일 prop 전달, 테스트 expectation 메시지 오타처럼 좁고 되돌리기 쉬운 작업은 관례 확인 후
바로 진행할 수 있다.

## 도메인별 참고 문서 (`references/`)

`references/en/`, `references/ko/`에 스택별 상세 지침이 있다. 지금 하려는 변경의 종류에
따라 아래 표에서 해당하는 파일만 열어본다 — 전체를 순회하지 않는다.

| 변경 종류 | 먼저 열 문서 |
|---|---|
| 요구사항/유저 플로우/범위 변경 | `references/en/core/readability.md`, `references/en/core/code-style.md` |
| API 스펙/에러 포맷/요청 응답 스키마 변경 | `actions/add-api-endpoint.md`, `references/en/backend/<스택>.md`, `references/en/core/error-handling.md`, `references/en/security.md`, `references/en/testing.md` |
| 엔터티/테이블/인덱스/관계 변경 | `actions/change-data-model.md`, `references/en/core/data-design.md`, `references/en/database/<DB>.md`, `references/en/backend/<스택>.md` |
| 컴포넌트 구조/접근성/SVG 아이콘 변경 | `actions/add-component.md`, `references/philosophy/component-layers.md`, `references/philosophy/accessibility.md`, `references/en/frontend/stacks/<스택>.md`, `references/en/frontend/ui/component.md`, `references/en/frontend/ui/accessibility.md` |
| Tailwind/CSS Module/테마 변경 | `references/en/frontend/styling/<css>.md`, `references/en/frontend/styling/theme.md` |
| React Query 캐시/동기화/로딩 전략 변경 | `references/en/frontend/data/react-query.md`, `references/en/core/error-handling.md` |
| 번역 키/locale/SEO 메타데이터 변경 | `references/philosophy/i18n.md`, `references/en/frontend/content/i18n.md`, `references/en/frontend/content/seo.md` |
| 보안 정책/테스트 기준 변경 | `actions/review-security.md`, `actions/test-code.md`, `references/en/security.md`, `references/en/testing.md` |
| 배포/인프라/런타임 설정 변경 | `references/en/infra/<인프라>.md` |
| 반응형 레이아웃/동작 변경 | `references/philosophy/responsive.md`, `references/en/frontend/styling/<css>.md`, `references/en/frontend/ui/component.md` |
| 코드 스타일/리팩터링/버그/성능/라이브러리/백그라운드 작업/PR 리뷰/문서 작업 | 해당 `actions/*.md`를 먼저 읽고 필요한 domain reference만 추가로 읽는다 |

한국어로 작업 중이면 같은 경로에서 `en`을 `ko`로 바꿔 읽는다. `<스택>`/`<DB>`/`<css>`/
`<인프라>`는 실제 프로젝트에서 쓰는 값으로 치환한다(예: `references/en/backend/nestjs.md`).

`references/EXAMPLES.md`에는 위 행동 원칙 각각의 구체적인 Before/After 예시가 있다 —
원칙 적용 방식이 애매할 때 참고한다.
