import React from 'react';
import { PerspectiveSource } from '../../types/perspectives';
import { X, BookOpen, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface SourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: PerspectiveSource[];
  activeSourceId?: string;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  isOpen,
  onClose,
  sources,
  activeSourceId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-navy-900 border-l border-navy-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-navy-border flex items-center justify-between bg-navy-950/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Primary Sources & Editorial Ledger</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {sources.map((src) => {
            const isHighlighted = activeSourceId === src.id;
            return (
              <div
                key={src.id}
                className={`p-4 rounded-panel border text-xs flex flex-col gap-2.5 transition-colors ${
                  isHighlighted
                    ? 'bg-navy-850 border-cyan-500/50 shadow-sm'
                    : 'bg-navy-950 border-navy-border'
                }`}
              >
                {/* Type Badge & Date */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-navy-800 text-cyan-300 border border-navy-border">
                    {src.sourceType.replace('-', ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {src.date}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100 leading-snug">
                  {src.title}
                </h4>

                {src.author && (
                  <div className="text-slate-300 font-medium">
                    Author / Tradition: <span className="text-slate-200">{src.author}</span>
                  </div>
                )}

                {src.section && (
                  <div className="font-mono text-[11px] text-slate-400">
                    Section: <span className="text-cyan-light">{src.section}</span>
                  </div>
                )}

                {src.translator && (
                  <div className="text-[11px] text-slate-300 bg-navy-900 p-2 rounded border border-navy-border/60">
                    <span className="text-slate-400 block mb-0.5">Translation & Edition:</span>
                    {src.translator}
                  </div>
                )}

                {/* Supports */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block mb-1">
                    Claims Supported:
                  </span>
                  <ul className="space-y-1">
                    {src.supports.map((sup, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{sup}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {src.notes && (
                  <p className="text-[11px] text-amber-300/90 bg-amber-950/20 p-2 rounded border border-amber-500/30">
                    {src.notes}
                  </p>
                )}

                {/* Audit & External Link */}
                <div className="flex items-center justify-between pt-2 border-t border-navy-border/60 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Reviewed: {src.reviewedAt}</span>
                  </div>
                  {src.url.startsWith('http') && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      <span>Digital Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

