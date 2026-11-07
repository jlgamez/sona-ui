import { buildUrlWith, post } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

export const downloadModel = (modelName: string) => {
  const url = buildUrlWith(ENDPOINT.DOWNLOAD_MODEL);
  return post(url, { name: modelName });
};

export const deleteModel = (modelName: string) => {
  const url = buildUrlWith(ENDPOINT.DELETE_MODEL);
  return post(url, { name: modelName });
};

export const saveUserConfig = (config: UserConfig) => {
  const url = buildUrlWith(ENDPOINT.USER_CONFIG);
  return post(url, undefined, config);
};
