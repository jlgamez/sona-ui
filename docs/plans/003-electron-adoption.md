# 003: Electron adoption (high-level technical plan)

Status: proposed. Nothing is implemented yet. Builds on `001-ui-electron-assessment.md` and follows the UI fixes in `002-ui-critical-fixes.md`.

## Goal

Ship Sona as a single macOS app (`Sona.app`, distributed as a `.dmg`). The user installs one thing, with no Python, no terminal and no manual backend start. Push-to-talk keeps working when the settings window is closed.

## Decisions

- The Electron app lives in the `sona-ui` repo. The renderer is the existing Vite and React app, so the UI code barely changes.
- The Python backend stays in the `sona` repo and is packaged with PyInstaller into a standalone binary. The two repos stay physically separate (see the monorepo discussion in 001).
- The Electron main process starts the backend as a child process on a free port, waits until it answers, then opens the window. It stops the backend on quit.
- Tooling: `electron-vite` for main, preload and renderer builds, and `electron-builder` for the `.app`, signing, notarization and `.dmg`.
- The app is a menu bar app. Closing the settings window hides it; quitting happens from the tray menu.

## Architecture

```
Sona.app
  Electron main (Node)      window, tray, lifecycle, spawns and stops the backend
  Renderer (Chromium)       existing React settings UI
  Preload script            exposes the backend URL to the renderer
  sona-backend (binary)     Flask API on 127.0.0.1, hotkey listener, ffmpeg, Whisper, paste
```

The renderer talks to the backend over HTTP only. The backend does all recording and transcription.

## Planned layout in `sona-ui`

```
electron/main.ts          window, tray, backend spawn and shutdown
electron/preload.ts       contextBridge: expose backend URL
electron-builder.yml      packaging, signing, extra resources
resources/                backend binary (copied from the sona build output)
```

## Phases

The order is deliberate. Phases 1 to 3 prove the risky parts first (the frozen backend and the macOS permissions). Behaviour and UI polish come after that. Each phase ends with an exit check that must pass before the next one starts.

### Phase 0: Finish the UI baseline (`sona-ui`), done

- Commit the pending work: item 5 of 002, `CLAUDE.md` and this plan.
- Implement item 6 of 002: load error screen with retry and backoff, which also covers the backend startup delay.
- Exit: the UI started before the backend recovers on its own once the backend comes up.

### Phase 1: Standalone backend (`sona`)

- Un-ignore and commit `Sona.spec`.
- Build with PyInstaller and run the binary from a terminal.
- Check that the frozen binary finds `ffmpeg` and the Whisper assets, accepts `--port`, and exits cleanly on SIGTERM.
- Confirm a cheap readiness check exists (`GET /api/models` can serve as one).
- Exit: `./sona-backend --port 5055` serves the API and records and transcribes on a Mac without the dev environment.

### Phase 2: Electron shell, unsigned (`sona-ui`), done

- Add `electron-vite`, `electron/main.ts` and `electron/preload.ts`.
- In dev, load the Vite dev server. In production, load the built files.
- Main spawns the backend on a free port, polls until it is ready, then opens the window.
- The preload script passes the port to the renderer. `ApiConstants.BASE_URL` reads it and falls back to `VITE_API_BASE_URL` for plain browser development.
- Main waits up to 90 s for readiness (a cold backend start takes about 24 s), so the window opens only when the API answers.
- Exit: one command opens the settings window with the backend started and stopped automatically.

### Phase 3: Signed build and permissions (risk gate)

- Package with `electron-builder`, add the usage descriptions to `Info.plist`, and sign with a Developer ID certificate.
- Microphone, Accessibility and Input Monitoring are granted per signed app, and the Python child process may not inherit them from Electron. Test hotkey, record, transcribe and paste from the installed app.
- Exit: the full flow works from `/Applications/Sona.app`. If the child process does not inherit the permissions, rework the design here (for example, run the hotkey and recording in a helper that is itself signed) before building more.

### Phase 4: App behaviour

- Tray icon with Open Settings and Quit, hide on close, single instance lock, optional start at login.
- Shut the backend down on quit, and kill it if Electron crashes.
- Exit: closing the window keeps push-to-talk working, and quitting leaves no stray processes.

### Phase 5: Onboarding and permissions UI (`sona-ui`)

- First-run flow that explains each permission, detects its state, and links to System Settings.
- Model download during onboarding.
- Exit: a new user can go from install to the first transcription without reading documentation.

### Phase 6: Release

- Notarization, `.dmg`, and an install test on a clean Mac.
- Decide on auto-update.
- Exit: a notarized `.dmg` installs and runs on a Mac that has never had the dev setup.

## Risks

- **Permissions** (phase 3): the most likely source of rework. Test early with a signed build.
- **Bundle size:** torch and Whisper make the backend binary large. Whisper models are downloaded after install (`~/.cache/whisper/`), not bundled.
- **Startup time:** a frozen torch binary can take several seconds to start. The UI shows a "Starting Sona..." state with retries.
- **Port conflicts:** use a free port chosen at launch, never a fixed 5000 (AirPlay Receiver already uses it on macOS).
- **Orphaned backend:** make sure the child process is killed if Electron crashes.
- **Security:** keep `contextIsolation` on and `nodeIntegration` off. The backend binds to `127.0.0.1` only and has no auth token, so consider a per-launch token that main passes to both sides.

## Open questions

- Apple Developer account and Developer ID certificate: available?
- Start at login by default, or opt in?
- One-folder or one-file PyInstaller build? One-folder starts faster; one-file is simpler to ship.
- Auto-update now or after the first release?
