import { PresetId, SimulationParameters, SpatialMode } from '../../types/physics';
import { calculateDispersion } from '../core/dispersion';

export interface FieldEvaluationResult {
  value: number; // field amplitude phi(x, z, t)
  energyDensity?: number; // local energy density
  phase?: number;
}

/**
 * Evaluates the scalar field value phi(x, z, t) at any given coordinate.
 */
export function evaluateScalarField(
  x: number,
  z: number,
  t: number,
  preset: PresetId,
  params: SimulationParameters
): FieldEvaluationResult {
  const { k, amplitude, phase, c_sim, mass, propagationAngle, packetWidth, packetCenterX, packetCenterZ, boundaryLength, modes } = params;

  switch (preset) {
    case 'single-mode': {
      const kx = k * Math.cos(propagationAngle);
      const kz = k * Math.sin(propagationAngle);
      const { omega } = calculateDispersion(k, mass, c_sim);
      const argument = (kx * x + kz * z) - omega * t + phase;
      const value = amplitude * Math.cos(argument);
      return { value, phase: ((argument % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) };
    }

    case 'two-mode': {
      // Use active modes from params.modes (first two modes)
      const m1 = modes[0] || { kx: k, kz: 0, amplitude: amplitude, phase: 0, isActive: true };
      const m2 = modes[1] || { kx: k * 1.5, kz: 0, amplitude: amplitude * 0.8, phase: Math.PI / 4, isActive: true };
      
      let sum = 0;
      if (m1.isActive) {
        const k1 = Math.sqrt(m1.kx * m1.kx + m1.kz * m1.kz);
        const { omega: w1 } = calculateDispersion(k1, mass, c_sim);
        sum += m1.amplitude * Math.cos((m1.kx * x + m1.kz * z) - w1 * t + m1.phase);
      }
      if (m2.isActive) {
        const k2 = Math.sqrt(m2.kx * m2.kx + m2.kz * m2.kz);
        const { omega: w2 } = calculateDispersion(k2, mass, c_sim);
        sum += m2.amplitude * Math.cos((m2.kx * x + m2.kz * z) - w2 * t + m2.phase);
      }
      return { value: sum };
    }

    case 'wave-packet': {
      const kx = k * Math.cos(propagationAngle);
      const kz = k * Math.sin(propagationAngle);
      const { omega } = calculateDispersion(k, mass, c_sim);
      
      // Physically consistent group velocity vg = d(omega)/dk = c^2 * k / omega
      const vg = omega > 0 ? (c_sim * c_sim * k) / omega : c_sim;
      
      // Moving envelope center along propagation direction
      const currentCenterX = packetCenterX + vg * t * Math.cos(propagationAngle);
      const currentCenterZ = packetCenterZ + vg * t * Math.sin(propagationAngle);
      
      const dx = x - currentCenterX;
      const dz = z - currentCenterZ;
      const distSq = dx * dx + dz * dz;
      const sigma = Math.max(0.5, packetWidth);
      
      const envelope = Math.exp(-distSq / (2 * sigma * sigma));
      const carrier = Math.cos((kx * x + kz * z) - omega * t + phase);
      return { value: amplitude * envelope * carrier };
    }

    case 'standing-wave': {
      const L = Math.max(2, boundaryLength);
      // Discrete mode numbers nx, nz ensuring node boundaries at box edges
      const nx = Math.max(1, Math.round((k * L) / (2 * Math.PI)));
      const nz = Math.max(1, Math.round((k * L) / (3 * Math.PI)));
      
      const kx = (nx * Math.PI) / L;
      const kz = (nz * Math.PI) / L;
      const totalK = Math.sqrt(kx * kx + kz * kz);
      const { omega } = calculateDispersion(totalK, mass, c_sim);
      
      // Zero boundary condition at x = +/- L/2
      const spatialX = Math.sin((nx * Math.PI * (x + L / 2)) / L);
      const spatialZ = Math.sin((nz * Math.PI * (z + L / 2)) / L);
      const temporal = Math.cos(omega * t + phase);
      
      // If outside boundary box, field is zero
      if (Math.abs(x) > L / 2 || Math.abs(z) > L / 2) {
        return { value: 0 };
      }
      return { value: amplitude * spatialX * spatialZ * temporal };
    }

    case 'ground-state': {
      // Scientifically honest: vacuum ground state has expectation value <phi> = 0,
      // but non-zero variance <phi^2>. We illustrate spatial correlation with zero-point amplitude.
      // Distinct from classical static flat zero: deterministic quantum expectation distribution.
      const { omega } = calculateDispersion(k, mass, c_sim);
      // Mode zero-point energy contribution ~ 1/2 hbar omega
      const zeroPointAmp = 0.25 * Math.sqrt(Math.max(0.1, 1 / (2 * Math.max(0.1, omega))));
      const kx = k * 1.0;
      const kz = k * 0.8;
      const val = zeroPointAmp * (
        Math.cos(kx * x - omega * t) * Math.sin(kz * z) +
        0.5 * Math.cos(2 * kx * x + 0.3) * Math.cos(1.5 * kz * z - 1.2 * omega * t)
      );
      return { value: val };
    }

    default: {
      // Multi-mode summation
      let sum = 0;
      for (const m of modes) {
        if (!m.isActive) continue;
        const totalK = Math.sqrt(m.kx * m.kx + m.kz * m.kz);
        const { omega } = calculateDispersion(totalK, mass, c_sim);
        sum += m.amplitude * Math.cos((m.kx * x + m.kz * z) - omega * t + m.phase);
      }
      return { value: sum };
    }
  }
}

