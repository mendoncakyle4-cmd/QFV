/**
 * Quantum Harmonic Oscillator Wavefunctions
 * 
 * Wavefunction:
 *   psi_n(x, t) = (1 / sqrt(2^n * n!)) * (m*omega / (pi*hbar))^(1/4) * exp(-m*omega*x^2 / (2*hbar)) * H_n(sqrt(m*omega/hbar) * x) * exp(-i * E_n * t / hbar)
 * Energy eigenvalues:
 *   E_n = (n + 1/2) * hbar * omega
 * 
 * In simulation units: m = 1, omega = 1, hbar = 1.
 */

// Hermite polynomials H_n(xi)
export function hermite(n: number, xi: number): number {
  if (n === 0) return 1;
  if (n === 1) return 2 * xi;
  if (n === 2) return 4 * xi * xi - 2;
  if (n === 3) return 8 * Math.pow(xi, 3) - 12 * xi;
  if (n === 4) return 16 * Math.pow(xi, 4) - 48 * xi * xi + 12;
  
  // Recurrence relation: H_{n+1}(x) = 2x H_n(x) - 2n H_{n-1}(x)
  let hPrev = 1;
  let hCurr = 2 * xi;
  for (let i = 1; i < n; i++) {
    const hNext = 2 * xi * hCurr - 2 * i * hPrev;
    hPrev = hCurr;
    hCurr = hNext;
  }
  return hCurr;
}

function factorial(n: number): number {
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export interface WavefunctionEvaluation {
  x: number;
  real: number;
  imag: number;
  magnitude: number;
  probabilityDensity: number;
  phase: number;
}

export function evaluateQHOWavefunction(
  n: number,
  x: number,
  t: number = 0,
  omega: number = 1.0
): WavefunctionEvaluation {
  const normFactor = 1 / Math.sqrt(Math.pow(2, n) * factorial(n)) * Math.pow(omega / Math.PI, 0.25);
  const xi = Math.sqrt(omega) * x;
  const spatialReal = normFactor * Math.exp(-0.5 * xi * xi) * hermite(n, xi);

  // Time evolution factor: exp(-i * E_n * t / hbar) = cos(E_n t) - i sin(E_n t)
  const En = (n + 0.5) * omega;
  const real = spatialReal * Math.cos(-En * t);
  const imag = spatialReal * Math.sin(-En * t);
  
  const magnitude = Math.abs(spatialReal);
  const probabilityDensity = real * real + imag * imag;
  const phase = Math.atan2(imag, real);

  return {
    x,
    real,
    imag,
    magnitude,
    probabilityDensity,
    phase,
  };
}

/**
 * Coherent state |alpha>: minimum uncertainty wavepacket oscillating like a classical particle
 */
export function evaluateCoherentState(
  alpha: number, // displacement amplitude
  x: number,
  t: number = 0,
  omega: number = 1.0
): WavefunctionEvaluation {
  // Center of the oscillating Gaussian wave packet: x_c(t) = sqrt(2) * alpha * cos(omega * t)
  const xc = Math.sqrt(2) * alpha * Math.cos(omega * t);
  const pc = -Math.sqrt(2) * alpha * Math.sin(omega * t);

  const norm = Math.pow(omega / Math.PI, 0.25);
  const envelope = norm * Math.exp(-0.5 * omega * Math.pow(x - xc, 2));
  
  const phaseAngle = pc * x - 0.5 * omega * t;
  const real = envelope * Math.cos(phaseAngle);
  const imag = envelope * Math.sin(phaseAngle);
  const probabilityDensity = envelope * envelope;

  return {
    x,
    real,
    imag,
    magnitude: envelope,
    probabilityDensity,
    phase: Math.atan2(imag, real),
  };
}

