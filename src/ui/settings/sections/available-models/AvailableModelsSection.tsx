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
import { removeModel, startModelDownload } from "@/ui/settings/modelActions.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

type AvailableModelsSectionProps = {
  onSavedConfigChange: (config: UserConfig) => void;
};

export const AvailableModelsSection = ({
  onSavedConfigChange,
}: AvailableModelsSectionProps) => {
  const { getModels } = useModelsStore();

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
              onDownload={startModelDownload}
              onDelete={(modelName) =>
                removeModel(modelName, onSavedConfigChange)
              }
            />
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};
