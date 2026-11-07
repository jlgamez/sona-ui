export {};

declare global {
  interface Window {
    /** Set by the Electron preload script; absent in a plain browser. */
    sona?: { apiBaseUrl?: string };
  }
}
