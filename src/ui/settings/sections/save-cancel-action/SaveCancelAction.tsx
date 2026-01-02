import { Button } from "@/components/ui/button.tsx";
import Stack from "@/common-components/Stack.tsx";

export const SaveCancelAction = () => {
  return (
    <div className="w-full flex justify-end p-10">
      <Stack direction={"row"} spacing={4} align={"end"}>
        <Button variant={"outline"}>Cancel</Button>
        <Button>Save</Button>
      </Stack>
    </div>
  );
};
