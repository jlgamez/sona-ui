import { buildUrlWith, post } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

export const downloadModel = (modelName: string) => {
  const url = buildUrlWith(ENDPOINT.DOWNLOAD_MODEL);
  return post<{ state: "accepted" | "completed" }>(url, { name: modelName });
};

export const deleteModel = (modelName: string) => {
  const url = buildUrlWith(ENDPOINT.DELETE_MODEL);
  return post(url, { name: modelName });
};

export const requestInputMonitoring = () =>
  post(buildUrlWith(ENDPOINT.REQUEST_INPUT_MONITORING));

/** Restarts the hotkey listener so a newly granted permission takes effect. */
export const reloadRuntime = () => post(buildUrlWith(ENDPOINT.RELOAD_RUNTIME));

export const saveUserConfig = (config: UserConfig) => {
  const url = buildUrlWith(ENDPOINT.USER_CONFIG);
  return post(url, undefined, config);
};
