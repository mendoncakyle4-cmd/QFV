import React, { useState } from 'react';
import { PERSPECTIVES_LIST } from '../../data/perspectivesData';
import { ThreeLayerPanel } from '../../components/perspectives/ThreeLayerPanel';
import { SourceDrawer } from '../../components/perspectives/SourceDrawer';
import { ParameterControl } from '../../components/ui/ParameterControl';
import { useNavigationStore } from '../../state/useNavigationStore';
import { ArrowLeft, BookOpen, Compass, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

export const FaradayPerspectiveView: React.FC = () => {
  const { navigate } = useNavigationStore();
  const perspective = PERSPECTIVES_LIST.find((p) => p.slug === 'faraday') || PERSPECTIVES_LIST[2];

  const [magnetPosX, setMagnetPosX] = useState(0); // relative displacement
  const [coilTurns, setCoilTurns] = useState(10);
  const [fieldLineDensity, setFieldLineDensity] = useState(12);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  // Induced EMF ~ - N * dPhi/dt approximation
  const inducedEmf = Math.abs(magnetPosX) * (coilTurns / 10) * 0.45;

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
              <span className="px-2 py-0.5 bg-sky-950 border border-sky-500/40 text-[10px] font-mono text-sky-300 rounded font-semibold uppercase">
                Experimental Classical Physics
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                1831–1852 Experimental Researches
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
        {/* Left Column: Induction & Field Line Simulation (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-border/60 pb-3 text-xs font-mono">
              <span className="text-sky-300 font-semibold uppercase">
                Faraday Induction: &Epsilon; = -N (d&Phi;<sub>B</sub> / dt)
              </span>
              <span className="text-cyan-light font-bold">
                Induced EMF: {inducedEmf.toFixed(2)} V
              </span>
            </div>

            {/* SVG Interactive Magnet & Field Lines */}
            <div className="w-full h-[320px] bg-navy-950 rounded-control border border-navy-border flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full max-w-[540px]" viewBox="0 0 540 320">
                {/* Magnetic Field Lines */}
                {Array.from({ length: fieldLineDensity }).map((_, idx) => {
                  const rx = 80 + idx * 16;
                  const ry = 40 + idx * 12;
                  const centerX = 200 + magnetPosX * 20;
                  return (
                    <ellipse
                      key={idx}
                      cx={centerX}
                      cy={160}
                      rx={rx}
                      ry={ry}
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="1.2"
                      strokeDasharray="4,3"
                      opacity={0.65}
                    />
                  );
                })}

                {/* Bar Magnet */}
                <g transform={`translate(${140 + magnetPosX * 20}, 140)`}>
                  <rect x="0" y="0" width="60" height="40" fill="#EF4444" rx="4" />
                  <text x="25" y="25" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">N</text>
                  <rect x="60" y="0" width="60" height="40" fill="#3B82F6" rx="4" />
                  <text x="85" y="25" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="monospace">S</text>
                </g>

                {/* Conductive Coil Ring */}
                <g transform="translate(380, 110)">
                  <ellipse cx="20" cy="50" rx="15" ry="45" fill="none" stroke="#F59E0B" strokeWidth="4" />
                  <text x="-5" y="115" fill="#F59E0B" fontSize="11" fontFamily="monospace">
                    Coil ({coilTurns} turns)
                  </text>
                </g>
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Lines encode field direction & relative flux density</span>
              <span className="text-slate-300">Move slider to simulate moving magnet</span>
            </div>

            {/* Parameter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-navy-border/60">
              <ParameterControl
                label="Magnet Displacement"
                value={magnetPosX}
                min={-3}
                max={3}
                step={0.2}
                unit="units"
                defaultValue={0}
                description="Move relative to coil to induce EMF"
                onChange={(val) => setMagnetPosX(val)}
              />
              <ParameterControl
                label="Coil Turns (N)"
                value={coilTurns}
                min={5}
                max={30}
                step={1}
                defaultValue={10}
                onChange={(val) => setCoilTurns(val)}
              />
              <ParameterControl
                label="Line Density"
                value={fieldLineDensity}
                min={6}
                max={20}
                step={1}
                defaultValue={12}
                onChange={(val) => setFieldLineDensity(val)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Three-Layer Rule (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ThreeLayerPanel perspective={perspective} />
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

