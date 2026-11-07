# 002: Critical UI fixes

Status: items 1, 2 and 4 done; the rest planned. Scope is steps 1 and 2 of the order in `001-ui-electron-assessment.md`. Each item is a separate commit.

Backend API (repo `sona`): `GET/POST /api/user-config`, `GET /api/models`, `GET /api/hot-keys`, `GET /api/audio-devices`, `POST /api/download-model?name=`, `GET /api/model-download-state?name=`, `POST /api/delete-model?name=`. Errors come back as `{"success": false, "error": "..."}` with a 4xx or 5xx status.

## 1. API client: check status, surface errors

Problem: `get` and `post` in `src/api/FetchUtils.ts` call `response.json()` without checking `response.ok`, and the helpers in `PostActionsService.ts` do not return their promises.

Changes:
- Add an `ApiError` class (status, message). `get` and `post` throw it when `!response.ok`, using `error` from the body when present.
- Make `downloadModel`, `deleteModel` and `saveUserConfig` return their promises.
- Remove the `console.log` in `buildUrlWith`.
- `BASE_URL` reads `import.meta.env.VITE_API_BASE_URL` and falls back to `http://127.0.0.1:5000`. The runtime hook for Electron (a preload script exposing the URL) is deferred until the Electron shell exists.

Done when: a 400 or 500 from any call rejects with a readable message.

## 2. Save and Cancel

Problems: Cancel keeps edited store values (bug 2), Save closes immediately and ignores failures (bug 3), the payload lacks `mic_device` (bug 1).

Done (see `useDraftConfig.ts`, `applyConfigToStores.ts`, `SaveCancelAction.tsx`):
- The saved config from `GET /api/user-config` is the baseline, held in `App.tsx`. The draft is the saved config with the edited store values on top (`useDraftConfig`). Fields the UI does not edit, such as `mic_device`, are carried over, so Save never resets them. There is no separate draft store.
- Cancel calls `applyConfigToStores(savedConfig)` to restore the stores, then closes.
- Save awaits `saveUserConfig`, shows a spinner and is disabled while saving or when nothing changed. On success it updates the saved config, shows a "Settings saved" toast (sonner) and closes. On failure it shows an error toast with the backend message and stays open with the draft intact.
- The Intelligent Mode and Text Selection Awareness stores were removed, since their values now come from the saved config. Bring stores back when those features exist.
- `UserConfig` has `mic_device: string | null`; the duplicate `UserConfigPayload` type was removed.

Known limit: choosing a model that is not downloaded starts its download immediately, and Cancel does not stop it. That belongs to item 3.

Checked against a stub backend: Save disabled until a change, Cancel reverts, failed save keeps the screen open with the error toast, successful save toasts and persists, and the request body keeps `mic_device`.

## 3. Model deletion and download

Problems: no delete confirmation (bug 5), stale current model after deleting it (bug 4), silent download failure (bug 6), optimistic updates that are never rolled back.

Changes:
- Delete opens a confirmation dialog (existing `components/ui/dialog`): "Delete model X? You can download it again later." Cancel and a destructive Delete button. Focus returns to the row button on close.
- Do not flip `inSystem` before the request returns. Await `deleteModel`, then update the store. On error, show a toast.
- After a successful delete, re-fetch `GET /api/user-config` and update `currentModelName` (the backend resets it when the deleted model was active).
- Download: set `isDownloading` on click, and roll it back with an error toast if `downloadModel` rejects. When polling `model-download-state` ends with `not_started` after a download was started, show a "Download of X failed" toast. A download that ends in `completed` shows nothing special.
- Disable the delete button for the model currently selected, or explain that the default will be used. Choose the second: the dialog states "This is your current model. Sona will switch to the default model."

Done when: deleting the active model updates the Current model section; a failed download shows a toast and returns the row to the download button; delete asks for confirmation.

## 4. Coming soon: Intelligent Mode and Text Selection Awareness

Problem: both toggles are stored by the backend but not used, so they do nothing.

Changes:
- Extend `ToggleSetting` with a `comingSoon?: boolean` prop. When set, the switch is disabled and not focusable as an action, and a "Coming soon" badge sits next to the name. The disabled state keeps `aria-disabled` and the badge text is read by screen readers.
- `IntelligentModeSection` and `TextSelectionAwarenessSection` become stateless and pass `comingSoon`. They no longer read the stores, and the switches display off.
- The stores stay, so the values loaded from the backend are still sent unchanged on Save and the backend config is not altered.
- Remove the line "Disabled when in Intelligent Mode" from the Autonomous pasting description in `ClipboardBehaviourSection`, since the interaction does not exist.
- Fix the typo in the Keep output description ("Sona will the latest output" should read "Sona will keep the latest output").

Done when: both toggles are visibly disabled with a badge and cannot be changed.

## 5. Microphone picker and hotkeys from the API

Changes:
- Add `AUDIO_DEVICES: "audio-devices"` and a `useFetchAudioDevices` hook (same shape as the existing fetch hooks). Response: `[{ "index": number, "name": string }]`.
- New `MicrophoneSection` in Settings, placed first or after the hotkey. Uses `DropDown` with a "System default" first option (maps to `mic_device: null`) followed by device names. Store the choice in the draft.
- A refresh icon button re-fetches the list. It has an `aria-label` of "Refresh microphones".
- If the saved `mic_device` is not in the list, show it in the dropdown as "<name> (not connected)" and a helper line "Sona is using the system default microphone." Do not clear it from the config.
- Empty list (non-macOS or ffmpeg failure): show "No microphones found. Using system default." and disable the dropdown.
- Hotkeys: replace the hardcoded `AVAILABLE_HOT_KEYS` with `GET /api/hot-keys`. First check the response shape and keep the display-name mapping only if the API does not return display names.

Done when: choosing a microphone and saving persists `mic_device`; an unplugged saved device shows the not-connected hint; the hotkey list comes from the backend.

## 6. Load errors and backend startup

Problem: any failed fetch shows the permanent text "There was an error loading settings" (`App.tsx`). In Electron the backend can take several seconds to be ready.

Changes:
- Replace the message with an error state: heading, short explanation, "Try again" button. While the first load fails, retry automatically with backoff (1s, 2s, 4s, up to 5 attempts), showing "Starting Sona..." with a spinner. After the attempts are exhausted, show the error state with the button.
- Do not require `models.length === 0` as a loading condition. An empty models list is a real error state with its own message.

Done when: starting the UI before the backend and then starting the backend recovers without a reload.

## Out of scope

Onboarding, recording status, microphone test, tabs layout, Electron shell, packaging. See `001-ui-electron-assessment.md`.

## Verification

- `npm run build` and `npm run lint` pass after each item.
- Manual run against the backend (`python run.py --port 5000`): save success and failure (stop the backend or send an invalid value), cancel and reopen, delete and download flows, mic list with a device unplugged, backend started late.
- No test runner exists in the repo. Adding Vitest with React Testing Library for the API client and the draft store is a reasonable follow-up, not part of this plan.
