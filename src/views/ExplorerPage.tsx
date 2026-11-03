import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '../state/useSimulationStore';
import { useNavigationStore } from '../state/useNavigationStore';
import { FieldScene } from '../rendering/canvas3d/FieldScene';
import { FallbackCanvas2D } from '../rendering/canvas3d/FallbackCanvas2D';
import { PRESETS } from '../data/presets';
import { calculateDispersion } from '../physics/core/dispersion';
import { ParameterControl } from '../components/ui/ParameterControl';
import { Tabs } from '../components/ui/Tabs';
import { WhatAmISeeingPanel } from '../components/simulation/WhatAmISeeingPanel';
import { ModelAssumptionsPanel } from '../components/simulation/ModelAssumptionsPanel';
import { SaveDialog } from '../components/dialogs/SaveDialog';
import { ShareDialog } from '../components/dialogs/ShareDialog';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Eye, 
  BookOpen, 
  Share2, 
  Bookmark, 
  Sparkles, 
  Check, 
  X, 
  Compass, 
  HelpCircle,
  Activity,
  Layers
} from 'lucide-react';
import { DisplayMode, PresetId } from '../types/physics';

export const ExplorerPage: React.FC = () => {
  const {
    modelId,
    presetId,
    parameters,
    displayMode,
    colormap,
    use2DFallback,
    sharedNotice,
    setPreset,
    updateParameter,
    setDisplayMode,
    setColormap,
    togglePlayPause,
    resetToPreset,
    resetAll,
    setSharedNotice,
    loadStateFromPayload,
  } = useSimulationStore();

  const { navigate } = useNavigationStore();
  const [activeTab, setActiveTab] = useState<'controls' | 'seeing' | 'equations'>('controls');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  // Check URL query for shared state (?s=...) on mount
  useEffect(() => {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?s=');
    if (queryIndex !== -1) {
      const encoded = hash.substring(queryIndex + 3);
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
        loadStateFromPayload(decoded, 'You are viewing a shared reproducible experiment.');
      } catch (err) {
        console.warn('Failed to parse shared state from URL:', err);
      }
    }
  }, [loadStateFromPayload]);

  // Keyboard shortcut: Spacebar toggles Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  const { wavelength, omega, frequency } = calculateDispersion(
    parameters.k,
    parameters.mass,
    parameters.c_sim
  );

  const presetList: { id: PresetId; name: string }[] = [
    { id: 'single-mode', name: 'Single Mode' },
    { id: 'two-mode', name: 'Two-Mode Interference' },
    { id: 'wave-packet', name: 'Localised Wave Packet' },
    { id: 'standing-wave', name: 'Standing Wave' },
    { id: 'ground-state', name: 'Ground-State (Vacuum)' },
  ];

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-66px)] bg-navy-950 overflow-hidden">
      {/* Shared Experiment Notice Banner */}
      {sharedNotice && (
        <div className="w-full bg-cyan-950/90 border-b border-cyan-500/40 px-4 py-2 flex items-center justify-between text-xs text-cyan-200 z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{sharedNotice}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetAll()}
              className="px-2 py-0.5 bg-navy-900 border border-cyan-500/30 rounded text-[11px] text-slate-200 hover:text-white"
            >
              Reset to Defaults
            </button>
            <button
              onClick={() => setSharedNotice(null)}
              className="p-1 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Column Workspace */}
      <div className="flex flex-1 overflow-hidden p-2 sm:p-3 gap-3">
        {/* LEFT RAIL (240px desktop) */}
        <aside className="hidden lg:flex flex-col w-60 bg-navy-900/70 border border-navy-border rounded-panel p-3.5 overflow-y-auto gap-4 shrink-0 shadow-subtle">
          {/* Header & Status */}
          <div className="pb-3 border-b border-navy-border">
            <div className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase mb-1">
              Field Explorer
            </div>
            <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Free Scalar Field</span>
            </div>
            <button
              onClick={() => navigate('/fields')}
              className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors mt-1 block"
            >
              Change model in Field Library &rarr;
            </button>
          </div>

          {/* Preset Configurations */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Presets
            </label>
            {presetList.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-control text-xs font-medium transition-all ${
                  presetId === p.id
                    ? 'bg-navy-800 text-cyan-light border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Display Mode Selection */}
          <div className="space-y-1.5 pt-2 border-t border-navy-border/60">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Representation
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['surface', 'wireframe', 'contours', 'slice-2d'] as DisplayMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDisplayMode(mode)}
                  className={`py-1.5 px-2 rounded text-[11px] font-mono uppercase text-center transition-colors ${
                    displayMode === mode
                      ? 'bg-navy-800 text-cyan-light border border-cyan-500/40'
                      : 'bg-navy-950/60 text-slate-400 hover:text-slate-200 border border-navy-border'
                  }`}
                >
                  {mode.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Guided Experiments Link */}
          <div className="mt-auto pt-3 border-t border-navy-border/60">
            <button
              onClick={() => navigate('/experiments')}
              className="w-full p-2.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 rounded-control text-xs text-cyan-300 font-medium flex items-center justify-between transition-colors"
            >
              <span>Guided Experiments</span>
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* CENTER SIMULATION CANVAS */}
        <main className="flex-1 flex flex-col rounded-panel border border-navy-border bg-navy-950 overflow-hidden relative shadow-2xl">
          {/* Live 3D WebGL or 2D Fallback */}
          <div className="flex-1 w-full h-full relative">
            {use2DFallback ? (
              <FallbackCanvas2D
                preset={presetId}
                params={parameters}
                colormap={colormap}
                isPaused={parameters.isPaused}
                className="w-full h-full"
              />
            ) : (
              <FieldScene
                preset={presetId}
                params={parameters}
                displayMode={displayMode}
                colormap={colormap}
                isPaused={parameters.isPaused}
                onOpenWhatAmISeeing={() => setActiveTab('seeing')}
                className="w-full h-full"
              />
            )}
          </div>

          {/* BOTTOM TRANSPORT & READOUT STRIP */}
          <div className="h-14 bg-navy-900/90 backdrop-blur border-t border-navy-border px-3 sm:px-4 flex items-center justify-between gap-3 text-xs z-10">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                title={parameters.isPaused ? 'Resume time evolution (Space)' : 'Pause simulation (Space)'}
                className="p-2 bg-navy-800 hover:bg-navy-700 text-cyan-light rounded-control border border-navy-border transition-colors flex items-center gap-1.5"
              >
                {parameters.isPaused ? <Play className="w-4 h-4 fill-cyan-400" /> : <Pause className="w-4 h-4 fill-cyan-400" />}
                <span className="font-mono text-[11px] hidden sm:inline">
                  {parameters.isPaused ? 'PLAY' : 'PAUSE'}
                </span>
              </button>

              <button
                onClick={() => resetToPreset()}
                title="Reset experiment parameters"
                className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-control border border-navy-border transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Live Parameter Numerical Readouts */}
            <div className="hidden md:flex items-center gap-4 font-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">k:</span>
                <span className="text-cyan-light font-bold tabular-nums">{parameters.k.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400">rad/u</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">&lambda;:</span>
                <span className="text-cyan-light font-bold tabular-nums">{wavelength.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400">u</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">&omega;:</span>
                <span className="text-cyan-light font-bold tabular-nums">{omega.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400">rad/t</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">f:</span>
                <span className="text-cyan-light font-bold tabular-nums">{frequency.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400">cyc/t</span>
              </div>
            </div>

            {/* Right: Save / Share / Mobile Controls Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaveOpen(true)}
                title="Save to My Lab"
                className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-control border border-navy-border transition-colors hidden sm:flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="text-[11px]">Save</span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                title="Share Experiment"
                className="p-2 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-control border border-navy-border transition-colors flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] hidden sm:inline">Share</span>
              </button>

              {/* Mobile Controls Trigger */}
              <button
                onClick={() => setMobileSheetOpen(true)}
                className="lg:hidden px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-control flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Controls</span>
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT INSPECTOR (320px desktop) */}
        <aside className="hidden lg:flex flex-col w-80 bg-navy-900/70 border border-navy-border rounded-panel overflow-hidden shrink-0 shadow-subtle">
          {/* Inspector Tab Bar */}
          <div className="p-2.5 border-b border-navy-border bg-navy-950/60">
            <Tabs
              activeTab={activeTab}
              onChange={(tab) => setActiveTab(tab as any)}
              tabs={[
                { id: 'controls', label: 'Controls', icon: <Sliders className="w-3.5 h-3.5" /> },
                { id: 'seeing', label: 'Overview', icon: <Eye className="w-3.5 h-3.5" /> },
                { id: 'equations', label: 'Physics', icon: <BookOpen className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          {/* Inspector Content Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {activeTab === 'controls' && (
              <div className="space-y-3">
                <ParameterControl
                  label="Wave Number (k)"
                  value={parameters.k}
                  min={0.2}
                  max={6.0}
                  step={0.05}
                  unit="rad/u"
                  defaultValue={1.5}
                  description="Dictates spatial wavelength lambda = 2*pi / k"
                  onChange={(val) => updateParameter('k', val)}
                  onReset={() => updateParameter('k', 1.5)}
                />

                <ParameterControl
                  label="Field Amplitude (A)"
                  value={parameters.amplitude}
                  min={0.0}
                  max={2.0}
                  step={0.05}
                  unit="sim units"
                  defaultValue={0.8}
                  description="Vertical field magnitude"
                  onChange={(val) => updateParameter('amplitude', val)}
                  onReset={() => updateParameter('amplitude', 0.8)}
                />

                <ParameterControl
                  label="Field Mass (m)"
                  value={parameters.mass}
                  min={0.0}
                  max={3.0}
                  step={0.1}
                  unit="mass"
                  defaultValue={0.0}
                  description="Relativistic mass: omega = sqrt(c^2*k^2 + m^2)"
                  onChange={(val) => updateParameter('mass', val)}
                  onReset={() => updateParameter('mass', 0.0)}
                />

                <ParameterControl
                  label="Phase Offset (phi)"
                  value={parameters.phase}
                  min={0.0}
                  max={Math.PI * 2}
                  step={0.1}
                  unit="rad"
                  defaultValue={0.0}
                  description="Spatial / temporal phase shift"
                  onChange={(val) => updateParameter('phase', val)}
                  onReset={() => updateParameter('phase', 0.0)}
                />

                <ParameterControl
                  label="Simulation Speed"
                  value={parameters.timeScale}
                  min={0.1}
                  max={3.0}
                  step={0.1}
                  unit="x"
                  defaultValue={1.0}
                  description="Animation playback speed"
                  onChange={(val) => updateParameter('timeScale', val)}
                  onReset={() => updateParameter('timeScale', 1.0)}
                />
              </div>
            )}

            {activeTab === 'seeing' && (
              <WhatAmISeeingPanel
                modelId={modelId}
                presetId={presetId}
                displayMode={displayMode}
                colormap={colormap}
                onColormapChange={setColormap}
              />
            )}

            {activeTab === 'equations' && (
              <ModelAssumptionsPanel params={parameters} />
            )}
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM SHEET FOR CONTROLS */}
      {mobileSheetOpen && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-navy-950/95 border-t border-navy-border rounded-t-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-navy-border pb-2.5 mb-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Experiment Controls</span>
            </h3>
            <button
              onClick={() => setMobileSheetOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <ParameterControl
              label="Wave Number (k)"
              value={parameters.k}
              min={0.2}
              max={6.0}
              step={0.05}
              unit="rad/u"
              onChange={(val) => updateParameter('k', val)}
            />
            <ParameterControl
              label="Amplitude (A)"
              value={parameters.amplitude}
              min={0.0}
              max={2.0}
              step={0.05}
              onChange={(val) => updateParameter('amplitude', val)}
            />
            <ParameterControl
              label="Mass (m)"
              value={parameters.mass}
              min={0.0}
              max={3.0}
              step={0.1}
              onChange={(val) => updateParameter('mass', val)}
            />
          </div>
        </div>
      )}

      {/* Save & Share Modals */}
      <SaveDialog isOpen={isSaveOpen} onClose={() => setIsSaveOpen(false)} />
      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
};

