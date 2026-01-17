import { buildUrlWith, post } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";

export const downloadModel = (modelName: string) => {
  const url = buildUrlWith(ENDPOINT.DOWNLOAD_MODEL);
  post(url, { name: modelName });
};
