import { useState } from "react";
import { toast } from "sonner";
import { describeError } from "@/api/FetchUtils.ts";
import { fetchHotKeys } from "@/api/GetActionsService.ts";
import { saveUserConfig } from "@/api/PostActionsService.ts";
import { AnimatePresence, motion } from "motion/react";
import { Welcome } from "@/ui/welcome/Welcome.tsx";
import { ProgressSteps } from "@/ui/onboarding/ProgressSteps.tsx";
import { HotkeyStep } from "@/ui/onboarding/HotkeyStep.tsx";
import { ModelStep } from "@/ui/onboarding/ModelStep.tsx";
import { PermissionsStep } from "@/ui/onboarding/PermissionsStep.tsx";
import { TryItStep } from "@/ui/onboarding/TryItStep.tsx";
import { useFetchData } from "@/ui/settings/hooks/useFetchData.ts";
import { useDraftConfig } from "@/ui/settings/hooks/useDraftConfig.ts";
import { useHotKeyStore } from "@/ui/settings/store/HotKeyStore.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

const STEPS = ["welcome", "permissions", "model", "hotkey", "try-it"] as const;

type OnboardingProps = {
  savedConfig: UserConfig;
  onSavedConfigChange: (config: UserConfig) => void;
};

/** First-run wizard. Marks `onboarding_completed` in the saved config when it ends. */
export const Onboarding = ({
  savedConfig,
  onSavedConfigChange,
}: OnboardingProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const draft = useDraftConfig(savedConfig);
  const { data: hotKeys } = useFetchData(fetchHotKeys);
  const hotKey = useHotKeyStore((store) => store.selectedHotKey);
  const hotKeyLabel =
    hotKeys?.find((option) => option.name === hotKey)?.display_name ??
    "your hotkey";

  const next = () => setStepIndex((index) => index + 1);

  /** Saving also restarts the backend runtime, so the chosen hotkey and model are live. */
  const save = async (config: UserConfig): Promise<boolean> => {
    setSaving(true);
    try {
      await saveUserConfig(config);
      onSavedConfigChange(config);
      return true;
    } catch (error) {
      toast.error(describeError(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const leaveHotkeyStep = async () => {
    if (await save(draft)) next();
  };

  const finish = async () => {
    await save({ ...draft, onboarding_completed: true });
  };

  const step = STEPS[stepIndex];

  return (
    <div className="flex min-h-full w-full flex-col gap-8 py-8">
      {/* Welcome is step 0 and has no progress yet. */}
      {stepIndex > 0 && (
        <ProgressSteps total={STEPS.length - 1} current={stepIndex} />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -35 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="my-auto w-full"
        >
          {/* Welcome's "navigate" button simply starts the wizard here. */}
          {step === "welcome" && <Welcome onNavigateToSettings={next} />}
          {step === "permissions" && <PermissionsStep onContinue={next} />}
          {step === "model" && <ModelStep onContinue={next} />}
          {step === "hotkey" && (
            <HotkeyStep saving={saving} onContinue={leaveHotkeyStep} />
          )}
          {step === "try-it" && (
            <TryItStep
              hotKeyLabel={hotKeyLabel}
              saving={saving}
              onFinish={finish}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
