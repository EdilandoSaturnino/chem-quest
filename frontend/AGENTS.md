# AGENTS.md

## Sources Of Truth
- The README is still the stock Vite template; trust `package.json`, configs, and `src/` over it.
- This repo uses npm: `package-lock.json` is present and there are no pnpm/yarn lockfiles.
- There is no CI, pre-commit config, formatter config, or test runner in the repo.

## Commands
- Install from the lockfile with `npm ci`.
- Start dev server: `npm run dev`.
- Production verification: `npm run build` runs `tsc -b` before `vite build`.
- Lint: `npm run lint` runs `eslint .`.
- Preview a built app: `npm run preview`.
- There is no `npm test` script; for focused validation use `npm run lint` and/or `npm run build`.

## App Structure
- Entry flow is `src/main.tsx` -> `src/App.tsx`; there is no router. `App.tsx` owns the current screen, score, lives, and game-over state.
- Screen names and mode metadata live in `src/domain/game/game-mode.ts`; adding a mode also requires updating `MODE_CONFIG` and the `renderScreen()` switch in `App.tsx`.
- Game rules for brewing live in `src/domain/game/brewing-rules.ts`; compound recipes and difficulty catalogs live in `src/domain/compounds/compound-catalog.ts`.
- Quiz questions are data in `src/domain/quiz/quiz-catalog.ts`; periodic-table data and accent-insensitive name lookup are in `src/domain/periodic/periodic-table.ts`.
- Leaderboard persistence is browser `localStorage` via `src/infra/local-storage-leaderboard-repository.ts`, key `chemquest_leaderboard_v1`.

## Implementation Notes
- TypeScript is strict about unused locals/parameters and uses `erasableSyntaxOnly`; run `npm run build` to catch type issues not covered by lint.
- The UI is mostly inline React styles plus `src/styles/theme.ts` and `src/styles/global-styles.tsx`; Tailwind v4 is wired through `@import "tailwindcss"` and the Vite plugin, but existing screens do not rely on utility classes.
- User-facing copy is mostly Portuguese and chemistry-themed; preserve that tone when adding questions, hints, labels, or facts.
- App source mostly uses double quotes and semicolons even though config files use single quotes/no semicolons; match the neighboring file.
