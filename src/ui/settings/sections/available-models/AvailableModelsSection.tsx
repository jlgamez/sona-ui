import Text from "@/common-components/Text.tsx";
import Stack from "@/common-components/Stack.tsx";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import { ModelRow } from "./ModelRow.tsx";
import {
  deleteModel,
  downloadModel,
} from "@/ui/settings/service/PostActionsService.ts";

export const AvailableModelsSection = () => {
  const { getModels, setModelDownloading, setModelInSystem } = useModelsStore();

  const handleDownloadClick = (modelName: string) => {
    downloadModel(modelName);
    setModelDownloading(modelName, true);
  };
  const handleDeleteClick = (modelName: string) => {
    deleteModel(modelName);
    setModelInSystem(modelName, false);
  };

  return (
    <Stack direction={"column"}>
      <Text as={"h1"} size={"lg"}>
        Transcription models available
      </Text>
      <Text as={"h2"} size={"md"} tone={"muted"}>
        Here you can see the transcription models that Sona can use to convert
        speech to text.
      </Text>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={"text-left"}>Model name</TableHead>
            <TableHead className={"text-center"}>Required RAM</TableHead>
            <TableHead className={"text-right"}>Relative speed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(getModels().values()).map((model) => (
            <ModelRow
              key={model.name}
              model={model}
              onDownload={handleDownloadClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};
