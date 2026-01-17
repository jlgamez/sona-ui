import { useEffect, useState } from "react";
import type { WhisperModel } from "@/ui/settings/types/SettingsTypes.ts";
import { buildUrlWith, get } from "@/api/FetchUtils";
import { ENDPOINT } from "@/api/ApiConstants";

type ApiModel = {
  name: string;
  required_ram: string;
  relative_speed: string;
  in_system: boolean;
  english_only: boolean;
};

export function useFetchAvailableModels() {
  const [models, setModels] = useState<WhisperModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapToWhisperModel = (dataFromApi: ApiModel[]): WhisperModel[] => {
    return dataFromApi.map((m) => ({
      name: m.name,
      requiredRam: m.required_ram,
      relativeSpeed: m.relative_speed,
      inSystem: m.in_system,
      englishOnly: m.english_only,
      isDownloading: false,
    }));
  };

  useEffect(() => {
    const url = buildUrlWith(ENDPOINT.MODELS);
    get<ApiModel[]>(url)
      .then((data) => {
        setModels(mapToWhisperModel(data));
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return { models, loading, error };
}
