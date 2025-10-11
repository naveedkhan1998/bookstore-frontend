# Repository Guidelines

## Project Structure & Module Organization

- `src/main.tsx` initializes React with Redux, Flowbite, and the dark-mode context; adjust providers here when new globals are introduced.
- `src/app` offers the store configuration (`store.ts`) and typed hooks (`hooks.ts`); always export selectors and dispatch helpers from this module.
- `src/features` holds Redux Toolkit slices (auth, cart, booklists, etc.); colocate reducers, actions, and thunks per domain.
- `src/services` centralizes API and storage helpers; components should call these wrappers instead of `fetch`.
- `src/components`, `src/pages`, and `src/layouts` cover reusable UI, route-level screens, and framing shells; align file names with exported component names.
- `public/` serves static assets, while `dist/` is generated output from `npm run build` and should not be committed.

## Build, Test, and Development Commands

- `npm install` resolves dependencies; rerun after changes to `package.json` or lockfile conflicts.
- `npm run dev` starts Vite on http://localhost:5173 with hot reload and Tailwind rebuilds.
- `npm run build` runs `tsc -b` for project-wide type safety before emitting production bundles.
- `npm run preview` serves the latest build for manual verification in a production-like environment.
- `npm run lint` executes ESLint; append `--fix` after reviewing a diff if automatic fixes are acceptable.

## Coding Style & Naming Conventions

- Write in TypeScript with JSX; components and hooks use PascalCase, utilities camelCase, and Redux artifacts the `somethingSlice.ts` pattern.
- Prettier defaults (`.prettierrc` is `{}`) enforce two-space indentation, double quotes, and trailing commas; format with `npx prettier . --write` ahead of large PRs.
- ESLint (see `eslint.config.js`) extends JS/TS recommended configs, keeps React hook guards disabled, and flags unsafe refresh exports; do not bypass lint unless justified in code comments.
- Tailwind classes belong in `src/index.css` or component `className` strings; prefer utility-first composition over ad-hoc inline styles.

## Testing Guidelines

- A test runner is not wired yet; stage future suites with Vitest and Testing Library under `src/__tests__` or alongside components as `ComponentName.test.tsx`.
- Until automation lands, document manual test cases in PRs (steps, expected state changes, screenshots) and smoke-test flows such as authentication, cart updates, and checkout.

## Commit & Pull Request Guidelines

- Git history currently uses terse lowercase summaries (e.g., `done`, `improved login`); keep the first line <= 60 characters and add context in an optional body.
- Reference related issues, call out breaking changes, and group work into focused PRs that include lint and build results plus UI evidence where relevant.
- Request review only after `npm run lint` and `npm run build` succeed; link design specs or API contracts when changes impact shared surfaces.

## State & Data Flow Notes

- Share state through Redux slices exported from `src/features` and wire them in `src/app/store.ts`; expose typed selectors via `hooks.ts`.
- `src/context` houses UI-specific providers (e.g., sidebar, dark mode); reuse these contexts instead of duplicating local state.
- Add new API clients to `src/services`, keeping side effects out of components and enabling reuse across pages.
