import { ToggleSetting } from "@/ui/settings/components/ToggleSetting.tsx";
import { useIntelligentModeStore } from "@/ui/settings/store/IntelligentModeStore.ts";

export const IntelligentModeSection = () => {
  const { setIsIntelligentModeEnabled } = useIntelligentModeStore();

  const isIntelligentModeEnabled = useIntelligentModeStore(
    (state) => state.isEnabled,
  );

  const handleIntelligentModeChange = (intelligentModeOn: boolean) => {
    setIsIntelligentModeEnabled(intelligentModeOn);
  };
  return (
    <ToggleSetting
      name={"Intelligent Mode"}
      description={"When enabled, Sona will process and respond to your speech"}
      onChange={handleIntelligentModeChange}
      checked={isIntelligentModeEnabled}
    />
  );
};
