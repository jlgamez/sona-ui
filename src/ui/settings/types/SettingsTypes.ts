export type WhisperModel = {
  name: string;
  requiredRam: string;
  relativeSpeed: string;
  inSystem: boolean;
  englishOnly: boolean;
  isDownloading: boolean;
};

export type UserConfig = {
  clipboard_behaviour: {
    autonomous_pasting: boolean;
    keep_output_in_clipboard: boolean;
  };
  current_model: string;
  hot_key: string;
  intelligent_mode: boolean;
  text_selection_awareness: boolean;
};
