/**
 * Wigner Quasiprobability Distribution W(x, p)
 * 
 * For Fock state |n>:
 *   W_n(x, p) = ((-1)^n / pi) * exp(-(x^2 + p^2)) * L_n(2(x^2 + p^2))
 * where L_n(u) is the Laguerre polynomial.
 * 
 * For Coherent state |alpha>:
 *   W_alpha(x, p) = (1 / pi) * exp(-(x - x0)^2 - (p - p0)^2)
 * 
 * Crucial scientific distinction:
 * W(x, p) can be negative for non-classical quantum states (e.g. n=1 Fock state).
 * Negative values are QUASIPROBABILITIES and do NOT represent negative classical probabilities.
 */

function laguerre(n: number, u: number): number {
  if (n === 0) return 1;
  if (n === 1) return 1 - u;
  if (n === 2) return 0.5 * (u * u - 4 * u + 2);
  if (n === 3) return (-u * u * u + 9 * u * u - 18 * u + 6) / 6;

  let lPrev = 1;
  let lCurr = 1 - u;
  for (let i = 1; i < n; i++) {
    const lNext = ((2 * i + 1 - u) * lCurr - i * lPrev) / (i + 1);
    lPrev = lCurr;
    lCurr = lNext;
  }
  return lCurr;
}

export function evaluateWignerFock(n: number, x: number, p: number): number {
  const rSq = x * x + p * p;
  const parity = n % 2 === 0 ? 1 : -1;
  const L = laguerre(n, 2 * rSq);
  return (parity / Math.PI) * Math.exp(-rSq) * L;
}

export function evaluateWignerCoherent(alpha: number, x: number, p: number, t: number = 0): number {
  const x0 = Math.sqrt(2) * alpha * Math.cos(t);
  const p0 = -Math.sqrt(2) * alpha * Math.sin(t);
  const distSq = (x - x0) * (x - x0) + (p - p0) * (p - p0);
  return (1 / Math.PI) * Math.exp(-distSq);
}

