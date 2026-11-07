import { contextBridge } from "electron";

const ARG_PREFIX = "--sona-api-base-url=";

// Main passes the backend URL as a process argument; no IPC needed.
const apiBaseUrl = process.argv
  .find((arg) => arg.startsWith(ARG_PREFIX))
  ?.slice(ARG_PREFIX.length);

contextBridge.exposeInMainWorld("sona", { apiBaseUrl });
