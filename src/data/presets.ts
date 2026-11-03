import { PresetId, SimulationParameters } from '../types/physics';

export interface PresetDefinition {
  id: PresetId;
  name: string;
  tagline: string;
  description: string;
  parameters: SimulationParameters;
}

export const PRESETS: Record<PresetId, PresetDefinition> = {
  'ground-state': {
    id: 'ground-state',
    name: 'Ground-State Illustration',
    tagline: 'Vacuum zero-point fluctuation',
    description: 'A representation of the field vacuum expectation value <phi> = 0 with non-zero spatial zero-point variance.',
    parameters: {
      k: 1.2,
      amplitude: 0.35,
      phase: 0,
      c_sim: 1.0,
      mass: 0.2,
      propagationAngle: 0,
      packetWidth: 2.0,
      packetCenterX: 0,
      packetCenterZ: 0,
      boundaryLength: 8.0,
      modes: [],
      timeScale: 0.8,
      isPaused: false,
    },
  },
  'single-mode': {
    id: 'single-mode',
    name: 'Single Mode',
    tagline: 'Pure monochromatic spatial sinusoidal wave',
    description: 'A single Fourier component with well-defined spatial wave number k, wavelength lambda = 2*pi/k, and frequency omega = c*k.',
    parameters: {
      k: 1.5,
      amplitude: 0.8,
      phase: 0,
      c_sim: 1.0,
      mass: 0.0,
      propagationAngle: 0,
      packetWidth: 2.0,
      packetCenterX: 0,
      packetCenterZ: 0,
      boundaryLength: 10.0,
      modes: [
        { id: 'm1', kx: 1.5, kz: 0, amplitude: 0.8, phase: 0, isActive: true },
      ],
      timeScale: 1.0,
      isPaused: false,
    },
  },
  'two-mode': {
    id: 'two-mode',
    name: 'Two-Mode Interference',
    tagline: 'Superposition of two spatial modes',
    description: 'Two distinct wave components interfering in space, creating visible interference fringes and beating.',
    parameters: {
      k: 1.4,
      amplitude: 0.7,
      phase: 0,
      c_sim: 1.0,
      mass: 0.0,
      propagationAngle: 0,
      packetWidth: 2.0,
      packetCenterX: 0,
      packetCenterZ: 0,
      boundaryLength: 10.0,
      modes: [
        { id: 'm1', kx: 1.2, kz: 0, amplitude: 0.7, phase: 0, isActive: true },
        { id: 'm2', kx: 2.0, kz: 0, amplitude: 0.5, phase: Math.PI / 3, isActive: true },
      ],
      timeScale: 1.0,
      isPaused: false,
    },
  },
  'wave-packet': {
    id: 'wave-packet',
    name: 'Localised Wave Packet',
    tagline: 'Gaussian envelope propagating at group velocity',
    description: 'A spatially bounded excitation with envelope width sigma propagating at physical group velocity vg = c^2*k/omega.',
    parameters: {
      k: 2.2,
      amplitude: 1.0,
      phase: 0,
      c_sim: 1.0,
      mass: 0.5,
      propagationAngle: 0,
      packetWidth: 1.8,
      packetCenterX: -3.0,
      packetCenterZ: 0,
      boundaryLength: 10.0,
      modes: [],
      timeScale: 0.9,
      isPaused: false,
    },
  },
  'standing-wave': {
    id: 'standing-wave',
    name: 'Standing Wave',
    tagline: 'Boundary-constrained quantized harmonic mode',
    description: 'A field trapped between reflecting boundaries with fixed nodes at the box edges and stationary envelope.',
    parameters: {
      k: 1.88, // tuned for integer half-wavelengths across boundary
      amplitude: 0.85,
      phase: 0,
      c_sim: 1.0,
      mass: 0.0,
      propagationAngle: 0,
      packetWidth: 2.0,
      packetCenterX: 0,
      packetCenterZ: 0,
      boundaryLength: 8.0,
      modes: [],
      timeScale: 1.0,
      isPaused: false,
    },
  },
  'custom': {
    id: 'custom',
    name: 'Custom Configuration',
    tagline: 'User-customized field model',
    description: 'Freely configured parameters and superposition modes.',
    parameters: {
      k: 1.5,
      amplitude: 0.8,
      phase: 0,
      c_sim: 1.0,
      mass: 0.0,
      propagationAngle: 0,
      packetWidth: 2.0,
      packetCenterX: 0,
      packetCenterZ: 0,
      boundaryLength: 10.0,
      modes: [
        { id: 'm1', kx: 1.5, kz: 0, amplitude: 0.8, phase: 0, isActive: true },
      ],
      timeScale: 1.0,
      isPaused: false,
    },
  },
};

