import type { ReactNode } from "react";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Button } from "@/components/ui/button.tsx";

type StepLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
  /** Shown as a quiet secondary button when the step can be skipped. */
  onSkip?: () => void;
};

export const StepLayout = ({
  title,
  description,
  children,
  canContinue,
  onContinue,
  continueLabel = "Continue",
  onSkip,
}: StepLayoutProps) => (
  <Stack direction="column" spacing={6} className="mx-auto w-full max-w-xl">
    <Stack direction="column" spacing={2}>
      <Text as="h2" size="xl" weight="bold">
        {title}
      </Text>
      <Text tone="muted">{description}</Text>
    </Stack>
    <Stack direction="column" spacing={3}>
      {children}
    </Stack>
    <Stack direction="row" spacing={3} justify="end">
      {onSkip && (
        <Button variant="ghost" onClick={onSkip}>
          Skip
        </Button>
      )}
      <Button onClick={onContinue} disabled={!canContinue}>
        {continueLabel}
      </Button>
    </Stack>
  </Stack>
);
