# fe-interview-prep-

A React + TypeScript workspace for practising front-end interview questions.

## Stack

- **React 19** with **TypeScript** (strict mode)
- **Vite** for the dev server and production build
- **ESLint** (flat config) for linting
- **Vitest** + **React Testing Library** (jsdom) for tests
- **Plain hand-written CSS** — no external CSS or UI library

## Getting started

```bash
npm install
npm run dev
```

The dev server prints a local URL (http://localhost:5173 by default).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Type-check without emitting |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

All four gate commands — `lint`, `typecheck`, `test`, `build` — must pass before a PR
is raised.

## Project layout

```
index.html           Vite entry HTML
vite.config.ts       Vite + Vitest configuration
eslint.config.js     ESLint flat config
tsconfig.json        TypeScript configuration
src/
  main.tsx           React root
  App.tsx            Root component
  App.css            Component styles
  index.css          Global styles and theme tokens
  setupTests.ts      Testing Library setup (jest-dom matchers, cleanup)
  App.test.tsx       Tests for App
```


| Question | PR link |
| --- | --- |
|1. TODO App | https://github.com/Anburaj2203/fe-interview-prep-/pull/2|
|2. Live Search | https://github.com/Anburaj2203/fe-interview-prep-/pull/5|
|3. Registration Wizard | https://github.com/Anburaj2203/fe-interview-prep-/pull/9|
|4. Data Table | https://github.com/Anburaj2203/fe-interview-prep-/pull/10|
|5. Login & Session Handling | https://github.com/Anburaj2203/fe-interview-prep/pull/11|


## Testing

Tests live next to the code they cover as `*.test.tsx` under `src/`. Vitest is scoped to
`src/` only; the scripts in `.claude/hooks/tests/` are standalone Node scripts with their
own runner (`node .claude/hooks/tests/run-all.cjs`).
