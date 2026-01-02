import Text from "@/common-components/Text.tsx";
import Stack from "@/common-components/Stack.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

import { DeleteButton } from "@/common-components/DeleteButton.tsx";
import { DownloadButton } from "@/common-components/DownloadButton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";

export const AvailableModelsSection = () => {
  const { getModels, setModelDownloading, setModelInSystem } = useModelsStore();

  const handleDownloadClick = (modelName: string) => {
    setModelDownloading(modelName, true);
  };
  const handleDeleteClick = (modelName: string) => {
    setModelInSystem(modelName, false);
    // setModelDownloading(modelName, false);
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
          {Array.from(getModels().values()).map((modelInfo) => (
            <TableRow key={modelInfo.model.name}>
              <TableCell>{modelInfo.model.name}</TableCell>
              <TableCell className={"text-center"}>
                {modelInfo.model.ram}
              </TableCell>
              <TableCell className="text-right">
                {modelInfo.model.speed}
              </TableCell>
              <TableCell>
                <div className={"ml-10"}>
                  {modelInfo.status.isInSystem ? (
                    <DeleteButton
                      onClick={() => handleDeleteClick(modelInfo.model.name)}
                    />
                  ) : modelInfo.status.isDownloading ? (
                    <Button size={"icon"} variant={"outline"}>
                      <Spinner />
                    </Button>
                  ) : (
                    <DownloadButton
                      onClick={() => handleDownloadClick(modelInfo.model.name)}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};
