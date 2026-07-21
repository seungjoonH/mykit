# Review PR

PR, branch diff, staged changes, 특정 변경 묶음을 리뷰할 때 사용한다. 구현 action과 달리 findings를
먼저 제시하고, 변경 요약은 뒤에 둔다.

## Project Scan

- diff 범위. staged, working tree, branch compare, 특정 파일.
- 관련 테스트와 CI 상태.
- 변경된 public contract, data model, auth/security boundary.
- 기존 playbook, action, philosophy 문서 중 관련 기준.
- user-owned dirty worktree와 내가 만든 변경의 구분.

## Confirmation Policy

리뷰 요청은 기본적으로 수정하지 않는다. 사용자가 “고쳐줘”라고 명시하면 별도 action으로 전환해
승인된 항목만 수정한다.

## Review Output

findings를 먼저 쓴다. 심각도 순으로 정렬하고 파일/라인 근거를 붙인다.

```text
Findings.

1. P1. 인증 없는 사용자가 주문 생성 API를 호출할 수 있습니다.
   file: ...
   이유: controller가 user context를 읽지 않고 body.userId를 신뢰합니다.
   영향: 다른 사용자 명의 주문 생성 가능.

2. P2. 실패 케이스 테스트가 없습니다.
   file: ...
   이유: 400/401/409 계약을 추가했지만 성공 테스트만 있습니다.

Open questions.
- 재고 부족은 409로 고정하는 게 맞나요?

Summary.
- 주문 생성 endpoint와 DTO가 추가되었습니다.
- service는 아직 transaction boundary가 없습니다.

Verification.
- npm test는 아직 실행하지 않았습니다.
```

## Review Checklist

- Behavioral regression.
- Missing tests.
- Public API contract mismatch.
- Auth/authorization bypass.
- Input validation and output leakage.
- Data migration and backward compatibility risk.
- Async retry/idempotency risk.
- Performance regression.
- i18n/a11y/responsive regression for UI changes.
- Overbroad refactor or unrelated formatting churn.

## Execution

1. 리뷰 범위를 확인한다.
2. diff와 관련 call site를 읽는다.
3. 테스트가 있으면 결과를 확인한다. 없으면 test gap을 명시한다.
4. findings-first로 보고한다.
5. 근거 없는 취향 코멘트는 피한다.
6. 고칠지 묻지 않고, 사용자가 요청하면 별도 수정 action으로 진행한다.
