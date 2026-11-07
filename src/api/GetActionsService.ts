import { buildUrlWith, get } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";
import type {
  AudioDevice,
  HotKeyOption,
  UserConfig,
} from "@/ui/settings/types/SettingsTypes.ts";

export const fetchHotKeys = () =>
  get<HotKeyOption[]>(buildUrlWith(ENDPOINT.HOT_KEYS));

export const fetchAudioDevices = () =>
  get<AudioDevice[]>(buildUrlWith(ENDPOINT.AUDIO_DEVICES));

export const fetchUserConfig = () =>
  get<UserConfig>(buildUrlWith(ENDPOINT.USER_CONFIG));
