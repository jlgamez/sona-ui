import { useState } from "react";
import { toast } from "sonner";
import { describeError } from "@/api/FetchUtils.ts";
import { fetchHotKeys } from "@/api/GetActionsService.ts";
import { saveUserConfig } from "@/api/PostActionsService.ts";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Welcome } from "@/ui/welcome/Welcome.tsx";
import { DoneStep } from "@/ui/onboarding/DoneStep.tsx";
import { ProgressSteps } from "@/ui/onboarding/ProgressSteps.tsx";
import { HotkeyStep } from "@/ui/onboarding/HotkeyStep.tsx";
import { ModelStep } from "@/ui/onboarding/ModelStep.tsx";
import { PermissionsStep } from "@/ui/onboarding/PermissionsStep.tsx";
import { TryItStep } from "@/ui/onboarding/TryItStep.tsx";
import { useFetchData } from "@/ui/settings/hooks/useFetchData.ts";
import { useDraftConfig } from "@/ui/settings/hooks/useDraftConfig.ts";
import { useHotKeyStore } from "@/ui/settings/store/HotKeyStore.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

const STEPS = [
  "welcome",
  "permissions",
  "model",
  "hotkey",
  "try-it",
  "done",
] as const;

/** Steps that count in the progress bar (everything between welcome and done). */
const PROGRESS_STEPS = 4;

// Steps slide in from the side we are heading to, so Back reverses the motion.
const slide: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: 35 * direction }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: -35 * direction }),
};

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
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  // Held until the done screen is left, so the wizard is not unmounted before it shows.
  const [finalConfig, setFinalConfig] = useState<UserConfig | null>(null);
  const draft = useDraftConfig(savedConfig);
  const { data: hotKeys } = useFetchData(fetchHotKeys);
  const hotKey = useHotKeyStore((store) => store.selectedHotKey);
  const hotKeyLabel = hotKeys?.find(
    (option) => option.name === hotKey,
  )?.display_name;

  const go = (delta: 1 | -1) => {
    setDirection(delta);
    setStepIndex((index) => index + delta);
  };
  const next = () => go(1);
  const back = () => go(-1);

  /** Saving also restarts the backend runtime, so the chosen hotkey and model are live. */
  const persist = async (config: UserConfig): Promise<boolean> => {
    setSaving(true);
    try {
      await saveUserConfig(config);
      return true;
    } catch (error) {
      toast.error(describeError(error));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const leaveHotkeyStep = async () => {
    if (await persist(draft)) {
      onSavedConfigChange(draft);
      next();
    }
  };

  const finish = async () => {
    const config = { ...draft, onboarding_completed: true };
    if (await persist(config)) {
      setFinalConfig(config);
      next();
    }
  };

  const step = STEPS[stepIndex];
  const showProgress = step !== "welcome" && step !== "done";

  return (
    <div className="flex min-h-full w-full flex-col gap-8 py-8">
      {showProgress && (
        <ProgressSteps total={PROGRESS_STEPS} current={stepIndex} />
      )}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="my-auto w-full"
        >
          {/* Welcome's "navigate" button simply starts the wizard here. */}
          {step === "welcome" && <Welcome onNavigateToSettings={next} />}
          {step === "permissions" && <PermissionsStep onContinue={next} />}
          {step === "model" && <ModelStep onBack={back} onContinue={next} />}
          {step === "hotkey" && (
            <HotkeyStep
              hotKeyLabel={hotKeyLabel}
              saving={saving}
              onBack={back}
              onContinue={leaveHotkeyStep}
            />
          )}
          {step === "try-it" && (
            <TryItStep
              hotKeyLabel={hotKeyLabel}
              saving={saving}
              onBack={back}
              onFinish={finish}
            />
          )}
          {step === "done" && (
            <DoneStep
              hotKeyLabel={hotKeyLabel}
              onOpenSettings={() =>
                finalConfig && onSavedConfigChange(finalConfig)
              }
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
