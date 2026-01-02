import { whisperModels } from "@/data/available-models.ts";

export function fetchModelsData() {
  // TODO: make a hook to fetch models data from backend
  return whisperModels;
}
