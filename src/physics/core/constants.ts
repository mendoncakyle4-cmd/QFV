/**
 * Physics Constants & Conventions
 * 
 * IMPORTANT SCIENTIFIC RULE:
 * Simulation units are normalised mathematical units and MUST NOT be conflated with SI units.
 * In this simulation:
 * - Natural unit convention: hbar_sim = 1
 * - Default propagation speed: c_sim = 1.0 (simulation length / simulation time)
 * - Spatial grid: x in [-L/2, L/2], z in [-L/2, L/2] where default L = 10
 */

export const SIMULATION_CONSTANTS = {
  HBAR_SIM: 1.0,
  DEFAULT_C_SIM: 1.0,
  DEFAULT_GRID_SIZE: 10.0,
  DEFAULT_RESOLUTION: 64, // 64x64 sampled vertex grid
  MIN_K: 0.2,
  MAX_K: 8.0,
  DEFAULT_K: 1.5,
  MIN_AMPLITUDE: 0.0,
  MAX_AMPLITUDE: 2.0,
  DEFAULT_AMPLITUDE: 0.8,
} as const;

export const PHYSICAL_CONSTANTS_SI = {
  SPEED_OF_LIGHT_C: 299792458, // m/s
  PLANCK_CONSTANT_H: 6.62607015e-34, // J*s
  REDUCED_PLANCK_HBAR: 1.054571817e-34, // J*s
} as const;

