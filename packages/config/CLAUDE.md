# packages/config

Owner: Backend core chat · starter brief: `docs/briefs/10-backend-core.md`

- **Holds:** shared TypeScript and ESLint settings for every package.
- **Status:** in use since BE-01.

## Use it

- `tsconfig.json`: extend `@fomo/config/tsconfig/node.json` for server and library code, or `@fomo/config/tsconfig/nextjs.json` for Next.js apps.
- `eslint.config.js`: `export default baseConfig(import.meta.dirname)` from `@fomo/config/eslint/base`, or `nextConfig` from `@fomo/config/eslint/next`.
- Add `"@fomo/config": "workspace:*"` to devDependencies so Turborepo re-runs your checks when these settings change.

Lint is type-aware: floating promises and unsafe `any` fail CI. Ask Backend core for a rule change instead of disabling it in your package.

Only the owner chat changes this folder. Any other chat puts a change request in its handoff note instead.
