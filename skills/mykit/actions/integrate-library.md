# Integrate Library

새 dependency, SDK, 외부 API, UI kit, auth/payment/analytics/error tracking provider를 추가하거나
기존 integration을 바꿀 때 사용한다.

## Project Scan

- package manager와 lockfile.
- 기존 dependency와 같은 역할의 local helper가 있는지.
- framework 초기화 위치와 provider boundary.
- env var, secret, runtime config 관리 방식.
- bundle size, server/client boundary, SSR 영향.
- 테스트, mock, local development 전략.

## Confirmation Policy

새 dependency, external provider, env var, network call, bundle/runtime 영향이 생기면 확인받는다.
이미 설치된 라이브러리의 import typo나 기존 패턴과 동일한 설정 한 줄 수정은 바로 진행할 수 있다.

## Confirmation Prompt

```text
이 라이브러리 연동을 이렇게 진행하려고 합니다. 괜찮을까요?

목적.
클라이언트 에러를 수집하기 위해 error tracking SDK를 추가합니다.

대체 검토.
기존 logging helper는 서버 로그만 다루므로 브라우저 런타임 에러 수집에는 부족합니다.

추가될 것.
- dependency 1개.
- PUBLIC_DSN env var.
- app root provider 초기화.
- 테스트에서는 SDK를 mock 처리.

주의할 점.
- user/session 정보는 그대로 보내지 않습니다.
- client bundle 증가를 확인합니다.

검증.
- typecheck.
- SDK mock 기반 에러 전송 테스트.
- 환경변수 누락 시 안전하게 비활성화되는지 확인.

어떻게 진행할까요?
- 이대로 진행.
- dependency 없이 기존 helper 확장.
- env/config 정책 수정.
- 더 자세히 보기.
```

## Intake

- 왜 새 dependency가 필요한지.
- 기존 코드나 표준 API로 충분하지 않은지.
- runtime 위치. client, server, edge, worker, CLI.
- env var와 secret.
- initialization boundary.
- failure behavior.
- 테스트/mock 전략.
- bundle, security, license, maintenance 영향.

## Execution

1. 기존 dependency와 helper를 먼저 확인한다.
2. 새 dependency가 필요한 이유를 검증한다.
3. network access나 install이 필요하면 사용자 승인을 받는다.
4. 초기화 위치와 runtime boundary를 preview로 제안한다.
5. env var와 secret 노출을 분리한다.
6. mock/test 전략을 같이 구현한다.
7. install, typecheck, test, build 중 관련 검증을 실행한다.
