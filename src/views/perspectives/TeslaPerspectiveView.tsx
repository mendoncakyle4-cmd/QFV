import React, { useState, useRef, useEffect } from 'react';
import { PERSPECTIVES_LIST } from '../../data/perspectivesData';
import { ThreeLayerPanel } from '../../components/perspectives/ThreeLayerPanel';
import { SourceDrawer } from '../../components/perspectives/SourceDrawer';
import { ParameterControl } from '../../components/ui/ParameterControl';
import { useNavigationStore } from '../../state/useNavigationStore';
import { 
  ArrowLeft, 
  BookOpen, 
  Activity, 
  RotateCcw, 
  ShieldAlert, 
  Zap, 
  Info,
  Sliders
} from 'lucide-react';

export const TeslaPerspectiveView: React.FC = () => {
  const { navigate } = useNavigationStore();
  const perspective = PERSPECTIVES_LIST.find((p) => p.slug === 'tesla') || PERSPECTIVES_LIST[1];

  const [frequencyKhz, setFrequencyKhz] = useState(50); // kHz
  const [amplitudeVolts, setAmplitudeVolts] = useState(120);
  const [dampingFactor, setDampingFactor] = useState(0.2);
  const [coupling, setCoupling] = useState(0.7);
  const [activeTab, setActiveTab] = useState<'simulation' | 'ether-history'>('simulation');
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resonantFreq = 50.0; // natural frequency f0 = 50 kHz

  // Render AC Waveform and Resonant Response
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId: number;
    let t = 0;

    const render = () => {
      reqId = requestAnimationFrame(render);
      t += 0.04;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      for (let x = 0; x < w; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      ctx.stroke();

      // Calculate resonance gain: Q = 1 / damping
      // Gain = 1 / sqrt((1 - (f/f0)^2)^2 + (damping * f/f0)^2)
      const ratio = frequencyKhz / resonantFreq;
      const gain = 1 / Math.sqrt(Math.pow(1 - ratio * ratio, 2) + Math.pow(dampingFactor * ratio, 2));
      const peakAmp = Math.min(h / 2 - 10, amplitudeVolts * gain * 0.4);

      // Primary Waveform (Cyan)
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const angle = (x / w) * Math.PI * 8 * ratio - t * 4;
        const y = h / 2 - Math.sin(angle) * peakAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary Induced Waveform (Violet, phase shifted by coupling)
      ctx.strokeStyle = '#A78BFA';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const angle = (x / w) * Math.PI * 8 * ratio - t * 4 - Math.PI / 2;
        const y = h / 2 - Math.sin(angle) * (peakAmp * coupling);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    reqId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(reqId);
  }, [frequencyKhz, amplitudeVolts, dampingFactor, coupling]);

  // Gain calculation for readout
  const ratio = frequencyKhz / resonantFreq;
  const currentGain = 1 / Math.sqrt(Math.pow(1 - ratio * ratio, 2) + Math.pow(dampingFactor * ratio, 2));
  const isAtResonance = Math.abs(frequencyKhz - resonantFreq) < 2.0;

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
              <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 rounded font-semibold uppercase">
                Experimental Classical Physics
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Lectures of 1891 & 1892
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
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'simulation' ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'}`}
            >
              Resonance Simulation
            </button>
            <button
              onClick={() => setActiveTab('ether-history')}
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'ether-history' ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'}`}
            >
              Ether Context
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
        {/* Left Column: Interactive Resonator Canvas & Controls (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {activeTab === 'simulation' ? (
            <div className="p-5 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-navy-border/60 pb-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-100 font-semibold uppercase">
                    Coupled Resonant RLC Circuit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    isAtResonance ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-navy-950 text-slate-400'
                  }`}>
                    {isAtResonance ? 'RESONANCE PEAK' : `Gain: ${currentGain.toFixed(2)}x`}
                  </span>
                </div>
              </div>

              {/* Oscilloscope Canvas */}
              <canvas
                ref={canvasRef}
                width={640}
                height={280}
                className="w-full h-[280px] bg-navy-950 rounded-control border border-navy-border"
              />

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-cyan-light">
                  <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
                  <span>Primary Driving Coil</span>
                </span>
                <span className="flex items-center gap-1.5 text-violet-light">
                  <span className="w-3 h-0.5 bg-violet-400 inline-block border-dashed" />
                  <span>Secondary Resonant Pickup</span>
                </span>
                <span>Natural Resonance f₀ = 50.0 kHz</span>
              </div>

              {/* Real Parameter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-navy-border/60">
                <ParameterControl
                  label="Oscillator Frequency (f)"
                  value={frequencyKhz}
                  min={10}
                  max={90}
                  step={1}
                  unit="kHz"
                  defaultValue={50}
                  description="Tune close to 50 kHz for maximum electrical resonance"
                  onChange={(val) => setFrequencyKhz(val)}
                  onReset={() => setFrequencyKhz(50)}
                />

                <ParameterControl
                  label="Driving Voltage (V₀)"
                  value={amplitudeVolts}
                  min={20}
                  max={240}
                  step={5}
                  unit="V"
                  defaultValue={120}
                  onChange={(val) => setAmplitudeVolts(val)}
                />

                <ParameterControl
                  label="Circuit Damping (R)"
                  value={dampingFactor}
                  min={0.05}
                  max={0.8}
                  step={0.05}
                  defaultValue={0.2}
                  description="Lower damping produces a sharper, higher resonance peak"
                  onChange={(val) => setDampingFactor(val)}
                />

                <ParameterControl
                  label="Inductive Coupling (k)"
                  value={coupling}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  defaultValue={0.7}
                  description="Mutual inductance coupling between primary and secondary"
                  onChange={(val) => setCoupling(val)}
                />
              </div>
            </div>
          ) : (
            /* Historical Ether Chapter */
            <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-2xl text-xs text-slate-200 leading-relaxed">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Tesla & The Historical Ether Hypothesis</span>
              </h3>
              <p>
                In his 1891 lecture before the American Institute of Electrical Engineers, Tesla articulated his view of the universe:
              </p>
              <blockquote className="p-3 bg-navy-950 rounded-control border border-navy-border/60 font-serif italic text-slate-100">
                &ldquo;What is the mysterious thing which we call electricity?... We know that it acts like an incompressible fluid; that there must be a constant quantity of it in nature; that it can be neither produced nor destroyed; and, what is more important, that the electro-magnetic theory of light and the ether must be considered as established facts.&rdquo;
              </blockquote>
              <p>
                Tesla conceived of the ether as a physical mechanical medium under tremendous tension that carried electrical vibrations. This view was mainstream in the late 19th century (shared by Lord Kelvin, Oliver Lodge, and Heinrich Hertz).
              </p>
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-control text-slate-300">
                <strong className="text-amber-400 block mb-1">Critical Scientific Distinction:</strong>
                Tesla\'s ether hypothesis was formulated before the advent of Einstein\'s special relativity (1905) and quantum mechanics (1925). The modern quantum vacuum is <em>not</em> Tesla\'s mechanical ether, and Tesla never claimed to have extracted infinite energy from subatomic quantum fields.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Three-Layer Rule & Guardrails (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ThreeLayerPanel perspective={perspective} />

          {/* Non-Negotiable Myth-Busting Guardrail */}
          <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-panel text-xs text-slate-300 flex flex-col gap-2 shadow-subtle">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Debunking Internet Myths</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Popular social media posts often claim that Tesla invented "free energy" devices or discovered that the universe is made of "vibrational quantum fields". Tesla was a rigorous engineer who operated strictly under the laws of thermodynamics: power transmitted always equals power generated minus circuit losses.
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

