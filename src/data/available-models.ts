export type WhisperModel = {
  name: string;
  ram: string;
  speed: string;
  inSystem: boolean;
};

export const whisperModels: WhisperModel[] = [
  {
    name: "tiny",
    ram: "~0.5 GB",
    speed: "~32x real-time (fastest)",
    inSystem: true,
  },
  {
    name: "base",
    ram: "~1 GB",
    speed: "~16x real-time",
    inSystem: false,
  },
  {
    name: "small",
    ram: "~2 GB",
    speed: "~6x real-time",
    inSystem: true,
  },
  {
    name: "medium",
    ram: "~5 GB",
    speed: "~2x–3x real-time",
    inSystem: false,
  },
  {
    name: "large",
    ram: "~10 GB",
    speed: "~1x real-time (slower)",
    inSystem: false,
  },
  {
    name: "turbo",
    ram: "~6 GB",
    speed: "~1x real-time (latest)",
    inSystem: true,
  },
];
