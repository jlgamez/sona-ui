import { Settings } from "@/ui/settings/Settings.tsx";
import { Welcome } from "@/ui/welcome/Welcome.tsx";
import { Onboarding } from "@/ui/onboarding/Onboarding.tsx";
import DesktopLayout from "@/common-components/DesktopLayout.tsx";
import { useState } from "react";
import { useLoadSettings } from "@/ui/settings/hooks/useLoadSettings.ts";
import { LoadError } from "@/ui/LoadError.tsx";
import Stack from "@/common-components/Stack.tsx";
import Text from "@/common-components/Text.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { motion } from "motion/react";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

// Inside Electron the real window is the frame; the faux window is for browser dev only.
const IN_ELECTRON = window.sona !== undefined;

function Frame({ children }: { children: ReactNode }) {
  if (IN_ELECTRON) {
    return <div className="h-screen overflow-y-auto p-6">{children}</div>;
  }
  return (
    <DesktopLayout
      maxWidth={1200}
      heightMode="viewport"
      withChrome
      devOnly={false}
      className="p-6"
    >
      {children}
    </DesktopLayout>
  );
}

function App() {
  const { status, config, setConfig, error, retry } = useLoadSettings();
  const [currentPage, setCurrentPage] = useState<"welcome" | "settings">(
    "welcome",
  );

  const pageVariants = {
    initial: { opacity: 0, x: 35 },
    animate: { opacity: 1, x: 0 },
  };

  return (
    <Frame>
      <Toaster />
      {status === "error" ? (
        <LoadError message={error} onRetry={retry} />
      ) : status !== "ready" || !config ? (
        <Stack
          direction="column"
          spacing={3}
          align="center"
          justify="center"
          className="h-screen w-full"
        >
          <Spinner />
          {status === "retrying" && <Text tone="muted">Starting Sona...</Text>}
        </Stack>
      ) : !config.onboarding_completed ? (
        <Onboarding
          savedConfig={config}
          onSavedConfigChange={(saved) => {
            setConfig(saved);
            if (saved.onboarding_completed) setCurrentPage("settings");
          }}
        />
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
              onSavedConfigChange={setConfig}
              onClose={() => setCurrentPage("welcome")}
            />
          )}
        </motion.div>
      )}
    </Frame>
  );
}

export default App;
