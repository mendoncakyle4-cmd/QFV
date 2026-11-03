import React, { useState } from 'react';
import { PERSPECTIVES_LIST } from '../../data/perspectivesData';
import { ThreeLayerPanel } from '../../components/perspectives/ThreeLayerPanel';
import { SourceDrawer } from '../../components/perspectives/SourceDrawer';
import { ParameterControl } from '../../components/ui/ParameterControl';
import { useNavigationStore } from '../../state/useNavigationStore';
import { ArrowLeft, BookOpen, Compass, RotateCcw, Info, CheckCircle2 } from 'lucide-react';
import { KatexMath } from '../../components/ui/KatexMath';

export const EinsteinPerspectiveView: React.FC = () => {
  const { navigate } = useNavigationStore();
  const perspective = PERSPECTIVES_LIST.find((p) => p.slug === 'einstein') || PERSPECTIVES_LIST[4];

  const [mass, setMass] = useState(1.5);
  const [activeTab, setActiveTab] = useState<'curvature' | 'leiden-address'>('curvature');
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
              <span className="px-2 py-0.5 bg-purple-950 border border-purple-500/40 text-[10px] font-mono text-purple-300 rounded font-semibold uppercase">
                Relativity & Spacetime Geometry
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                1915 Field Equations & 1920 Leiden Address
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-0.5">
              {perspective.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-navy-900 p-1 border border-navy-border rounded-control text-xs font-mono">
            <button
              onClick={() => setActiveTab('curvature')}
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'curvature' ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'}`}
            >
              Curvature Model
            </button>
            <button
              onClick={() => setActiveTab('leiden-address')}
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'leiden-address' ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'}`}
            >
              1920 Ether Address
            </button>
          </div>

          <button
            onClick={() => setIsSourceDrawerOpen(true)}
            className="px-3 py-1.5 bg-navy-900 hover:bg-navy-850 text-slate-200 border border-navy-border hover:border-cyan-500/40 rounded-control text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sources</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {activeTab === 'curvature' ? (
            <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-navy-border/60 pb-3 text-xs font-mono">
                <span className="text-purple-300 font-semibold uppercase">
                  Einstein Field Equations: G<sub>&mu;&nu;</sub> + &Lambda;g<sub>&mu;&nu;</sub> = (8&pi;G / c⁴) T<sub>&mu;&nu;</sub>
                </span>
                <span className="text-cyan-light font-bold">
                  Deflection Angle &theta; &prop; 4GM / (c² R)
                </span>
              </div>

              {/* SVG Spacetime Metric Grid Distortion */}
              <div className="w-full h-[320px] bg-navy-950 rounded-control border border-navy-border flex items-center justify-center relative overflow-hidden">
                <svg className="w-full h-full max-w-[500px]" viewBox="0 0 500 320">
                  {/* Metric Coordinate Grid lines deflected toward center */}
                  {Array.from({ length: 11 }).map((_, i) => {
                    const y = 30 + i * 26;
                    const dCenter = Math.abs(y - 160);
                    const dip = (mass * 35) / (1 + dCenter * 0.04);
                    return (
                      <path
                        key={`h-${i}`}
                        d={`M 30,${y} Q 250,${y + dip} 470,${y}`}
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="1.2"
                        opacity={0.6}
                      />
                    );
                  })}

                  {/* Central Gravitating Mass */}
                  <circle cx="250" cy="160" r={mass * 12} fill="#38BDF8" opacity={0.85} />
                  <circle cx="250" cy="160" r={mass * 12 + 8} fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="250" y="164" fill="#0A0E17" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    M = {mass.toFixed(1)}
                  </text>

                  {/* Deflected Light Ray Geodesic */}
                  <path
                    d={`M 30,80 Q 250,${80 + mass * 25} 470,60`}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                  />
                  <text x="350" y="65" fill="#F59E0B" fontSize="10" fontFamily="monospace">
                    Light Geodesic Deflection
                  </text>
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Spacetime metric distortion g_munu</span>
                <span className="text-slate-300">Geodesics: straightest paths in curved 4D geometry</span>
              </div>

              <div className="pt-2 border-t border-navy-border/60">
                <ParameterControl
                  label="Central Mass (M)"
                  value={mass}
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  defaultValue={1.5}
                  description="Increases spacetime curvature and light deflection angle"
                  onChange={(val) => setMass(val)}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-2xl text-xs text-slate-200 leading-relaxed">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Einstein\'s 1920 Leiden Address Context</span>
              </h3>
              <p>
                In 1920 at the University of Leiden, Einstein delivered a lecture titled <em>&ldquo;Ether and the Theory of Relativity&rdquo;</em>, clarifying:
              </p>
              <blockquote className="p-3 bg-navy-950 rounded-control border border-navy-border/60 font-serif italic text-slate-100">
                &ldquo;Recapitulating, we may say that according to the general theory of relativity space is endowed with physical qualities; in this sense, therefore, there exists an ether... But this ether may not be thought of as endowed with the quality characteristic of ponderable media, as consisting of parts which may be tracked through time.&rdquo;
              </blockquote>
              <div className="p-3 bg-navy-950 rounded border border-navy-border/60 space-y-1.5 text-slate-300">
                <strong className="text-cyan-300 block">Crucial Historical Distinction:</strong>
                <p>
                  Einstein did not return to the mechanical 19th-century ether. Instead, he used the word &ldquo;ether&rdquo; poetically to signify that empty space is not an inert void, but a dynamic geometric entity possessing metric tensor fields (g_munu).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (35%) */}
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

