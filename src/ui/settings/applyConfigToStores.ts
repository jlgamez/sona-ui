import { useClipboardStore } from "@/ui/settings/store/ClipboardStore.ts";
import { useHotKeyStore } from "@/ui/settings/store/HotKeyStore.ts";
import { useMicStore } from "@/ui/settings/store/MicStore.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

export function applyConfigToStores(config: UserConfig) {
  useHotKeyStore.getState().setSelectedHotKey(config.hot_key);
  useMicStore.getState().setSelectedMic(config.mic_device);
  useClipboardStore
    .getState()
    .setAutonomousPasteOn(config.clipboard_behaviour.autonomous_pasting);
  useClipboardStore
    .getState()
    .setKeepOutputInClipboardOn(
      config.clipboard_behaviour.keep_output_in_clipboard,
    );
  useModelsStore.getState().setCurrentModelName(config.current_model);
}
