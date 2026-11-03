import React, { useState } from 'react';
import { KatexMath } from '../components/ui/KatexMath';
import { Info, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const InteractionsPage: React.FC = () => {
  const [couplingConstant, setCouplingConstant] = useState(0.1); // fine structure constant alpha representation

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-6 max-w-7xl mx-auto w-full gap-6">
      {/* Header */}
      <div className="border-b border-navy-border pb-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1 block">
          Quantum Electrodynamics (QED)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Field Interactions & Feynman Diagrams
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl mt-1">
          When fields couple, excitations scatter, annihilate, and create new particles. In perturbation theory, these probability amplitudes are calculated using Feynman diagrams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Feynman Schematic (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-border/60 pb-3 text-xs font-mono">
              <span className="text-cyan-300 font-semibold uppercase">
                Møller Scattering: e⁻ + e⁻ → e⁻ + e⁻
              </span>
              <span className="text-slate-400">
                Tree-Level Virtual Photon Exchange (&gamma;)
              </span>
            </div>

            {/* SVG Feynman Diagram */}
            <div className="w-full h-[340px] bg-navy-950 rounded-control border border-navy-border flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full max-w-[500px]" viewBox="0 0 500 340">
                {/* Incoming Electrons */}
                <line x1="80" y1="60" x2="200" y2="120" stroke="#38BDF8" strokeWidth="3" />
                <polygon points="140,86 150,92 138,98" fill="#38BDF8" />
                <text x="60" y="55" fill="#E2E8F0" fontSize="13" fontFamily="monospace">e⁻ (p₁)</text>

                <line x1="80" y1="280" x2="200" y2="220" stroke="#38BDF8" strokeWidth="3" />
                <polygon points="140,254 150,248 138,242" fill="#38BDF8" />
                <text x="60" y="295" fill="#E2E8F0" fontSize="13" fontFamily="monospace">e⁻ (p₂)</text>

                {/* Virtual Photon Propagator (Wavy line) */}
                <path
                  d="M 200,120 Q 208,135 200,150 T 200,180 T 200,210 T 200,220"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeDasharray="4,2"
                />
                <text x="215" y="175" fill="#F59E0B" fontSize="13" fontFamily="monospace">
                  Virtual &gamma; (q)
                </text>

                {/* Interaction Vertices */}
                <circle cx="200" cy="120" r="5" fill="#00E5FF" />
                <text x="180" y="105" fill="#00E5FF" fontSize="11" fontFamily="monospace">-ie&gamma;^&mu;</text>

                <circle cx="200" cy="220" r="5" fill="#00E5FF" />
                <text x="180" y="245" fill="#00E5FF" fontSize="11" fontFamily="monospace">-ie&gamma;^&nu;</text>

                {/* Outgoing Electrons */}
                <line x1="200" y1="120" x2="380" y2="60" stroke="#38BDF8" strokeWidth="3" />
                <polygon points="290,94 300,88 288,82" fill="#38BDF8" />
                <text x="390" y="55" fill="#E2E8F0" fontSize="13" fontFamily="monospace">e⁻ (p₃)</text>

                <line x1="200" y1="220" x2="380" y2="280" stroke="#38BDF8" strokeWidth="3" />
                <polygon points="290,246 300,252 288,258" fill="#38BDF8" />
                <text x="390" y="295" fill="#E2E8F0" fontSize="13" fontFamily="monospace">e⁻ (p₄)</text>

                {/* Time Axis Arrow */}
                <line x1="60" y1="320" x2="440" y2="320" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <polygon points="440,320 432,316 432,324" fill="rgba(255,255,255,0.4)" />
                <text x="230" y="335" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">
                  Time &rarr;
                </text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Vertex Coupling: e = &radic;(4&pi;&alpha;)</span>
              <span className="text-cyan-light font-bold">Fine Structure Constant &alpha; &asymp; 1/137</span>
            </div>
          </div>
        </div>

        {/* Right Column: Rigorous Conceptual Explanation (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 shadow-subtle">
            <h3 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
              Scattering Amplitude Integral
            </h3>
            <KatexMath math="i\mathcal{M} = (-ie)^2 \left[\bar{u}(p_3)\gamma^\mu u(p_1)\right] \frac{-i g_{\mu\nu}}{q^2 + i\epsilon} \left[\bar{u}(p_4)\gamma^\nu u(p_2)\right]" block />
            <p className="text-xs text-slate-400">
              The invariant matrix element M squared yields the cross section d&sigma;/d&Omega;.
            </p>
          </div>

          <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-panel flex flex-col gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>What Feynman Diagrams Are — and Are Not</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Not a Spacetime Trajectory:</strong> A Feynman diagram is a graphical term in an asymptotic perturbation series (Dyson expansion of the S-matrix), NOT an actual video camera recording of physical paths.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-navy-border/40">
              <strong>Virtual Particles:</strong> Virtual particles are mathematical propagators inside internal lines of loop integrals; they do not exist as on-shell observable particles hitting detectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

