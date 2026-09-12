# Component Structure Migration

`code-refactoring`에서 React + TypeScript + Vite 컴포넌트 구조 전체 또는 지정 범위를
마이그레이션할 때만 읽는다.

## 실행 절차

1. 합의한 범위의 `components/{layout,design,composed,interactive,feature}`를 스캔한다.
2. 카테고리별 논리적 컴포넌트 수를 세고 `COMPONENT_FOLDER_THRESHOLD` 이상인 flat 구조를
   전환 대상으로 선정한다.
3. 대상별 export 형태, CSS Module, 로컬 보조 파일, 프로젝트 전체 import 호출부를 찾는다.
4. `ComponentName/ComponentName.tsx`, 선택적 CSS Module, `ComponentName/index.ts` 형태로
   이동한다. default와 named export를 기존 공개 API대로 재노출한다.
5. 프로젝트 전체의 해당 호출부를 새 alias import로 치환한다.
6. import 문을 전수 검색해 두 단계 이상 상위 상대경로를 alias로 치환한다. 같은 컴포넌트
   폴더 내부의 `./` 참조는 유지한다.
7. `tsconfig.json`과 Vite 설정을 검사한다. `vite-tsconfig-paths`를 사용하지 않으면 두 설정을
   함께 갱신하고, 사용하면 tsconfig만 canonical source로 유지한다.
8. 프로젝트의 typecheck와 build를 실행한다. 실패하면 실제 오류 파일과 오류를 보고하고,
   사용자 승인 없이 작업 전 상태로 되돌리지 않는다.

## 결과 보고

- 이동한 컴포넌트 수와 이름.
- 치환한 import 수.
- 남은 두 단계 이상 상대 import와 남긴 이유.
- 남은 flat 컴포넌트와 임계값 또는 예외 근거.
- 실행한 typecheck/build 명령과 결과.
