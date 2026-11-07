# sona-ui

A React + TypeScript settings UI for configuring an AI assistant / productivity tool. It provides a single, polished "Settings" surface that can be embedded into a desktop-style host application.

The UI focuses on configuring how the assistant behaves (models, intelligent mode, clipboard behavior, text selection awareness, hotkeys, etc.) while staying frontend-only and framework-agnostic on the backend side.

---

## Running Sona

Sona is an Electron app (`electron/`) that starts the Python backend (repo `sona`, sibling folder) and shows this UI. It needs macOS and the backend built once: in `../sona` run `pyinstaller Sona.spec --noconfirm` (Python 3.14 venv), which creates `dist/sona-backend/`.

### Development

```bash
npm install
npm run dev        # Electron window + hot reload; starts ../sona/dist/sona-backend on a free port
```

- Other backend binary: `SONA_BACKEND_PATH=/path/to/sona-backend npm run dev`.
- Browser only (no Electron): start a backend yourself, then `VITE_API_BASE_URL=http://127.0.0.1:5000 npm run dev:web`.
- Backend logs show in the terminal with a `[backend]` prefix. The first start takes about 25 s.

### Packaged app

```bash
npm run backend:copy && npm run pack    # builds release/mac-arm64/Sona.app (ad-hoc signed)
cp -R release/mac-arm64/Sona.app /Applications/
```

Open it from Finder. Sona lives in the menu bar (no Dock icon): closing the window hides it, and **Quit Sona** in the menu bar icon stops it and the backend. The menu also has a "Start at login" option.

### Permissions

macOS asks for these per app. In dev they belong to the terminal you run `npm run dev` from; in the packaged app they belong to `Sona.app`.

| Permission | Needed for |
|---|---|
| Microphone | recording |
| Input Monitoring | hearing the hotkey |
| Accessibility | pasting the text |

On first launch Sona opens a setup wizard (permissions, speech model, hotkey, test). Each permission row shows its live state and either shows the macOS prompt or opens the right System Settings pane. No restart is needed after granting.

The wizard runs when `onboarding_completed` is false in `~/.sona/user_config.json`. A config file saved before that field existed counts as completed. To see the wizard again, set the field to `false` or delete the file.

Rebuilding the app changes its signature and macOS then ignores the old grants (the switch still looks on). Fix: `tccutil reset All com.jlgamez.sona`, reopen Sona and grant them again. A stable Developer ID signature will end this (plan 003, phase 6).

Plan and status: `docs/plans/003-electron-adoption.md`.

---

## Features

- **Centralized Settings Screen**
  - Single Settings view rendered by `App.tsx` and `ui/Settings.tsx`.
  - Desktop-style chrome and responsive layout via `common-components/DesktopLayout.tsx`.

- **Hotkey Configuration**
  - Configure global or app-specific hotkeys in `HotKeySelectionSection`.
  - Designed so a host app can wire these preferences to system-level shortcuts.

- **Intelligent Mode Controls**
  - Toggle and tune "Intelligent Mode" options in `IntelligentModeSection`.
  - Backed by a dedicated Zustand store (`IntelligentModeStore.ts`) for predictable state.

- **Text Selection Awareness**
  - Decide how the assistant should behave when there is selected text on screen (`TextSelectionAwarenessSection`).
  - State is handled via `TextSelectionAwarenessStore.ts`.

- **Clipboard Behavior**
  - Configure how clipboard contents should be used or monitored (`ClipboardBehaviourSection`).
  - State is managed by `ClipboardStore.ts`.

- **Model Management**
  - **Current Model Selection** — choose the active AI model in `CurrentModelSection` using data from `ModelsStore.ts`.
  - **Available Models List** — browse models defined in `data/available-models.ts` and rendered by `AvailableModelsSection`.

- **Explicit Save / Cancel Flow**
  - `SaveCancelAction` section provides a clear way to apply or discard changes.
  - Designed to support host apps that only persist settings on explicit save.

- **Reusable UI Primitives**
  - `src/common-components` exposes building blocks like `DesktopLayout`, `Stack`, `Text`, `DropDown`, `DownloadButton`, and `DeleteButton`.
  - `src/components/ui` contains shadcn/Radix-style primitives (`button`, `dialog`, `popover`, `separator`, `spinner`, `switch`, `table`, `command`) used to compose higher-level settings components.

---

## Tech Stack

- **Core**
  - [React](https://react.dev/) 19 (function components, hooks)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/) for dev server and bundling

- **Styling**
  - [Tailwind CSS](https://tailwindcss.com/) v4 via `@tailwindcss/vite`
  - Utility helpers: `clsx`, `class-variance-authority`, `tailwind-merge`, `tw-animate-css`
