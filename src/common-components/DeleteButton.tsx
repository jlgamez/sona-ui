import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type DeleteButtonProps = {
  onClick?: () => void;
};

export const DeleteButton = (props: DeleteButtonProps) => {
  const { onClick } = props;

  return (
    <Button size={"icon"} variant={"outline"} onClick={onClick}>
      <Trash2Icon />
    </Button>
  );
};
