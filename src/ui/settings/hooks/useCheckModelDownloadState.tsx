import { useEffect, useRef } from "react";
import { buildUrlWith, get } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";

type DownloadStateResponse = {
  model_name: string;
  state: "completed" | "downloading" | "not_started";
  success: boolean;
};

const ENDPOINT_URL = buildUrlWith(ENDPOINT.MODEL_DOWNLOAD_STATE);

export function useCheckModelDownloadState(modelName: string) {
  const { setModelDownloading, setModelInSystem } = useModelsStore();
  // Subscribe directly to the model's downloading state so the effect re-runs when it changes
  const isDownloading = useModelsStore(
    (state) => state.models.get(modelName)?.isDownloading ?? false,
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!modelName || !isDownloading) {
      // Clear any existing interval when not downloading
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkDownloadState = async () => {
      const response = await get<DownloadStateResponse>(ENDPOINT_URL, {
        name: modelName,
      });

      // Update flags only on change (store already guards redundant writes)
      const isDownloading = response.state === "downloading";
      setModelDownloading(modelName, isDownloading);

      if (response.state === "completed") {
        setModelInSystem(modelName, true);
        // Stop polling on completion
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return true;
      }

      // Stop polling if server reports not_started
      if (response.state === "not_started") {
        setModelDownloading(modelName, false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return true;
      }

      return false;
    };

    // Fire immediately, then continue if still downloading
    (async () => {
      const done = await checkDownloadState();
      if (done) return;
      intervalRef.current = setInterval(async () => {
        const stop = await checkDownloadState();
        if (stop && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 2000);
    })();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [modelName, isDownloading, setModelDownloading, setModelInSystem]);

  return { modelName, setModelDownloading, setModelInSystem };
}
