import { ToggleSetting } from "@/ui/settings/components/ToggleSetting.tsx";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { useClipboardStore } from "@/ui/settings/store/ClipboardStore.ts";

export const ClipboardBehaviourSection = () => {
  const { setAutonomousPasteOn, setKeepOutputInClipboardOn } =
    useClipboardStore();
  const isAutonomousPaste = useClipboardStore(
    (state) => state.autonomousPasteOn,
  );
  const isKeepOutputInClipboard = useClipboardStore(
    (state) => state.keepOutputInClipboardOn,
  );

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
          //enabled={isIntelligentModeDisabled}
          onChange={handleAutonomousPasteChange}
          //defaultChecked={isAutonomousPaste}
          checked={isAutonomousPaste}
        />
        <ToggleSetting
          name={"Keep output in clipboard"}
          description={
            "When enabled, Sona will the latest output in the clipboard"
          }
          onChange={handleKeepOutputInClipboardChange}
          //defaultChecked={isKeepOutputInClipboard}
          checked={isKeepOutputInClipboard}
        />
      </Stack>
    </Stack>
  );
};
