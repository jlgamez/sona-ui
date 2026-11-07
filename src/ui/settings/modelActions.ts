import { toast } from "sonner";
import { describeError } from "@/api/FetchUtils.ts";
import { fetchUserConfig } from "@/api/GetActionsService.ts";
import { deleteModel, downloadModel } from "@/api/PostActionsService.ts";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import type { UserConfig } from "@/ui/settings/types/SettingsTypes.ts";

export async function startModelDownload(modelName: string) {
  const { setModelDownloading, setModelInSystem } = useModelsStore.getState();
  try {
    const { state } = await downloadModel(modelName);
    // Flag the download only once the backend tracks it, so polling cannot see "not started".
    if (state === "completed") setModelInSystem(modelName, true);
    else setModelDownloading(modelName, true);
  } catch (error) {
    toast.error(describeError(error));
  }
}

export async function removeModel(
  modelName: string,
  onSavedConfigChange: (config: UserConfig) => void,
) {
  const { setModelInSystem, setCurrentModelName } = useModelsStore.getState();
  try {
    await deleteModel(modelName);
    setModelInSystem(modelName, false);
    // The backend switches to its default model when the deleted one was active.
    const config = await fetchUserConfig();
    onSavedConfigChange(config);
    if (useModelsStore.getState().currentModelName === modelName) {
      setCurrentModelName(config.current_model);
    }
  } catch (error) {
    toast.error(describeError(error));
  }
}
