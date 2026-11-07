import { ToggleSetting } from "@/ui/settings/components/ToggleSetting.tsx";

export const TextSelectionAwarenessSection = () => (
  <ToggleSetting
    name={"Text Selection Awareness"}
    description={
      <>
        When enabled, Sona will consider your current text selection as part of
        the conversation
        <br />
        Available only with Intelligent Mode
      </>
    }
    comingSoon
  />
);
