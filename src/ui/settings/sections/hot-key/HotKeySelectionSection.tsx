import { useHotKeyStore } from "@/ui/settings/store/HotKeyStore";
import { SelectableSetting } from "@/ui/settings/components/SelectableSetting.tsx";

export const HotKeySelectionSection = () => {
  const selectedHotKey = useHotKeyStore((store) => store.getSelectedHotKey());
  const setSelectedHotKey = useHotKeyStore((store) => store.setSelectedHotKey);
  const availableHotKeys = useHotKeyStore((store) =>
    store.getAvailableHotKeys(),
  );

  return (
    <SelectableSetting
      name={"Hot key"}
      placeholder={"Select key to record audio"}
      options={availableHotKeys}
      value={selectedHotKey}
      onChange={(value) => setSelectedHotKey(value as typeof selectedHotKey)}
    />
  );
};
