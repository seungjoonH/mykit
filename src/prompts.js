// mykit init 인터랙티브 선택 질문을 정의한다.
import { checkbox, select } from "@inquirer/prompts";
import {
  aiGuides,
  backendStacks,
  cssOptions,
  crossCuttingDocs,
  databases,
  frontendStacks,
  infrastructures,
} from "./manifest.js";

const toChoices = (items) => items.map((item) => ({ name: item, value: item }));
const supportedLanguages = ["en", "ko"];

export async function promptSelection() {
  const language = await select({
    message: "Select playbook language",
    choices: toChoices(supportedLanguages),
    default: "en",
  });
  const frontend = await select({
    message: "Select frontend stack",
    choices: toChoices(frontendStacks),
    default: "nextjs",
  });
  const css = await select({
    message: "Select CSS strategy",
    choices: toChoices(cssOptions),
    default: "tailwindcss",
  });
  const backend = await select({
    message: "Select backend stack",
    choices: [
      { name: "none (frontend only)", value: null },
      ...toChoices(backendStacks),
    ],
    default: "nestjs",
  });
  const db = await checkbox({
    message: "Select database stacks (optional, space to toggle)",
    choices: toChoices(databases),
  });
  const infra = await checkbox({
    message: "Select infra stacks (optional, space to toggle)",
    choices: toChoices(infrastructures),
  });
  const docs = await checkbox({
    message: "Select cross-cutting docs",
    choices: toChoices(crossCuttingDocs),
    required: true,
  });
  const ai = await checkbox({
    message: "Select AI guide files (space for multi-select)",
    choices: [{ name: "all", value: "all" }, ...toChoices(aiGuides)],
    required: true,
  });
  const autoCommit = await select({
    message: "Select commit behavior",
    choices: [
      { name: "auto — commit when a logical unit is complete", value: true },
      { name: "manual — never commit without explicit user approval", value: false },
    ],
    default: true,
  });

  return {
    language,
    frontend,
    css,
    backend,
    db,
    infra,
    docs,
    ai,
    autoCommit,
  };
}
