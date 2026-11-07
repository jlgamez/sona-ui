import { Settings } from "@/ui/settings/Settings.tsx";
import { Welcome } from "@/ui/welcome/Welcome.tsx";
import DesktopLayout from "@/common-components/DesktopLayout.tsx";
import { useEffect, useState } from "react";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import { useFetchAvailableModels } from "@/ui/settings/hooks/useFetchAvailableModels.tsx";
import { useFetchUserConfig } from "@/ui/settings/hooks/useFetchUserConfig.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import { applyConfigToStores } from "@/ui/settings/applyConfigToStores.ts";

function App() {
  const { initializeModels } = useModelsStore();
  const {
    loading: modelsLoading,
    models,
    error: modelsError,
  } = useFetchAvailableModels();
  const {
    loading: configLoading,
    config,
    setConfig,
    error: configError,
  } = useFetchUserConfig();

  useEffect(() => {
    if (!modelsLoading && !modelsError) initializeModels(models);
  }, [modelsLoading, modelsError]);

  useEffect(() => {
    if (config) applyConfigToStores(config);
  }, [config]);

  const isLoading =
    modelsLoading || configLoading || models.length === 0 || !config;
  const hasError = modelsError || configError;
  const [currentPage, setCurrentPage] = useState<"welcome" | "settings">(
    "welcome",
  );

  const pageVariants = {
    initial: { opacity: 0, x: 35 },
    animate: { opacity: 1, x: 0 },
  };

  return (
    <DesktopLayout
      maxWidth={1200}
      heightMode="viewport"
      withChrome
      devOnly={false}
      className="p-6"
    >
      <Toaster />
      {hasError ? (
        <div className={"flex justify-center items-center h-screen w-full"}>
          There was an error loading settings
        </div>
      ) : isLoading ? (
        <div className={"flex justify-center items-center h-screen w-full"}>
          <Spinner />
        </div>
      ) : (
        <motion.div
          key={currentPage}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3, ease: "easeOut" }}
          variants={pageVariants}
          className="h-full w-full"
        >
          {currentPage === "welcome" ? (
            <Welcome onNavigateToSettings={() => setCurrentPage("settings")} />
          ) : (
            <Settings
              savedConfig={config}
              onSaved={setConfig}
              onClose={() => setCurrentPage("welcome")}
            />
          )}
        </motion.div>
      )}
    </DesktopLayout>
  );
}

export default App;
