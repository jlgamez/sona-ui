import {
  UI_TO_BACKEND_KEY_MAP,
  useHotKeyStore,
} from "@/ui/settings/store/HotKeyStore.ts";
import { useClipboardStore } from "@/ui/settings/store/ClipboardStore.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

/**
 * The saved config with the values currently edited in the settings stores on top.
 * Fields the UI does not edit (e.g. mic_device) are carried over from the saved config.
 */
export function useDraftConfig(saved: UserConfig): UserConfig {
  const hotKey = useHotKeyStore((store) => store.selectedHotKey);
  const autonomousPasting = useClipboardStore(
    (store) => store.autonomousPasteOn,
  );
  const keepOutputInClipboard = useClipboardStore(
    (store) => store.keepOutputInClipboardOn,
  );
  const currentModel = useModelsStore((store) => store.currentModelName);

  return {
    ...saved,
    hot_key: hotKey ? UI_TO_BACKEND_KEY_MAP[hotKey] : saved.hot_key,
    clipboard_behaviour: {
      ...saved.clipboard_behaviour,
      autonomous_pasting: autonomousPasting,
      keep_output_in_clipboard: keepOutputInClipboard,
    },
    current_model: currentModel,
  };
}
