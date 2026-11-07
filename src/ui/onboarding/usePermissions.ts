import { useCallback, useEffect, useState } from "react";
import { fetchPermissions } from "@/api/GetActionsService.ts";

/** "not-determined" means the system has not asked the user yet. */
export type PermissionState = "granted" | "denied" | "not-determined";

export type PermissionsState = {
  microphone: PermissionState;
  accessibility: PermissionState;
  inputMonitoring: PermissionState;
};

const POLL_MS = 1500;

const INITIAL: PermissionsState = {
  microphone: "not-determined",
  accessibility: "denied",
  inputMonitoring: "not-determined",
};

function fromMic(status: MicStatus): PermissionState {
  if (status === "granted") return "granted";
  if (status === "denied" || status === "restricted") return "denied";
  return "not-determined";
}

async function readPermissions(): Promise<PermissionsState | null> {
  try {
    const [mic, backend] = await Promise.all([
      window.sona?.permissions?.micStatus() ?? Promise.resolve("granted"),
      fetchPermissions(),
    ]);
    return {
      microphone: fromMic(mic as MicStatus),
      accessibility: backend.accessibility === "granted" ? "granted" : "denied",
      // IOHIDCheckAccess reports "unknown" until the user has been asked.
      inputMonitoring:
        backend.input_monitoring === "granted"
          ? "granted"
          : backend.input_monitoring === "denied"
            ? "denied"
            : "not-determined",
    };
  } catch {
    return null; // transient error: keep the last state
  }
}

/**
 * Current macOS permission state, refreshed while the component is mounted.
 * Microphone comes from Electron, Accessibility and Input Monitoring from the
 * backend, which is the process that uses them. Outside Electron (browser dev)
 * the microphone cannot be read and counts as granted.
 */
export function usePermissions() {
  const [state, setState] = useState<PermissionsState>(INITIAL);

  const refresh = useCallback(async () => {
    const next = await readPermissions();
    if (next) setState(next);
  }, []);

  useEffect(() => {
    let active = true;
    const poll = () =>
      readPermissions().then((next) => {
        if (active && next) setState(next);
      });
    void poll();
    const timer = setInterval(() => void poll(), POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return { state, refresh };
}
