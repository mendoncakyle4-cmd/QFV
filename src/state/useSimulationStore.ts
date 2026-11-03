import { create } from 'zustand';
import { ColormapId, DisplayMode, FieldModelId, PresetId, SharedExperimentState, SimulationParameters } from '../types/physics';
import { PRESETS } from '../data/presets';
import { calculateDispersion } from '../physics/core/dispersion';
import { toneSynthesizer } from '../audio/toneGenerator';

export interface SavedExperimentItem {
  id: string;
  name: string;
  date: string;
  state: SharedExperimentState;
}

interface SimulationState {
  modelId: FieldModelId;
  presetId: PresetId;
  parameters: SimulationParameters;
  displayMode: DisplayMode;
  colormap: ColormapId;
  use2DFallback: boolean;
  isAudioEnabled: boolean;
  
  // Shared link notice banner
  sharedNotice: string | null;

  // Actions
  setModel: (model: FieldModelId) => void;
  setPreset: (preset: PresetId) => void;
  updateParameter: <K extends keyof SimulationParameters>(key: K, value: SimulationParameters[K]) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setColormap: (colormap: ColormapId) => void;
  toggle2DFallback: () => void;
  togglePlayPause: () => void;
  toggleAudio: () => void;
  resetToPreset: (presetId?: PresetId) => void;
  resetAll: () => void;
  setSharedNotice: (msg: string | null) => void;

  // Persistence & URL Serialization
  serializeState: () => string;
  loadStateFromPayload: (payload: SharedExperimentState, bannerNotice?: string) => boolean;
  
  // Local Lab storage
  savedExperiments: SavedExperimentItem[];
  saveCurrentToLab: (name: string) => void;
  deleteSavedExperiment: (id: string) => void;
}

const DEFAULT_PRESET = 'single-mode';

export const useSimulationStore = create<SimulationState>((set, get) => ({
  modelId: 'scalar-free',
  presetId: DEFAULT_PRESET,
  parameters: { ...PRESETS[DEFAULT_PRESET].parameters },
  displayMode: 'surface',
  colormap: 'cyan-violet',
  use2DFallback: false,
  isAudioEnabled: false,
  sharedNotice: null,
  savedExperiments: (() => {
    try {
      const stored = localStorage.getItem('qfe_saved_experiments');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),

  setModel: (model) => set({ modelId: model }),

  setPreset: (presetId) => {
    const preset = PRESETS[presetId];
    if (!preset) return;
    set({
      presetId,
      parameters: { ...preset.parameters },
    });
    // Update audio tone frequency if audio is on
    const { omega } = calculateDispersion(preset.parameters.k, preset.parameters.mass, preset.parameters.c_sim);
    toneSynthesizer.updateFrequency(omega);
  },

  updateParameter: (key, value) => {
    set((state) => {
      const nextParams = { ...state.parameters, [key]: value };
      
      // If updating wave number k or mass or c_sim, sync audio frequency
      if (key === 'k' || key === 'mass' || key === 'c_sim') {
        const { omega } = calculateDispersion(nextParams.k, nextParams.mass, nextParams.c_sim);
        toneSynthesizer.updateFrequency(omega);
      }

      return {
        parameters: nextParams,
        presetId: 'custom', // Mark custom when modified
      };
    });
  },

  setDisplayMode: (mode) => set({ displayMode: mode }),
  setColormap: (colormap) => set({ colormap }),
  toggle2DFallback: () => set((state) => ({ use2DFallback: !state.use2DFallback })),

  togglePlayPause: () => {
    set((state) => {
      const next = !state.parameters.isPaused;
      return {
        parameters: { ...state.parameters, isPaused: next },
      };
    });
  },

  toggleAudio: () => {
    const status = toneSynthesizer.toggle();
    set({ isAudioEnabled: status });
    if (status) {
      const { k, mass, c_sim } = get().parameters;
      const { omega } = calculateDispersion(k, mass, c_sim);
      toneSynthesizer.updateFrequency(omega);
    }
  },

  resetToPreset: (presetId) => {
    const targetPreset = presetId || get().presetId;
    const def = PRESETS[targetPreset] || PRESETS['single-mode'];
    set({
      presetId: def.id,
      parameters: { ...def.parameters },
    });
    const { omega } = calculateDispersion(def.parameters.k, def.parameters.mass, def.parameters.c_sim);
    toneSynthesizer.updateFrequency(omega);
  },

  resetAll: () => {
    const def = PRESETS['single-mode'];
    set({
      modelId: 'scalar-free',
      presetId: 'single-mode',
      parameters: { ...def.parameters },
      displayMode: 'surface',
      colormap: 'cyan-violet',
      sharedNotice: null,
    });
    const { omega } = calculateDispersion(def.parameters.k, def.parameters.mass, def.parameters.c_sim);
    toneSynthesizer.updateFrequency(omega);
  },

  setSharedNotice: (sharedNotice) => set({ sharedNotice }),

  serializeState: () => {
    const state = get();
    const payload: SharedExperimentState = {
      schemaVersion: '1.0',
      modelId: state.modelId,
      modelVersion: '1.0.0',
      presetId: state.presetId,
      parameters: state.parameters,
      displayMode: state.displayMode,
      colormap: state.colormap,
      timestamp: Date.now(),
    };
    try {
      return btoa(encodeURIComponent(JSON.stringify(payload)));
    } catch {
      return '';
    }
  },

  loadStateFromPayload: (payload, bannerNotice) => {
    if (!payload || payload.schemaVersion !== '1.0') return false;
    set({
      modelId: payload.modelId || 'scalar-free',
      presetId: payload.presetId || 'custom',
      parameters: { ...PRESETS['single-mode'].parameters, ...payload.parameters },
      displayMode: payload.displayMode || 'surface',
      colormap: payload.colormap || 'cyan-violet',
      sharedNotice: bannerNotice || 'Loaded shared experiment configuration.',
    });
    return true;
  },

  saveCurrentToLab: (name) => {
    const state = get();
    const item: SavedExperimentItem = {
      id: `exp-${Date.now()}`,
      name: name.trim() || `Experiment ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleString(),
      state: {
        schemaVersion: '1.0',
        modelId: state.modelId,
        modelVersion: '1.0.0',
        presetId: state.presetId,
        parameters: state.parameters,
        displayMode: state.displayMode,
        colormap: state.colormap,
        timestamp: Date.now(),
      },
    };
    const updated = [item, ...state.savedExperiments];
    try {
      localStorage.setItem('qfe_saved_experiments', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    set({ savedExperiments: updated });
  },

  deleteSavedExperiment: (id) => {
    const updated = get().savedExperiments.filter((exp) => exp.id !== id);
    try {
      localStorage.setItem('qfe_saved_experiments', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage remove failed:', e);
    }
    set({ savedExperiments: updated });
  },
}));

