import { PHYSICAL_CONSTANTS_SI } from '../core/constants';

/**
 * Casimir Effect Physics
 * 
 * Model:
 * Idealised parallel, perfectly conducting plates separated by distance d in vacuum.
 * Boundary condition: Electric field tangential components vanish at plates (Dirichlet boundary).
 * Mode quantisation inside plates:
 *   k_n = n * pi / d,  for n = 1, 2, 3...
 * 
 * Attractive Casimir Force per unit area (Casimir, 1948):
 *   F / A = - (pi^2 * hbar * c) / (240 * d^4)
 * 
 * Scientific limitations & assumptions:
 * - Perfectly conducting plates (infinite conductivity at all frequencies). Real metals become transparent to UV frequencies (plasma frequency cutoff).
 * - Zero temperature (T = 0 K). Thermal corrections appear at larger separations.
 * - Perfectly flat, smooth plates without surface roughness.
 * - Attractive force does NOT allow perpetual energy extraction (conservation of energy holds; work is done by the field as plates move together).
 */

export interface CasimirCalculation {
  plateDistanceUm: number;       // separation d in micrometers (10^-6 m)
  forcePerAreaPascal: number;    // F/A in N/m^2 (Pascals)
  attractiveForceSign: -1;
  allowedModesCount: number;     // number of resonant modes below cutoff
  allowedModesK: number[];       // discrete wave numbers kn = n*pi/d
  zeroPointVarianceSim: number;  // <0|phi^2|0> representation
  energyDensityDiff: number;
}

export function calculateCasimir(distanceUm: number): CasimirCalculation {
  const d_meters = Math.max(0.05, distanceUm) * 1e-6; // convert um to m
  const hbar = PHYSICAL_CONSTANTS_SI.REDUCED_PLANCK_HBAR;
  const c = PHYSICAL_CONSTANTS_SI.SPEED_OF_LIGHT_C;

  // F/A = - (pi^2 * hbar * c) / (240 * d^4)
  const numerator = Math.PI * Math.PI * hbar * c;
  const denominator = 240 * Math.pow(d_meters, 4);
  const forcePerArea = -numerator / denominator;

  // Discretised cavity modes for visualization (first 8 modes)
  const allowedModesK: number[] = [];
  for (let n = 1; n <= 8; n++) {
    allowedModesK.push((n * Math.PI) / Math.max(0.1, distanceUm));
  }

  // Cavity energy density difference
  const energyDensity = forcePerArea * d_meters;

  // Zero-point amplitude representation ~ 1/sqrt(d)
  const zeroPointVarianceSim = 0.5 / Math.sqrt(Math.max(0.1, distanceUm));

  return {
    plateDistanceUm: distanceUm,
    forcePerAreaPascal: forcePerArea,
    attractiveForceSign: -1,
    allowedModesCount: allowedModesK.length,
    allowedModesK,
    zeroPointVarianceSim,
    energyDensityDiff: energyDensity,
  };
}

