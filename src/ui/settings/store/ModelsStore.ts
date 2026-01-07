import { create } from "zustand";
import type { WhisperModel } from "@/ui/settings/types/SettingsTypes.ts";

interface ModelsState {
  models: Map<string, WhisperModel>;

  // Actions
  setModelDownloading: (modelName: string, isDownloading: boolean) => void;
  setModelInSystem: (modelName: string, isInSystem: boolean) => void;
  initializeModels: (models: WhisperModel[]) => void;

  // Getters
  getModel: (modelName: string) => WhisperModel | undefined;
  getModels: () => Map<string, WhisperModel>;
}

export const useModelsStore = create<ModelsState>((set, get) => ({
  models: new Map(),

  initializeModels: (modelsArray: WhisperModel[]) => {
    const modelsMap = new Map<string, WhisperModel>();
    modelsArray.forEach((model) => {
      modelsMap.set(model.name, model);
    });
    set({ models: modelsMap });
  },

  setModelDownloading: (modelName: string, isDownloading: boolean) => {
    const { models } = get();
    const model = models.get(modelName);
    if (model) {
      const updatedModelsMap = new Map(models);
      updatedModelsMap.set(modelName, { ...model, isDownloading });
      set({ models: updatedModelsMap });
    }
  },

  setModelInSystem: (modelName: string, isInSystem: boolean) => {
    const { models } = get();
    const model = models.get(modelName);
    if (model) {
      const updatedModelsMap = new Map(models);
      updatedModelsMap.set(modelName, {
        ...model,
        inSystem: isInSystem,
        isDownloading: false,
      });
      set({ models: updatedModelsMap });
    }
  },

  getModel: (modelName: string) => get().models.get(modelName),
  getModels: () => get().models,
}));
