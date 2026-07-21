# Kubernetes 인프라

## 규칙
- 매니페스트는 선언형으로 유지하고 환경 오버라이드 가능해야 한다.
- 모든 워크로드에 requests/limits를 강제한다.
- 롤아웃 전략과 헬스 프로브를 필수로 둔다.

## Do
- 런타임 값은 하드코딩 대신 ConfigMap/Secret 참조를 사용한다.

## Don't
- readiness/liveness probe 없이 워크로드를 배포하지 않는다.

## 예시
```yaml
containers:
  - name: api
    image: ghcr.io/org/api:1.2.3
    resources:
      requests: { cpu: "100m", memory: "128Mi" }
      limits: { cpu: "500m", memory: "512Mi" }
```

## 경계
- 플랫폼 매니페스트가 스케줄링/스케일링/네트워크 정책을 소유한다.
- 애플리케이션 이미지는 프로세스 동작을 소유한다.

## 테스트 범위
- 롤링 업데이트/롤백 동작 검증.
- 프로브 실패/복구 시나리오 검증.
