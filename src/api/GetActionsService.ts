import { buildUrlWith, get } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";
import type {
  AudioDevice,
  HotKeyOption,
  UserConfig,
  WhisperModel,
} from "@/ui/settings/types/SettingsTypes.ts";

export const fetchHotKeys = () =>
  get<HotKeyOption[]>(buildUrlWith(ENDPOINT.HOT_KEYS));

export const fetchAudioDevices = () =>
  get<AudioDevice[]>(buildUrlWith(ENDPOINT.AUDIO_DEVICES));

export type BackendPermissions = {
  input_monitoring: "granted" | "denied" | "unknown";
  accessibility: "granted" | "denied" | "unknown";
};

export const fetchPermissions = () =>
  get<BackendPermissions>(buildUrlWith(ENDPOINT.PERMISSIONS));

export const fetchUserConfig = () =>
  get<UserConfig>(buildUrlWith(ENDPOINT.USER_CONFIG));

type ApiModel = {
  name: string;
  required_ram: string;
  relative_speed: string;
  in_system: boolean;
  english_only: boolean;
};

export const fetchModels = async (): Promise<WhisperModel[]> => {
  const models = await get<ApiModel[]>(buildUrlWith(ENDPOINT.MODELS));
  return models.map((m) => ({
    name: m.name,
    requiredRam: m.required_ram,
    relativeSpeed: m.relative_speed,
    inSystem: m.in_system,
    englishOnly: m.english_only,
    isDownloading: false,
  }));
};
