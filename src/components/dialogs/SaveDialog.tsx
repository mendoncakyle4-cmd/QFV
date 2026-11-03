import React, { useState } from 'react';
import { useSimulationStore } from '../../state/useSimulationStore';
import { Bookmark, Check, X } from 'lucide-react';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({ isOpen, onClose }) => {
  const { saveCurrentToLab, presetId } = useSimulationStore();
  const [name, setName] = useState(`Experiment with ${presetId}`);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentToLab(name);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-navy-900 border border-navy-border rounded-panel p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-navy-border pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Save Experiment to My Lab</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Experiment Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High-frequency wave packet"
              className="w-full px-3 py-2 bg-navy-950 border border-navy-border rounded-control text-xs text-slate-200 focus:border-cyan-500/50"
            />
          </div>

          <p className="text-[11px] text-slate-400">
            Saved locally in your browser storage. You can review, reload, or export this experiment anytime from the My Lab tab.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saved}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-xs rounded-control flex items-center gap-1.5 transition-colors"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Saved!' : 'Save Experiment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

