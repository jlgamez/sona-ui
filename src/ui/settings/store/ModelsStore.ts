import { create } from "zustand";
import { type WhisperModel, whisperModels } from "@/data/available-models";

export type ModelStatus = {
  isDownloading: boolean;
  isInSystem: boolean;
};
export type ModelInfo = {
  model: WhisperModel;
  status: ModelStatus;
};

interface ModelsState {
  models: Map<string, ModelInfo>;

  // Actions
  setModelDownloading: (modelName: string, isDownloading: boolean) => void;
  setModelInSystem: (modelName: string, isInSystem: boolean) => void;
  initializeModels: () => void;

  // Getters
  getModelStatus: (modelName: string) => ModelStatus | undefined;
  getModels: () => Map<string, ModelInfo>;
}

export const useModelsStore = create<ModelsState>((set, get) => ({
  models: new Map(),

  initializeModels: () => {
    const modelsMap = new Map<string, ModelInfo>();
    whisperModels.forEach((model) => {
      modelsMap.set(model.name, {
        model: model,
        status: {
          isInSystem: model.inSystem,
          isDownloading: false,
        },
      });
    });
    set({ models: modelsMap });
  },

  setModelDownloading: (chosenModel: string, isDownloading: boolean) => {
    const { models } = get();
    const model = models.get(chosenModel)?.model;
    if (model) {
      const updatedModelsMap = new Map(models);

      updatedModelsMap.set(chosenModel, {
        model: model,
        status: {
          // if downloading, model is not in system yet
          isInSystem: false,
          isDownloading: isDownloading,
        },
      });
      set({ models: updatedModelsMap });
    }
  },

  setModelInSystem: (chosenModel: string, isInSystem: boolean) => {
    const { models } = get();
    const model = models.get(chosenModel)?.model;
    if (model) {
      const updatedModelsMap = new Map(models);

      updatedModelsMap.set(chosenModel, {
        model: model,
        status: {
          isInSystem: isInSystem,
          // If model is now in system, it's no longer downloading
          isDownloading: false,
        },
      });
      set({ models: updatedModelsMap });
    }
  },

  getModelStatus: (modelName: string) => {
    return get().models.get(modelName)?.status;
  },
  getModels: () => get().models,
}));

// Initialize the store with available models
useModelsStore.getState().initializeModels();
