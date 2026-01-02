import { Settings } from "@/ui/Settings.tsx";
import DesktopLayout from "@/common-components/DesktopLayout.tsx";

function App() {
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
