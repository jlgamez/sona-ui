import { create } from "zustand";

export type HotKey = "ctrl (left)" | "cmd + ctrl";

export const AVAILABLE_HOT_KEYS: HotKey[] = ["ctrl (left)", "cmd + ctrl"];

// Maps backend key format to UI display format
const BACKEND_TO_UI_KEY_MAP: Record<string, HotKey> = {
  ctrl_l: "ctrl (left)",
  cmd_ctrl: "cmd + ctrl",
};

// Maps UI display format to backend key format
export const UI_TO_BACKEND_KEY_MAP: Record<HotKey, string> = {
  "ctrl (left)": "ctrl_l",
  "cmd + ctrl": "cmd_ctrl",
};

interface HotKeyStore {
  selectedHotKey: HotKey | null;

  // actions
  setSelectedHotKey: (hotKey: HotKey | null) => void;
  initializeHotKeyWith: (backendKey: string) => void;

  // getters
  getSelectedHotKey: () => HotKey | null;
  getAvailableHotKeys: () => HotKey[];
}

export const useHotKeyStore = create<HotKeyStore>((set, get) => ({
  selectedHotKey: null,

  setSelectedHotKey: (hotKey: HotKey | null) => {
    set({ selectedHotKey: hotKey });
  },

  initializeHotKeyWith: (backendKey: string) => {
    const uiKey = BACKEND_TO_UI_KEY_MAP[backendKey] ?? null;
    set({ selectedHotKey: uiKey });
  },

  getSelectedHotKey: () => get().selectedHotKey,
  getAvailableHotKeys: () => AVAILABLE_HOT_KEYS,
}));
