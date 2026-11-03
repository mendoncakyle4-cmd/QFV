import React from 'react';
import { HelpCircle, X, MousePointer, Keyboard, Eye } from 'lucide-react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-navy-900 border border-navy-border rounded-panel p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-navy-border pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-sm">Controls & Navigation Guide</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pointer & Camera Controls */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <MousePointer className="w-4 h-4" />
            <span>3D Camera Navigation</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 bg-navy-950 p-3 rounded-control border border-navy-border font-mono text-[11px]">
            <li className="flex justify-between">
              <span className="text-slate-400">Left Click + Drag:</span>
              <span>Rotate scene around center</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Scroll Wheel / Pinch:</span>
              <span>Zoom in / Zoom out</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Right Click + Drag / Shift+Drag:</span>
              <span>Pan horizontal coordinates</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Camera Reset Icon:</span>
              <span>Restore default camera perspective</span>
            </li>
          </ul>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Keyboard className="w-4 h-4" />
            <span>Keyboard Shortcuts</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 bg-navy-950 p-3 rounded-control border border-navy-border font-mono text-[11px]">
            <li className="flex justify-between">
              <span className="text-slate-400">Spacebar:</span>
              <span>Play / Pause time evolution</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Esc:</span>
              <span>Close modal dialogs</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Arrow Keys (on sliders):</span>
              <span>Fine-tune parameters incrementally</span>
            </li>
          </ul>
        </div>

        {/* Visual Notice */}
        <div className="p-2.5 bg-navy-950 border border-navy-border/60 rounded-control text-[11px] text-slate-400 flex items-start gap-2">
          <Eye className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            Every control immediately recalculates the underlying physics. If your device has limited GPU capability, click the <strong>2D MODE</strong> toggle in the top bar anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

