# Code Refactoring

기존 코드를 mykit 구조/설계 원칙 기준으로 폭넓게 감사할 때 쓰는 진입점이다. 실제 체크는
아래 5개 독립 action이 도메인별로 나눠 갖고 있고, 이 문서는 대상을 확인한 뒤 관련
action만 골라 돌리는 dispatcher 역할만 한다. 특정 관심사 하나만 보고 싶으면 이 문서를
거치지 않고 해당 action을 바로 불러도 된다.

| 관심사 | action | 스코프 |
|---|---|---|
| 컴포넌트/훅/Store 경계 | `audit-hooks.md` | 프론트엔드 전용 |
| 데이터 요청 계층 | `audit-api-layer.md` | 언어/스택 무관 |
| 디자인 시스템 SSOT | `audit-a11y-ssot.md` | 프론트엔드 전용 |
| 컴포넌트 API(props/variant/타입) | `audit-component-api.md` | 프론트엔드 전용 |
| 데이터 설계, 사이드이펙트, 정리/utils, 성능 | `audit-hygiene.md` | 언어/스택 무관 |

단일 statement block 압축, guard clause 정리, JSX 밖 계산 추출처럼 좁고 되돌리기 쉬운 스타일
문제만 있으면 `review-code-style.md`로 라우팅한다. 새 컴포넌트/화면을 만드는 작업이면
`add-component.md`/`build-screen.md`로 라우팅한다.

## 대상 확인

호출 시 대상이 파일 경로나 "이 컴포넌트"처럼 구체적으로 지칭돼 있으면 이 단계를 건너뛴다.
대상이 명시되지 않았으면 먼저 하나만 확인한다.

- 전체 코드베이스
- dirty worktree (지금 변경된 파일)
- 사용자 지정 (파일/디렉터리를 직접 알려줌)

## 관련 action 판별

대상 파일 종류에 따라 관련 있는 action만 돈다. 백엔드 전용 프로젝트나 파일이면
`audit-api-layer`/`audit-hygiene`만 적용하고 나머지는 건너뛴다.

| 대상 | 적용 action |
|---|---|
| `.tsx`/`.jsx` 포함 | `audit-hooks`, `audit-a11y-ssot`, `audit-component-api` + 아래 공통 |
| 항상(언어 무관) | `audit-api-layer`, `audit-hygiene` |

`전체 코드베이스`를 고르면 모든 파일을 읽지 않는다. 각 audit action이 자기 문서에 갖고
있는 grep 키워드로 먼저 후보 파일을 좁히고, 좁혀진 파일만 읽는다. 키워드로 좁힌 뒤에도
후보가 너무 많으면(예: 수십 개 이상) fork나 서브에이전트로 위임한다.

## Execution

1. 대상이 명시되지 않았으면 대상 확인 질문부터 한다.
2. 대상 파일 종류로 관련 action을 판별한다.
3. 각 관련 action 문서를 읽고, 그 문서의 Project Scan과 Review Checklist를 대상에
   적용한다.
4. 각 action에서 나온 후보를 하나로 종합해 `바로 고칠 수 있음`, `확인 필요`로 나눈다.
5. 종합한 Confirmation Prompt(형식은 각 action의 예시와 동일)로 사용자 승인을 받는다.
6. 승인된 범위만 수정한다. 승인 없이 hook 분리, API 변경, 파일 분리를 진행하지 않는다.
7. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
