import { useEffect, useState } from "react";
import { fetchUserConfig } from "@/api/GetActionsService";
import { applyConfigToStores } from "@/ui/settings/applyConfigToStores";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes";

/** Loads the saved config once and applies it to the settings stores. */
export function useFetchUserConfig() {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserConfig()
      .then((data) => {
        applyConfigToStores(data);
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { config, setConfig, loading, error };
}
