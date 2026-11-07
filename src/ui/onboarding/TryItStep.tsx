import { useState } from "react";
import Text from "@/common-components/Text.tsx";
import { HotKeyHint } from "@/ui/onboarding/Keycap.tsx";
import { StepLayout } from "@/ui/onboarding/StepLayout.tsx";

type TryItStepProps = {
  hotKeyLabel?: string;
  saving: boolean;
  onBack: () => void;
  onFinish: () => void;
};

export const TryItStep = ({
  hotKeyLabel,
  saving,
  onBack,
  onFinish,
}: TryItStepProps) => {
  const [text, setText] = useState("");
  const worked = text.trim().length > 0;

  return (
    <StepLayout
      title="Try it"
      description={
        <>
          Click the box, hold <HotKeyHint label={hotKeyLabel} />, say something,
          then release. Your words appear here.
        </>
      }
      canContinue={!saving}
      continueLabel={worked ? "Finish" : "Finish without testing"}
      onBack={onBack}
      onContinue={onFinish}
    >
      <textarea
        autoFocus
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Your transcription will appear here"
        className="min-h-32 w-full rounded-lg border bg-background p-3 text-base outline-none focus:ring-2 focus:ring-ring"
      />
      {worked && <Text tone="success">It works. Sona is ready.</Text>}
    </StepLayout>
  );
};
