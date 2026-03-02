# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Countdown timer app tracking Long Đào's 2-year military service (enlist: 2026-03-04, return: 2028-03-04). Vietnamese UI with military/heroic theme. Single-page React app with real-time countdown and progress bar.

## Commands

```bash
npm run dev      # Start dev server (Vite + HMR)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

No test framework is configured.

## Tech Stack

- React 19 + TypeScript (strict mode) + Vite 7
- ESLint 9 flat config with typescript-eslint, react-hooks, react-refresh plugins
- No state management library — uses React hooks only
- No router — single page app

## Architecture

All app logic lives in `src/App.tsx` — a single component handling countdown calculation, progress tracking, and rendering. Key functions:

- `getTimeLeft()` — computes remaining days/hours/minutes/seconds until return date
- `getProgress()` — computes percentage of service completed (0–100%)
- A 1-second `setInterval` in `useEffect` drives real-time updates

Styling in `src/App.css` uses CSS animations (pulse, flipIn, shimmer), glass-morphism, and gradient backgrounds. Fonts: Orbitron (countdown digits) + Inter (body text), loaded via Google Fonts in `index.html`.

## Key Dates (hardcoded in App.tsx)

- `enlistDate`: 2026-03-04
- `returnDate`: 2028-03-04
