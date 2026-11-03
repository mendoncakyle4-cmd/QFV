import React from 'react';
import { ColormapId } from '../../types/physics';
import { COLORMAPS } from '../../rendering/palettes/colormaps';

interface LegendProps {
  colormap: ColormapId;
  onColormapChange?: (id: ColormapId) => void;
  maxAmplitude?: number;
  className?: string;
}

export const Legend: React.FC<LegendProps> = ({
  colormap,
  onColormapChange,
  maxAmplitude = 1.0,
  className = '',
}) => {
  const currentMap = COLORMAPS[colormap];

  return (
    <div className={`p-3 bg-navy-900/80 border border-navy-border rounded-control flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-300">Colour Encoding Legend</span>
        <span className="text-[10px] font-mono text-cyan-300 bg-navy-950 px-1.5 py-0.5 rounded border border-navy-border">
          {currentMap.scientificLabel}
        </span>
      </div>

      {/* Gradient Bar */}
      <div className="flex flex-col gap-1">
        <div
          className="w-full h-3 rounded-full border border-white/10 shadow-inner"
          style={{ background: currentMap.sampleGradient }}
        />
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>-{(maxAmplitude).toFixed(1)}</span>
          <span className="text-slate-400">0.0 (Node)</span>
          <span>+{(maxAmplitude).toFixed(1)}</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-tight">
        {currentMap.description}
      </p>

      {/* Colormap Selectors */}
      {onColormapChange && (
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-navy-border/60">
          {(Object.keys(COLORMAPS) as ColormapId[]).map((id) => (
            <button
              key={id}
              onClick={() => onColormapChange(id)}
              className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                colormap === id
                  ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-950'
              }`}
            >
              {COLORMAPS[id].name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

