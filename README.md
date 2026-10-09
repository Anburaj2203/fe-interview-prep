# fe-interview-prep-

A React + TypeScript workspace for practising front-end interview questions.

## Features

### Live search

A search box that queries a public product API as you type. It waits until typing settles
before sending a request, so a quickly typed word costs one request rather than one per
keystroke, and a response to an older query can never overwrite the results for the current
one. Loading, error (with retry), empty and results states are all shown, and the matched
text is highlighted in each result.

Built from two reusable pieces: `useDebouncedValue` for the typing delay and the shared API
client in `src/api/`, which owns the base URL and the error shape.

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
  config/
    env.ts           Environment values, read through import.meta.env
  api/
    client.ts        Shared fetch client: base URL, error shape, abort support
  hooks/
    useDebouncedValue.ts   Debounce any value, reusable across features
  features/
    search/          Live search: ProductSearch, SearchResults, HighlightedText
```

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://dummyjson.com` | Base URL for the search API |

Only `VITE_`-prefixed variables reach the client. `.env*` files are not committed.

## Testing

Tests live next to the code they cover as `*.test.tsx` under `src/`. Vitest is scoped to
`src/` only; the scripts in `.claude/hooks/tests/` are standalone Node scripts with their
own runner (`node .claude/hooks/tests/run-all.cjs`).
