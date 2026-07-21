# Review Security

보안 검토, 인증/인가 변경, 입력 검증, 비밀정보, rate limit, 로깅, dependency risk를 다룰 때
사용한다.

## Project Scan

- auth/session/user context 흐름.
- authorization policy와 role/permission 모델.
- input validation과 output serialization.
- secret/env 관리 방식.
- logging, audit, rate limit, CSRF/CORS 정책.
- 기존 security test와 threat model 문서.

## Confirmation Policy

보안 경계, 권한 정책, 외부 노출, 민감정보 처리 변경은 확인받는다. 명백한 secret masking 누락처럼
작고 즉시 위험한 수정은 관례 확인 후 바로 고칠 수 있지만, 후속 보고에 반드시 남긴다.

## Confirmation Prompt

```text
보안 검토를 이렇게 진행하겠습니다. 괜찮을까요?

대상.
POST /admin/users

보호할 것.
관리자 전용 사용자 생성 권한과 초대 토큰.

확인할 경계.
- 인증된 사용자 여부.
- admin 권한 확인 위치.
- request validation.
- secret/token이 response나 log에 노출되지 않는지.
- 실패 시 error format.

만족 조건.
- 권한 없는 사용자는 403.
- 토큰은 저장/로그/응답에서 안전하게 처리.
- 기존 auth 테스트는 계속 통과.

어떻게 진행할까요?
- 이대로 검토.
- 테스트까지 추가.
- 수정까지 진행.
- 더 자세히 보기.
```

## Intake

- 보호할 자산.
- 신뢰 경계.
- 인증과 인가.
- 입력 검증과 출력 노출.
- secret/token/password 처리.
- rate limit, replay, CSRF/CORS 필요성.
- logging과 audit.
- 검증 또는 테스트 범위.

## Execution

1. 관련 경계와 기존 정책을 읽는다.
2. 취약점 후보를 `즉시 수정`, `권장`, `관찰`로 나눈다.
3. 사용자 요청 범위와 위험도를 기준으로 수정 범위를 확인받는다.
4. 보안 수정을 위해 unrelated refactor를 하지 않는다.
5. 관련 security test, API test, lint/audit 중 필요한 검증을 실행한다.
