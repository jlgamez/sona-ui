# CLAUDE.md

## Overview

**sona-ui** is the settings front end for Sona, a macOS push-to-talk speech-to-text app. The backend (separate repo `sona`, Flask) records audio, transcribes it with local Whisper and pastes the text. This UI configures it over HTTP and will be packaged with Electron later. Stack: Vite, React 19, TypeScript, Tailwind 4, Zustand, shadcn/Radix components, sonner for toasts.

## Quick Reference

- **Install and run:** `npm install`, then `npm run dev` (Vite, default port 5173)
- **Check:** `npm run build` (runs `tsc -b`) and `npm run lint`. There are no tests yet
- **Backend URL:** `VITE_API_BASE_URL`, default `http://127.0.0.1:5000`. Start the backend with `python run.py` (or `--port N`) in the `sona` repo. Port 5000 can clash with macOS AirPlay Receiver
- **Plans:** `docs/plans/` holds the assessment (001) and the UI fix plan (002) with status

## Structure

| Path | Purpose |
|------|---------|
| `src/api/` | `FetchUtils` (get/post, `ApiError`, `describeError`), endpoint constants, `GetActionsService`, `PostActionsService` |
| `src/ui/settings/` | Settings screen: `sections/`, `components/`, `hooks/`, `store/`, `types/`, plus `applyConfigToStores` and `modelActions` |
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

- Open plan items: microphone picker and hotkeys from `GET /api/hot-keys` (item 5), retry and error screen on load failure (item 6)
- Hotkey list is still hardcoded in `HotKeyStore.ts`
- Not built yet: onboarding and permissions flow, recording status, Electron shell, tests
- Existing lint errors in `Text.tsx` and `button.tsx`, and an exhaustive-deps warning in `App.tsx`
