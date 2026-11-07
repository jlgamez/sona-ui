import { contextBridge, ipcRenderer } from "electron";

const ARG_PREFIX = "--sona-api-base-url=";

// Main passes the backend URL as a process argument; no IPC needed.
const apiBaseUrl = process.argv
  .find((arg) => arg.startsWith(ARG_PREFIX))
  ?.slice(ARG_PREFIX.length);

// Only these functions cross the bridge; ipcRenderer itself is never exposed.
const permissions = {
  micStatus: () => ipcRenderer.invoke("permissions:mic-status"),
  requestMic: () => ipcRenderer.invoke("permissions:request-mic"),
  requestAccessibility: () =>
    ipcRenderer.invoke("permissions:request-accessibility"),
  openSettings: (pane: string) =>
    ipcRenderer.invoke("permissions:open-settings", pane),
};

contextBridge.exposeInMainWorld("sona", { apiBaseUrl, permissions });
