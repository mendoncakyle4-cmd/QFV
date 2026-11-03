import React, { useState } from 'react';
import { useSimulationStore } from '../state/useSimulationStore';
import { FieldScene } from '../rendering/canvas3d/FieldScene';
import { FallbackCanvas2D } from '../rendering/canvas3d/FallbackCanvas2D';
import { SpectrumPanel } from '../components/simulation/SpectrumPanel';
import { ParameterControl } from '../components/ui/ParameterControl';
import { calculateDispersion } from '../physics/core/dispersion';
import { KatexMath } from '../components/ui/KatexMath';
import { PresetId, SpatialMode } from '../types/physics';
import { BarChart3, Plus, Trash2, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

export const FrequencyLabPage: React.FC = () => {
  const {
    parameters,
    presetId,
    displayMode,
    colormap,
    use2DFallback,
    setPreset,
    updateParameter,
  } = useSimulationStore();

  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);

  // Manage multi-mode components
  const activeModes = parameters.modes.length > 0 ? parameters.modes : [
    { id: 'm1', kx: 1.2, kz: 0, amplitude: 0.8, phase: 0, isActive: true },
    { id: 'm2', kx: 2.2, kz: 0, amplitude: 0.5, phase: Math.PI / 4, isActive: true },
  ];

  const handleToggleMode = (id: string) => {
    const updated = activeModes.map((m) =>
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    updateParameter('modes', updated);
  };

  const handleAddMode = () => {
    if (activeModes.length >= 5) return;
    const newK = 1.0 + activeModes.length * 0.8;
    const newMode: SpatialMode = {
      id: `m${Date.now()}`,
      kx: newK,
      kz: 0,
      amplitude: 0.6,
      phase: 0,
      isActive: true,
    };
    updateParameter('modes', [...activeModes, newMode]);
  };

  const handleRemoveMode = (id: string) => {
    if (activeModes.length <= 1) return;
    const updated = activeModes.filter((m) => m.id !== id);
    updateParameter('modes', updated);
  };

  const handleUpdateModeAmplitude = (id: string, amp: number) => {
    const updated = activeModes.map((m) =>
      m.id === id ? { ...m, amplitude: amp } : m
    );
    updateParameter('modes', updated);
  };

  const handleUpdateModeK = (id: string, kVal: number) => {
    const updated = activeModes.map((m) =>
      m.id === id ? { ...m, kx: kVal } : m
    );
    updateParameter('modes', updated);
  };

  const { wavelength, omega, frequency } = calculateDispersion(
    parameters.k,
    parameters.mass,
    parameters.c_sim
  );

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
      {/* Intro Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 rounded font-semibold uppercase">
              Signature Lab
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Free Scalar Dispersion & Superposition
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Frequency & Mode Laboratory
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Investigate how spatial wave number k, wavelength &lambda;, and angular frequency &omega; interact through the relativistic dispersion relation &omega; = &radic;(c<sup>2</sup>k<sup>2</sup> + m<sup>2</sup>).
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="flex items-center gap-1.5 bg-navy-900 p-1 border border-navy-border rounded-control shrink-0">
          {[
            { id: 'single-mode', label: 'Single Mode' },
            { id: 'two-mode', label: 'Two Modes' },
            { id: 'wave-packet', label: 'Wave Packet' },
            { id: 'standing-wave', label: 'Standing' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPreset(item.id as PresetId)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                presetId === item.id
                  ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Lab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Simulation & Spectrum Panel (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Canvas Box */}
          <div className="w-full h-[400px] sm:h-[460px] rounded-panel border border-navy-border overflow-hidden shadow-2xl relative bg-navy-950">
            {use2DFallback ? (
              <FallbackCanvas2D
                preset={presetId}
                params={{ ...parameters, modes: activeModes }}
                colormap={colormap}
                isPaused={parameters.isPaused}
                className="h-full"
              />
            ) : (
              <FieldScene
                preset={presetId}
                params={{ ...parameters, modes: activeModes }}
                displayMode={displayMode}
                colormap={colormap}
                isPaused={parameters.isPaused}
                className="h-full"
              />
            )}
          </div>

          {/* Interactive Spectrum Panel below canvas */}
          <SpectrumPanel
            modes={activeModes}
            mass={parameters.mass}
            c_sim={parameters.c_sim}
            onSelectMode={(id) => setSelectedModeId(id)}
            onToggleMode={handleToggleMode}
          />
        </div>

        {/* Right Column: Controls, Dispersion Readouts & Equations (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Physical Dispersion Equations & Linked Readouts */}
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 shadow-subtle">
            <h3 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
              Exact Dispersion Relations
            </h3>
            <KatexMath math="\omega(k) = \sqrt{c_{\text{sim}}^2 k^2 + m^2}" block />
            <KatexMath math="\lambda = \frac{2\pi}{k}, \quad f = \frac{\omega}{2\pi}, \quad E = \hbar \omega" block />

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy-border/60 text-xs font-mono">
              <div className="p-2 bg-navy-950 rounded border border-navy-border/60">
                <span className="text-slate-400 text-[10px] block">Wavelength &lambda;</span>
                <span className="text-cyan-light font-bold text-sm tabular-nums">{wavelength.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 ml-1">length units</span>
              </div>
              <div className="p-2 bg-navy-950 rounded border border-navy-border/60">
                <span className="text-slate-400 text-[10px] block">Angular Freq &omega;</span>
                <span className="text-cyan-light font-bold text-sm tabular-nums">{omega.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 ml-1">rad / time unit</span>
              </div>
              <div className="p-2 bg-navy-950 rounded border border-navy-border/60">
                <span className="text-slate-400 text-[10px] block">Ordinary Freq f</span>
                <span className="text-cyan-light font-bold text-sm tabular-nums">{frequency.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 ml-1">cycles / time unit</span>
              </div>
              <div className="p-2 bg-navy-950 rounded border border-navy-border/60">
                <span className="text-slate-400 text-[10px] block">Energy E (&hbar;=1)</span>
                <span className="text-cyan-light font-bold text-sm tabular-nums">{omega.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 ml-1">energy units</span>
              </div>
            </div>
          </div>

          {/* Mode Configuration & Tuning */}
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 shadow-subtle">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
                Active Fourier Components
              </h3>
              <button
                onClick={handleAddMode}
                disabled={activeModes.length >= 5}
                className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono rounded flex items-center gap-1 transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Mode</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeModes.map((mode, index) => (
                <div key={mode.id} className="p-3 bg-navy-950 border border-navy-border rounded-control space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-cyan-light">
                      Mode {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleMode(mode.id)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          mode.isActive
                            ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                            : 'bg-navy-900 border-navy-border text-slate-400'
                        }`}
                      >
                        {mode.isActive ? 'ACTIVE' : 'MUTED'}
                      </button>
                      {activeModes.length > 1 && (
                        <button
                          onClick={() => handleRemoveMode(mode.id)}
                          className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <ParameterControl
                    label="Wave Number (k)"
                    value={mode.kx}
                    min={0.5}
                    max={5.0}
                    step={0.1}
                    unit="rad/u"
                    onChange={(val) => handleUpdateModeK(mode.id, val)}
                  />

                  <ParameterControl
                    label="Mode Amplitude (A)"
                    value={mode.amplitude}
                    min={0.0}
                    max={1.5}
                    step={0.05}
                    onChange={(val) => handleUpdateModeAmplitude(mode.id, val)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3 bg-navy-900/60 border border-navy-border rounded-panel text-xs text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              Note: Field frequency describes how rapidly a mode oscillates over time. It is not equivalent to optical visual color. Visual color here is an artificial false-color gradient chosen for mathematical legibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

