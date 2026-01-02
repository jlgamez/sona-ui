# sona-ui

A React + TypeScript settings UI for configuring an AI assistant / productivity tool. It provides a single, polished "Settings" surface that can be embedded into a desktop-style host application.

The UI focuses on configuring how the assistant behaves (models, intelligent mode, clipboard behavior, text selection awareness, hotkeys, etc.) while staying frontend-only and framework-agnostic on the backend side.

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
