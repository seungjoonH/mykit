# Meaning Unit

폼 필드와 선택 UI를 의미 단위로 닫을 때 읽는 슬라이스다. 계층 표는
`component-layers.md`, 훅/Store는 `hooks-store.md`다.

## mustHold

필드는 `NameTextForm`처럼 의미 단위로 닫는다. `feature`/`page`는 `TextField`를 직접
쓰지 않는다. Specify를 variant 전용으로 읽지 않는다.

## 의미 단위로 닫는다

구체화의 대상은 버튼 variant만이 아니다. `Chip` → `StatusChip` 은 시각 상태의 예일 뿐이고, 같은
규칙이 입력, 세그먼트, 토글에도 적용된다. `TextField` 에 `label={t("name")}` 을 거는 것은
`Chip` 에 `tone="success"` 를 걸면서 `StatusChip` 을 안 만드는 것과 같다. 의미가 열린 채로
남아 있다.

의미 단위가 닫혔다는 뜻은 label, type, required, 허용 값, i18n이 그 컴포넌트 안에 고정되고,
호출부는 도메인 이름만 본다는 뜻이다. `feature`/`page` JSX에 `TextField` 가 보이면 아직
안 닫힌 것이다.

접근성도 호출부가 primitive에 label을 채우는 일이 아니다. 의미가 생기는 계층에서 보장한다.
`NameTextForm`이 그 지점이면 label/aria는 그 안에 둔다. `TextField`는 계약을 열고, feature는
채우지 않는다.

```tsx
// ❌ feature/page가 interactive를 열고 의미를 밖에서 조립한다
<TextField label={t("name")} value={draft.name} onChange={handleNameChange} required />
<TextField label={t("cptCode")} value={draft.cptCode} onChange={handleCptCodeChange} required />
<ChipButton selected={draft.active} onClick={() => setActive(true)}>{t("active")}</ChipButton>

// ✅ 의미가 닫힌 컴포넌트만 둔다. TextField와 ChipButton은 그 안에만 있다
<NameTextForm value={fields.name} onChange={handleNameChange} />
<CptCodeTextForm value={fields.cptCode} onChange={handleCptCodeChange} />
<StatusForm value={fields.active} onChange={handleStatusChange} />
```

읽기 함정. `PrimaryButton`, `StatusChip` 예시만 보고 Specify를 variant 전용으로 읽지 않는다.
폼 필드도 같은 구체화다. primitive 재사용은 `TextField` 를 화면에 깔라는 뜻이 아니다.
재사용은 닫힌 의미 단위가 그 primitive를 내부에서 쓰는 것이다.

기존 패턴이 이 계약을 어기면 복제하지 않는다. 합의한 범위 안에서 새 의미 단위를 만들고
사후에 보고한다.
