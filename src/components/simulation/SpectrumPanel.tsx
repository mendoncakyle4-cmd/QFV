import React from 'react';
import { extractSpectralPeaks, SpectralPeak } from '../../physics/fourier/spectrum';
import { SpatialMode } from '../../types/physics';

interface SpectrumPanelProps {
  modes: SpatialMode[];
  mass: number;
  c_sim: number;
  onSelectMode?: (modeId: string) => void;
  onToggleMode?: (modeId: string) => void;
  className?: string;
}

export const SpectrumPanel: React.FC<SpectrumPanelProps> = ({
  modes,
  mass,
  c_sim,
  onSelectMode,
  onToggleMode,
  className = '',
}) => {
  const peaks = extractSpectralPeaks(modes, mass, c_sim);
  const activeCount = peaks.filter((p) => p.isActive).length;
  const maxK = 6.0;

  return (
    <div className={`p-4 bg-navy-900/90 border border-navy-border rounded-control flex flex-col gap-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">
            Spatial Frequency Spectrum (Fourier Decomposition)
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Active Fourier Modes: {activeCount} / {modes.length}
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-navy-950 px-2 py-0.5 rounded border border-navy-border">
          k-Space &rarr; &omega; Dispersion
        </span>
      </div>

      {/* SVG Spectrum Graph */}
      <div className="relative w-full h-32 bg-navy-950 border border-navy-border rounded-control overflow-hidden flex flex-col justify-end p-2">
        {/* Y Axis Grid Lines */}
        <div className="absolute inset-x-2 top-2 border-b border-navy-border/40 text-[9px] font-mono text-slate-400">
          Max Power A<sup>2</sup> = 1.0
        </div>
        <div className="absolute inset-x-2 top-1/2 border-b border-navy-border/40 text-[9px] font-mono text-slate-400">
          0.5
        </div>

        {/* Mode Peak Bars */}
        <div className="relative w-full h-24 flex items-end">
          {peaks.map((peak, idx) => {
            // Position x by kTotal / maxK (percentage across width)
            const leftPct = Math.min(92, Math.max(8, (peak.kTotal / maxK) * 100));
            const heightPct = Math.min(95, Math.max(10, peak.spectralWeight * 90));

            return (
              <div
                key={peak.id}
                onClick={() => {
                  if (onToggleMode) onToggleMode(peak.id);
                  if (onSelectMode) onSelectMode(peak.id);
                }}
                style={{ left: `${leftPct}%`, height: `${heightPct}%` }}
                title={`${peak.label} | Power: ${peak.spectralWeight.toFixed(2)} | Click to toggle`}
                className={`absolute bottom-0 -translate-x-1/2 w-4 cursor-pointer transition-all flex flex-col items-center justify-start group ${
                  peak.isActive ? 'bg-cyan-500/80 hover:bg-cyan-400' : 'bg-slate-700/50 hover:bg-slate-600'
                } rounded-t`}
              >
                {/* Peak Tip Indicator */}
                <span className="w-2 h-2 -mt-1 rounded-full bg-cyan-200 group-hover:scale-125 transition-transform shadow" />
                <span className="text-[9px] font-mono font-bold text-navy-950 mt-1 select-none">
                  {idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* X-Axis labels */}
        <div className="w-full flex justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-navy-border">
          <span>k = 0</span>
          <span>k = 2.0 rad/u</span>
          <span>k = 4.0 rad/u</span>
          <span>k = 6.0 rad/u</span>
        </div>
      </div>

      {/* Discrete Readout Table */}
      <div className="space-y-1.5">
        {peaks.map((p, idx) => (
          <div
            key={p.id}
            onClick={() => onToggleMode && onToggleMode(p.id)}
            className={`p-2 rounded border text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
              p.isActive
                ? 'bg-navy-850/80 border-cyan-500/40 text-slate-200'
                : 'bg-navy-950/40 border-navy-border text-slate-400 line-through'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-cyan-400' : 'bg-slate-600'}`} />
              <span className="font-semibold text-cyan-light">Mode {idx + 1}:</span>
              <span>k = {p.kTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>&lambda; = {p.wavelength.toFixed(2)} u</span>
              <span>&omega; = {p.omega.toFixed(2)} rad/t</span>
              <span className="text-cyan-light font-bold">A = {p.amplitude.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 leading-tight">
        Click any peak or row to toggle and isolate that Fourier component. Notice how each spatial wave number k maps deterministically to wavelength &lambda; = 2&pi;/k and frequency &omega; = &radic;(c<sup>2</sup>k<sup>2</sup> + m<sup>2</sup>).
      </p>
    </div>
  );
};

