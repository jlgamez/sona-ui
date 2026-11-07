import { DeleteButton } from "@/common-components/DeleteButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";

type DeleteModelDialogProps = {
  modelName: string;
  isCurrentModel: boolean;
  onConfirm: () => void;
};

export const DeleteModelDialog = ({
  modelName,
  isCurrentModel,
  onConfirm,
}: DeleteModelDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <DeleteButton />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete model {modelName}?</DialogTitle>
        <DialogDescription>
          You can download it again later.
          {isCurrentModel &&
            " This is your current model. Sona will switch to another model."}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
