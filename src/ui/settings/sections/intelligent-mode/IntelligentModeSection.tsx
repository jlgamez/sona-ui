import { ToggleSetting } from "@/ui/settings/components/ToggleSetting.tsx";

export const IntelligentModeSection = () => (
  <ToggleSetting
    name={"Intelligent Mode"}
    description={"When enabled, Sona will process and respond to your speech"}
    comingSoon
  />
);
