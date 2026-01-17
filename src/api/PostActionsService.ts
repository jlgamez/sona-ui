import { buildUrlWith, post } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";

export const downloadModel = (modelName: string) => {
  const url = buildUrlWith(ENDPOINT.DOWNLOAD_MODEL);
  post(url, { name: modelName });
};

export const deleteModel = (modelName: string) => {
  const url = buildUrlWith(ENDPOINT.DELETE_MODEL);
  post(url, { name: modelName });
};

export type UserConfigPayload = {
  clipboard_behaviour: {
    autonomous_pasting: boolean;
    keep_output_in_clipboard: boolean;
  };
  current_model: string;
  hot_key: string;
  intelligent_mode: boolean;
  text_selection_awareness: boolean;
};

export const saveUserConfig = (config: UserConfigPayload) => {
  const url = buildUrlWith(ENDPOINT.USER_CONFIG);
  post(url, undefined, config);
};
