import { create } from "zustand";

interface ClipboardStore {
  autonomousPasteOn: boolean;
  keepOutputInClipboardOn: boolean;

  // actions
  setAutonomousPasteOn: (enabled: boolean) => void;
  setKeepOutputInClipboardOn: (enabled: boolean) => void;

  // getters
  getAutomaticPasteEnabled: () => boolean;
  getKeepOutputInClipboardEnabled: () => boolean;
}

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  autonomousPasteOn: false,
  keepOutputInClipboardOn: false,
  setAutonomousPasteOn: (enabled: boolean) => {
    set({ autonomousPasteOn: enabled });
  },
  setKeepOutputInClipboardOn: (enabled: boolean) => {
    set({ keepOutputInClipboardOn: enabled });
  },
  getAutomaticPasteEnabled: () => get().autonomousPasteOn,
  getKeepOutputInClipboardEnabled: () => get().keepOutputInClipboardOn,
}));
