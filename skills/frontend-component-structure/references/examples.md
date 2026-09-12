# Structure Examples

구조나 export 판단이 불분명할 때만 참고한다.

## Before

```text
src/components/composed/
├── EditorPane.tsx
├── EditorPane.module.css
├── FileTree.tsx
└── SettingsPanel.tsx
```

```ts
import EditorPane from '../../../components/composed/EditorPane';
```

## After

```text
src/components/composed/
├── EditorPane/
│   ├── EditorPane.tsx
│   ├── EditorPane.module.css
│   └── index.ts
├── FileTree/
│   ├── FileTree.tsx
│   └── index.ts
└── SettingsPanel/
    ├── SettingsPanel.tsx
    └── index.ts
```

```ts
// composed 컴포넌트를 공개 경로로 가져오는 예시
import EditorPane from '@composed/EditorPane';
```

default와 named export가 함께 있는 경우의 배럴은 다음과 같다.

```ts
// EditorPane의 공개 export를 모으는 배럴
export { default } from './EditorPane';
export * from './EditorPane';
```
