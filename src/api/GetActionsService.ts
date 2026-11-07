import { buildUrlWith, get } from "@/api/FetchUtils.ts";
import { ENDPOINT } from "@/api/ApiConstants.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

export const fetchUserConfig = () =>
  get<UserConfig>(buildUrlWith(ENDPOINT.USER_CONFIG));
