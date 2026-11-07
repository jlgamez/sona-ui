import Text from "@/common-components/Text.tsx";
import { HotKeyHint } from "@/ui/onboarding/Keycap.tsx";
import { StepLayout } from "@/ui/onboarding/StepLayout.tsx";
import { HotKeySelectionSection } from "@/ui/settings/sections/hot-key/HotKeySelectionSection.tsx";

type HotkeyStepProps = {
  hotKeyLabel?: string;
  saving: boolean;
  onBack: () => void;
  onContinue: () => void;
};

export const HotkeyStep = ({
  hotKeyLabel,
  saving,
  onBack,
  onContinue,
}: HotkeyStepProps) => (
  <StepLayout
    title="Choose your hotkey"
    description="Hold this key to record, and release it to transcribe. You can change it any time in Settings."
    canContinue={!saving}
    onBack={onBack}
    onContinue={onContinue}
  >
    <HotKeySelectionSection />
    <Text tone="muted">
      Hold <HotKeyHint label={hotKeyLabel} /> to record, release to transcribe.
    </Text>
  </StepLayout>
);
