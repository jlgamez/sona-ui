# CLAUDE.md

## Overview

**sona-ui** is the settings front end for Sona, a macOS push-to-talk speech-to-text app. The backend (separate repo `sona`, Flask) records audio, transcribes it with local Whisper and pastes the text. This UI configures it over HTTP and runs inside an Electron shell (`electron/`) that starts and stops the backend. Stack: Vite, React 19, TypeScript, Tailwind 4, Zustand, shadcn/Radix components, sonner for toasts.

## Quick Reference

- **Install and run:** `npm install`, then `npm run dev` (Electron; main spawns the backend from `../sona/dist/sona-backend/`, override with `SONA_BACKEND_PATH`). `npm run dev:web` is plain Vite (port 5173) against a backend you start yourself; `npm run start` previews the production build. `npm run backend:copy && npm run pack` builds `release/mac-arm64/Sona.app` (ad-hoc signed, with the backend in `Resources/sona-backend/`). The app is menu bar only (`electron/tray.ts`): closing the window hides it, Quit is in the tray menu, single instance, optional start at login. Rebuilt apps lose their macOS grants (see plan 003 phase 4)
- **Backend URL:** the preload script exposes `window.sona.apiBaseUrl` (free port chosen by main); `ApiConstants.BASE_URL` falls back to `VITE_API_BASE_URL`, then port 5000
- **Check:** `npm run build` (runs `tsc -b`) and `npm run lint`. There are no tests yet
- **Backend URL:** `VITE_API_BASE_URL`, default `http://127.0.0.1:5000`. Start the backend with `python run.py` (or `--port N`) in the `sona` repo. Port 5000 can clash with macOS AirPlay Receiver
- **Plans:** `docs/plans/` holds the assessment (001) and the UI fix plan (002) with status

## Structure

| Path | Purpose |
|------|---------|
| `src/api/` | `FetchUtils` (get/post, `ApiError`, `describeError`), endpoint constants, `GetActionsService`, `PostActionsService` |
| `src/ui/settings/` | Settings screen: `sections/`, `components/`, `hooks/`, `store/`, `types/`, plus `applyConfigToStores` and `modelActions`. `useLoadSettings` loads models and config with retry on startup. Hotkey and microphone lists load with `useFetchData` |
| `src/ui/welcome/` | Welcome screen |
| `src/common-components/` | Shared building blocks (`Stack`, `Text`, `DropDown`, buttons) |
| `src/components/ui/` | shadcn primitives. Generated style, rarely edited |

Alias `@/` maps to `src/`.

## How settings work

The saved config from `GET /api/user-config` is held in `App.tsx` and applied to the Zustand stores once on load. The stores hold the edited values. `useDraftConfig` builds the draft (saved config plus store values), so fields the UI does not edit, such as `mic_device`, pass through unchanged on Save. Save posts the draft and updates the saved config. Cancel restores the stores from the saved config. Model download and delete go through `modelActions.ts`.

## Conventions

- Keep code minimal and readable: small functions, clear names, reuse existing components and helpers before adding new ones
- API calls throw `ApiError` on non-2xx; show failures with `toast.error(describeError(error))`
- Backend JSON is snake_case; UI types and stores use camelCase where they are UI-only
- Run `npx prettier --write` on files you touch
- Backend features that are not built yet are shown disabled with a "Coming soon" badge (Intelligent Mode, Text Selection Awareness)

## Commit Format

```
type(scope): description (max 50 chars, imperative)

<General title>
- Functional Change: <impact>
- Technical Change: <details>
- Criticality: <Low|Medium|High|CRITICAL> - <justification>
```

Types: `feat fix refactor perf docs style test chore`. Scopes: `settings models api ui dev`.

## Known Gaps

- The backend silently falls back to Control (Left) for an unknown `hot_key`; it should reject it with a 400
- Not built yet: onboarding and permissions flow, recording status, Electron shell, tests
- Existing lint errors in `Text.tsx` and `button.tsx`, and an exhaustive-deps warning in `App.tsx`
