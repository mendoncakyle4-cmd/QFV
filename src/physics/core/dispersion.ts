import { SIMULATION_CONSTANTS } from './constants';
import { CalculatedReadouts } from '../../types/physics';

/**
 * Calculates physically rigorous dispersion relations for the scalar field.
 * 
 * Rules:
 * - Massless scalar field: omega = c_sim * k
 * - Massive relativistic scalar field: omega(k) = sqrt((c_sim * k)^2 + (m * c_sim^2 / hbar)^2)
 *   In simulation units where hbar = 1, omega(k) = sqrt((c_sim * k)^2 + m^2)
 * - Wavelength: lambda = 2 * pi / k
 * - Frequency: f = omega / (2 * pi)
 * - Energy: E = hbar * omega (in simulation units where hbar=1, E = omega)
 */

export function calculateDispersion(
  k: number,
  mass: number = 0,
  c_sim: number = SIMULATION_CONSTANTS.DEFAULT_C_SIM
): CalculatedReadouts {
  // Clamp k to prevent division by zero or infinite wavelengths
  const safeK = Math.max(0.01, Math.abs(k));
  const wavelength = (2 * Math.PI) / safeK;
  
  // Relativistic dispersion
  const isMassive = Math.abs(mass) > 0.001;
  const omegaSquared = Math.pow(c_sim * safeK, 2) + Math.pow(mass, 2);
  const omega = Math.sqrt(Math.max(0, omegaSquared));
  const frequency = omega / (2 * Math.PI);
  const energy_sim = omega * SIMULATION_CONSTANTS.HBAR_SIM;

  return {
    k: safeK,
    wavelength,
    omega,
    frequency,
    energy_sim,
    dispersionType: isMassive ? 'massive' : 'massless',
  };
}

/**
 * Recovers wave number k from user-provided wavelength lambda.
 */
export function kFromWavelength(wavelength: number): number {
  const safeLambda = Math.max(0.01, wavelength);
  return (2 * Math.PI) / safeLambda;
}

