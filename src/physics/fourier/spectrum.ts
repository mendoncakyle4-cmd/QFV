import { SpatialMode } from '../../types/physics';
import { calculateDispersion } from '../core/dispersion';

export interface SpectralPeak {
  id: string;
  kx: number;
  kz: number;
  kTotal: number;
  wavelength: number;
  omega: number;
  frequency: number;
  amplitude: number;
  phase: number;
  spectralWeight: number; // A^2
  isActive: boolean;
  label: string;
}

export function extractSpectralPeaks(
  modes: SpatialMode[],
  mass: number = 0,
  c_sim: number = 1.0
): SpectralPeak[] {
  return modes.map((m, index) => {
    const kTotal = Math.sqrt(m.kx * m.kx + m.kz * m.kz);
    const { wavelength, omega, frequency } = calculateDispersion(kTotal, mass, c_sim);
    return {
      id: m.id || `mode-${index + 1}`,
      kx: m.kx,
      kz: m.kz,
      kTotal,
      wavelength,
      omega,
      frequency,
      amplitude: m.amplitude,
      phase: m.phase,
      spectralWeight: m.amplitude * m.amplitude,
      isActive: m.isActive,
      label: `Mode ${index + 1} (k=${kTotal.toFixed(2)})`,
    };
  });
}

