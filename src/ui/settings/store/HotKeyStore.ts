import { create } from "zustand";

interface HotKeyStore {
  /** Backend hot key name, e.g. "ctrl_l". */
  selectedHotKey: string | null;
  setSelectedHotKey: (hotKey: string | null) => void;
}

export const useHotKeyStore = create<HotKeyStore>((set) => ({
  selectedHotKey: null,
  setSelectedHotKey: (hotKey) => set({ selectedHotKey: hotKey }),
}));
