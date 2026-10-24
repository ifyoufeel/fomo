// Repo rules that CLAUDE.md states but cannot enforce. Runs in CI on every pull request.
//   1. The root CLAUDE.md stays under 200 lines.
//   2. Every folder in apps/ and packages/ has a CLAUDE.md naming its owner chat.
//   3. A dependency that has a catalog entry in pnpm-workspace.yaml uses "catalog:".
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const errors = [];

const rootClaude = join(root, "CLAUDE.md");
if (!existsSync(rootClaude)) {
  errors.push("CLAUDE.md is missing at the repo root.");
} else {
  const lines = readFileSync(rootClaude, "utf8").trimEnd().split("\n").length;
  if (lines >= 200) errors.push(`CLAUDE.md has ${lines} lines; keep it under 200.`);
}

const workspaceDirs = ["apps", "packages"].flatMap((group) =>
  readdirSync(join(root, group), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(group, entry.name)),
);

for (const dir of workspaceDirs) {
  const claude = join(root, dir, "CLAUDE.md");
  if (!existsSync(claude)) {
    errors.push(`${dir}/CLAUDE.md is missing.`);
  } else if (!/^Owner: /m.test(readFileSync(claude, "utf8"))) {
    errors.push(`${dir}/CLAUDE.md has no "Owner: " line.`);
  }
}

// Reads the top-level `catalog:` map. pnpm-workspace.yaml keeps it as one `name: range` per line.
function readCatalog() {
  const names = new Set();
  let inCatalog = false;
  for (const line of readFileSync(join(root, "pnpm-workspace.yaml"), "utf8").split("\n")) {
    if (/^\S/.test(line)) inCatalog = line.startsWith("catalog:");
    else if (inCatalog) {
      const match = /^\s+"?([^"#\s][^":]*)"?:\s/.exec(line);
      if (match?.[1]) names.add(match[1]);
    }
  }
  return names;
}

const catalog = readCatalog();
// peerDependencies state a compatible range for consumers, so they may differ from the catalog.
const fields = ["dependencies", "devDependencies", "optionalDependencies"];

for (const dir of [".", ...workspaceDirs]) {
  const manifestPath = join(root, dir, "package.json");
  if (!existsSync(manifestPath)) continue;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const field of fields) {
    for (const [name, range] of Object.entries(manifest[field] ?? {})) {
      if (catalog.has(name) && range !== "catalog:") {
        errors.push(`${dir}/package.json: ${field}.${name} is "${range}"; use "catalog:".`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Repo check failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `Repo check passed (${workspaceDirs.length} folders, ${catalog.size} catalog entries).`,
);
