import { fetchHotKeys } from "@/api/GetActionsService.ts";
import { SelectableSetting } from "@/ui/settings/components/SelectableSetting.tsx";
import { useFetchData } from "@/ui/settings/hooks/useFetchData.ts";
import { useHotKeyStore } from "@/ui/settings/store/HotKeyStore.ts";

export const HotKeySelectionSection = () => {
  const { data: hotKeys } = useFetchData(fetchHotKeys);
  const selectedHotKey = useHotKeyStore((store) => store.selectedHotKey);
  const setSelectedHotKey = useHotKeyStore((store) => store.setSelectedHotKey);

  const options = (hotKeys ?? []).map((hotKey) => ({
    value: hotKey.name,
    label: hotKey.display_name,
  }));
  // The backend falls back to its default key for a name it does not know.
  const isKnown = hotKeys?.some((hotKey) => hotKey.name === selectedHotKey);
  const shownHotKey = isKnown
    ? selectedHotKey
    : (hotKeys?.find((hotKey) => hotKey.is_default)?.name ?? selectedHotKey);

  return (
    <SelectableSetting
      name={"Hot key"}
      placeholder={"Select key to record audio"}
      options={options}
      value={shownHotKey}
      onChange={setSelectedHotKey}
    />
  );
};
