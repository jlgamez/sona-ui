import { useEffect, useRef, useState } from "react";
import { Accessibility, Keyboard, Mic } from "lucide-react";
import { toast } from "sonner";
import { describeError } from "@/api/FetchUtils.ts";
import {
  reloadRuntime,
  requestInputMonitoring,
} from "@/api/PostActionsService.ts";
import { PermissionRow } from "@/ui/onboarding/PermissionRow.tsx";
import { StepLayout } from "@/ui/onboarding/StepLayout.tsx";
import { usePermissions } from "@/ui/onboarding/usePermissions.ts";

type PermissionsStepProps = {
  onContinue: () => void;
};

export const PermissionsStep = ({ onContinue }: PermissionsStepProps) => {
  const { state, refresh } = usePermissions();
  // Accessibility can only be prompted once; afterwards the user must use System Settings.
  const [askedAccessibility, setAskedAccessibility] = useState(false);
  const bridge = window.sona?.permissions;

  const allGranted =
    state.microphone === "granted" &&
    state.accessibility === "granted" &&
    state.inputMonitoring === "granted";

  // The hotkey listener only receives events if it starts after the grant.
  const listeningGranted =
    state.accessibility === "granted" && state.inputMonitoring === "granted";
  const reloaded = useRef(false);
  useEffect(() => {
    if (!listeningGranted || reloaded.current) return;
    reloaded.current = true;
    reloadRuntime().catch((error) => toast.error(describeError(error)));
  }, [listeningGranted]);

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
    } catch (error) {
      toast.error(describeError(error));
    }
    void refresh();
  };

  return (
    <StepLayout
      title="Allow Sona to work"
      description="macOS asks for three permissions. Sona needs all of them to listen for your hotkey, hear you, and type the result."
      canContinue={allGranted}
      onContinue={onContinue}
    >
      <PermissionRow
        icon={Mic}
        title="Microphone"
        reason="Records your voice while you hold the hotkey."
        state={state.microphone}
        canPrompt={state.microphone === "not-determined"}
        onRequest={() => run(() => bridge!.requestMic())}
        onOpenSettings={() =>
          run(() => bridge!.openSettings("Privacy_Microphone"))
        }
      />
      <PermissionRow
        icon={Keyboard}
        title="Input Monitoring"
        reason="Detects when you press and release the hotkey."
        state={state.inputMonitoring}
        canPrompt={state.inputMonitoring === "not-determined"}
        onRequest={() => run(requestInputMonitoring)}
        onOpenSettings={() =>
          run(() => bridge!.openSettings("Privacy_ListenEvent"))
        }
      />
      <PermissionRow
        icon={Accessibility}
        title="Accessibility"
        reason="Pastes the transcription where your cursor is."
        state={state.accessibility}
        canPrompt={!askedAccessibility}
        onRequest={() =>
          run(async () => {
            setAskedAccessibility(true);
            await bridge!.requestAccessibility();
          })
        }
        onOpenSettings={() =>
          run(() => bridge!.openSettings("Privacy_Accessibility"))
        }
      />
    </StepLayout>
  );
};
