// UI 규칙의 핵심 의미와 생성 결과 드리프트를 검증한다.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatePlaybook } from "../src/generator.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return fs.readFile(path.join(repositoryRoot, relativePath), "utf8");
}

function includesAll(content, contracts, label) {
  for (const contract of contracts) {
    assert.match(content, contract, `${label} is missing contract: ${contract}`);
  }
}

const selection = {
  frontend: "nextjs",
  css: "css-module",
  backend: null,
  db: [],
  infra: [],
  docs: [],
  ai: ["agents", "examples"],
  language: "en",
  autoCommit: false,
};

const languageContracts = {
  en: {
    css: [/internal class assignment/i, /public style escape hatch/i, /features and pages own CSS Modules/i],
    component: [/take priority over primitive reuse/i, /Repeated flex\/grid is a signal/i],
    screen: [/Visual QA/i, /Functional completion and design completion are separate/i],
  },
  ko: {
    css: [/내부 클래스 적용/, /public 스타일 탈출구/, /feature\/page가 화면 고유 layout/],
    component: [/primitive 재사용보다 우선/, /직접 CSS 사용 금지가 아니다/],
    screen: [/Visual QA/, /기능 완료와 디자인 완료를 별도로 판정/],
  },
};

for (const [language, contracts] of Object.entries(languageContracts)) {
  for (const sourceRoot of ["templates", "skills/mykit/references"]) {
    const css = await read(`${sourceRoot}/${language}/frontend/styling/css-module.md`);
    const component = await read(`${sourceRoot}/${language}/frontend/ui/component.md`);
    const screen = await read(`${sourceRoot}/${language}/frontend/ui/screen.md`);
    includesAll(css, contracts.css, `${sourceRoot} ${language} CSS Module`);
    includesAll(component, contracts.component, `${sourceRoot} ${language} component`);
    includesAll(screen, contracts.screen, `${sourceRoot} ${language} screen`);
  }
}

const skill = await read("skills/mykit/SKILL.md");
const addComponent = await read("skills/mykit/actions/add-component.md");
const buildScreen = await read("skills/mykit/actions/build-screen.md");
includesAll(skill, [/actions\/build-screen\.md/, /references\/en\/frontend\/ui\/screen\.md/], "skill routing");
includesAll(addComponent, [/build-screen\.md/, /route\/page/], "add-component routing");
includesAll(buildScreen, [/구조적 QA/, /Visual QA/, /기능 완료와 디자인 완료를 별도로 판정/], "build-screen action");

const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mykit-ui-contracts-"));
try {
  for (const language of Object.keys(languageContracts)) {
    const outputRoot = path.join(temporaryRoot, language);
    await generatePlaybook({
      cwd: outputRoot,
      selection: { ...selection, language },
    });

    const generatedCss = await fs.readFile(
      path.join(outputRoot, "playbook/frontend/styling/css-module.md"),
      "utf8",
    );
    const generatedComponent = await fs.readFile(
      path.join(outputRoot, "playbook/frontend/ui/component.md"),
      "utf8",
    );
    const generatedScreen = await fs.readFile(
      path.join(outputRoot, "playbook/frontend/ui/screen.md"),
      "utf8",
    );
    const generatedIndex = await fs.readFile(
      path.join(outputRoot, "playbook/PLAYBOOK.index.yaml"),
      "utf8",
    );

    includesAll(generatedCss, languageContracts[language].css, `generated ${language} CSS Module`);
    includesAll(generatedComponent, languageContracts[language].component, `generated ${language} component`);
    includesAll(generatedScreen, languageContracts[language].screen, `generated ${language} screen`);
    includesAll(generatedIndex, [/id: frontend-screen-change/, /action: build-screen/, /frontend\/ui\/screen\.md/], `generated ${language} index`);
  }
}
finally {
  assert.equal(path.dirname(temporaryRoot), os.tmpdir());
  assert.match(path.basename(temporaryRoot), /^mykit-ui-contracts-/);
  await fs.rm(temporaryRoot, { recursive: true });
}

console.log("UI contract checks passed for skill references, templates, and generated playbooks.");
