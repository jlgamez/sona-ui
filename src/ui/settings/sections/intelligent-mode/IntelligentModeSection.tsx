import { ToggleSetting } from "@/ui/settings/components/ToggleSetting.tsx";
import { useIntelligentModeStore } from "@/ui/settings/store/IntelligentModeStore.ts";

export const IntelligentModeSection = () => {
  const { getIsIntelligentModeEnabled, setIsIntelligentModeEnabled } =
    useIntelligentModeStore();

  let isIntelligentModeEnabled = getIsIntelligentModeEnabled();

  const handleIntelligentModeChange = (intelligentModeOn: boolean) => {
    setIsIntelligentModeEnabled(intelligentModeOn);
  };
  return (
    <ToggleSetting
      name={"Intelligent Mode"}
      description={"When enabled, Sona will process and respond to your speech"}
      onChange={handleIntelligentModeChange}
      defaultChecked={isIntelligentModeEnabled}
    />
  );
};
