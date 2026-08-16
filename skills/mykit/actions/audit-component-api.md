# Audit Component API

기존 컴포넌트의 props/variant/타입 설계를 감사하고 구조적으로 고칠 때 사용한다.
프론트엔드 전용이다. 컴포넌트 내부 로직(훅 경계)은 `audit-hooks.md`로 라우팅한다.

대상이 파일 경로처럼 구체적으로 지칭돼 있으면 바로 Project Scan으로 넘어간다. 대상이
없으면 "어떤 파일/디렉터리를 볼까요?"만 짧게 묻는다. 이 체크리스트는 키워드로 좁히기
어렵다. 대상 파일을 직접 읽으면서 확인한다.

## Project Scan

- `code-quality.md`(있으면 프로젝트의 `playbook/`)의 컴포넌트 API 규칙(§5).
- 프로젝트의 기존 variant 패턴, Base + Named Export 패턴 사용 여부.
- 대상 컴포넌트의 호출부(같은 prop을 실제로 어떻게 쓰는지).

## Confirmation Policy

public prop 변경은 호출부에 영향을 주므로 확인을 받는다.

바로 고칠 수 있는 항목.

- 없음. props 변경은 public API 변경이라 전부 확인을 받는다.

확인받고 고칠 항목.

- 한 값으로 유추 가능한 중복 prop 제거.
- 임의 문자열 variant/size를 타입으로 제한.
- variant가 여러 개인데 Base + Named Export 패턴이 안 쓰였으면 도입.
- 컴포넌트 파일에 섞인 타입을 `type.ts`로 분리.
- 함수 시그니처의 인라인 객체 타입 리터럴을 이름 있는 타입으로 교체.

## Confirmation Prompt

```text
mykit 컴포넌트 API 감사 기준으로 보면 후보는 1개입니다.

컴포넌트 API: 확인 필요.
AddChildForm이 { accountId }: { accountId: string } 형태로 인라인 타입을 받고 있습니다.
AddChildFormProps로 이름 있는 타입을 분리하는 걸 제안합니다.

어떻게 진행할까요?
- 전체 후보 적용.
- 항목별로 선택.
- 리뷰만 하고 멈추기.
```

## Review Checklist

- 한 값으로 유추 가능한 중복 prop이 있는가.
- variant/size가 임의 문자열이 아니라 타입으로 제한돼 있는가.
- variant가 여러 개인데 Base + Named Export 패턴이 안 쓰였는가.
- 타입이 컴포넌트 파일에 섞여 있고 `type.ts`로 분리 안 됐는가.
- Props가 함수 시그니처에 인라인 객체 타입 리터럴로 돼 있고 이름 있는 타입이 없는가.

## Execution

1. 대상이 명시되지 않았으면 대상부터 확인한다.
2. `code-quality.md`(또는 프로젝트 `playbook/`) 규칙과 대상 컴포넌트의 실제 호출부를
   먼저 확인한다.
3. Confirmation Prompt로 사용자 승인을 받는다.
4. 승인된 범위만 수정한다. public prop 변경은 모든 호출부를 함께 갱신한다.
5. 관련 lint/typecheck/test 중 가장 작은 검증을 실행한다.
