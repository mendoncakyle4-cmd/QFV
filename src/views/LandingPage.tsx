import React from 'react';
import { useNavigationStore } from '../state/useNavigationStore';
import { useSimulationStore } from '../state/useSimulationStore';
import { FieldScene } from '../rendering/canvas3d/FieldScene';
import { FallbackCanvas2D } from '../rendering/canvas3d/FallbackCanvas2D';
import { PRESETS } from '../data/presets';
import { GUIDED_EXPERIMENTS } from '../data/experimentsData';
import { 
  Compass, 
  Layers, 
  FlaskConical, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  BarChart3
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate } = useNavigationStore();
  const { use2DFallback } = useSimulationStore();
  const heroPreset = PRESETS['single-mode'];
  const featuredExp = GUIDED_EXPERIMENTS[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-full border-b border-navy-border/80 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 px-4 md:px-8 py-10 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column (42%) */}
          <div className="lg:col-span-5 flex flex-col gap-5 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-full max-w-fit">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-wider font-semibold text-cyan-300 uppercase">
                An Interactive Science Experience
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-[1.15]">
              Explore the fields <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-light">
                beneath the particles.
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Change the parameters of simple field models, explore their spatial modes, and see how mathematical representations help physicists describe the invisible structures of reality.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/explore')}
                className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-sm rounded-control flex items-center gap-2 transition-all shadow-instrument hover:shadow-active"
              >
                <Compass className="w-4 h-4" />
                <span>Enter the Field Explorer</span>
              </button>

              <button
                onClick={() => navigate('/experiments/frequency-lab')}
                className="px-4 py-3 bg-navy-900 hover:bg-navy-850 text-slate-200 border border-navy-border rounded-control font-medium text-sm flex items-center gap-2 transition-colors hover:border-cyan-500/40"
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Try Frequency Lab</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Scientific models, clearly labelled. No physics background required.</span>
            </div>
          </div>

          {/* Right Hero Interactive 3D Visual Preview (58%) */}
          <div className="lg:col-span-7 w-full h-[380px] sm:h-[440px] md:h-[480px] rounded-panel border border-navy-border overflow-hidden shadow-2xl relative bg-navy-950">
            {use2DFallback ? (
              <FallbackCanvas2D
                preset="single-mode"
                params={heroPreset.parameters}
                colormap="cyan-violet"
                isPaused={false}
                className="h-full"
              />
            ) : (
              <FieldScene
                preset="single-mode"
                params={heroPreset.parameters}
                displayMode="surface"
                colormap="cyan-violet"
                isPaused={false}
                onOpenWhatAmISeeing={() => navigate('/explore')}
                className="h-full"
              />
            )}
          </div>
        </div>
      </section>

      {/* SECTION: CHOOSE AN EXPLORATION */}
      <section className="w-full py-16 px-4 md:px-8 border-b border-navy-border/60 bg-navy-950">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Guided Pathways
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Choose your exploration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div 
              onClick={() => navigate('/explore')}
              className="p-6 bg-navy-900/60 hover:bg-navy-900 border border-navy-border hover:border-cyan-500/50 rounded-panel cursor-pointer transition-all flex flex-col justify-between group shadow-subtle"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-navy-800 border border-navy-border flex items-center justify-center text-cyan-400 mb-4 group-hover:border-cyan-400 transition-colors">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-cyan-light transition-colors">
                  Explore a Field
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Step into the 3D scalar field environment. Manipulate spatial wave numbers, amplitude, and mass in real-time.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-400">
                <span>Enter Explorer</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => navigate('/experiments/frequency-lab')}
              className="p-6 bg-navy-900/60 hover:bg-navy-900 border border-navy-border hover:border-cyan-500/50 rounded-panel cursor-pointer transition-all flex flex-col justify-between group shadow-subtle"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-navy-800 border border-navy-border flex items-center justify-center text-cyan-400 mb-4 group-hover:border-cyan-400 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-cyan-light transition-colors">
                  Change Its Modes
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Open the Frequency Lab. Decompose complex fields into Fourier spectrum peaks and observe interference fringes.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-400">
                <span>Open Frequency Lab</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => navigate('/experiments')}
              className="p-6 bg-navy-900/60 hover:bg-navy-900 border border-navy-border hover:border-cyan-500/50 rounded-panel cursor-pointer transition-all flex flex-col justify-between group shadow-subtle"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-navy-800 border border-navy-border flex items-center justify-center text-cyan-400 mb-4 group-hover:border-cyan-400 transition-colors">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-cyan-light transition-colors">
                  Follow an Experiment
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Curated 2 to 4 minute guided experiments designed to teach physical concepts step-by-step with zero fluff.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-400">
                <span>Browse Experiments</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WHAT THIS EXPERIENCE IS — AND IS NOT */}
      <section className="w-full py-16 px-4 md:px-8 bg-navy-900/30 border-b border-navy-border/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Scientific Integrity
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
              What this experience is — and is not
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Credibility matters. We never substitute pseudo-mystical visual noise for mathematical physics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What you can explore */}
            <div className="p-6 bg-emerald-950/15 border border-emerald-500/30 rounded-panel flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>What you can explore</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Mathematical Field Models:</strong> Direct evaluations of the relativistic Klein-Gordon equation and Fourier mode sums.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Explicit Visual Encodings:</strong> Every visual variable is named in a legend (amplitude, phase, coordinate scale).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Coupled Dispersion Relations:</strong> Spatial wave number k and temporal frequency &omega; obey relativistic physics.</span>
                </li>
              </ul>
            </div>

            {/* What you are not seeing */}
            <div className="p-6 bg-amber-950/15 border border-amber-500/30 rounded-panel flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>What you are not seeing</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>No Literal Photographs:</strong> Quantum fields do not have an optical colour, surface gloss, or human-visible texture.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>No Cartoon Particles:</strong> A particle is not a billiard ball bouncing on a rubber wave; it is a discrete quantum state excitation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>No Random Glitter:</strong> We never generate random noise and label it &ldquo;vacuum fluctuations&rdquo;.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: START WITH ONE EXPERIMENT */}
      <section className="w-full py-16 px-4 md:px-8 bg-navy-950">
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-navy-900 border border-navy-border rounded-panel flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex flex-col gap-2 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 rounded font-semibold uppercase">
                Featured Experiment
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{featuredExp.durationMinutes} Minutes</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              {featuredExp.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {featuredExp.subtitle}. Observe in real-time how increasing the wave number packs crests tighter together and shortens wavelength &lambda;.
            </p>
          </div>

          <button
            onClick={() => navigate('/experiments', featuredExp.slug)}
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-control flex items-center gap-2 transition-all shrink-0 shadow-instrument"
          >
            <span>Start Experiment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

