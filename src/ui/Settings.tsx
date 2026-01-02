import Stack from "@/common-components/Stack.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import Text from "@/common-components/Text.tsx";
import { AvailableModelsSection } from "@/ui/settings/sections/available-models/AvailableModelsSection.tsx";
import { CurrentModelSection } from "@/ui/settings/sections/current-model/CurrentModelSection.tsx";
import { ClipboardBehaviourSection } from "@/ui/settings/sections/clipboard/ClipboardBehaviourSection.tsx";
import { IntelligentModeSection } from "@/ui/settings/sections/intelligent-mode/IntelligentModeSection.tsx";
import { HotKeySelectionSection } from "@/ui/settings/sections/hot-key/HotKeySelectionSection.tsx";
import { SaveCancelAction } from "@/ui/settings/sections/save-cancel-action/SaveCancelAction.tsx";
import { TextSelectionAwarenessSection } from "@/ui/settings/sections/text-selection-awareness/TextSelectionAwarenessSection.tsx";

export const Settings = () => {
  return (
    <div className={"relative h-full w-full"}>
      <div className={"pl-5 pr-5 min-w-full mb-4"}>
        <Text as={"h1"} tone={"default"} weight={"bold"} size={"xl"}>
          Settings
        </Text>
      </div>
      <Stack
        direction={"column"}
        spacing={8}
        align={"start"}
        className={"pl-7 pr-7 pt-5 pb-10"}
      >
        <HotKeySelectionSection />
        <Separator />
        <IntelligentModeSection />
        <Separator />
        <TextSelectionAwarenessSection />
        <Separator />
        <ClipboardBehaviourSection />
        <Separator />
        <CurrentModelSection />
        <Separator />
        <AvailableModelsSection />
        <SaveCancelAction />
      </Stack>
    </div>
  );
};
