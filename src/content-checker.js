// 프로젝트별 사용자 노출 텍스트 제약을 검사하는 범용 스캐너.
import fs from "node:fs/promises";
import path from "node:path";

function resolveInside(root, relativePath) {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Content check paths must be relative: ${relativePath}`);
  }

  const resolved = path.resolve(root, relativePath);
  const boundary = path.relative(root, resolved);
  if (boundary === ".." || boundary.startsWith(`..${path.sep}`)) {
    throw new Error(`Content check path escapes project root: ${relativePath}`);
  }
  return resolved;
}

function isExcluded(relativePath, excludes) {
  return excludes.some((excludedPath) => (
    relativePath === excludedPath || relativePath.startsWith(`${excludedPath}/`)
  ));
}

async function collectFiles(root, target, excludes, extensions, output) {
  const relativePath = path.relative(root, target).split(path.sep).join("/");
  if (isExcluded(relativePath, excludes)) return;

  const stats = await fs.lstat(target);
  if (stats.isSymbolicLink()) return;
  if (stats.isDirectory()) {
    const entries = await fs.readdir(target);
    for (const entry of entries) {
      await collectFiles(root, path.join(target, entry), excludes, extensions, output);
    }
    return;
  }
  if (!stats.isFile()) return;
  if (extensions.length > 0 && !extensions.includes(path.extname(target))) return;
  output.add(target);
}

function normalizeForbidden(forbidden) {
  return forbidden.map((entry) => {
    if (typeof entry === "string") return { value: entry, reason: "Forbidden user-facing content" };
    if (!entry || typeof entry.value !== "string") {
      throw new Error("Each forbidden entry must be a string or an object with a string value.");
    }
    return { value: entry.value, reason: entry.reason ?? "Forbidden user-facing content" };
  });
}

export async function findContentViolations({ root, config }) {
  if (!Array.isArray(config.include) || config.include.length === 0) {
    throw new Error("Content check config requires at least one include path.");
  }
  if (!Array.isArray(config.forbidden) || config.forbidden.length === 0) {
    throw new Error("Content check config requires at least one forbidden entry.");
  }

  const excludes = (config.exclude ?? []).map((item) => item.replace(/\\/g, "/").replace(/\/$/, ""));
  const extensions = config.extensions ?? [];
  const ignoreLinePatterns = (config.ignoreLinePatterns ?? []).map((pattern) => new RegExp(pattern));
  const forbidden = normalizeForbidden(config.forbidden);
  const files = new Set();

  for (const includePath of config.include) {
    await collectFiles(root, resolveInside(root, includePath), excludes, extensions, files);
  }

  const violations = [];
  for (const filePath of files) {
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (ignoreLinePatterns.some((pattern) => pattern.test(line))) return;
      for (const rule of forbidden) {
        if (line.includes(rule.value)) {
          violations.push({
            file: path.relative(root, filePath).split(path.sep).join("/"),
            line: index + 1,
            value: rule.value,
            reason: rule.reason,
          });
        }
      }
    });
  }

  return violations;
}
