import React, { useState } from 'react';
import { PerspectiveItem } from '../../types/perspectives';
import { BookOpen, Sparkles, Scale, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ThreeLayerPanelProps {
  perspective: PerspectiveItem;
  className?: string;
}

export const ThreeLayerPanel: React.FC<ThreeLayerPanelProps> = ({
  perspective,
  className = '',
}) => {
  const [activeLayer, setActiveLayer] = useState<'A' | 'B' | 'C'>('A');
  const { layerA, layerB, layerC } = perspective.threeLayerRule;

  return (
    <div className={`p-5 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-subtle ${className}`}>
      {/* Header & Layer Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-border pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
            Integrity Framework
          </span>
          <h3 className="text-sm font-bold text-slate-100">The Three-Layer Disclosure</h3>
        </div>

        <div className="flex items-center gap-1 bg-navy-950 p-1 border border-navy-border rounded-control text-xs font-mono">
          <button
            onClick={() => setActiveLayer('A')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'A' ? 'bg-navy-800 text-cyan-light border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Layer A: Source
          </button>
          <button
            onClick={() => setActiveLayer('B')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'B' ? 'bg-navy-800 text-cyan-light border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Layer B: Visual
          </button>
          <button
            onClick={() => setActiveLayer('C')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'C' ? 'bg-navy-800 text-cyan-light border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Layer C: Science
          </button>
        </div>
      </div>

      {/* Layer Content */}
      <div className="text-xs text-slate-300 leading-relaxed space-y-3">
        {activeLayer === 'A' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
              <BookOpen className="w-4 h-4" />
              <span>{layerA.heading}</span>
            </div>
            <div className="p-3 bg-navy-950 rounded-control border border-navy-border/60 font-serif italic text-slate-200">
              &ldquo;{layerA.sourceText}&rdquo;
            </div>
            <p className="text-slate-400">
              <strong className="text-slate-300">Historical & Textual Context:</strong> {layerA.context}
            </p>
          </div>
        )}

        {activeLayer === 'B' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-violet-light font-semibold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>{layerB.heading}</span>
            </div>
            <p className="text-slate-200">
              {layerB.visualMetaphor}
            </p>
            <div className="p-2.5 bg-navy-950 rounded border border-navy-border/60 text-[11px] text-slate-400">
              <strong className="text-slate-300 block mb-0.5">What the Visual Controls Change:</strong>
              {layerB.whatControlsChange}
            </div>
          </div>
        )}

        {activeLayer === 'C' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Scale className="w-4 h-4" />
              <span>{layerC.heading}</span>
            </div>
            <p className="text-slate-200">
              {layerC.scientificComparison}
            </p>
            <div className="p-2.5 bg-amber-950/20 rounded border border-amber-500/30 text-[11px] text-slate-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-400 block mb-0.5">What is NOT Equivalent:</strong>
                <span>{layerC.whatIsNotEquivalent}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

