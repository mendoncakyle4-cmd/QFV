import React, { useState, useRef, useEffect } from 'react';
import { calculateCasimir } from '../physics/vacuum/casimir';
import { ParameterControl } from '../components/ui/ParameterControl';
import { KatexMath } from '../components/ui/KatexMath';
import { ShieldAlert, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const VacuumPage: React.FC = () => {
  const [plateDistanceUm, setPlateDistanceUm] = useState(1.0); // separation d in micrometers
  const [activeTab, setActiveTab] = useState<'casimir' | 'ground-variance'>('casimir');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const casimir = calculateCasimir(plateDistanceUm);

  // Draw Casimir cavity illustration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Plate separation in pixel coords
    // map distance 0.2um - 4.0um to 50px - 280px
    const cavityWidth = Math.min(280, Math.max(50, (plateDistanceUm / 4.0) * 260 + 40));
    const centerX = width / 2;
    const leftPlateX = centerX - cavityWidth / 2;
    const rightPlateX = centerX + cavityWidth / 2;

    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw Standing Cavity Modes between plates: kn = n*pi/d
    const numModesToDraw = Math.min(5, Math.max(1, Math.round(5 - plateDistanceUm)));
    for (let n = 1; n <= numModesToDraw; n++) {
      ctx.strokeStyle = n === 1 ? '#06B6D4' : n === 2 ? '#38BDF8' : '#818CF8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let px = leftPlateX; px <= rightPlateX; px++) {
        const u = (px - leftPlateX) / cavityWidth;
        const wave = Math.sin(n * Math.PI * u) * 22;
        const py = height / 2 + (n - 2.5) * 45 + wave;
        if (px === leftPlateX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Draw Plates (Left and Right conducting boundaries)
    const plateWidth = 14;
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 2;

    // Left plate
    ctx.fillRect(leftPlateX - plateWidth, 30, plateWidth, height - 60);
    ctx.strokeRect(leftPlateX - plateWidth, 30, plateWidth, height - 60);

    // Right plate
    ctx.fillRect(rightPlateX, 30, plateWidth, height - 60);
    ctx.strokeRect(rightPlateX, 30, plateWidth, height - 60);

    // Attractive Force Arrows (inward pointing)
    const arrowLen = Math.min(30, Math.max(8, 100 / Math.pow(plateDistanceUm, 2)));
    ctx.strokeStyle = '#F59E0B';
    ctx.fillStyle = '#F59E0B';
    ctx.lineWidth = 2.5;

    // Left plate arrow pointing right
    ctx.beginPath();
    ctx.moveTo(leftPlateX - plateWidth - arrowLen, height / 2);
    ctx.lineTo(leftPlateX - plateWidth, height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(leftPlateX - plateWidth, height / 2);
    ctx.lineTo(leftPlateX - plateWidth - 6, height / 2 - 5);
    ctx.lineTo(leftPlateX - plateWidth - 6, height / 2 + 5);
    ctx.fill();

    // Right plate arrow pointing left
    ctx.beginPath();
    ctx.moveTo(rightPlateX + plateWidth + arrowLen, height / 2);
    ctx.lineTo(rightPlateX + plateWidth, height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rightPlateX + plateWidth, height / 2);
    ctx.lineTo(rightPlateX + plateWidth + 6, height / 2 - 5);
    ctx.lineTo(rightPlateX + plateWidth + 6, height / 2 + 5);
    ctx.fill();

    // Distance Dimension Arrow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftPlateX, height - 25);
    ctx.lineTo(rightPlateX, height - 25);
    ctx.stroke();

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`d = ${plateDistanceUm.toFixed(2)} µm`, centerX, height - 12);
  }, [plateDistanceUm]);

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-6 max-w-7xl mx-auto w-full gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-border pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1 block">
            Quantum Vacuum & Boundary Physics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Vacuum Ground State & Casimir Effect
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            The quantum vacuum is not empty nothingness; it is the ground state of all quantum field modes possessing zero-point energy and non-zero observable variance.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-navy-900 p-1 border border-navy-border rounded-control shrink-0">
          <button
            onClick={() => setActiveTab('casimir')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'casimir'
                ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Casimir Cavity
          </button>
          <button
            onClick={() => setActiveTab('ground-variance')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              activeTab === 'ground-variance'
                ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ground Variance
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visualisation Canvas (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-border/60 pb-2 text-xs font-mono">
              <span className="text-cyan-300 font-semibold uppercase">
                Cavity Mode Quantisation: k<sub>n</sub> = n&pi; / d
              </span>
              <span className="text-slate-400">
                Attractive Force F &prop; -1/d<sup>4</sup>
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={640}
              height={380}
              className="w-full h-[380px] bg-navy-950 rounded-control border border-navy-border"
            />

            {/* Slider Control for Plate Separation */}
            <div className="pt-2">
              <ParameterControl
                label="Conducting Plate Separation (d)"
                value={plateDistanceUm}
                min={0.2}
                max={4.0}
                step={0.05}
                unit="µm"
                defaultValue={1.0}
                description="Decreasing d sharply amplifies attractive Casimir force ~ 1/d^4"
                onChange={(val) => setPlateDistanceUm(val)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Scientific Guardrails (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Exact Casimir Equation & Readout */}
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 shadow-subtle">
            <h3 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
              Casimir Force per Unit Area
            </h3>
            <KatexMath math="\frac{F}{A} = -\frac{\pi^2 \hbar c}{240 d^4}" block />

            <div className="p-3 bg-navy-950 rounded border border-navy-border/60 text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Separation (d):</span>
                <span className="text-cyan-light font-bold">{plateDistanceUm.toFixed(2)} µm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Force / Area (F/A):</span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {casimir.forcePerAreaPascal.toExponential(3)} Pa (N/m²)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resonant Modes:</span>
                <span className="text-slate-200">{casimir.allowedModesCount} discrete modes</span>
              </div>
            </div>
          </div>

          {/* Strict Non-Negotiable Guardrails Notice */}
          <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-panel flex flex-col gap-2 shadow-subtle text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Conservation of Energy & Guardrails</span>
            </div>
            <p className="leading-relaxed text-slate-400 text-[11px]">
              <strong>Zero Usable Free Energy:</strong> The attractive Casimir force does NOT allow harvesting free energy from the vacuum. Bringing the plates together does work once, but separating them requires supplying the exact same work back against the field.
            </p>
            <p className="leading-relaxed text-slate-400 text-[11px] pt-1 border-t border-navy-border/40">
              <strong>No Glitter Particles:</strong> Quantum vacuum fluctuations are not cartoon particle sparks popping in and out of space; they are non-vanishing variances of quantum operator fields &lang;0|&phi;<sup>2</sup>|0&rang; &gt; 0.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
