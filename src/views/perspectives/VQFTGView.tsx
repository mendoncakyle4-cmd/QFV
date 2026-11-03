import React, { useState } from 'react';
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
  Layers, 
  Compass, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ChevronRight,
  GitBranch
} from 'lucide-react';

export const VQFTGView: React.FC = () => {
  const { navigate } = useNavigationStore();
  const perspective = PERSPECTIVES_LIST.find((p) => p.slug === 'vqftg') || PERSPECTIVES_LIST[7];

  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [isPlayingCycle, setIsPlayingCycle] = useState(false);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  // Layer-specific conceptual parameters
  const [vortexAspect, setVortexAspect] = useState(1.4);
  const [disturbanceMag, setDisturbanceMag] = useState(0.8);
  const [latencyFactor, setLatencyFactor] = useState(1.0);
  const [vfgPhase, setVfgPhase] = useState<'expansion' | 'contraction' | 'correction'>('expansion');

  const layers = [
    {
      id: 'substrate',
      title: 'Layer 1 — Prakṛiti: The Substrate',
      tagline: 'Isotropic pressurized continuum',
      explanation: 'In VQFTG, Prakṛiti is hypothesized as an underlying hyper-dense, inviscid medium under uniform ambient pressure. The visual is an illustrative conceptual rendering of that postulate.',
      statusNote: 'Hypothesized base medium (untested ontology).',
    },
    {
      id: 'vortex',
      title: 'Layer 2 — Matter as Toroidal Vortex',
      tagline: 'Fluid rotation in the substrate',
      explanation: 'Elementary matter is proposed as stable toroidal fluid vortex structures in the substrate. Rotating fluid rings create localized low-pressure cores.',
      statusNote: 'Proposed fluid-matter hypothesis; not standard quantum wave mechanics.',
    },
    {
      id: 'gravity',
      title: 'Layer 3 — Gravity as Pressure Restoration',
      tagline: 'Inward restoration flow (suction)',
      explanation: 'Instead of spacetime curvature (GR) or graviton exchange (QFT), VQFTG proposes gravity as an inward pressure-restoration flow of the medium rushing toward the vortex disturbance.',
      statusNote: 'Alternative mechanism; requires field equations and observational tests.',
    },
    {
      id: 'lattice',
      title: 'Layer 4 — Discrete 54-Node Lattice',
      tagline: 'Topological state network & ledgers',
      explanation: 'Underlying the medium is a discrete 54-node network inspired by Śrī Yantra geometry. Each node contains a ledger recording state vectors and update history.',
      statusNote: 'Proposed computational geometry; distinct from traditional Śrī Vidyā sacred geometry.',
    },
    {
      id: 'time',
      title: 'Layer 5 — Time as Update Latency',
      tagline: 'Clock time as ordered succession of updates',
      explanation: 'Experienced time corresponds to the sequential rate of discrete lattice updates. Regions with slower update latency experience time dilation.',
      statusNote: 'Proposed discrete time model; must reproduce continuous relativistic invariants.',
    },
    {
      id: 'vfg',
      title: 'Layer 6 — Vital Flip Governor (VFG)',
      tagline: 'Expansion & contraction regulator',
      explanation: 'The VFG acts as a homeostatic controller balancing vortex circulation and lattice restoration, preventing runaway collapse or dissipation.',
      statusNote: 'Proposed cybernetic control loop in nature.',
    },
    {
      id: 'rahu-ketu',
      title: 'Layer 7 — Rahu–Ketu Phase Inversion',
      tagline: 'Periodic polarity reversal cycle',
      explanation: 'Inspired by traditional astronomical nodes, this mechanism applies phase inversions across lattice node ledgers during cyclic transitions.',
      statusNote: 'Symbolic inspiration and model rule; not established physics.',
    },
    {
      id: 'consciousness',
      title: 'Layer 8 — Consciousness as Audit Operator',
      tagline: 'Observation scanning and state pinning',
      explanation: 'Consciousness is assigned an active role as an audit operator that scans node addresses, pins coordinates, and registers states.',
      statusNote: 'Philosophical hypothesis; not established quantum measurement consensus.',
    },
    {
      id: 'cycle',
      title: 'Layer 9 & 10 — Complete Self-Correcting Cycle',
      tagline: '10-step cosmic feedback loop',
      explanation: 'The complete proposed universe: Substrate -> Vortex disturbance -> Pressure restoration -> Lattice transition -> Node update -> VFG regulation -> Rahu-Ketu inversion -> Audit observation -> Next state.',
      statusNote: 'Complete proposed architecture map.',
    },
  ];

  const activeLayer = layers[activeLayerIndex];

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
      {/* Persistent Disclaimer Bar (Non-Negotiable Addendum A Rule) */}
      <div className="w-full bg-rose-950/80 border border-rose-500/50 rounded-panel p-3 px-4 flex items-center justify-between text-xs text-rose-200 shadow-subtle">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Editorial Status:</strong> Proposed Contemporary Framework &middot; Not an established, peer-reviewed, or experimentally verified physical theory.
          </span>
        </div>
        <button
          onClick={() => setIsSourceDrawerOpen(true)}
          className="text-[11px] font-mono text-cyan-300 hover:text-white underline shrink-0 ml-2"
        >
          View Model Specification &rarr;
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-rose-950 border border-rose-500/40 text-[10px] font-mono text-rose-300 rounded font-semibold uppercase">
              Contemporary Proposed Framework
            </span>
            <span className="text-xs font-mono text-slate-400">
              Cosmos as a Self-Correcting Lattice
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
            VQFTG: The Pressure-Restoration Cosmos
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Explore a proposed universe in which matter, gravity, time, information, and consciousness are coupled layers of one pressure-restoration system.
          </p>
        </div>

        <button
          onClick={() => setIsSourceDrawerOpen(true)}
          className="px-3.5 py-1.5 bg-navy-900 hover:bg-navy-850 text-slate-200 border border-navy-border hover:border-cyan-500/40 rounded-control text-xs font-mono flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Source & Methodology</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Layer-by-Layer Interactive Architecture (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Layer Stepper Bar */}
          <div className="flex items-center gap-1 bg-navy-900 p-1 border border-navy-border rounded-panel overflow-x-auto text-xs font-mono">
            {layers.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setActiveLayerIndex(i)}
                className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                  activeLayerIndex === i
                    ? 'bg-rose-950 border border-rose-500/50 text-rose-200 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
                }`}
              >
                {i + 1}. {l.title.split('—')[1]?.trim() || l.title}
              </button>
            ))}
          </div>

          {/* Interactive Layer Visual Display */}
          <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col justify-between min-h-[420px] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-navy-border/60 pb-3 text-xs font-mono">
              <span className="text-rose-400 font-bold uppercase">
                {activeLayer.title}
              </span>
              <span className="text-slate-400">
                {activeLayer.tagline}
              </span>
            </div>

            {/* Central Schematic Diagram & Systems Visual */}
            <div className="my-auto py-6 flex flex-col items-center justify-center text-center gap-4">
              {/* Dynamic SVG / Canvas Representation */}
              <div className="w-full max-w-[460px] h-52 bg-navy-950 rounded-control border border-navy-border p-4 flex items-center justify-center relative overflow-hidden">
                {activeLayerIndex === 0 && (
                  /* Substrate: Uniform pressurized fluid grid */
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div className="w-48 h-32 border border-cyan-500/30 rounded bg-cyan-950/20 flex items-center justify-center text-cyan-300 font-mono text-xs">
                      Uniform Isotropic Prakṛiti Medium
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">P_ambient = Const &middot; Inviscid Substrate</span>
                  </div>
                )}

                {activeLayerIndex === 1 && (
                  /* Toroidal Vortex */
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-36 h-24 border-2 border-rose-400 rounded-full flex items-center justify-center animate-spin-slow">
                      <div className="w-16 h-10 border border-cyan-400 rounded-full" />
                    </div>
                    <span className="text-[10px] font-mono text-rose-300">Toroidal Matter Vortex (Circulation Aspect: {vortexAspect.toFixed(1)})</span>
                  </div>
                )}

                {activeLayerIndex === 2 && (
                  /* Gravity as Inward Restoration */
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-40 h-28 border border-navy-border rounded flex items-center justify-center bg-navy-900/60">
                      {/* Inward arrows */}
                      <span className="text-rose-400 font-bold">&darr; &rarr; INWARD RESTORATION &larr; &uarr;</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300">Pressure Gradient Suction &Delta;P = {disturbanceMag.toFixed(2)}</span>
                  </div>
                )}

                {activeLayerIndex === 3 && (
                  /* 54-Node Lattice & Śrī Yantra Overlay */
                  <div className="flex flex-col items-center gap-2">
                    <div className="grid grid-cols-6 gap-2 p-2 bg-navy-900 rounded border border-cyan-500/30">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <div key={i} className="w-3.5 h-3.5 rounded-full bg-cyan-400/80 flex items-center justify-center text-[8px] font-mono text-navy-950 font-bold">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300">54-Node Computational Network & Ledgers</span>
                  </div>
                )}

                {activeLayerIndex >= 4 && (
                  /* Systems Feedback Loop */
                  <div className="flex flex-col items-center gap-2 font-mono text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-navy-800 rounded border border-navy-border">State Update</span>
                      <span>&rarr;</span>
                      <span className="px-2 py-1 bg-navy-800 rounded border border-rose-500/40 text-rose-300">VFG Regulation</span>
                      <span>&rarr;</span>
                      <span className="px-2 py-1 bg-navy-800 rounded border border-cyan-500/40 text-cyan-300">Audit Observer</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Complete Self-Correcting Feedback Cycle</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-200 max-w-lg leading-relaxed">
                {activeLayer.explanation}
              </p>
            </div>

            {/* Bottom Status & Assumptions */}
            <div className="pt-3 border-t border-navy-border/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-rose-300">{activeLayer.statusNote}</span>
              <span>Interpretive Conceptual Model</span>
            </div>
          </div>

          {/* Conceptual Controls */}
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-semibold uppercase text-cyan-300">Illustrative Model Controls</span>
              <span className="text-[11px] text-slate-400">(Conceptual sliders; not empirical calibration)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ParameterControl
                label="Disturbance Magnitude"
                value={disturbanceMag}
                min={0.1}
                max={2.0}
                step={0.1}
                defaultValue={0.8}
                onChange={(v) => setDisturbanceMag(v)}
              />
              <ParameterControl
                label="Toroid Aspect Ratio"
                value={vortexAspect}
                min={0.8}
                max={2.5}
                step={0.1}
                defaultValue={1.4}
                onChange={(v) => setVortexAspect(v)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Falsifiability Panel & Three-Layer Rule (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ThreeLayerPanel perspective={perspective} />

          {/* Prominent Falsifiability & Empirical Benchmark Panel (Mandatory Section A.7) */}
          <div className="p-5 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 text-xs text-slate-300 shadow-subtle">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs text-cyan-300 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>What Would This Model Need to Explain?</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              To be evaluated as a scientific theory, any proposed gravitational or cosmic model must derive quantitative predictions that match established precision measurements:
            </p>
            <ul className="space-y-1.5 text-[11px] font-mono text-slate-300 bg-navy-950 p-3 rounded-control border border-navy-border/60">
              <li>&bull; <strong>Gravitational Redshift:</strong> NASA Gravity Probe A confirmed GR predictions to 7 &times; 10⁻⁵.</li>
              <li>&bull; <strong>Time Dilation:</strong> Verified daily by atomic clocks aboard GPS constellation satellites.</li>
              <li>&bull; <strong>Gravitational Lensing:</strong> Light bending around galaxies and galaxy clusters (Hubble, JWST).</li>
              <li>&bull; <strong>Gravitational Waves:</strong> GW150914 quadrupole waveform matched GR to millisecond precision (LIGO/Virgo).</li>
              <li>&bull; <strong>Equivalence Principle:</strong> MICROSCOPE mission tested free-fall acceleration equivalence to 10⁻¹⁵.</li>
            </ul>
            <div className="p-2.5 bg-navy-950/80 rounded border border-navy-border/60 text-[11px] text-slate-400">
              <strong>Evaluation Status:</strong> Quantitative derivations for these benchmarks have not yet been published by the contributor for VQFTG.
            </div>
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

