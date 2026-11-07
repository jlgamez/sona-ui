# 002: Critical UI fixes

Status: items 1 to 6 done. Scope is steps 1 and 2 of the order in `001-ui-electron-assessment.md`. Each item is a separate commit.

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

Problems: no delete confirmation (bug 5), stale current model after deleting it (bug 4), silent download failure (bug 6), optimistic updates that were never rolled back, and a race where polling could see "not started" before the backend tracked the download.

Done (see `modelActions.ts`, `DeleteModelDialog.tsx`, `useCheckModelDownloadState.tsx`):
- `startModelDownload` and `removeModel` are the one place that calls the API, updates the model store and reports errors with a toast. The downloading flag is set only after the backend accepted the request, which removes the race.
- Delete asks for confirmation. For the current model the dialog says Sona will switch to another model.
- After a delete, the saved config is re-fetched. If the deleted model was selected in the stores, the selection follows the backend. Other unsaved edits are kept. The config is applied to the stores once on load, not on every change.
- A download that ends without the model shows "Download of X failed". Polling ignores transient network errors and now runs once per model (the Current Model section no longer polls on its own).

Not included: cancelling a download (the backend has no endpoint), so Cancel in Settings reverts the selection but a started download continues. Blocking Save while the chosen model is still downloading is a possible follow-up.

Checked against a stub backend: successful download, failed request, failed download, delete (cancel and confirm), delete of the current model with an unsaved edit, failed delete, and downloading from the Current Model dropdown.

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

Done (see `MicrophoneSection.tsx`, `HotKeySelectionSection.tsx`, `useFetchData.ts`, `MicStore.ts`):
- Microphone section after the hotkey: "System default" (saved as `mic_device: null`) plus the devices from `GET /api/audio-devices`, and a refresh button (`aria-label` "Refresh microphones"). A saved mic that is not in the list is shown as "<name> (not connected)" with the hint "Sona is using the system default microphone." and is kept in the config. An empty list shows "No microphones found. Using system default." If the request fails, only "System default" and the saved value are shown. The dropdown is not disabled in these cases.
- Hotkeys come from `GET /api/hot-keys` (`name`, `display_name`, `is_default`). The hardcoded lists and key maps are gone.
- `DropDown` options are now `{ value, label }`, and long labels are truncated.

Bug found and fixed: the old UI mapped "cmd + ctrl" to `cmd_ctrl`, but the backend expects `cmd+ctrl`. The backend silently falls back to Control (Left) for unknown names, so "Command + Control" never worked. A config already saved as `cmd_ctrl` is shown as the default key (as the backend treats it) and is only corrected when the user picks a key and saves.

Follow-up for the backend repo: reject an unknown `hot_key` with a 400 instead of silently using the default.

Checked against a stub backend: hotkey saved as `cmd+ctrl`, mic chosen and saved, unplugged mic with hint, "System default" saved as null, refresh picks up a new device, empty list, failing endpoint, legacy `cmd_ctrl`, and the Current Model dropdown after the `DropDown` change.

## 6. Load errors and backend startup

Problem: any failed fetch showed the permanent text "There was an error loading settings" (`App.tsx`). In Electron the backend can take several seconds to be ready.

Done (see `useLoadSettings.ts`, `LoadError.tsx`, `App.tsx`):
- `useLoadSettings` replaces the two load hooks. It loads the models and the saved config together and applies them to the stores once on success. If a load fails it retries after 1s, 2s, 4s and 8s (five attempts in total) and the screen shows a spinner with "Starting Sona...".
- When the attempts run out, `LoadError` shows the reason and a "Try again" button, which starts the cycle again.
- An empty models list is an error ("Sona returned no models") and no longer an endless spinner.
- `fetchModels` in `GetActionsService.ts` now holds the model mapping.

Not included: detecting that the backend died after a successful load. That belongs with the Electron main process.

Checked against a stub backend: UI started before the backend recovers on its own, the error screen after the attempts run out and recovery through "Try again", an empty models list, a 500 from the config endpoint, and a normal load into Settings.

## Out of scope

Onboarding, recording status, microphone test, tabs layout, Electron shell, packaging. See `001-ui-electron-assessment.md`.

## Verification

- `npm run build` and `npm run lint` pass after each item.
- Manual run against the backend (`python run.py --port 5000`): save success and failure (stop the backend or send an invalid value), cancel and reopen, delete and download flows, mic list with a device unplugged, backend started late.
- No test runner exists in the repo. Adding Vitest with React Testing Library for the API client and the draft store is a reasonable follow-up, not part of this plan.
