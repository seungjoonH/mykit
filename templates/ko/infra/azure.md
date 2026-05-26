# Azure 인프라

## 규칙
- 최소 권한 RBAC와 관리형 ID를 강제한다.
- 워크로드는 리소스 그룹/환경 정책 단위로 분리한다.
- Bicep/Terraform 기반 선언형 인프라를 유지한다.

## Do
- Azure Monitor/Log Analytics로 진단을 중앙화한다.

## Don't
- 앱 런타임 ID에 owner 급 권한을 부여하지 않는다.

## 예시
```bicep
resource appIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'app-identity'
  location: resourceGroup().location
}
```

## 경계
- 플랫폼 계층이 ID/네트워크 정책을 소유한다.
- 애플리케이션 계층은 배포 아티팩트만 소유한다.

## 테스트 범위
- RBAC 할당 검증.
- 진단/알람 규칙 커버리지 검증.
