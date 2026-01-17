import { ToggleSetting } from "@/ui/settings/components/ToggleSetting.tsx";
import { useTextSelectionAwarenessStore } from "@/ui/settings/store/TextSelectionAwarenessStore.ts";
import { useIntelligentModeStore } from "@/ui/settings/store/IntelligentModeStore.ts";
import { useEffect } from "react";

export const TextSelectionAwarenessSection = () => {
  const { setTextSelectionAwarenessOn } = useTextSelectionAwarenessStore();
  const { getIsIntelligentModeEnabled } = useIntelligentModeStore();

  const isSelectionAwarenessEnabled = useTextSelectionAwarenessStore(
    (state) => state.isTextSelectionAwarenessOn,
  );
  const isIntelligentModeEnabled = getIsIntelligentModeEnabled();

  const handleTextSelectionAwarenessChange = (isOn: boolean) => {
    setTextSelectionAwarenessOn(isOn);
  };

  useEffect(() => {
    if (!isIntelligentModeEnabled && isSelectionAwarenessEnabled) {
      setTextSelectionAwarenessOn(false);
    }
  }, [
    isIntelligentModeEnabled,
    isSelectionAwarenessEnabled,
    setTextSelectionAwarenessOn,
  ]);

  return (
    <ToggleSetting
      name={"Text Selection Awareness"}
      description={
        <>
          When enabled, Sona will consider your current text selection as part
          of the conversation
          <br />
          Available only with Intelligent Mode
        </>
      }
      onChange={handleTextSelectionAwarenessChange}
      //defaultChecked={isSelectionAwarenessEnabled}
      checked={isSelectionAwarenessEnabled}
      enabled={isIntelligentModeEnabled}
    />
  );
};
