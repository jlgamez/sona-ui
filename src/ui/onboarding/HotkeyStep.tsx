import { StepLayout } from "@/ui/onboarding/StepLayout.tsx";
import { HotKeySelectionSection } from "@/ui/settings/sections/hot-key/HotKeySelectionSection.tsx";

type HotkeyStepProps = {
  saving: boolean;
  onContinue: () => void;
};

export const HotkeyStep = ({ saving, onContinue }: HotkeyStepProps) => (
  <StepLayout
    title="Choose your hotkey"
    description="Hold this key to record, and release it to transcribe. You can change it any time in Settings."
    canContinue={!saving}
    onContinue={onContinue}
  >
    <HotKeySelectionSection />
  </StepLayout>
);
