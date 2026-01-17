import { useEffect, useState } from "react";
import { buildUrlWith, get } from "@/api/FetchUtils";
import { ENDPOINT } from "@/api/ApiConstants";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes";

export function useFetchUserConfig() {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = buildUrlWith(ENDPOINT.USER_CONFIG);
    get<UserConfig>(url)
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { config, loading, error };
}
