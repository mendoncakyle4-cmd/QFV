import React from 'react';
import { useNavigationStore } from '../../state/useNavigationStore';
import { ShieldCheck, Info, FileText, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useNavigationStore();

  return (
    <footer className="w-full bg-navy-950 border-t border-navy-border pt-12 pb-16 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 mb-8">
        {/* Brand & Purpose */}
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              Quantum Field Explorer
            </span>
            <span className="px-2 py-0.5 bg-navy-800 text-[10px] font-mono text-cyan-300 rounded border border-navy-border">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            An interactive science platform developed to let curious minds explore mathematically rigorous visual representations of quantum field theory models. The interface may be beautiful; the physics remains explicit, reproducible, and honest.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Scientific Review Date: November 2026</span>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <h4 className="font-semibold text-slate-200 mb-2 uppercase tracking-wider text-[11px]">Exploration</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => navigate('/explore')} className="hover:text-cyan-300">Field Explorer</button></li>
              <li><button onClick={() => navigate('/experiments/frequency-lab')} className="hover:text-cyan-300">Frequency Lab</button></li>
              <li><button onClick={() => navigate('/experiments')} className="hover:text-cyan-300">Guided Experiments</button></li>
              <li><button onClick={() => navigate('/fields')} className="hover:text-cyan-300">Field Library</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2 uppercase tracking-wider text-[11px]">Special Modules</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => navigate('/states')} className="hover:text-cyan-300">Quantum States</button></li>
              <li><button onClick={() => navigate('/vacuum')} className="hover:text-cyan-300">Vacuum & Casimir</button></li>
              <li><button onClick={() => navigate('/interactions')} className="hover:text-cyan-300">Interactions</button></li>
              <li><button onClick={() => navigate('/lab')} className="hover:text-cyan-300">My Lab</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2 uppercase tracking-wider text-[11px]">Science & Trust</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => navigate('/science')} className="hover:text-cyan-300">Equations & Models</button></li>
              <li><button onClick={() => navigate('/science')} className="hover:text-cyan-300">Assumptions & Limits</button></li>
              <li><button onClick={() => navigate('/science')} className="hover:text-cyan-300">Source Bibliography</button></li>
              <li><button onClick={() => navigate('/science')} className="hover:text-cyan-300">Excluded Claims</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Non-negotiable Disclaimer Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-navy-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Scientific Notice: No quantum field has a literal optical color, visible surface, or texture. Renderings are visual encodings of mathematical quantities and states.
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Anonymous & Local-First (No tracking walls)</span>
          <span>&middot;</span>
          <span>WCAG 2.2 AA Accessible</span>
        </div>
      </div>
    </footer>
  );
};

