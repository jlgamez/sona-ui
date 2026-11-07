import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils.ts";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { PermissionState } from "@/ui/onboarding/usePermissions.ts";

type PermissionRowProps = {
  title: string;
  reason: string;
  state: PermissionState;
  /** True when the system can still show its own prompt for this permission. */
  canPrompt: boolean;
  onRequest: () => void;
  onOpenSettings: () => void;
};

export const PermissionRow = ({
  title,
  reason,
  state,
  canPrompt,
  onRequest,
  onOpenSettings,
}: PermissionRowProps) => (
  <Stack
    direction="row"
    spacing={4}
    align="center"
    justify="between"
    className={cn(
      "rounded-lg border p-4 transition-colors duration-500",
      state === "granted" && "border-emerald-500/40 bg-emerald-500/5",
    )}
  >
    <Stack direction="column" spacing={1}>
      <Text weight="semibold">{title}</Text>
      <Text size="sm" tone="muted">
        {reason}
      </Text>
    </Stack>
    {state === "granted" ? (
      <Stack direction="row" spacing={2} align="center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <CheckCircle2 className="size-5 text-emerald-600" />
        </motion.span>
        <Text tone="success">Granted</Text>
      </Stack>
    ) : canPrompt ? (
      <Button onClick={onRequest}>Grant access</Button>
    ) : (
      <Button variant="outline" onClick={onOpenSettings}>
        Open System Settings
      </Button>
    )}
  </Stack>
);
