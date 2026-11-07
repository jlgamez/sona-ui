import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { StepLayout } from "@/ui/onboarding/StepLayout.tsx";
import { useCheckModelDownloadState } from "@/ui/settings/hooks/useCheckModelDownloadState.tsx";
import { startModelDownload } from "@/ui/settings/modelActions.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";

type ModelStepProps = {
  onContinue: () => void;
};

export const ModelStep = ({ onContinue }: ModelStepProps) => {
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
      onContinue={onContinue}
    >
      <Stack
        direction="row"
        spacing={4}
        align="center"
        justify="between"
        className="rounded-lg border p-4"
      >
        <Stack direction="column" spacing={1}>
          <Text weight="semibold">{modelName}</Text>
          {model && (
            <Text size="sm" tone="muted">
              Needs {model.requiredRam} of RAM. Speed: {model.relativeSpeed}.
            </Text>
          )}
        </Stack>
        {ready ? (
          <Text tone="success">Downloaded</Text>
        ) : downloading ? (
          <Stack direction="row" spacing={2} align="center">
            <Spinner />
            <Text tone="muted">Downloading...</Text>
          </Stack>
        ) : (
          <Button onClick={() => startModelDownload(modelName)}>
            Download
          </Button>
        )}
      </Stack>
    </StepLayout>
  );
};
