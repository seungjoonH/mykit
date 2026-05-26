# AWS 인프라

## 규칙
- 기본적으로 최소 권한 IAM Role 정책을 적용한다.
- 환경은 계정 또는 강한 경계로 분리한다.
- 인프라 변경은 IaC로 재현 가능해야 한다.

## Do
- CloudWatch 메트릭/로그와 서비스 단위 알람을 사용한다.

## Don't
- IaC 동기화 없이 콘솔 수동 변경만 적용하지 않는다.

## 예시
```hcl
resource "aws_iam_role_policy" "app_read_s3" {
  role = aws_iam_role.app_role.id
  policy = data.aws_iam_policy_document.read_assets.json
}
```

## 경계
- IaC 계층이 리소스와 권한을 정의한다.
- 애플리케이션 계층은 프로비저닝된 리소스만 소비한다.

## 테스트 범위
- 핵심 액션에 대한 IAM 권한 시뮬레이션.
- 스테이징 환경에서 헬스/알람 동작 검증.
