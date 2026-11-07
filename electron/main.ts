import { app, BrowserWindow, dialog } from "electron";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const READY_TIMEOUT_MS = 90_000;
const READY_POLL_MS = 500;
const KILL_TIMEOUT_MS = 5_000;

const here = path.dirname(fileURLToPath(import.meta.url));

let backend: ChildProcess | null = null;
let quitting = false;

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
  // Dev: sibling checkout of the sona repo. Packaged path comes in phase 3.
  return (
    process.env.SONA_BACKEND_PATH ??
    path.resolve(here, "../../../sona/dist/sona-backend/sona-backend")
  );
}

function startBackend(port: number): ChildProcess {
  const executable = backendPath();
  if (!existsSync(executable)) {
    throw new Error(`Backend not found at ${executable}`);
  }
  const child = spawn(executable, ["--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
  });
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

function createWindow(port: number): void {
  const window = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(here, "../preload/index.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      additionalArguments: [`--sona-api-base-url=http://127.0.0.1:${port}`],
    },
  });
  const devUrl = process.env.ELECTRON_RENDERER_URL;
  if (devUrl) {
    void window.loadURL(devUrl);
  } else {
    void window.loadFile(path.join(here, "../renderer/index.html"));
  }
}

async function main(): Promise<void> {
  await app.whenReady();
  try {
    const port = await getFreePort();
    backend = startBackend(port);
    await waitUntilReady(port);
    createWindow(port);
  } catch (error) {
    dialog.showErrorBox("Sona could not start", String(error));
    app.quit();
  }
}

app.on("before-quit", () => {
  quitting = true;
  stopBackend();
});
app.on("window-all-closed", () => app.quit());

void main();
