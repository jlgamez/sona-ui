import { motion } from "motion/react";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { StepLayout } from "@/ui/onboarding/StepLayout.tsx";
import { useCheckModelDownloadState } from "@/ui/settings/hooks/useCheckModelDownloadState.tsx";
import { startModelDownload } from "@/ui/settings/modelActions.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";

const RECOMMENDED_MODEL = "base.en";

type ModelStepProps = {
  onBack: () => void;
  onContinue: () => void;
};

export const ModelStep = ({ onBack, onContinue }: ModelStepProps) => {
  const modelName = useModelsStore((store) => store.currentModelName);
  const model = useModelsStore((store) => store.models.get(modelName));
  useCheckModelDownloadState(modelName);

  const ready = model?.inSystem ?? false;
  const downloading = model?.isDownloading ?? false;

  return (
    <StepLayout
      title="Download a speech model"
      description="Sona transcribes on your Mac, so it needs a model file first. It is downloaded once and stays on your computer. You can pick another model later in Settings."
      canContinue={ready}
      onBack={onBack}
      onContinue={onContinue}
    >
      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <Stack direction="row" spacing={4} align="center" justify="between">
          <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={2} align="center">
              <Text weight="semibold">{modelName}</Text>
              {modelName === RECOMMENDED_MODEL && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Recommended
                </span>
              )}
            </Stack>
            {model && (
              <Text size="sm" tone="muted">
                Needs {model.requiredRam} of RAM. Speed: {model.relativeSpeed}.
              </Text>
            )}
          </Stack>
          {ready ? (
            <Text tone="success">Downloaded</Text>
          ) : downloading ? (
            <Text tone="muted">Downloading...</Text>
          ) : (
            <Button onClick={() => startModelDownload(modelName)}>
              Download
            </Button>
          )}
        </Stack>
        {downloading && (
          // The backend reports no progress, so the bar just sweeps.
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full w-1/3 rounded-full bg-primary"
              animate={{ x: ["-100%", "300%"] }}
              transition={{
                duration: 1.4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>
        )}
      </div>
    </StepLayout>
  );
};
