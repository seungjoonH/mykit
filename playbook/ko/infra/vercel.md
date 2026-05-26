# Vercel 인프라

## 규칙
- 환경변수는 환경 단위로 엄격히 분리한다.
- 모든 PR은 Preview Deployment를 거친다.
- 검증된 Preview만 Production으로 승격한다.

## Do
- 프로젝트 빌드/런타임 설정을 소스 관리되는 설정 파일로 유지한다.

## Don't
- Preview 검증 없이 production 전용 변경을 바로 배포하지 않는다.

## 예시
```json
{
  "framework": "nextjs",
  "functions": {
    "app/api/**/route.ts": { "maxDuration": 30 }
  }
}
```

## 경계
- Vercel 프로젝트 설정이 배포/런타임 정책을 소유한다.
- 앱 코드는 프레임워크 동작과 엔드포인트를 소유한다.

## 테스트 범위
- Preview URL 스모크 테스트.
- Production 환경변수 완전성 검증.
