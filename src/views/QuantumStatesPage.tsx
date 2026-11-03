import React, { useState, useRef, useEffect } from 'react';
import { 
  evaluateQHOWavefunction, 
  evaluateCoherentState, 
  WavefunctionEvaluation 
} from '../physics/quantumStates/harmonicOscillator';
import { evaluateWignerFock, evaluateWignerCoherent } from '../physics/quantumStates/wigner';
import { KatexMath } from '../components/ui/KatexMath';
import { Tabs } from '../components/ui/Tabs';
import { ParameterControl } from '../components/ui/ParameterControl';
import { Info, AlertCircle, Play, Pause, Activity } from 'lucide-react';

export const QuantumStatesPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<'n0' | 'n1' | 'n2' | 'coherent'>('n1');
  const [displayToggle, setDisplayToggle] = useState<'prob' | 'real' | 'imag' | 'phase'>('prob');
  const [isWignerMode, setIsWignerMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);

  const canvas1DRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWignerRef = useRef<HTMLCanvasElement | null>(null);

  // Animation loop for time evolution exp(-i E_n t / hbar)
  useEffect(() => {
    let reqId: number;
    let last = performance.now();
    const loop = (now: number) => {
      reqId = requestAnimationFrame(loop);
      const dt = (now - last) / 1000;
      last = now;
      if (isPlaying) {
        setTime((t) => t + dt * 1.5);
      }
    };
    reqId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqId);
  }, [isPlaying]);

  // Render 1D Wavefunction graph
  useEffect(() => {
    const canvas = canvas1DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Grid & Zero-line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Harmonic Oscillator Potential V(x) = 1/2 m omega^2 x^2
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let px = 0; px < width; px++) {
      const x = (px / width - 0.5) * 8; // range [-4, +4]
      const vx = 0.5 * x * x; // V(x)
      const py = height / 2 - vx * 18;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Sample wavefunction values
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (displayToggle === 'prob') {
      ctx.strokeStyle = '#06B6D4'; // Cyan
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    } else if (displayToggle === 'real') {
      ctx.strokeStyle = '#38BDF8';
    } else if (displayToggle === 'imag') {
      ctx.strokeStyle = '#A78BFA'; // Violet
    } else {
      ctx.strokeStyle = '#F59E0B'; // Amber
    }

    const n = selectedState === 'n0' ? 0 : selectedState === 'n1' ? 1 : selectedState === 'n2' ? 2 : 0;
    const points: [number, number][] = [];

    for (let px = 0; px < width; px++) {
      const x = (px / width - 0.5) * 8;
      let evalResult: WavefunctionEvaluation;
      if (selectedState === 'coherent') {
        evalResult = evaluateCoherentState(1.5, x, time);
      } else {
        evalResult = evaluateQHOWavefunction(n, x, time);
      }

      let yVal = 0;
      if (displayToggle === 'prob') yVal = evalResult.probabilityDensity * 120;
      else if (displayToggle === 'real') yVal = evalResult.real * 75;
      else if (displayToggle === 'imag') yVal = evalResult.imag * 75;
      else yVal = (evalResult.phase / Math.PI) * 40;

      const py = height / 2 - yVal;
      points.push([px, py]);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    ctx.stroke();

    // Fill area under probability density
    if (displayToggle === 'prob') {
      ctx.lineTo(width, height / 2);
      ctx.lineTo(0, height / 2);
      ctx.closePath();
      ctx.fill();
    }
  }, [selectedState, displayToggle, time]);

  // Render 2D Wigner phase-space distribution W(x, p)
  useEffect(() => {
    const canvas = canvasWignerRef.current;
    if (!canvas || !isWignerMode) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const n = selectedState === 'n0' ? 0 : selectedState === 'n1' ? 1 : selectedState === 'n2' ? 2 : 0;

    const step = 4;
    for (let px = 0; px < width; px += step) {
      for (let py = 0; py < height; py += step) {
        const x = (px / width - 0.5) * 6; // range [-3, 3]
        const p = -(py / height - 0.5) * 6;

        let wVal = 0;
        if (selectedState === 'coherent') {
          wVal = evaluateWignerCoherent(1.5, x, p, time);
        } else {
          wVal = evaluateWignerFock(n, x, p);
        }

        // Color encoding:
        // Positive: Cyan (0 to +0.35)
        // Negative: Red/Orange (W < 0 - strictly quantum negativity!)
        let r = 10, g = 14, b = 23;
        if (wVal > 0) {
          const intensity = Math.min(1, wVal * 3.0);
          r = Math.round(10 + intensity * (0 - 10));
          g = Math.round(14 + intensity * (229 - 14));
          b = Math.round(23 + intensity * (255 - 23));
        } else if (wVal < 0) {
          const negIntensity = Math.min(1, Math.abs(wVal) * 4.0);
          r = Math.round(239 * negIntensity);
          g = Math.round(68 * negIntensity);
          b = Math.round(68 * negIntensity);
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(px, py, step, step);
      }
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  }, [selectedState, isWignerMode, time]);

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-6 max-w-7xl mx-auto w-full gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-border pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1 block">
            Quantum Mechanics & States
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Harmonic Oscillator & Phase Space
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Explore stationary energy eigenstates &psi;<sub>n</sub>(x), probability density |&psi;|<sup>2</sup>, and Wigner quasiprobability distributions W(x, p).
          </p>
        </div>

        {/* State Selector */}
        <div className="flex items-center gap-1.5 bg-navy-900 p-1 border border-navy-border rounded-control shrink-0">
          {[
            { id: 'n0', label: '|0⟩ Ground' },
            { id: 'n1', label: '|1⟩ 1st Excited' },
            { id: 'n2', label: '|2⟩ 2nd Excited' },
            { id: 'coherent', label: '|α⟩ Coherent' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedState(st.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                selectedState === st.id
                  ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visualisation Canvas (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 shadow-2xl">
            {/* View Mode Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-border/60 pb-3">
              <div className="flex items-center gap-1 bg-navy-950 p-1 border border-navy-border rounded-control text-xs font-mono">
                <button
                  onClick={() => setIsWignerMode(false)}
                  className={`px-3 py-1 rounded transition-colors ${
                    !isWignerMode ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'
                  }`}
                >
                  1D Wavefunction
                </button>
                <button
                  onClick={() => setIsWignerMode(true)}
                  className={`px-3 py-1 rounded transition-colors ${
                    isWignerMode ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'
                  }`}
                >
                  Wigner Phase Space W(x, p)
                </button>
              </div>

              {!isWignerMode && (
                <div className="flex items-center gap-1 text-xs font-mono">
                  {[
                    { id: 'prob', label: '|ψ|² Prob' },
                    { id: 'real', label: 'Re(ψ)' },
                    { id: 'imag', label: 'Im(ψ)' },
                    { id: 'phase', label: 'Phase' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setDisplayToggle(btn.id as any)}
                      className={`px-2.5 py-1 rounded border transition-colors ${
                        displayToggle === btn.id
                          ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                          : 'bg-navy-950 border-navy-border text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 bg-navy-800 text-slate-200 hover:text-cyan-300 rounded border border-navy-border"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* Canvas Area */}
            <div className="relative w-full h-[360px] bg-navy-950 rounded-control border border-navy-border overflow-hidden flex items-center justify-center">
              {isWignerMode ? (
                <canvas
                  ref={canvasWignerRef}
                  width={420}
                  height={340}
                  className="w-full max-w-[420px] h-[340px] rounded"
                />
              ) : (
                <canvas
                  ref={canvas1DRef}
                  width={640}
                  height={340}
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Scientific Legend & Guidance */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
              <span>
                {isWignerMode
                  ? 'Horizontal: Position x · Vertical: Momentum p · Red: Negative Quasiprobability'
                  : `Horizontal: Position x ∈ [-4, +4] · Dashed line: Parabolic Potential V(x)`}
              </span>
              <span className="text-cyan-light font-bold">
                Energy E = {selectedState === 'n0' ? '0.5' : selectedState === 'n1' ? '1.5' : selectedState === 'n2' ? '2.5' : 'oscillating'} &hbar;&omega;
              </span>
            </div>
          </div>
        </div>

        {/* Right Explanations (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Mathematical State Definition */}
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 shadow-subtle">
            <h3 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
              Exact Eigenstate Formula
            </h3>
            <KatexMath math="\psi_n(x, t) = \frac{1}{\sqrt{2^n n!}}\left(\frac{m\omega}{\pi\hbar}\right)^{1/4} e^{-\frac{m\omega x^2}{2\hbar}} H_n(\sqrt{\frac{m\omega}{\hbar}}x) e^{-i\frac{E_n t}{\hbar}}" block />
            <KatexMath math="E_n = \left(n + \frac{1}{2}\right)\hbar\omega" block />
          </div>

          {/* Wigner Non-Classicality Notice */}
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-2 shadow-subtle">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
              <Info className="w-4 h-4" />
              <span>Wigner Quasiprobability & Negativity</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike classical phase-space distributions, the quantum Wigner function <span className="font-mono text-cyan-300">W(x, p)</span> can take <strong>negative values</strong> for quantum states such as the single-photon / first excited state |1&rang;.
            </p>
            <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded text-[11px] text-slate-300 mt-1">
              <strong>Crucial Distinction:</strong> Negative values are <em>quasiprobabilities</em> proving quantum non-classicality. They do not mean negative classical events occur in real life!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

