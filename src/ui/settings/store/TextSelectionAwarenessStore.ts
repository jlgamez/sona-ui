import { create } from "zustand";

interface TextSelectionAwarenessStore {
  isTextSelectionAwarenessOn: boolean;

  // actions
  setTextSelectionAwarenessOn: (value: boolean) => void;

  // getters
  getIsTextSelectionAwarenessOn: () => boolean;
}

export const useTextSelectionAwarenessStore =
  create<TextSelectionAwarenessStore>((set, get) => ({
    isTextSelectionAwarenessOn: false,
    setTextSelectionAwarenessOn: (value) => {
      set({ isTextSelectionAwarenessOn: value });
    },
    getIsTextSelectionAwarenessOn: () => get().isTextSelectionAwarenessOn,
  }));
