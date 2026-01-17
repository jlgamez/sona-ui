import { Settings } from "@/ui/Settings.tsx";
import DesktopLayout from "@/common-components/DesktopLayout.tsx";
import { useEffect } from "react";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import { useFetchAvailableModels } from "@/ui/settings/hooks/useFetchAvailableModels.tsx";
import { useFetchUserConfig } from "@/ui/settings/hooks/useFetchUserConfig.tsx";
import { useHotKeyStore } from "@/ui/settings/store/HotKeyStore.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useClipboardStore } from "@/ui/settings/store/ClipboardStore.ts";
import { useIntelligentModeStore } from "@/ui/settings/store/IntelligentModeStore.ts";
import { useTextSelectionAwarenessStore } from "@/ui/settings/store/TextSelectionAwarenessStore.ts";

function App() {
  const { initializeModels, setCurrentModelName } = useModelsStore();
  const { initializeHotKeyWith } = useHotKeyStore();
  const { setAutonomousPasteOn, setKeepOutputInClipboardOn } =
    useClipboardStore();
  const { setIsIntelligentModeEnabled } = useIntelligentModeStore();
  const { setTextSelectionAwarenessOn } = useTextSelectionAwarenessStore();
  const {
    loading: modelsLoading,
    models,
    error: modelsError,
  } = useFetchAvailableModels();
  const {
    loading: configLoading,
    config,
    error: configError,
  } = useFetchUserConfig();

  useEffect(() => {
    if (!modelsLoading && !modelsError) initializeModels(models);
  }, [modelsLoading, modelsError]);

  useEffect(() => {
    if (!configLoading && !configError && config) {
      initializeHotKeyWith(config.hot_key);
      setAutonomousPasteOn(config.clipboard_behaviour.autonomous_pasting);
      setKeepOutputInClipboardOn(
        config.clipboard_behaviour.keep_output_in_clipboard,
      );
      setIsIntelligentModeEnabled(config.intelligent_mode);
      setTextSelectionAwarenessOn(config.text_selection_awareness);
      setCurrentModelName(config.current_model);
    }
  }, [configLoading, configError, config]);

  const isLoading = modelsLoading || configLoading || models.length === 0;
  const hasError = modelsError || configError;

  return (
    <DesktopLayout
      maxWidth={1200}
      heightMode="viewport"
      withChrome
      devOnly={false}
      className="p-6"
    >
      {hasError ? (
        <div className={"flex justify-center items-center h-screen w-full"}>
          There was an error loading settings
        </div>
      ) : isLoading ? (
        <div className={"flex justify-center items-center h-screen w-full"}>
          <Spinner />
        </div>
      ) : (
        <Settings />
      )}
    </DesktopLayout>
  );
}

export default App;
