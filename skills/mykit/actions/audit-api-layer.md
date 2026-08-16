# Audit API Layer

기존 코드의 데이터 요청 계층(fetch, 실패 처리, client 모듈 응집성)을 감사하고 구조적으로
고칠 때 사용한다. 언어나 스택에 무관하게 적용된다. 프론트엔드 전용이 아니다. 컴포넌트/훅
경계 자체는 `audit-hooks.md`, SSOT는 `audit-a11y-ssot.md`로 라우팅한다.

대상이 파일 경로처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로 넘어간다. 대상이
없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 저장소 전체를 훑어야 하면 아래
키워드로 후보를 먼저 좁힌다.

- `fetch(`
- `try {` 근처의 요청/파싱 코드
- `.json()`

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 기존 규칙.
- 기존 공용 client/service 모듈(fetch를 감싸는 layer가 있는지, 있다면 그 모듈의 계약).
- 같은 리소스를 다루는 API 호출이 여러 파일에 흩어져 있는지.
- 대상 파일과 가까운 call site, 동일 패턴이 반복되는 다른 파일.

## Confirmation Policy

client 모듈 신설이나 통합은 여러 호출부에 영향을 주므로 대부분 확인을 받는다.

바로 고칠 수 있는 항목.

- 명백한 dead import/export 제거.

확인받고 고칠 항목.

- 호출부마다 반복되는 요청 실패 처리를 하나의 client로 통합.
- 같은 리소스를 다루는 개별 API 호출 함수를 하나의 서비스 모듈로 묶어 응집성 확보.
- 호출부가 URL, method, header를 직접 조립하던 것을 도메인 서비스 함수로 은닉.

## Confirmation Prompt

```text
mykit API 계층 감사 기준으로 보면 후보는 1개입니다.

구조 변경: 확인 필요.
ProfileSettingsPanel 안의 fetch 3곳이 각자 try/catch와 에러 매핑을 반복하고, URL과 method도
호출부에 그대로 노출돼 있습니다. ProfileService 도메인 함수로 묶어서 은닉하는 걸 제안합니다.

어떻게 진행할까요?
- 전체 후보 적용.
- 항목별로 선택.
- 리뷰만 하고 멈추기.
```

## Review Checklist

- fetch + 실패 처리(파싱, 에러 매핑)가 공용 client 모듈을 통과하는가.
- 호출부마다 `try/catch`, 응답 파싱, 에러 코드 매핑을 반복 구현하는가.
- 호출부(컴포넌트, 훅)가 URL, method, header를 직접 조립하는가. 도메인 서비스 함수로
  은닉돼야 한다.
- 같은 리소스의 API 호출이 개별 함수로 흩어져 있고 하나의 서비스 모듈로 안 묶여 있는가.

## Execution

1. 대상이 명시되지 않았으면 대상부터 확인한다.
2. `code-quality.md`(또는 프로젝트 `playbook/`) 규칙을 먼저 확인한다.
3. 대상 파일과 동일 패턴이 반복되는 다른 파일을 함께 읽는다.
4. 후보를 `바로 고칠 수 있음`, `확인 필요`로 나눈다.
5. 확인 필요 항목은 Confirmation Prompt로 사용자 승인을 받는다.
6. 승인된 범위만 수정한다.
7. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
