# MongoDB 규칙

## 규칙
- 문서 모델은 실제 조회/갱신 패턴 중심으로 설계한다.
- 유연한 스키마여도 validation 규칙을 유지한다.
- 필터/정렬 조합 기준으로 복합 인덱스를 설계한다.

## Do
- 스키마 진화 시 버전 필드/호환 전략을 명시한다.

## Don't
- 무한히 커지는 배열 필드를 설계하지 않는다.

## 예시
```ts
await users.updateOne(
  { _id: userId },
  { $set: { profile: payload, updatedAt: new Date() } },
  { upsert: false },
);
```

## 경계
- 데이터 계층은 컬렉션 스키마/인덱스 정책을 소유한다.
- Repository는 aggregation/query 조합을 소유한다.
- Service는 문서 생명주기 규칙을 소유한다.

## 테스트 범위
- 스키마 검증 및 하위 호환성 테스트.
- 핵심 aggregation의 인덱스 커버리지 검증.
