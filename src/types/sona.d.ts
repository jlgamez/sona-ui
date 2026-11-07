export {};

declare global {
  type MicStatus =
    | "not-determined"
    | "granted"
    | "denied"
    | "restricted"
    | "unknown";

  type SettingsPane =
    | "Privacy_Microphone"
    | "Privacy_Accessibility"
    | "Privacy_ListenEvent";

  interface Window {
    /** Set by the Electron preload script; absent in a plain browser. */
    sona?: {
      apiBaseUrl?: string;
      permissions?: {
        micStatus: () => Promise<MicStatus>;
        requestMic: () => Promise<boolean>;
        requestAccessibility: () => Promise<boolean>;
        openSettings: (pane: SettingsPane) => Promise<void>;
      };
    };
  }
}
