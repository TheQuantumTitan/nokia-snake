# AGENTS.md — Project Rules

## Product
- Single-player Snake game inspired by the Nokia 1100 era, running entirely in the browser.

## Stack
- Vite + TypeScript (strict), plain HTML and CSS, Canvas 2D for rendering, localStorage for persistence.
- Keep dependencies minimal: currently only `vite` and `typescript` (devDependencies). Do not add new packages without asking.
- Deployment target: Vercel static hosting (build output: `dist/` via `vite build`).

## Required flow (all mandatory)
1. Welcome animation
2. Main menu
3. Difficulty selection
4. Gameplay
5. Pause/resume
6. Start-new-game
7. Game-over
8. Top-10 high scores

## Controls
- Desktop: keyboard controls (arrows/WASD, Enter/Space to confirm, Esc/P to pause).
- Mobile: touch controls (swipe and/or on-screen buttons). Both input modes must be supported simultaneously.

## Codebase rules
- Keep the code small, readable, modular, and dependency-light. One concern per module; plain functions; no framework.
- Use semantic HTML elements (`button`, `nav`, `main`, `dialog`-style patterns) for all interface controls; Canvas only for the game board.
- Responsive layouts that work on desktop and mobile viewports.
- Keyboard accessibility: all controls focusable and operable, visible focus styles.
- Respect `prefers-reduced-motion`: reduce or disable the welcome animation and other non-essential motion.
- No backend, accounts, analytics, remote APIs, or externally hosted assets. Everything local and offline-capable.

## High scores
- Store top-10 high scores in localStorage.
- Handle missing, corrupted, or malformed storage gracefully (treat as empty list, never throw).

## Scope discipline
- Do not add features outside the agreed scope without asking first.

## Verification
- Before finishing code changes, run the relevant checks and report actual results:
  - `npm run build` (runs `tsc && vite build` — type-check + production build)
  - `npm run dev` / `npm run preview` for manual smoke-testing
- Report check output verbatim; do not claim success without running them.

## Current implementation state
- Shell: `index.html` has header, `main`, footer, and one `.screen` per state (`screen-welcome/menu/difficulty/playing/paused/gameover/scores`). Board (`canvas#game-board`), score line, and pause/end controls live only in `screen-playing`.
- Modules: `src/main.ts` (bootstrap, calls `initUI()`), `src/ui.ts` (`ScreenName` state machine + placeholder click wiring), `src/style.css` (Nokia LCD theme, centered single column, square board).
- Removed Vite demo: `src/counter.ts`, `src/assets/*` + folder, `public/icons.svg`. Kept: `public/favicon.svg`. Config and dependencies unchanged.
- `tsconfig.json`: ES2023, bundler module resolution, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, no emit.

## UI conventions
- State values: `welcome | menu | difficulty | playing | paused | game-over | high-scores`, mapped to element IDs via `SCREEN_IDS` in `src/ui.ts:13`.
- Navigation: `data-goto` (screen name), `data-action` (`start/pause/resume/restart/end/quit` via `ACTION_TARGETS`), `data-difficulty` (sets `aria-pressed` within its list, navigates nowhere; default `normal`).
- Visibility: exactly one screen shown via the `hidden` attribute; `showScreen()` moves focus to the active screen so hidden screens are never keyboard-focusable.

## Still placeholder (not yet implemented)
- Score is static `0`; difficulty choice is not stored; scores list is always empty with a "No scores yet" empty state.
- Paused/game-over are separate panels with no board overlay. No snake movement, collision, food, game loop, real pause/resume, animations, touch input, or score persistence yet.
