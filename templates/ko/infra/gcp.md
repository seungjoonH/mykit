# GCP 인프라

> GCE VM + Docker Compose 배포와 Cloud Run/GKE 배포 모두를 지원한다.
> Terraform/IaC, 세분화된 IAM, Cloud Monitoring 알람은 규모가 커질 때 도입을 권장한다.

## 규칙

- 배포 진입점(배포 스크립트, GitHub Actions 워크플로)과 런타임 환경변수 소스를 명시한다.
- secret은 repo에 커밋하지 않고 배포 환경에서 주입한다 (GitHub Secrets, Secret Manager 등).
- reverse proxy, app, worker, redis, db 등 서비스 간 연결 경계를 문서화한다.
- 배포 전 `docker compose config` 또는 동등한 설정 검증을 수행한다.
- 운영 로그에서 secret URL/token/password를 마스킹한다.
- 런타임 서비스에 광범위한 편집 권한을 부여하지 않는다.

## Do

- GCE VM 배포: 배포 스크립트에서 `docker compose pull && docker compose up -d`를 실행한다.
- 환경변수는 VM 내 `.env` 파일 또는 Secret Manager에서 주입한다.
- 네트워크 경계는 환경별(dev/staging/prod)로 명확히 분리한다.
- 규모가 커질 때: Terraform/IaC로 인프라를 코드로 관리하고, 서비스 계정을 최소 권한으로 설정한다.
- 규모가 커질 때: Cloud Logging/Cloud Monitoring + 알람 정책을 구성한다.

## Don't

- secret을 환경변수 이름 없이 스크립트에 하드코딩하지 않는다.
- VM에 직접 SSH로 파일을 수동 편집하지 않는다 — 배포 파이프라인을 거친다.
- 하나의 서비스 계정에 project-level editor 권한을 부여하지 않는다.

## 예시

```yaml
# docker-compose.prod.yml 검증 후 VM에 배포하는 GitHub Actions 단계
- name: Validate compose config
  run: docker compose -f docker-compose.prod.yml config --quiet

- name: Deploy to VM
  run: |
    ssh ${{ secrets.VM_USER }}@${{ secrets.VM_HOST }} "
      cd /app &&
      docker compose pull &&
      docker compose up -d --remove-orphans
    "
```

## 경계

- 배포 파이프라인(GitHub Actions 등)이 런타임 환경변수 주입과 compose 기동을 소유한다.
- 런타임 서비스는 명시적으로 허용된 포트/네트워크만 노출한다.
- Terraform/IaC 도입 전이라면: VM 설정 변경 시 변경 이력을 PR 또는 커밋으로 남긴다.

## 테스트 범위

- 배포 후 헬스체크 엔드포인트 응답 확인.
- 환경변수 누락 시 컨테이너 기동 실패 확인.
- secret이 로그에 출력되지 않는지 확인.
