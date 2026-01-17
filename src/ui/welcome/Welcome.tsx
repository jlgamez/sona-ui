import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowRight, Mic } from "lucide-react";
import { motion } from "motion/react";

type WelcomeProps = {
  onNavigateToSettings: () => void;
};

export const Welcome = ({ onNavigateToSettings }: WelcomeProps) => {
  return (
    <Stack
      direction="column"
      spacing={8}
      align="center"
      justify="center"
      className="h-full w-full px-8"
    >
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        className="rounded-full bg-primary/10 p-6"
      >
        <Mic className="size-12 text-primary" />
      </motion.div>

      {/* Heading & Description */}
      <Stack direction="column" spacing={3} align="center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.18 }}
        >
          <Text as="h1" size="xl" weight="bold" align="center">
            Welcome to Sona
          </Text>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.32 }}
        >
          <Text as="p" tone="muted" align="center" className="max-w-md">
            Your intelligent speech-to-text companion. Transcribe audio with
            whisper-powered accuracy—fast, private, and seamless.
          </Text>
        </motion.div>
      </Stack>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.48 }}
      >
        <Button size="lg" onClick={onNavigateToSettings}>
          Get Started
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </motion.div>
    </Stack>
  );
};
