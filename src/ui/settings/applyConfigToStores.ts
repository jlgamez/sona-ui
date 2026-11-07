import { useClipboardStore } from "@/ui/settings/store/ClipboardStore.ts";
import { useHotKeyStore } from "@/ui/settings/store/HotKeyStore.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

export function applyConfigToStores(config: UserConfig) {
  useHotKeyStore.getState().initializeHotKeyWith(config.hot_key);
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
