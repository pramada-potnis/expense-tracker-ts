# Expense Tracker — TypeScript Learning Project

A hands-on project built to learn TypeScript through a real-world UI app using Vite + React.

## Goals

Work through TypeScript's major features by building a functional expense tracker:
- Types, interfaces, and enums
- Union types and type guards
- Generics
- Utility types (Partial, Pick, Omit, Record)
- Discriminated unions
- Async/fetch with typed responses

## Tech Stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- TypeScript

## Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/ppotnis/expense-tracker-ts.git
cd expense-tracker-ts
npm install
```

### Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

## Project Structure

### Initial commit contains
- `index.html` — app entry point
- `src/main.tsx` — mounts React app
- `src/App.tsx` — root component
- `src/App.css`, `src/assets/` — default styles/assets
- `tsconfig.json`, `tsconfig.node.json` — TypeScript config
- `vite.config.ts` — Vite config
- `package.json` — dependencies
- `.gitignore` — node_modules etc. excluded

### Source structure
```
src/
├── main.tsx        # App entry point
├── App.tsx         # Root component
├── types/          # TypeScript type definitions
├── components/     # React components
├── data/           # Sample/mock data
└── utils/          # Helper functions
```

## Learning Progress

- [ ] Step 1: Data model — types & interfaces
- [ ] Step 2: Enums for categories
- [ ] Step 3: Components with typed props
- [ ] Step 4: State management with generics
- [ ] Step 5: Filtering with utility types
- [ ] Step 6: Async data fetching with typed responses
