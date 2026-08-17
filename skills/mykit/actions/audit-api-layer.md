# Audit API Layer

기존 코드의 데이터 요청 계층을 감사한다. 내부를 client 체크와 route-handler 체크로 나눈다.
언어나 스택에 무관하게 적용된다. 프론트엔드 전용이 아니다. 컴포넌트/훅 경계는
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-hooks.md`, SSOT는
`$CLAUDE_PLUGIN_ROOT/skills/mykit/actions/audit-a11y-ssot.md`로 라우팅한다.

대상이 파일 경로처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로 넘어간다. 대상이
없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 저장소 전체를 훑어야 하면 아래
키워드로 후보를 먼저 좁힌다.

- `fetch(`
- `try {` 근처의 요청/파싱 코드
- `.json()`
- 라우트 핸들러 파일(`route.ts`, controller 등)의 `instanceof.*Error` 반복
- 반복문 안의 `await`가 붙은 DB 호출(N+1 후보)

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 해당 절만 `source-rule-map`으로 연다.
- 기존 공용 client/service 모듈(fetch를 감싸는 layer가 있는지, 있다면 그 모듈의 계약).
- 같은 리소스를 다루는 API 호출이 여러 파일에 흩어져 있는지.
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.

## 확인 정책

확인은 범위만 받는다. 합의한 범위 안에서는 client 통합과 서비스 모듈 추출을 원칙대로
하고 사후에 보고한다. 새 파일 이름을 만들기 전에 따로 묻지 않는다. 범위 밖은 고치지
않고 보고만 한다.

## Confirmation Prompt

```text
이번에 만지는 범위는 이 요청 계층입니다.

범위 안에서 할 것.
ProfileSettingsPanel의 fetch 3곳을 ProfileService 도메인 함수로 묶는다.

범위 밖. 고치지 않고 보고만 한다.
(없으면 생략)

어떻게 진행할까요?
- 이 범위로 고친다.
- 범위 수정.
```

## Review Checklist

- fetch + 실패 처리(파싱, 에러 매핑)가 공용 client 모듈을 통과하는가.
- 호출부마다 `try/catch`, 응답 파싱, 에러 코드 매핑을 반복 구현하는가.
- 호출부(컴포넌트, 훅)가 URL, method, header를 직접 조립하는가. 도메인 서비스 함수로
  은닉돼야 한다.
- 같은 리소스의 API 호출이 개별 함수로 흩어져 있고 하나의 서비스 모듈로 안 묶여 있는가.
- 여러 라우트 핸들러가 같은 에러 타입 조건을 상태 코드용, 메시지용으로 각자 반복 판단하는가.
- 파싱, 검증, 에러 매핑, rollback 흐름이 두 핸들러에 거의 그대로 복사돼 있는가.
- 다단계 쓰기 작업에서 일부 단계만 실패 시 되돌리고 나머지는 실패해도 그냥 넘어가는가.
- 반복문 안에서 항목 개수만큼 DB 호출이 발생하는가(N+1).

## Execution

1. 대상이 명시되지 않았으면 범위부터 확인한다.
2. `code-quality.md`(있으면 프로젝트의 `playbook/`)의 해당 절만 `source-rule-map`으로 연다.
3. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
4. 후보를 범위 안 수정 / 범위 밖 보고로 나눈다.
5. 합의한 범위 안에서 원칙대로 고친다. 새 파일 이름을 만들기 전에 따로 묻지 않는다.
6. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
