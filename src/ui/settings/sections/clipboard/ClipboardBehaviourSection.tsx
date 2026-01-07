import { ToggleSetting } from "@/ui/settings/components/ToggleSetting.tsx";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { useIntelligentModeStore } from "@/ui/settings/store/IntelligentModeStore.ts";
import { useClipboardStore } from "@/ui/settings/store/ClipboardStore.ts";
import { useEffect } from "react";

export const ClipboardBehaviourSection = () => {
  const { getIsIntelligentModeEnabled } = useIntelligentModeStore();
  let isIntelligentModeEnabled = getIsIntelligentModeEnabled();
  let isIntelligentModeDisabled = !isIntelligentModeEnabled;

  const {
    getAutomaticPasteEnabled,
    getKeepOutputInClipboardEnabled,
    setAutonomousPasteOn,
    setKeepOutputInClipboardOn,
  } = useClipboardStore();
  let isAutonomousPaste = getAutomaticPasteEnabled();
  let isKeepOutputInClipboard = getKeepOutputInClipboardEnabled();

  useEffect(() => {
    if (isIntelligentModeEnabled && isAutonomousPaste) {
      setAutonomousPasteOn(false);
    }
  }, [isIntelligentModeEnabled, setAutonomousPasteOn]);

  const handleAutonomousPasteChange = (isOn: boolean) => {
    setAutonomousPasteOn(isOn);
  };

  const handleKeepOutputInClipboardChange = (isOn: boolean) => {
    setKeepOutputInClipboardOn(isOn);
  };

  return (
    <Stack direction={"column"} spacing={8} align={"start"}>
      <Text>{"Clipboard behaviour"}</Text>
      <Stack
        direction={"column"}
        spacing={4}
        align={"start"}
        className={"pl-7"}
      >
        <ToggleSetting
          name={"Autonomous pasting"}
          description={
            <>
              When enabled Sona will paste the transcribed text on its own
              <br />
              Disabled when in Intelligent Mode
            </>
          }
          enabled={isIntelligentModeDisabled}
          onChange={handleAutonomousPasteChange}
          defaultChecked={isAutonomousPaste}
          checked={isAutonomousPaste}
        />
        <ToggleSetting
          name={"Keep output in clipboard"}
          description={
            "When enabled, Sona will the latest output in the clipboard"
          }
          onChange={handleKeepOutputInClipboardChange}
          defaultChecked={isKeepOutputInClipboard}
        />
      </Stack>
    </Stack>
  );
};
