import React, { useState } from 'react';
import { useSimulationStore, SavedExperimentItem } from '../state/useSimulationStore';
import { useNavigationStore } from '../state/useNavigationStore';
import { Bookmark, Compass, Trash2, Share2, Play, Plus, ShieldCheck, Check } from 'lucide-react';

export const MyLabPage: React.FC = () => {
  const { savedExperiments, deleteSavedExperiment, loadStateFromPayload } = useSimulationStore();
  const { navigate } = useNavigationStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleLoad = (exp: SavedExperimentItem) => {
    loadStateFromPayload(exp.state, `Loaded saved experiment: ${exp.name}`);
    navigate('/explore');
  };

  const handleCopyLink = (exp: SavedExperimentItem) => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(exp.state)));
      const url = `${window.location.origin}${window.location.pathname}#/explore?s=${encoded}`;
      navigator.clipboard.writeText(url);
      setCopiedId(exp.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.warn('Copy link error:', err);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-8 max-w-7xl mx-auto w-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Personal Research Workspace
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mb-1">
            My Lab & Saved Experiments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Experiments you customize and save are persisted directly in your browser's private local storage. No account or login required.
          </p>
        </div>

        <button
          onClick={() => navigate('/explore')}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-control flex items-center gap-2 transition-colors shrink-0 shadow-instrument"
        >
          <Plus className="w-4 h-4" />
          <span>New Experiment</span>
        </button>
      </div>

      {/* Experiment List */}
      {savedExperiments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-navy-900/40 border border-navy-border rounded-panel text-center max-w-lg mx-auto gap-4">
          <div className="w-12 h-12 rounded-full bg-navy-800 border border-navy-border flex items-center justify-center text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-1">No Saved Experiments Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore a field configuration, tune its wave number or amplitude, and click &ldquo;Save to My Lab&rdquo; in the explorer to record it here.
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-cyan-light font-medium text-xs rounded-control border border-navy-border transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Open Field Explorer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedExperiments.map((exp) => (
            <div
              key={exp.id}
              className="p-5 bg-navy-900 border border-navy-border hover:border-cyan-500/40 rounded-panel transition-all flex flex-col justify-between gap-4 shadow-subtle group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <span>{exp.date}</span>
                  <span className="text-cyan-300 font-semibold">{exp.state.presetId || 'custom'}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-light transition-colors mb-2">
                  {exp.name}
                </h3>

                {/* Parameters Snapshot */}
                <div className="p-2.5 bg-navy-950 rounded-control border border-navy-border/60 text-xs font-mono grid grid-cols-2 gap-2 text-slate-300">
                  <div>k: <span className="text-cyan-light font-bold">{exp.state.parameters.k.toFixed(2)}</span></div>
                  <div>Amp: <span className="text-cyan-light font-bold">{exp.state.parameters.amplitude.toFixed(2)}</span></div>
                  <div>Mass: <span className="text-cyan-light font-bold">{exp.state.parameters.mass.toFixed(2)}</span></div>
                  <div>Mode: <span className="text-slate-300">{exp.state.displayMode}</span></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-navy-border/60 text-xs">
                <button
                  onClick={() => handleLoad(exp)}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Load</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyLink(exp)}
                    title="Copy share link"
                    className="p-1.5 text-slate-400 hover:text-cyan-300 bg-navy-950 border border-navy-border rounded transition-colors"
                  >
                    {copiedId === exp.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteSavedExperiment(exp.id)}
                    title="Delete saved experiment"
                    className="p-1.5 text-slate-400 hover:text-red-400 bg-navy-950 border border-navy-border rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trust & Privacy Notice */}
      <div className="p-4 bg-navy-900/40 border border-navy-border rounded-panel flex items-center gap-3 text-xs text-slate-400 max-w-2xl">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p>
          Data Privacy: Your saved experiments stay 100% in your local browser storage. We do not transmit your experiment data or personal identifying information to any remote servers.
        </p>
      </div>
    </div>
  );
};

