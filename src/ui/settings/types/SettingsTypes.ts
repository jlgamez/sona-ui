export type WhisperModel = {
  name: string;
  requiredRam: string;
  relativeSpeed: string;
  inSystem: boolean;
  englishOnly: boolean;
  isDownloading: boolean;
};

export type HotKeyOption = {
  name: string;
  display_name: string;
  is_default: boolean;
};

export type AudioDevice = {
  index: number;
  name: string;
};

export type UserConfig = {
  clipboard_behaviour: {
    autonomous_pasting: boolean;
    keep_output_in_clipboard: boolean;
  };
  current_model: string;
  hot_key: string;
  mic_device: string | null;
  intelligent_mode: boolean;
  text_selection_awareness: boolean;
  onboarding_completed: boolean;
};
