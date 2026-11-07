import { app, BrowserWindow, dialog, type Tray } from "electron";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createTray } from "./tray";

const READY_TIMEOUT_MS = 90_000;
const READY_POLL_MS = 500;
const KILL_TIMEOUT_MS = 5_000;

const here = path.dirname(fileURLToPath(import.meta.url));

let backend: ChildProcess | null = null;
let quitting = false;
let mainWindow: BrowserWindow | null = null;
let backendPort = 0;
let tray: Tray | null = null;

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        server.close();
        reject(new Error("Could not get a free port"));
        return;
      }
      server.close(() => resolve(address.port));
    });
  });
}

function backendPath(): string {
  if (process.env.SONA_BACKEND_PATH) return process.env.SONA_BACKEND_PATH;
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "sona-backend", "sona-backend");
  }
  // Dev: sibling checkout of the sona repo.
  return path.resolve(here, "../../../sona/dist/sona-backend/sona-backend");
}

function startBackend(port: number): ChildProcess {
  const executable = backendPath();
  if (!existsSync(executable)) {
    throw new Error(`Backend not found at ${executable}`);
  }
  const child = spawn(
    executable,
    ["--port", String(port), "--exit-when-parent-dies"],
    // stdin stays open as a pipe: when Electron dies the OS closes it and the backend stops itself.
    { stdio: ["pipe", "pipe", "pipe"] },
  );
  const log = (stream: NodeJS.ReadableStream) =>
    stream.on("data", (chunk: Buffer) => {
      for (const line of chunk.toString().split("\n")) {
        if (line.trim()) console.log(`[backend] ${line}`);
      }
    });
  log(child.stdout!);
  log(child.stderr!);
  child.on("exit", (code, signal) => {
    console.log(`[backend] exited code=${code} signal=${signal}`);
    backend = null;
    if (!quitting) {
      dialog.showErrorBox(
        "Sona stopped",
        "The Sona backend exited unexpectedly.",
      );
      app.quit();
    }
  });
  return child;
}

async function waitUntilReady(port: number): Promise<void> {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (backend === null) throw new Error("Backend exited during startup");
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/models`);
      if (response.ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, READY_POLL_MS));
  }
  throw new Error("Backend did not become ready in time");
}

function stopBackend(): void {
  const child = backend;
  if (child === null) return;
  child.kill("SIGTERM");
  setTimeout(() => child.kill("SIGKILL"), KILL_TIMEOUT_MS).unref();
}

function showWindow(): void {
  if (mainWindow === null || mainWindow.isDestroyed()) {
    mainWindow = createWindow(backendPort);
  }
  mainWindow.show();
  mainWindow.focus();
}

function createWindow(port: number): BrowserWindow {
  const window = new BrowserWindow({
    width: 900,
    height: 700,
    show: false,
    webPreferences: {
      preload: path.join(here, "../preload/index.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      additionalArguments: [`--sona-api-base-url=http://127.0.0.1:${port}`],
    },
  });
  // Closing hides the window so push-to-talk keeps working; only Quit exits.
  window.on("close", (event) => {
    if (!quitting) {
      event.preventDefault();
      window.hide();
    }
  });
  const devUrl = process.env.ELECTRON_RENDERER_URL;
  if (devUrl) {
    void window.loadURL(devUrl);
  } else {
    void window.loadFile(path.join(here, "../renderer/index.html"));
  }
  return window;
}

async function main(): Promise<void> {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }
  app.on("second-instance", () => {
    if (backendPort !== 0) showWindow();
  });
  await app.whenReady();
  app.dock?.hide();
  try {
    backendPort = await getFreePort();
    backend = startBackend(backendPort);
    tray = createTray(here, {
      openSettings: showWindow,
      quit: () => app.quit(),
    });
    await waitUntilReady(backendPort);
    // Started by the login item: stay in the menu bar until the user opens Settings.
    if (process.argv.includes("--hidden")) {
      mainWindow = createWindow(backendPort);
    } else {
      showWindow();
    }
  } catch (error) {
    dialog.showErrorBox("Sona could not start", String(error));
    app.quit();
  }
}

app.on("before-quit", () => {
  quitting = true;
  stopBackend();
  tray?.destroy();
});
// Closing the last window must not quit: Sona lives in the menu bar.
app.on("window-all-closed", () => {});

void main();
