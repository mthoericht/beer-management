# Beer Management — Agent Instructions

## Commands

```bash
# Frontend
cd frontend && npm run build        # Type-check (vue-tsc) + Vite production build
cd frontend && npm run type-check   # Type-check only
cd frontend && npm run lint         # ESLint
cd frontend && npm run dev          # Dev server

# Backend
cd backend && npm run dev           # Dev server with nodemon
cd backend && npm run build         # Compile TypeScript

# Tests
npm run test:unit                   # Unit tests (Vitest)
npm run test:integration            # API integration tests (Playwright)
npm run test:e2e                    # E2E browser tests (Playwright)
npx playwright test                 # All Playwright tests
```

## Code Conventions

- **Vue components**: Composition API with `<script setup lang="ts">`, `<template>` first for feature components
- **UI components** live in `frontend/src/components/ui/` — small, reusable primitives
- **Feature components** live in `frontend/src/components/` — BeerList, BeerForm, BeerStats, etc.
- **Shared form field styles**: Use `fieldBase` from `frontend/src/utils/fieldClasses.ts` for Input, Select, Textarea
- **Styling**: Tailwind CSS 3 utility classes; design tokens as CSS custom properties in `frontend/src/styles/theme.css`, mapped in `frontend/tailwind.config.js`
- **No comments** unless code is complex and requires context
- **TypeScript**: Strict types, interfaces in `frontend/src/types/`

## Design System

The UI derives from a Figma preset (`Figma-preset/`). Only actively used design tokens and components should exist in the frontend — do not add unused shadcn/Figma components or CSS variables speculatively.
