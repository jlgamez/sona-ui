import { SelectableSetting } from "@/ui/settings/components/SelectableSetting.tsx";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import { downloadModel } from "@/ui/settings/service/PostActionsService.ts";
import { useCheckModelDownloadState } from "@/ui/settings/hooks/useCheckModelDownloadState.tsx";

export const CurrentModelSection = () => {
  const { getModels, getModel, setCurrentModelName, setModelDownloading } =
    useModelsStore();
  const models = Array.from(getModels().keys());
  let currentModelName = useModelsStore((state) => state.currentModelName);

  // Subscribe to store's downloading state for the selected model
  const isDownloading = useModelsStore(
    (state) => state.models.get(currentModelName ?? "")?.isDownloading ?? false,
  );

  // Poll download state when downloading
  useCheckModelDownloadState(currentModelName ?? "");

  const DOWNLOAD_WARNING = "Downloading %s...";
  const getDownloadWarning = (modelName: string) =>
    DOWNLOAD_WARNING.replace("%s", modelName);

  const onSelect = (newModelSelection: string) => {
    setCurrentModelName(newModelSelection);

    // Skip download if model is already in the system
    const model = getModel(newModelSelection);
    if (model?.inSystem) return;

    // Trigger actual download and update store
    downloadModel(newModelSelection);
    setModelDownloading(newModelSelection, true);
  };

  return (
    <Stack direction={"row"} spacing={10} align={"start"}>
      <SelectableSetting
        name={"Current Model"}
        placeholder={"Select transcription model"}
        options={models}
        onChange={onSelect}
        value={currentModelName}
      />
      {isDownloading && currentModelName && (
        <Stack
          direction={"row"}
          spacing={2}
          align={"center"}
          className={"pt-8 ml-16"}
        >
          <Text as={"p"} tone={"muted"}>
            {getDownloadWarning(currentModelName)}
          </Text>
          <Spinner />
        </Stack>
      )}
    </Stack>
  );
};
