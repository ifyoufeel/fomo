import nextVitals from "eslint-config-next/core-web-vitals";
import { defineConfig, globalIgnores } from "eslint/config";

import { baseConfig } from "./base.js";

/**
 * Lint rules for the Next.js apps: the shared TypeScript rules plus Next's
 * Core Web Vitals, React, hooks and accessibility rules.
 *
 * @param {string} tsconfigRootDir
 */
export function nextConfig(tsconfigRootDir) {
  return defineConfig(
    nextVitals,
    baseConfig(tsconfigRootDir),
    globalIgnores(["out/**", "build/**"]),
  );
}

export default nextConfig;
