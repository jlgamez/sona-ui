import { CheckCircle2 } from "lucide-react";
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
    className="rounded-lg border p-4"
  >
    <Stack direction="column" spacing={1}>
      <Text weight="semibold">{title}</Text>
      <Text size="sm" tone="muted">
        {reason}
      </Text>
    </Stack>
    {state === "granted" ? (
      <Stack direction="row" spacing={2} align="center">
        <CheckCircle2 className="size-5 text-emerald-600" />
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
