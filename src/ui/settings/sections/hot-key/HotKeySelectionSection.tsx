import { SelectableSetting } from "@/ui/settings/components/SelectableSetting.tsx";

export const HotKeySelectionSection = () => {
  return (
    <SelectableSetting
      name={"Hot key"}
      placeholder={"Select key to record audio"}
      options={[
        "ctrl (left)",
        "ctrl (right)",
        "alt (left)",
        "alt (right)",
        "shift (left)",
        "shift (right)",
      ]}
    />
  );
};
