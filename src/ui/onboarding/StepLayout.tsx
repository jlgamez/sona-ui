import { Children, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Button } from "@/components/ui/button.tsx";

type StepLayoutProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  /** Text for the final step; without it the button is a round arrow. */
  continueLabel?: string;
  /** Shows a quiet Back button on the left. */
  onBack?: () => void;
  /** Shown as a quiet secondary button when the step can be skipped. */
  onSkip?: () => void;
};

// Same fade-up as the Welcome screen; children appear one after another.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export const StepLayout = ({
  title,
  description,
  children,
  canContinue,
  onContinue,
  continueLabel,
  onBack,
  onSkip,
}: StepLayoutProps) => (
  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className="mx-auto flex w-full max-w-xl flex-col gap-6"
  >
    <motion.div variants={item}>
      <Stack direction="column" spacing={2}>
        <Text as="h2" size="xl" weight="bold">
          {title}
        </Text>
        <Text tone="muted">{description}</Text>
      </Stack>
    </motion.div>
    <Stack direction="column" spacing={3}>
      {Children.toArray(children).map((child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </Stack>
    <motion.div variants={item}>
      <Stack direction="row" spacing={3} align="center" justify="between">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        ) : (
          <span />
        )}
        <Stack direction="row" spacing={3} align="center">
          {onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Skip
            </Button>
          )}
          {continueLabel ? (
            <Button onClick={onContinue} disabled={!canContinue}>
              {continueLabel}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={onContinue}
              disabled={!canContinue}
              aria-label="Continue"
              className="group size-11 rounded-full shadow-sm transition-all disabled:opacity-30"
            >
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          )}
        </Stack>
      </Stack>
    </motion.div>
  </motion.div>
);
