import React from 'react';
import { ColormapId, DisplayMode, FieldModelId, PresetId } from '../../types/physics';
import { Legend } from './Legend';
import { useNavigationStore } from '../../state/useNavigationStore';
import { Info, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface WhatAmISeeingPanelProps {
  modelId: FieldModelId;
  presetId: PresetId;
  displayMode: DisplayMode;
  colormap: ColormapId;
  onColormapChange?: (id: ColormapId) => void;
  className?: string;
}

export const WhatAmISeeingPanel: React.FC<WhatAmISeeingPanelProps> = ({
  modelId,
  presetId,
  displayMode,
  colormap,
  onColormapChange,
  className = '',
}) => {
  const { navigate } = useNavigationStore();

  return (
    <div className={`flex flex-col gap-4 text-xs ${className}`}>
      {/* 1. Plain English Headline */}
      <div className="p-3 bg-navy-900/90 border border-navy-border rounded-control">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
          <Info className="w-4 h-4" />
          <span>In Plain English</span>
        </div>
        <p className="text-slate-200 leading-relaxed">
          You are looking at a mathematical representation of a <strong className="text-cyan-light">free scalar field</strong> configuration across a 2D spatial coordinate plane.
        </p>
      </div>

      {/* 2. "This Visual Encodes..." */}
      <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-control">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>This visual encodes</span>
        </div>
        <ul className="space-y-1 text-slate-300 list-disc list-inside">
          <li><strong>Vertical displacement (Y-axis):</strong> The real scalar field amplitude &phi;(x, z, t).</li>
          <li><strong>Colour gradient:</strong> False-colour mapping of local field amplitude (cyan for positive, violet for negative).</li>
          <li><strong>Wave crest spacing:</strong> Spatial wavelength &lambda; = 2&pi; / k.</li>
          <li><strong>Oscillation tempo:</strong> Temporal angular frequency &omega; = &radic;(c<sup>2</sup>k<sup>2</sup> + m<sup>2</sup>).</li>
        </ul>
      </div>

      {/* 3. "This Does NOT Mean..." */}
      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-control">
        <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1.5">
          <AlertCircle className="w-4 h-4" />
          <span>This does NOT mean</span>
        </div>
        <ul className="space-y-1 text-slate-300 list-disc list-inside">
          <li>This is not a photograph or physical snapshot of empty space.</li>
          <li>Quantum fields do not possess intrinsic optical colour, gloss, or texture.</li>
          <li>Particles are not solid balls riding along this surface. Particles are discrete quantum excitations of the field modes itself.</li>
        </ul>
      </div>

      {/* 4. Color Legend */}
      <Legend colormap={colormap} onColormapChange={onColormapChange} />

      {/* 5. Deep Dive CTA */}
      <button
        onClick={() => navigate('/science')}
        className="w-full flex items-center justify-between p-2.5 bg-navy-900 hover:bg-navy-850 border border-navy-border rounded-control text-slate-200 hover:text-cyan-light transition-all"
      >
        <span className="font-medium">Read Full Equations, Derivations & Assumptions</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

