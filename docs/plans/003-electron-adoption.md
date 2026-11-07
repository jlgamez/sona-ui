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

## Steps

1. **Backend as a standalone binary** (repo `sona`). Un-ignore and commit `Sona.spec`. Build with PyInstaller and run the binary from a terminal. Check that it finds `ffmpeg` and the Whisper assets when frozen, accepts `--port`, and exits cleanly on SIGTERM. Confirm a cheap readiness check exists (`GET /api/models` can serve as one).
2. **Electron shell** (repo `sona-ui`). Add `electron-vite`, `main.ts` and `preload.ts`. In dev, load the Vite dev server. In production, load the built files. Spawn the backend on a free port, poll until ready, then open the window. The preload script passes the port to the renderer; `ApiConstants.BASE_URL` reads it and falls back to `VITE_API_BASE_URL` for plain browser development.
3. **Permissions on a signed build.** Microphone, Accessibility and Input Monitoring are granted per signed app, and the Python child process may not inherit them from Electron. Add the usage descriptions to `Info.plist`, sign with a Developer ID certificate and test the full flow: hotkey, record, transcribe, paste. This is the main risk, so it is done before any polish.
4. **App behaviour.** Tray icon with Open Settings and Quit, hide on close, start at login (optional), single instance lock, and a clean shutdown of the backend on quit or crash.
5. **Onboarding and permissions screens** in the UI: explain each permission, detect its state, and link to System Settings. Add the load error and retry screen (item 6 of 002), which also covers the backend startup delay.
6. **Packaging and release.** `electron-builder` with `extraResources` for the backend binary, signing, notarization and a `.dmg`. Decide on auto-update later.

## Risks

- **Permissions** (step 3): the most likely source of rework. Test early with a signed build.
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
