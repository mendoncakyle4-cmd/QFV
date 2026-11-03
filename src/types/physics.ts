export type FieldModelId = 
  | 'scalar-free' 
  | 'electromagnetic' 
  | 'higgs-potential' 
  | 'fermion-dirac' 
  | 'qcd-lattice';

export type PresetId = 
  | 'ground-state'
  | 'single-mode'
  | 'two-mode'
  | 'wave-packet'
  | 'standing-wave'
  | 'custom';

export type DisplayMode = 'surface' | 'wireframe' | 'contours' | 'slice-2d';

export type ColormapId = 'cyan-violet' | 'diverging-coolwarm' | 'monochrome-cyan' | 'phase-cyclic';

export interface SpatialMode {
  id: string;
  kx: number; // spatial wave number in x (rad/sim-length)
  kz: number; // spatial wave number in z (rad/sim-length)
  amplitude: number;
  phase: number; // radians
  isActive: boolean;
}

export interface SimulationParameters {
  // Primary spatial wave number (rad/sim-length)
  k: number;
  // Amplitude (arbitrary field amplitude units)
  amplitude: number;
  // Phase offset (radians)
  phase: number;
  // Wave propagation speed in simulation units
  c_sim: number;
  // Mass parameter m (for massive scalar field dispersion)
  mass: number;
  // Propagation angle in horizontal xz plane (radians)
  propagationAngle: number;
  
  // Wave packet parameters
  packetWidth: number; // spatial width sigma (Gaussian envelope)
  packetCenterX: number;
  packetCenterZ: number;

  // Standing wave boundary length L
  boundaryLength: number;
  
  // Superposition modes (for Frequency Lab and multi-mode)
  modes: SpatialMode[];
  
  // Time & Animation
  timeScale: number;
  isPaused: boolean;
}

export interface CalculatedReadouts {
  k: number;             // Primary wave number (rad/unit)
  wavelength: number;    // lambda = 2*pi / k (length units)
  omega: number;         // Angular frequency = sqrt(c^2*k^2 + m^2) (rad/time unit)
  frequency: number;     // f = omega / (2*pi) (cycles/time unit)
  energy_sim: number;    // E_sim = omega (simulation units where hbar=1)
  dispersionType: 'massless' | 'massive';
}

export interface SharedExperimentState {
  schemaVersion: '1.0';
  modelId: FieldModelId;
  modelVersion: '1.0.0';
  presetId?: PresetId;
  name?: string;
  description?: string;
  parameters: SimulationParameters;
  displayMode: DisplayMode;
  colormap: ColormapId;
  camera?: {
    position: [number, number, number];
    target: [number, number, number];
  };
  timestamp: number;
}

