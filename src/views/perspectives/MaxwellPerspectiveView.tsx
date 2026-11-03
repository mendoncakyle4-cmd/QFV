import React, { useState, useRef, useEffect } from 'react';
import { PERSPECTIVES_LIST } from '../../data/perspectivesData';
import { ThreeLayerPanel } from '../../components/perspectives/ThreeLayerPanel';
import { SourceDrawer } from '../../components/perspectives/SourceDrawer';
import { ParameterControl } from '../../components/ui/ParameterControl';
import { useNavigationStore } from '../../state/useNavigationStore';
import { ArrowLeft, BookOpen, RotateCcw, Activity } from 'lucide-react';

export const MaxwellPerspectiveView: React.FC = () => {
  const { navigate } = useNavigationStore();
  const perspective = PERSPECTIVES_LIST.find((p) => p.slug === 'maxwell') || PERSPECTIVES_LIST[3];

  const [wavelength, setWavelength] = useState(2.0);
  const [showEField, setShowEField] = useState(true);
  const [showBField, setShowBField] = useState(true);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render transverse electromagnetic wave: E in vertical plane, B in horizontal plane
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId: number;
    let t = 0;

    const render = () => {
      reqId = requestAnimationFrame(render);
      t += 0.05;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Central axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, h / 2);
      ctx.lineTo(w - 30, h / 2);
      ctx.stroke();

      const k = (2 * Math.PI) / (wavelength * 40);
      const amp = 65;

      // Draw Electric Field E (Cyan vertical arrows)
      if (showEField) {
        ctx.strokeStyle = '#00E5FF';
        ctx.fillStyle = '#00E5FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 40; x < w - 40; x += 16) {
          const eVal = Math.sin(k * x - t) * amp;
          ctx.moveTo(x, h / 2);
          ctx.lineTo(x, h / 2 - eVal);
        }
        ctx.stroke();
      }

      // Draw Magnetic Field B (Violet horizontal/isometric perspective arrows)
      if (showBField) {
        ctx.strokeStyle = '#A78BFA';
        ctx.fillStyle = '#A78BFA';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 40; x < w - 40; x += 16) {
          const bVal = Math.sin(k * x - t) * (amp * 0.7);
          // 45-degree isometric projection for horizontal plane
          ctx.moveTo(x, h / 2);
          ctx.lineTo(x + bVal * 0.5, h / 2 + bVal * 0.35);
        }
        ctx.stroke();
      }
    };

    reqId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(reqId);
  }, [wavelength, showEField, showBField]);

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
              <span className="px-2 py-0.5 bg-indigo-950 border border-indigo-500/40 text-[10px] font-mono text-indigo-300 rounded font-semibold uppercase">
                Classical Mathematical Physics
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                1873 Treatise on Electricity & Magnetism
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
              <span className="text-indigo-300 font-semibold uppercase">
                Coupled Wave: &nabla; &times; E = -&part;B/&part;t &middot; &nabla; &times; B = &mu;₀&epsilon;₀ &part;E/&part;t
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEField(!showEField)}
                  className={`px-2 py-0.5 rounded border text-[10px] ${showEField ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' : 'bg-navy-950 text-slate-500'}`}
                >
                  E-Field (Vertical)
                </button>
                <button
                  onClick={() => setShowBField(!showBField)}
                  className={`px-2 py-0.5 rounded border text-[10px] ${showBField ? 'bg-violet-950 text-violet-300 border-violet-500/40' : 'bg-navy-950 text-slate-500'}`}
                >
                  B-Field (Horizontal)
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={640}
              height={300}
              className="w-full h-[300px] bg-navy-950 rounded-control border border-navy-border"
            />

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-cyan-light font-bold">Electric Field E &perp; Magnetic Field B &perp; Propagation Vector k</span>
              <span>Propagation Speed c = 1 / &radic;(&mu;₀&epsilon;₀)</span>
            </div>

            <div className="pt-2 border-t border-navy-border/60">
              <ParameterControl
                label="Wavelength (&lambda;)"
                value={wavelength}
                min={1.0}
                max={4.0}
                step={0.1}
                unit="units"
                defaultValue={2.0}
                description="Dictates spatial periodicity and oscillation frequency f = c / lambda"
                onChange={(val) => setWavelength(val)}
              />
            </div>
          </div>
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

