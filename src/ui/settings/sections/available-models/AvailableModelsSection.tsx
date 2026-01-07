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
          {Array.from(getModels().values()).map((model) => (
            <TableRow key={model.name}>
              <TableCell>{model.name}</TableCell>
              <TableCell className={"text-center"}>
                {model.requiredRam}
              </TableCell>
              <TableCell className="text-right">
                {model.relativeSpeed}
              </TableCell>
              <TableCell>
                <div className={"ml-10"}>
                  {model.inSystem ? (
                    <DeleteButton
                      onClick={() => handleDeleteClick(model.name)}
                    />
                  ) : model.isDownloading ? (
                    <Button size={"icon"} variant={"outline"}>
                      <Spinner />
                    </Button>
                  ) : (
                    <DownloadButton
                      onClick={() => handleDownloadClick(model.name)}
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
