import React, { useState } from 'react';
import { useNavigationStore } from '../state/useNavigationStore';
import { useSimulationStore } from '../state/useSimulationStore';
import { GUIDED_EXPERIMENTS, GuidedExperiment } from '../data/experimentsData';
import { FieldScene } from '../rendering/canvas3d/FieldScene';
import { FallbackCanvas2D } from '../rendering/canvas3d/FallbackCanvas2D';
import { ParameterControl } from '../components/ui/ParameterControl';
import { 
  FlaskConical, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  X,
  Compass,
  ArrowLeft
} from 'lucide-react';

export const ExperimentsPage: React.FC = () => {
  const { activeExperimentSlug, navigate } = useNavigationStore();
  const {
    parameters,
    presetId,
    displayMode,
    colormap,
    use2DFallback,
    setPreset,
    updateParameter,
    resetToPreset,
  } = useSimulationStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // If a specific experiment slug is selected, show the active guided experience
  const activeExp = GUIDED_EXPERIMENTS.find((e) => e.slug === activeExperimentSlug);

  const startExperiment = (exp: GuidedExperiment) => {
    setPreset(exp.startingPreset);
    setCurrentStepIndex(0);
    navigate('/experiments', exp.slug);
  };

  const handleNextStep = () => {
    if (!activeExp) return;
    if (currentStepIndex < activeExp.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed: prompt next experiment
      if (activeExp.nextSuggestedSlug) {
        const next = GUIDED_EXPERIMENTS.find((e) => e.slug === activeExp.nextSuggestedSlug);
        if (next) startExperiment(next);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-6 max-w-7xl mx-auto w-full gap-8">
      {/* If Active Guided Experiment is Open */}
      {activeExp ? (
        <div className="flex flex-col gap-6">
          {/* Top Navigation Bar for Guided Experience */}
          <div className="flex items-center justify-between border-b border-navy-border pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/experiments')}
                className="p-1.5 bg-navy-900 hover:bg-navy-850 text-slate-300 rounded border border-navy-border flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Experiments</span>
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-100">{activeExp.title}</h2>
                <span className="text-xs font-mono text-cyan-300">{activeExp.concept}</span>
              </div>
            </div>

            {/* Step Progress Indicators */}
            <div className="flex items-center gap-1.5">
              {activeExp.steps.map((step, idx) => (
                <div
                  key={step.stepNumber}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold cursor-pointer transition-colors ${
                    idx === currentStepIndex
                      ? 'bg-cyan-500 text-navy-950 shadow-active'
                      : idx < currentStepIndex
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-navy-900 text-slate-400 border border-navy-border'
                  }`}
                >
                  {idx < currentStepIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.stepNumber}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Workspace: Simulation Canvas + Guided Step Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Simulation Canvas (60%) */}
            <div className="lg:col-span-7 h-[420px] sm:h-[480px] rounded-panel border border-navy-border overflow-hidden bg-navy-950 shadow-2xl relative">
              {use2DFallback ? (
                <FallbackCanvas2D
                  preset={presetId}
                  params={parameters}
                  colormap={colormap}
                  isPaused={parameters.isPaused}
                  className="h-full"
                />
              ) : (
                <FieldScene
                  preset={presetId}
                  params={parameters}
                  displayMode={displayMode}
                  colormap={colormap}
                  isPaused={parameters.isPaused}
                  className="h-full"
                />
              )}
            </div>

            {/* Guided Step Instruction & Interactive Controls (40%) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Step Instruction Card */}
              {(() => {
                const step = activeExp.steps[currentStepIndex];
                return (
                  <div className="p-5 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-4 shadow-subtle">
                    <div className="flex items-center justify-between border-b border-navy-border/60 pb-3">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        Step {step.stepNumber} of {activeExp.steps.length}
                      </span>
                      <button
                        onClick={() => resetToPreset(activeExp.startingPreset)}
                        title="Reset step parameters"
                        className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Step</span>
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-100 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>

                    {/* Highlighted Control Slider */}
                    <div className="p-3 bg-navy-950 rounded-control border border-cyan-500/30">
                      <ParameterControl
                        label="Wave Number (k)"
                        value={parameters.k}
                        min={0.2}
                        max={6.0}
                        step={0.1}
                        unit="rad/u"
                        onChange={(val) => updateParameter('k', val)}
                      />
                      <div className="mt-2">
                        <ParameterControl
                          label="Field Rest Mass (m)"
                          value={parameters.mass}
                          min={0.0}
                          max={3.0}
                          step={0.1}
                          onChange={(val) => updateParameter('mass', val)}
                        />
                      </div>
                    </div>

                    {/* What to Observe & Scientific Insight */}
                    <div className="p-3 bg-navy-950/80 rounded-control border border-navy-border/60 text-xs space-y-2">
                      <div>
                        <span className="font-semibold text-emerald-400 block mb-0.5">What to Observe:</span>
                        <p className="text-slate-300">{step.expectedObservation}</p>
                      </div>
                      <div className="pt-2 border-t border-navy-border/40">
                        <span className="font-semibold text-cyan-light block mb-0.5">Scientific Insight:</span>
                        <p className="text-slate-300 leading-relaxed">{step.scientificInsight}</p>
                      </div>
                    </div>

                    {/* Step Navigation Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handlePrevStep}
                        disabled={currentStepIndex === 0}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30"
                      >
                        &larr; Previous Step
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-control flex items-center gap-1.5 transition-colors shadow-instrument"
                      >
                        <span>{currentStepIndex === activeExp.steps.length - 1 ? 'Complete Experiment' : 'Next Step'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Takeaway Box */}
              <div className="p-4 bg-navy-900/40 border border-navy-border rounded-panel text-xs text-slate-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-100 block mb-0.5">Experiment Takeaway</span>
                  <p className="text-slate-400 leading-relaxed">{activeExp.takeaway}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Catalogue View */
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1 block">
              Curated Curriculum
            </span>
            <h1 className="text-3xl font-extrabold text-slate-100 mb-2">
              Guided Field Experiments
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Step-by-step interactive explorations designed to take you from core foundations to advanced quantum concepts in 2 to 4 minutes.
            </p>
          </div>

          {/* Grid of Experiments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDED_EXPERIMENTS.map((exp) => (
              <div
                key={exp.slug}
                className="p-6 bg-navy-900/60 hover:bg-navy-900 border border-navy-border hover:border-cyan-500/50 rounded-panel transition-all flex flex-col justify-between shadow-subtle group"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-3 text-xs font-mono">
                    <span className="px-2 py-0.5 bg-navy-950 border border-navy-border text-cyan-300 rounded font-medium">
                      {exp.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{exp.durationMinutes} min</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 mb-1.5 group-hover:text-cyan-light transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {exp.subtitle}
                  </p>

                  <div className="p-2.5 bg-navy-950 rounded-control border border-navy-border/60 text-[11px] font-mono text-slate-400 mb-4">
                    <strong className="text-slate-300 block mb-0.5">Concept:</strong>
                    {exp.concept}
                  </div>
                </div>

                <button
                  onClick={() => startExperiment(exp)}
                  className="w-full py-2.5 bg-navy-800 group-hover:bg-cyan-500 group-hover:text-navy-950 text-slate-200 font-semibold text-xs rounded-control flex items-center justify-center gap-2 transition-all border border-navy-border group-hover:border-transparent"
                >
                  <span>Start Experiment</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

