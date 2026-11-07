import { ipcMain, shell, systemPreferences } from "electron";

/** System Settings privacy panes the renderer may open. */
const PANES = [
  "Privacy_Microphone",
  "Privacy_Accessibility",
  "Privacy_ListenEvent",
] as const;

type Pane = (typeof PANES)[number];

function isPane(value: unknown): value is Pane {
  return PANES.includes(value as Pane);
}

/**
 * Microphone and Accessibility go through Electron's own APIs. Input Monitoring
 * has none, so the backend reports and requests it (see the /api/permissions route).
 */
export function registerPermissionHandlers(): void {
  ipcMain.handle("permissions:mic-status", () =>
    systemPreferences.getMediaAccessStatus("microphone"),
  );
  ipcMain.handle("permissions:request-mic", () =>
    systemPreferences.askForMediaAccess("microphone"),
  );
  // true shows the system prompt and adds Sona to the Accessibility list.
  ipcMain.handle("permissions:request-accessibility", () =>
    systemPreferences.isTrustedAccessibilityClient(true),
  );
  ipcMain.handle("permissions:open-settings", (_event, pane: unknown) => {
    if (!isPane(pane))
      throw new Error(`Unknown settings pane: ${String(pane)}`);
    return shell.openExternal(
      `x-apple.systempreferences:com.apple.preference.security?${pane}`,
    );
  });
}
