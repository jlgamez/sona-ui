export const ApiConstants = {
  BASE_URL: "http://127.0.0.1:5000",
  API: "api",
} as const;

export const ENDPOINT = {
  MODELS: "models",
  USER_CONFIG: "user-config",
  MODEL_DOWNLOAD_STATE: "model-download-state",
  DOWNLOAD_MODEL: "download-model",
  DELETE_MODEL: "delete-model",
  HOT_KEYS: "hot-keys",
} as const;

export type ENDPOINT = (typeof ENDPOINT)[keyof typeof ENDPOINT];
