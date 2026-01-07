import { Settings } from "@/ui/Settings.tsx";
import DesktopLayout from "@/common-components/DesktopLayout.tsx";
import { useEffect } from "react";
import { useModelsStore } from "@/ui/settings/store/ModelsStore.ts";
import { useFetchAvailableModels } from "@/ui/settings/hooks/useFetchAvailableModels.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

function App() {
  const { initializeModels } = useModelsStore();
  const { loading, models, error } = useFetchAvailableModels();

  useEffect(() => {
    if (!loading && !error) initializeModels(models);
  }, [loading, error]);

  if (loading || models.length === 0) return <Spinner />;

  if (error) return <div>There was an error loading models</div>;

  return (
    <DesktopLayout
      maxWidth={1200}
      heightMode="viewport"
      withChrome
      devOnly={false}
      className="p-6"
    >
      <Settings />
    </DesktopLayout>
  );
}

export default App;
