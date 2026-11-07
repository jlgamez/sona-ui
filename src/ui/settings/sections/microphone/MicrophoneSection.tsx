import { RefreshCwIcon } from "lucide-react";
import { fetchAudioDevices } from "@/api/GetActionsService.ts";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import DropDown from "@/common-components/DropDown.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useFetchData } from "@/ui/settings/hooks/useFetchData.ts";
import { useMicStore } from "@/ui/settings/store/MicStore.ts";

const SYSTEM_DEFAULT = "";

export const MicrophoneSection = () => {
  const { data: devices, reload } = useFetchData(fetchAudioDevices);
  const selectedMic = useMicStore((store) => store.selectedMic);
  const setSelectedMic = useMicStore((store) => store.setSelectedMic);

  const deviceNames = devices?.map((device) => device.name) ?? [];
  const isNotConnected =
    devices !== null &&
    selectedMic !== null &&
    !deviceNames.includes(selectedMic);

  const options = [
    { value: SYSTEM_DEFAULT, label: "System default" },
    ...deviceNames.map((name) => ({ value: name, label: name })),
  ];
  if (selectedMic !== null && !deviceNames.includes(selectedMic)) {
    options.push({
      value: selectedMic,
      label: isNotConnected ? `${selectedMic} (not connected)` : selectedMic,
    });
  }

  const hint = isNotConnected
    ? "Sona is using the system default microphone."
    : devices?.length === 0
      ? "No microphones found. Using system default."
      : null;

  return (
    <Stack direction="column" spacing={2} align="start">
      <Text as={"h2"} tone={"default"} weight={"normal"}>
        Microphone
      </Text>
      <Stack direction="row" spacing={2} align="center">
        <DropDown
          options={options}
          value={selectedMic ?? SYSTEM_DEFAULT}
          onChange={(value) => setSelectedMic(value || null)}
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Refresh microphones"
          onClick={reload}
        >
          <RefreshCwIcon />
        </Button>
      </Stack>
      {hint && (
        <Text as={"p"} tone={"muted"} size={"sm"}>
          {hint}
        </Text>
      )}
    </Stack>
  );
};
