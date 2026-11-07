import { useHotKeyStore } from "@/ui/settings/store/HotKeyStore.ts";
import { useMicStore } from "@/ui/settings/store/MicStore.ts";
import { useClipboardStore } from "@/ui/settings/store/ClipboardStore.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

/**
 * The saved config with the values currently edited in the settings stores on top.
 * Fields the UI does not edit (e.g. Intelligent Mode) are carried over from the saved config.
 */
export function useDraftConfig(saved: UserConfig): UserConfig {
  const hotKey = useHotKeyStore((store) => store.selectedHotKey);
  const autonomousPasting = useClipboardStore(
    (store) => store.autonomousPasteOn,
  );
  const keepOutputInClipboard = useClipboardStore(
    (store) => store.keepOutputInClipboardOn,
  );
  const micDevice = useMicStore((store) => store.selectedMic);
  const currentModel = useModelsStore((store) => store.currentModelName);

  return {
    ...saved,
    hot_key: hotKey ?? saved.hot_key,
    mic_device: micDevice,
    clipboard_behaviour: {
      ...saved.clipboard_behaviour,
      autonomous_pasting: autonomousPasting,
      keep_output_in_clipboard: keepOutputInClipboard,
    },
    current_model: currentModel,
  };
}
