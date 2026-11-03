import React, { useState } from 'react';
import { PERSPECTIVES_LIST } from '../../data/perspectivesData';
import { PerspectiveCategory } from '../../types/perspectives';
import { PerspectiveCard } from '../../components/perspectives/PerspectiveCard';
import { PerspectiveScaleToCosmos } from '../../components/perspectives/PerspectiveScaleToCosmos';
import { useNavigationStore } from '../../state/useNavigationStore';
import { 
  Compass, 
  ArrowRight, 
  Scale, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PerspectivesLandingPage: React.FC = () => {
  const { navigate } = useNavigationStore();
  const [selectedCategory, setSelectedCategory] = useState<PerspectiveCategory | 'all'>('all');

  const filteredPerspectives = PERSPECTIVES_LIST.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleSelectPerspective = (slug: string) => {
    navigate('/perspectives', slug);
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      {/* HERO SECTION */}
      <section className="relative w-full border-b border-navy-border/80 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest font-semibold text-cyan-300 uppercase">
              A Visual Atlas of Ideas
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15]">
            One reality. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-light to-pink-400">
              Many ways of seeing it.
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
            From ancient questions about the origin of existence to the fields and spacetime geometries described by modern physics, explore how different minds and traditions have understood what lies beneath the visible world.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#collection-grid"
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-control flex items-center gap-2 transition-all shadow-instrument hover:shadow-active"
            >
              <Compass className="w-4 h-4" />
              <span>Explore the Perspectives</span>
            </a>

            <button
              onClick={() => navigate('/perspectives', 'compare')}
              className="px-5 py-3 bg-navy-900 hover:bg-navy-850 text-slate-200 border border-navy-border rounded-control font-medium text-xs flex items-center gap-2 transition-colors hover:border-cyan-500/40"
            >
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Compare Perspectives</span>
            </button>

            <button
              onClick={() => navigate('/perspectives', 'sources')}
              className="px-4 py-3 bg-navy-900/60 hover:bg-navy-850 text-slate-300 border border-navy-border rounded-control font-medium text-xs flex items-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Source Library</span>
            </button>
          </div>

          {/* MANDATORY INTRODUCTORY STATEMENT (Non-Negotiable Product Rule) */}
          <div className="w-full max-w-3xl mt-6 p-4 bg-navy-900/80 border border-cyan-500/30 rounded-panel text-left text-xs text-slate-300 leading-relaxed shadow-subtle flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-100 block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                Editorial Integrity & Scientific Guardrails
              </strong>
              <span>
                These perspectives are not interchangeable theories. Some are philosophical or textual inquiries; others are historical scientific models; modern quantum field theory is a mathematical framework tested through physics. This experience explores their ideas and visual interpretations while keeping those differences visible.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PERSPECTIVES COLLECTION GRID SECTION */}
      <section id="collection-grid" className="w-full py-16 px-4 md:px-8 bg-navy-950 border-b border-navy-border/60">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Header & Category Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">The Perspectives Collection</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a perspective to enter its custom interactive visual scene and primary source ledger.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-navy-900 p-1 border border-navy-border rounded-control">
              {[
                { id: 'all', label: 'All (8)' },
                { id: 'ancient-philosophy', label: 'Ancient Philosophy' },
                { id: 'classical-physics', label: 'Classical Physics' },
                { id: 'relativity', label: 'Relativity' },
                { id: 'quantum-interpretation', label: 'Quantum Interpretation' },
                { id: 'modern-physics', label: 'Modern Physics' },
                { id: 'proposed-framework', label: 'Proposed Framework' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedCategory(btn.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    selectedCategory === btn.id
                      ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerspectives.map((p) => (
              <PerspectiveCard
                key={p.slug}
                perspective={p}
                onSelect={handleSelectPerspective}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: HOW TO READ THIS PAGE (The Three-Layer Architecture) */}
      <section className="w-full py-16 px-4 md:px-8 bg-navy-900/40 border-b border-navy-border/60">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-1 block">
              Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              How to Read This Page
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Every perspective in this atlas is strictly structured across three transparent layers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Layer A */}
            <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                A
              </div>
              <h3 className="text-sm font-bold text-slate-100">1. The Source</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                What the original text, historical scientist, or theoretical framework actually states. Sourced from primary publications, authoritative translations, and verified manuscripts.
              </p>
            </div>

            {/* Layer B */}
            <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-800 border border-violet-500/40 flex items-center justify-center text-violet-light font-mono font-bold text-sm">
                B
              </div>
              <h3 className="text-sm font-bold text-slate-100">2. The Visual Interpretation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                How our design translates those ideas into interactive scenes, clearly distinguishing mathematical models from illustrative artistic metaphors.
              </p>
            </div>

            {/* Layer C */}
            <div className="p-6 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-800 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                C
              </div>
              <h3 className="text-sm font-bold text-slate-100">3. The Comparison</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Where meaningful conceptual overlap exists, where differences arise, and strictly what is <strong>not</strong> equivalent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ADDENDUM D: CROSS-PERSPECTIVE SCALE-TO-COSMOS VISUALISATION */}
      <PerspectiveScaleToCosmos initialPerspectiveSlug="quantum-field-theory" />
    </div>
  );
};

