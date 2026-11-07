import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import Stack from "@/common-components/Stack.tsx";
import { describeError } from "@/api/FetchUtils.ts";
import { saveUserConfig } from "@/api/PostActionsService.ts";
import { applyConfigToStores } from "@/ui/settings/applyConfigToStores.ts";
import { useDraftConfig } from "@/ui/settings/hooks/useDraftConfig.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

type SaveCancelActionProps = {
  savedConfig: UserConfig;
  onSavedConfigChange: (config: UserConfig) => void;
  onClose?: () => void;
};

export const SaveCancelAction = ({
  savedConfig,
  onSavedConfigChange,
  onClose,
}: SaveCancelActionProps) => {
  const draft = useDraftConfig(savedConfig);
  const [isSaving, setIsSaving] = useState(false);
  // Both objects are built from savedConfig, so their key order matches.
  const isDirty = JSON.stringify(draft) !== JSON.stringify(savedConfig);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveUserConfig(draft);
      onSavedConfigChange(draft);
      toast.success("Settings saved");
      onClose?.();
    } catch (error) {
      toast.error(describeError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    applyConfigToStores(savedConfig);
    onClose?.();
  };

  return (
    <div className="w-full flex justify-end p-10">
      <Stack direction={"row"} spacing={4} align={"end"}>
        <Button variant={"outline"} onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving && <Spinner />}
          Save
        </Button>
      </Stack>
    </div>
  );
};
