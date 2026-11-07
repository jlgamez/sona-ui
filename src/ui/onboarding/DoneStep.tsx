import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { HotKeyHint } from "@/ui/onboarding/Keycap.tsx";
import sonaIcon from "@/assets/sona-icon.png";

type DoneStepProps = {
  hotKeyLabel?: string;
  onOpenSettings: () => void;
};

/** Last screen: same fade-ups as Welcome, then on to Settings. */
export const DoneStep = ({ hotKeyLabel, onOpenSettings }: DoneStepProps) => (
  <Stack direction="column" spacing={6} align="center" className="px-8">
    <motion.img
      src={sonaIcon}
      alt="Sona"
      className="size-24"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    />
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
    >
      <Stack direction="column" spacing={3} align="center">
        <Text as="h1" size="xl" weight="bold" align="center">
          You&apos;re all set
        </Text>
        <Text as="p" tone="muted" align="center" className="max-w-md">
          Hold <HotKeyHint label={hotKeyLabel} /> anywhere to dictate. Closing
          this window keeps Sona running in the menu bar.
        </Text>
      </Stack>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
    >
      <Button size="lg" onClick={onOpenSettings}>
        Open Settings
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </motion.div>
  </Stack>
);
