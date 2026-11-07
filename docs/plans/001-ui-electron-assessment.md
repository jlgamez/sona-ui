# 001: UI and Electron readiness assessment

Status: assessment, written 2026-11-07. Detailed fixes are in `002-ui-critical-fixes.md`.

## Context

sona-ui is the settings front end for the Sona backend (a Flask API in a separate repo, `sona`). The backend records audio on a global hotkey, transcribes with local Whisper and pastes the text. The plan is to package both with Electron. The two repos stay separate for now. The only coupling is the HTTP API, so a monorepo gains little today. Revisit it if cross-repo changes become painful or if one release pipeline is wanted.

The UI is Vite, React 19, Tailwind 4, Zustand and shadcn/Radix components. It has a Welcome screen and a Settings screen. It talks to the backend at a hardcoded `http://127.0.0.1:5000`.

## Bugs in the existing UI

1. Saving can wipe the microphone choice. The save payload has no `mic_device` field, and the backend treats a missing field as "system default".
2. Cancel does not discard changes. Settings edit the Zustand stores live, and Cancel only navigates away, so unsaved values reappear when Settings is reopened.
3. Save is fire and forget. The request is not awaited and the response status is never checked. The screen closes at once, so a 400 or 500 from the backend is silent.
4. Deleting the active model leaves the UI stale. The backend resets `current_model` to its default, but the UI store keeps the deleted name and a later Save sends it back.
5. Delete has no confirmation.
6. Download failures are invisible. The backend ends the "downloading" state on failure, so the row reverts to the download button with no error shown.
7. `buildUrlWith` contains a leftover `console.log`.

## Toggles with no backend behaviour

Intelligent Mode and Text Selection Awareness are saved in the config but nothing in the backend reads them. The switches do nothing. Mark them as "coming soon" and disable them until the features exist.

The hotkey list is hardcoded in `HotKeyStore.ts`, although the backend serves `GET /api/hot-keys`.

## Missing features

- Microphone picker, using `GET /api/audio-devices` and the `mic_device` config field. Include a "System default" option and a refresh action. The backend falls back to the default device silently when the saved one is missing, so the UI should say so.
- First-run onboarding: permissions (Microphone, Accessibility, Input Monitoring), then model download, then hotkey, then a try-it step. Without a downloaded model, recording does nothing.
- Recording status (idle, recording, transcribing). The backend has no endpoint for it yet.
- A microphone test (input level meter or a short check). It would have shortened the "Thank you" debugging done on the backend.

## UX patterns to apply

- Toast for save results and errors.
- Loading state on the Save button.
- A retry screen for load errors. The backend starts a few seconds after the UI in Electron, so retry with backoff.
- Per-section skeletons instead of one global spinner.
- Disable Save until something changed (dirty state).
- Accessibility pass: labels on the custom `DropDown`, `aria-live` for download progress, visible focus.
- Group settings into tabs or a sidebar once the page grows. Not needed yet.

## Electron requirements

- API base URL: pick a free port in the main process, start the backend with `--port`, and pass the URL to the renderer through a preload script. The UI reads it at runtime.
- Backend lifecycle: spawn, wait for readiness (poll `/`), kill on quit, restart on crash. The UI must handle "backend died".
- Backend binary: build with PyInstaller (`Sona.spec` is gitignored in the backend repo and should be tracked) and ship it as an Electron resource. Whisper pulls in torch, so expect a large bundle and slow cold start. Ship the `ffmpeg` binary inside the app.
- macOS permissions: Microphone, Accessibility and Input Monitoring attach to the launching app. This needs a signed build and a microphone usage string in the Info.plist. A child process should show up as "Sona", but this must be tested early. It is the likeliest packaging surprise.
- App shell: tray icon with status, close to tray, launch at login, single-instance lock. The fake window frame in `DesktopLayout withChrome` should go once a real window is used.
- CORS: a packaged app loaded from `file://` sends `Origin: null`, which is already in the backend defaults. A custom protocol would need a new origin in `SONA_ALLOWED_ORIGINS`.
- Signing, notarization and auto-update come last (electron-builder).

## Suggested order

1. Critical UI fixes (see 002).
2. Microphone picker and hotkeys from the API.
3. Electron shell, run unpackaged: spawn backend, runtime URL, tray.
4. PyInstaller bundle, then permission testing on a signed build.
5. Onboarding and the recording status indicator.
