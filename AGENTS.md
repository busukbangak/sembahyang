# AGENTS.md

## High-Signal Guidance for This Repository

- **App type**: React + TypeScript app scaffolded with Vite. Entry: `src/main.tsx` → `src/App.tsx`.
- **API dependency**: Fetches all prayer data via [Aladhan API](https://aladhan.com/prayer-times-api) (`calendarByCity` endpoint).
    - Credentials/config for API are not required; all parameters are hardcoded in `src/config/index.ts`.
- **Default city/method**: Queries for `"Hamburg"`, `"Germany"`, method `3` (see `src/config/index.ts`). Change these values for other regions.
- **Package management**:
    - Use npm. All commands in `package.json` > `scripts`.
    - **Install deps**: `npm install`
    - **Dev server**: `npm run dev`
    - **Production build**: `npm run build`
    - **Lint**: `npm run lint`
    - **Preview static build**: `npm run preview`
    - **No test scripts** are present — add `.test.tsx` files and update scripts if tests are added.
- **TypeScript**:
    - Config split between `tsconfig.app.json`, `tsconfig.node.json`, and root `tsconfig.json` (references project configs).
- **Build & plugins**:
    - Uses Vite plugin for React, PWA mode (`vite-plugin-pwa`), and Tailwind integration (`@tailwindcss/vite`).
    - PWA config is in `vite.config.ts`. Icons/assets in `/public`.
- **ESLint**:
    - Uses a flat ESLint config (`eslint.config.js`) with React, hooks, and refresh plugins. Ignore `dist/`.
    - No `.eslintrc`; see only `eslint.config.js`. Lint using `npm run lint`.
- **File conventions**:
    - Main logic in `src/`
    - No backend, docker, or infra.
    - All API interaction is in `src/services/aladhanService.ts`.
    - Only city and method configuration is abstracted (see above); all else inlined in components and hooks.
- **No .env or secrets needed**: API is public and configuration is hardcoded.
- **Workflow**:
    - No CI workflow files detected—manual verification only.
    - No custom pre-commit, formatting, snapshot, or test flows.
- **Other notes**:
    - There is no existing `AGENTS.md`—this file is now the canonical agent instruction source for this repo.
    - The code should be understandable from the Vite/TypeScript config and conventional React project layout.

---

Edit and extend only with additional, *verified*, repo-specific facts discovered in new config or workflow files.
