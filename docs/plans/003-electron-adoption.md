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

### Phase 3: Packaged build and permissions (risk gate), done with an ad-hoc signature

- Package with `electron-builder`, add the usage descriptions to `Info.plist`, and sign it (ad-hoc, since there is no Developer ID).
- Microphone, Accessibility and Input Monitoring are granted per signed app, and the Python child process may not inherit them from Electron. Test hotkey, record, transcribe and paste from the installed app.
- Result (tested with an ad-hoc signature; there is no Developer ID and none is planned): the full flow works from `/Applications/Sona.app`. The backend child process uses the grants of the app, so no redesign is needed.
  - The hardened runtime needs the `allow-jit` entitlement or Electron crashes on start (`build/entitlements.mac.plist`).
  - Only Microphone prompts by itself. Accessibility (needed for paste) and Input Monitoring (hotkey) had to be added by hand in System Settings, which is the job of phase 5.
  - Ad-hoc rebuilds change the code signature, so grants can go stale and need removing and adding again. There is no Developer ID, so this stays: re-grant after installing an update (see the README).
  - Build with `npm run backend:copy && npm run pack`; the app is `release/mac-arm64/Sona.app`.
- Exit: the full flow works from `/Applications/Sona.app`. If the child process does not inherit the permissions, rework the design here (for example, run the hotkey and recording in a helper that is itself signed) before building more.

### Phase 4: App behaviour, done

- Tray icon with Open Settings and Quit, hide on close, single instance lock, optional start at login.
- Shut the backend down on quit, and kill it if Electron crashes.
- Result: menu bar only (`LSUIElement`, no Dock icon), tray menu with Open Settings, a "Start at login" checkbox (off by default) and Quit. Closing the window hides it. A second launch focuses the running instance. The backend runs with `--exit-when-parent-dies` and a stdin pipe, so it stops within seconds if Electron is killed with `kill -9`.
- The tray icon is a generated placeholder (`build/trayTemplate.png`); replace it with real artwork.
- A rebuilt, re-signed app loses its permission grants (the log shows "This process is not trusted"). Reset with `tccutil reset All com.jlgamez.sona` and add Sona again under Accessibility and Input Monitoring. Phase 5 removes this manual step.
- Exit: closing the window keeps push-to-talk working, and quitting leaves no stray processes.

### Phase 5: Onboarding and permissions UI (`sona-ui`), done with an ad-hoc signature

- First-run flow that explains each permission, detects its state, and links to System Settings.
- Model download during onboarding.
- Result: a wizard (welcome, permissions, model, hotkey, try it, done, with a Back button and a progress bar) shown while `onboarding_completed` is false in the backend config. Existing config files without the field count as completed.
  - Microphone: Electron `systemPreferences` over IPC. Accessibility: status from the backend (`AXIsProcessTrusted`), prompt from Electron (`isTrustedAccessibilityClient(true)`). Input Monitoring: backend `IOHIDCheckAccess` / `IOHIDRequestAccess` via ctypes (`GET /api/permissions`, `POST /api/permissions/request-input-monitoring`).
  - `POST /api/runtime/reload` restarts the hotkey listener once Accessibility and Input Monitoring are granted, so no app restart is needed.
  - Reload is cheap: the model loads lazily on the first transcription.
  - Run from the packaged `/Applications/Sona.app` (ad-hoc signature) from a clean state (`tccutil reset`, no config, no models) and accepted. Steps and motion respect macOS Reduce motion.
- Exit: a new user can go from install to the first transcription without reading documentation.

### Phase 6: Share as a zip, done except the clean-Mac check

Sona is for personal use and is shared through Google Drive, so there is no Apple Developer account, no notarization and no `.dmg`.

- `npm run dist` builds the ad-hoc signed app and zips it with `ditto` (`release/Sona-<version>-arm64.zip`, script `scripts/make-zip.sh`).
- Recipients unzip, move the app to Applications, remove the quarantine flag with `xattr -dr com.apple.quarantine /Applications/Sona.app`, and follow the setup wizard. Steps are in the README ("Sharing the app").
- Apple Silicon only. The speech model downloads on first run, so the recipient needs internet once.
- No auto-update: recipients replace the app by hand and re-grant permissions, because each build has a new ad-hoc signature.
- Revisit notarization and a `.dmg` only if a Developer ID is ever available. A self-signed certificate would keep permission grants across updates and can be added later.
- Exit: a zip downloaded through Drive opens on a Mac that has never had the dev setup (another Apple Silicon Mac or a fresh user account) and goes through the wizard to a first transcription. Not checked yet.

## Risks

- **Permissions** (phase 3): the most likely source of rework. Grants are tied to the signature, so every new build needs a re-grant.
- **Gatekeeper:** the app is not notarized, so a downloaded copy is blocked until the quarantine flag is removed (documented in the README).
- **Bundle size:** torch and Whisper make the backend binary large. Whisper models are downloaded after install (`~/.cache/whisper/`), not bundled.
- **Startup time:** a frozen torch binary can take several seconds to start. The UI shows a "Starting Sona..." state with retries.
- **Port conflicts:** use a free port chosen at launch, never a fixed 5000 (AirPlay Receiver already uses it on macOS).
- **Orphaned backend:** make sure the child process is killed if Electron crashes.
- **Security:** keep `contextIsolation` on and `nodeIntegration` off. The backend binds to `127.0.0.1` only and has no auth token, so consider a per-launch token that main passes to both sides.

## Decisions on the open questions

- Apple Developer account: none, and none planned.
- Start at login: opt-in, off by default (implemented in the tray menu).
- PyInstaller build: one-folder (used).
- Auto-update: none. Recipients replace the app by hand.
