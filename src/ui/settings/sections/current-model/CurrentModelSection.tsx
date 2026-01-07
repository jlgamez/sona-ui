import { SelectableSetting } from "@/ui/settings/components/SelectableSetting.tsx";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import { useState } from "react";

export const CurrentModelSection = () => {
  const [currentSelectedModel, setCurrentSelectedModel] = useState<
    string | null
  >(null);
  const [currentDownloadMessage, setCurrentDownloadMessage] = useState<
    string | null
  >(null);

  const { getModels, setModelDownloading } = useModelsStore();
  const models = Array.from(getModels().keys());

  const DOWNLOAD_WARNING = "Downloading %s...";
  const getDownloadWarning = (modelName: string) =>
    DOWNLOAD_WARNING.replace("%s", modelName);

  const onSelect = (newModelSelection: string) => {
    // clear download warning when the model changes
    if (currentSelectedModel !== newModelSelection)
      setCurrentDownloadMessage(null);

    // indicate the new selected model
    setCurrentSelectedModel(newModelSelection);

    // do not download the model if it is already in the system
    //if (getModelStatus(newModelSelection)?.isInSystem) return;

    // if not in system, update model status to downloading and display warning
    setModelDownloading(newModelSelection, true);
    const downloadWarning = getDownloadWarning(newModelSelection);
    setCurrentDownloadMessage(downloadWarning);
  };

  return (
    <Stack direction={"row"} spacing={10} align={"start"}>
      <SelectableSetting
        name={"Current Model"}
        placeholder={"Select transcription model"}
        options={models}
        onChange={onSelect}
      />
      {currentDownloadMessage && (
        <Stack
          direction={"row"}
          spacing={2}
          align={"center"}
          className={"pt-8 ml-16"}
        >
          <Text as={"p"} tone={"muted"}>
            {currentDownloadMessage}
          </Text>
          <Spinner />
        </Stack>
      )}
    </Stack>
  );
};
