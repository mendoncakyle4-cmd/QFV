import React from 'react';
import { PerspectiveItem } from '../../types/perspectives';
import { ArrowRight, Clock, BookOpen, Layers } from 'lucide-react';

interface PerspectiveCardProps {
  perspective: PerspectiveItem;
  onSelect: (slug: string) => void;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({ perspective, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(perspective.slug)}
      className="p-6 bg-navy-900/60 hover:bg-navy-900 border border-navy-border hover:border-cyan-500/50 rounded-panel transition-all flex flex-col justify-between shadow-subtle cursor-pointer group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs font-mono mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase bg-navy-950 border border-navy-border text-cyan-300">
            {perspective.categoryLabel}
          </span>
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>{perspective.estimatedMinutes} min</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-light transition-colors mb-1">
          {perspective.title}
        </h3>

        <div className="text-[11px] font-mono text-slate-400 mb-2">
          {perspective.keyFigureOrTradition} &middot; {perspective.historicalPeriod}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {perspective.summary}
        </p>

        {/* Core Question Callout */}
        <div className="p-2.5 bg-navy-950 rounded-control border border-navy-border/60 text-[11px] font-mono text-slate-300 mb-4">
          <span className="text-cyan-400 font-semibold block mb-0.5">Core Question:</span>
          &ldquo;{perspective.coreQuestion}&rdquo;
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-3 border-t border-navy-border/60 flex items-center justify-between text-xs">
        <span className="text-[10px] font-mono text-slate-400">
          {perspective.evidenceBadge}
        </span>
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
          <span>Enter Perspective</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

