import { create } from "zustand";

interface IntelligentModeStore {
  isEnabled: boolean;

  // actions
  setIsIntelligentModeEnabled: (isIntelligentModeEnabled: boolean) => void;

  // getters
  getIsIntelligentModeEnabled: () => boolean;
}

export const useIntelligentModeStore = create<IntelligentModeStore>(
  (set, get) => ({
    isEnabled: false,
    setIsIntelligentModeEnabled: (enabled: boolean) => {
      set({ isEnabled: enabled });
    },
    getIsIntelligentModeEnabled: () => get().isEnabled,
  }),
);
