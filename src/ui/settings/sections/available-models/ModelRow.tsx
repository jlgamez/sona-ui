import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { DownloadButton } from "@/common-components/DownloadButton.tsx";
import { DeleteButton } from "@/common-components/DeleteButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useCheckModelDownloadState } from "@/ui/settings/hooks/useCheckModelDownloadState.tsx";
import type { WhisperModel } from "@/ui/settings/types/SettingsTypes.ts";

interface ModelRowProps {
  model: WhisperModel;
  onDownload: (modelName: string) => void;
  onDelete: (modelName: string) => void;
}

export const ModelRow = ({ model, onDownload, onDelete }: ModelRowProps) => {
  useCheckModelDownloadState(model.name);

  return (
    <TableRow>
      <TableCell>{model.name}</TableCell>
      <TableCell className={"text-center"}>{model.requiredRam}</TableCell>
      <TableCell className="text-right">{model.relativeSpeed}</TableCell>
      <TableCell>
        <div className={"ml-10"}>
          {model.inSystem ? (
            <DeleteButton onClick={() => onDelete(model.name)} />
          ) : model.isDownloading ? (
            <Button size={"icon"} variant={"outline"}>
              <Spinner />
            </Button>
          ) : (
            <DownloadButton onClick={() => onDownload(model.name)} />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
