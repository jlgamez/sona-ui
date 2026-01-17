import { Button } from "@/components/ui/button.tsx";
import Stack from "@/common-components/Stack.tsx";
import { saveUserConfig } from "@/api/PostActionsService.ts";
import {
  useHotKeyStore,
  UI_TO_BACKEND_KEY_MAP,
} from "@/ui/settings/store/HotKeyStore.ts";
import { useClipboardStore } from "@/ui/settings/store/ClipboardStore.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import { useIntelligentModeStore } from "@/ui/settings/store/IntelligentModeStore.ts";
import { useTextSelectionAwarenessStore } from "@/ui/settings/store/TextSelectionAwarenessStore.ts";

type SaveCancelActionProps = {
  onClose?: () => void;
};

export const SaveCancelAction = ({ onClose }: SaveCancelActionProps) => {
  const handleSave = () => {
    const selectedHotKey = useHotKeyStore.getState().selectedHotKey;
    const { autonomousPasteOn, keepOutputInClipboardOn } =
      useClipboardStore.getState();
    const currentModelName = useModelsStore.getState().currentModelName;
    const isIntelligentModeEnabled =
      useIntelligentModeStore.getState().isEnabled;
    const isTextSelectionAwarenessOn =
      useTextSelectionAwarenessStore.getState().isTextSelectionAwarenessOn;

    if (!selectedHotKey) {
      console.error("No hot key selected");
      return;
    }

    saveUserConfig({
      hot_key: UI_TO_BACKEND_KEY_MAP[selectedHotKey],
      clipboard_behaviour: {
        autonomous_pasting: autonomousPasteOn,
        keep_output_in_clipboard: keepOutputInClipboardOn,
      },
      current_model: currentModelName,
      intelligent_mode: isIntelligentModeEnabled,
      text_selection_awareness: isTextSelectionAwarenessOn,
    });
    onClose?.();
  };

  return (
    <div className="w-full flex justify-end p-10">
      <Stack direction={"row"} spacing={4} align={"end"}>
        <Button variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </Stack>
    </div>
  );
};
