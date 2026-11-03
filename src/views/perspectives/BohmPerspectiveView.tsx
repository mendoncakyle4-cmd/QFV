import React, { useState } from 'react';
import { PERSPECTIVES_LIST } from '../../data/perspectivesData';
import { ThreeLayerPanel } from '../../components/perspectives/ThreeLayerPanel';
import { SourceDrawer } from '../../components/perspectives/SourceDrawer';
import { ParameterControl } from '../../components/ui/ParameterControl';
import { useNavigationStore } from '../../state/useNavigationStore';
import { ArrowLeft, BookOpen, Sparkles, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

export const BohmPerspectiveView: React.FC = () => {
  const { navigate } = useNavigationStore();
  const perspective = PERSPECTIVES_LIST.find((p) => p.slug === 'bohm') || PERSPECTIVES_LIST[5];

  const [enfoldmentLevel, setEnfoldmentLevel] = useState(0.5); // visual metaphor slider
  const [patternDensity, setPatternDensity] = useState(8);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-navy-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/perspectives')}
            className="p-1.5 bg-navy-900 hover:bg-navy-850 text-slate-300 rounded border border-navy-border flex items-center gap-1.5 text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Perspectives</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-pink-950 border border-pink-500/40 text-[10px] font-mono text-pink-300 rounded font-semibold uppercase">
                Philosophical Proposal & Interpretation
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                1980 Wholeness & The Implicate Order
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-0.5">
              {perspective.title}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsSourceDrawerOpen(true)}
          className="px-3 py-1.5 bg-navy-900 hover:bg-navy-850 text-slate-200 border border-navy-border hover:border-cyan-500/40 rounded-control text-xs font-mono flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Source Notes</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-border/60 pb-3 text-xs font-mono">
              <span className="text-pink-300 font-semibold uppercase">
                Holomovement: Enfolded (Implicate) &rarr; Manifest (Explicate)
              </span>
              <span className="text-slate-400">
                Interpretive Visual Metaphor
              </span>
            </div>

            {/* SVG Holographic Interference / Enfoldment Metaphor */}
            <div className="w-full h-[320px] bg-navy-950 rounded-control border border-navy-border flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full max-w-[500px]" viewBox="0 0 500 320">
                {/* Concentric / Wave Interference Rings */}
                {Array.from({ length: patternDensity }).map((_, i) => {
                  const r = 25 + i * (160 / patternDensity);
                  const opacity = (1 - enfoldmentLevel * 0.7) * (0.8 - i * 0.04);
                  return (
                    <circle
                      key={i}
                      cx="250"
                      cy="160"
                      r={r}
                      fill="none"
                      stroke="#EC4899"
                      strokeWidth="1.5"
                      opacity={Math.max(0.1, opacity)}
                    />
                  );
                })}

                {/* Unfolded localized entity emerging based on (1 - enfoldmentLevel) */}
                <circle
                  cx="250"
                  cy="160"
                  r={30 * (1 - enfoldmentLevel) + 6}
                  fill="#00E5FF"
                  opacity={1 - enfoldmentLevel}
                />
                <text x="250" y="165" fill="#0A0E17" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  {enfoldmentLevel < 0.4 ? 'Explicate Form' : ''}
                </text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-pink-300">Enfolded Implicate Order (Holographic totality)</span>
              <span className="text-cyan-light font-bold">Unfolded Explicate Structure</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-navy-border/60">
              <ParameterControl
                label="Enfoldment Degree"
                value={enfoldmentLevel}
                min={0.0}
                max={1.0}
                step={0.05}
                defaultValue={0.5}
                description="Higher enfoldment diffuses manifest structure into the holomovement"
                onChange={(val) => setEnfoldmentLevel(val)}
              />
              <ParameterControl
                label="Interference Density"
                value={patternDensity}
                min={4}
                max={16}
                step={1}
                defaultValue={8}
                description="Controls density of holographic interference fringes"
                onChange={(val) => setPatternDensity(val)}
              />
            </div>
          </div>
        </div>

        {/* Right Column (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ThreeLayerPanel perspective={perspective} />

          {/* Technical Note on Pilot-Wave vs Implicate Order */}
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel text-xs text-slate-300 space-y-1.5">
            <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs text-cyan-300">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Bohmian Mechanics vs Implicate Order</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bohm developed two distinct frameworks: (1) <strong>de Broglie–Bohm mechanics (1952)</strong>, a mathematically rigorous deterministic pilot-wave formulation of quantum mechanics; and (2) <strong>The Implicate Order (1980)</strong>, a broader philosophical theory of unbroken wholeness.
            </p>
          </div>
        </div>
      </div>

      <SourceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
        sources={perspective.sources}
      />
    </div>
  );
};

