import React, { useState } from 'react';
import { FIELD_LIBRARY, FieldLibraryEntry } from '../data/fieldsData';
import { useNavigationStore } from '../state/useNavigationStore';
import { Layers, ArrowRight, ShieldCheck, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { KatexMath } from '../components/ui/KatexMath';

export const FieldLibraryPage: React.FC = () => {
  const { navigate } = useNavigationStore();
  const [filter, setFilter] = useState<'all' | 'available' | 'advanced'>('all');

  const filteredFields = FIELD_LIBRARY.filter((field) => {
    if (filter === 'available') return field.available;
    if (filter === 'advanced') return !field.available;
    return true;
  });

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-8 max-w-7xl mx-auto w-full gap-8">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-border pb-6">
        <div className="max-w-2xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1 block">
            Theoretical Overview
          </span>
          <h1 className="text-3xl font-extrabold text-slate-100 mb-2">
            Field Model Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Different physical fields require fundamentally different mathematical objects. We never force vector, spinor, or gauge theories onto an unsuitable scalar wave surface.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-navy-900 p-1 border border-navy-border rounded-control shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              filter === 'all'
                ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Fields ({FIELD_LIBRARY.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              filter === 'available'
                ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Available Now (1)
          </button>
          <button
            onClick={() => setFilter('advanced')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
              filter === 'advanced'
                ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Later / Advanced (4)
          </button>
        </div>
      </div>

      {/* Field Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.map((field) => (
          <div
            key={field.id}
            className={`p-6 bg-navy-900/60 border rounded-panel transition-all flex flex-col justify-between shadow-subtle ${
              field.available
                ? 'border-cyan-500/50 hover:bg-navy-900 hover:border-cyan-400'
                : 'border-navy-border hover:border-slate-700'
            }`}
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                    field.badge === 'AVAILABLE NOW'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                      : field.badge === 'LATER MODULE'
                      ? 'bg-navy-950 border-cyan-500/30 text-cyan-400'
                      : 'bg-navy-950 border-navy-border text-slate-400'
                  }`}
                >
                  {field.badge}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {field.type.split(' ')[0]}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-100 mb-1">
                {field.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {field.description}
              </p>

              {/* Mathematical Object */}
              <div className="p-3 bg-navy-950 rounded-control border border-navy-border mb-4 text-xs font-mono">
                <span className="text-[10px] text-cyan-300 block mb-1 font-semibold uppercase">
                  Mathematical Object:
                </span>
                <span className="text-slate-200">{field.mathematicalObject}</span>
                <div className="mt-2 pt-2 border-t border-navy-border/60">
                  <KatexMath math={field.governingEquation} block />
                </div>
              </div>

              {/* What Can Be Visualised */}
              <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>What Can Be Visualised</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                  {field.whatCanBeVisualised.slice(0, 2).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* What Is NOT Represented */}
              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>What Is NOT Represented</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                  {field.whatIsNotRepresented.slice(0, 2).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action */}
            {field.available ? (
              <button
                onClick={() => navigate('/explore')}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-control flex items-center justify-center gap-2 transition-colors shadow-instrument"
              >
                <span>Explore This Field</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-full py-2 bg-navy-950 text-slate-400 font-mono text-xs rounded-control text-center border border-navy-border/60">
                In Scientific Validation Pipeline
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

