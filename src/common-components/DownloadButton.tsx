import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type DownloadButtonProps = {
  onClick?: () => void;
};

export const DownloadButton = (props: DownloadButtonProps) => {
  const { onClick } = props;

  return (
    <Button size={"icon"} variant={"outline"} onClick={onClick}>
      <DownloadIcon />
    </Button>
  );
};
