// mykit에서 선택 가능한 문서 키와 경로를 정의하는 매니페스트.
export const frontendStacks = ["nextjs", "react-vite", "vue-nuxt", "sveltekit", "vanilla-js"];
export const cssOptions = ["tailwindcss", "css-module"];
export const backendStacks = ["express", "nestjs", "spring"];
export const databases = ["postgres", "mysql", "mongodb", "redis", "supabase"];
export const infrastructures = ["aws", "gcp", "azure", "vercel", "kubernetes"];
export const crossCuttingDocs = ["security", "testing"];
export const aiGuides = ["agents", "claude", "cursor-rules", "examples"];

export const commonFrontendDocs = [
  "frontend/styling/theme",
  "frontend/ui/component",
  "frontend/ui/screen",
  "frontend/ui/accessibility",
  "frontend/ui/svg-icon",
  "frontend/data/react-query",
  "frontend/content/i18n",
  "frontend/content/seo",
];

export const staticCoreDocs = [
  "core/readability",
  "core/code-style",
  "core/code-hygiene",
  "core/naming",
  "core/performance",
  "core/error-handling",
  "core/data-design",
];

export function buildDocKeys(selection) {
  const docKeys = new Set(staticCoreDocs);
  commonFrontendDocs.forEach((doc) => docKeys.add(doc));
  docKeys.add(`frontend/styling/${selection.css ?? "tailwindcss"}`);
  docKeys.add(`frontend/stacks/${selection.frontend}`);
  if (selection.backend) docKeys.add(`backend/${selection.backend}`);
  selection.db.forEach((db) => docKeys.add(`database/${db}`));
  selection.infra.forEach((infra) => docKeys.add(`infra/${infra}`));
  selection.docs.forEach((doc) => docKeys.add(`${doc}`));
  return [...docKeys];
}

export function buildAiGuideKeys(selection) {
  if (selection.ai?.includes("all")) {
    return aiGuides;
  }
  const selected = new Set(selection.ai ?? []);
  const hasCoreGuide = ["agents", "claude", "cursor-rules"].some((key) => selected.has(key));
  if (hasCoreGuide) selected.add("examples");
  return [...selected];
}
