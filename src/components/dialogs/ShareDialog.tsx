import React, { useState } from 'react';
import { useSimulationStore } from '../../state/useSimulationStore';
import { Copy, Check, X, Share2, Globe, Shield } from 'lucide-react';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose }) => {
  const { serializeState, modelId, presetId } = useSimulationStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encoded = serializeState();
  const shareUrl = `${window.location.origin}${window.location.pathname}#/explore?s=${encoded}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-navy-900 border border-navy-border rounded-panel p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-border pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Share Reproducible Experiment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Experiment Snapshot Summary */}
        <div className="p-3 bg-navy-950 border border-navy-border rounded-control text-xs font-mono text-slate-300 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Model:</span>
            <span className="text-cyan-light font-semibold">{modelId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Configuration:</span>
            <span className="text-slate-200">{presetId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Schema Version:</span>
            <span className="text-slate-200">1.0 (reproducible)</span>
          </div>
        </div>

        {/* URL Box */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-300 font-medium">Unique Experiment Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3 py-2 bg-navy-950 border border-navy-border rounded-control font-mono text-xs text-slate-300 select-all focus:border-cyan-500/50"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-xs rounded-control flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Trust & Reproducibility Notice */}
        <div className="flex items-start gap-2 p-2.5 bg-navy-950/60 rounded-control border border-navy-border/60 text-[11px] text-slate-400">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            This link embeds the exact parameter configuration in the URL. Anyone opening it will see your exact model state without needing to sign up or create an account.
          </p>
        </div>
      </div>
    </div>
  );
};

