import { create } from "zustand";

interface MicStore {
  /** Microphone name, or null for the system default. */
  selectedMic: string | null;
  setSelectedMic: (mic: string | null) => void;
}

export const useMicStore = create<MicStore>((set) => ({
  selectedMic: null,
  setSelectedMic: (mic) => set({ selectedMic: mic }),
}));
