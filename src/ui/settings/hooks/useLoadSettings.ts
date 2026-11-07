import { useEffect, useState } from "react";
import { fetchModels, fetchUserConfig } from "@/api/GetActionsService";
import { ApiError, describeError } from "@/api/FetchUtils";
import { applyConfigToStores } from "@/ui/settings/applyConfigToStores";
import { useModelsStore } from "@/ui/settings/store/ModelsStore";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes";

/** Wait before each retry. The backend can take a few seconds to start. */
const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000];

export type LoadStatus = "loading" | "retrying" | "error" | "ready";

/**
 * Loads the models and the saved config, retrying with backoff while the
 * backend starts. On success both are applied to the stores once.
 */
export function useLoadSettings() {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState("");
  const [run, setRun] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const load = async (attempt: number) => {
      try {
        const [models, savedConfig] = await Promise.all([
          fetchModels(),
          fetchUserConfig(),
        ]);
        if (models.length === 0) {
          throw new ApiError("Sona returned no models", 200);
        }
        if (cancelled) return;
        useModelsStore.getState().initializeModels(models);
        applyConfigToStores(savedConfig);
        setConfig(savedConfig);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        if (attempt < RETRY_DELAYS_MS.length) {
          setStatus("retrying");
          timer = setTimeout(() => load(attempt + 1), RETRY_DELAYS_MS[attempt]);
        } else {
          setError(describeError(e));
          setStatus("error");
        }
      }
    };

    load(0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [run]);

  const retry = () => {
    setStatus("loading");
    setRun((r) => r + 1);
  };

  return { status, config, setConfig, error, retry };
}
