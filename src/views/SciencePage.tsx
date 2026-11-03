import React, { useState } from 'react';
import { SCIENCE_TOPICS, ScienceTopic } from '../data/scienceTopics';
import { KatexMath } from '../components/ui/KatexMath';
import { BookOpen, ShieldCheck, AlertTriangle, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

export const SciencePage: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>(SCIENCE_TOPICS[0].id);
  const activeTopic = SCIENCE_TOPICS.find((t) => t.id === activeTopicId) || SCIENCE_TOPICS[0];

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-8 max-w-7xl mx-auto w-full gap-8">
      {/* Editorial Header */}
      <div className="border-b border-navy-border pb-6 max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 rounded font-semibold uppercase">
            Peer-Reviewed Foundations
          </span>
          <span className="text-xs font-mono text-slate-400">
            Last Scientific Audit: November 2026
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-3">
          Scientific Method, Equations & Limitations
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Scientific trust requires complete mathematical transparency. Below is the full audit of governing equations, dimensional units, physical assumptions, numerical limitations, and research literature triage.
        </p>
      </div>

      {/* 2-Column Editorial Layout: Sidebar ToC (220px) + Main Content (720px) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Side Table of Contents (220px) */}
        <nav className="md:col-span-4 lg:col-span-3 bg-navy-900/60 border border-navy-border rounded-panel p-3.5 space-y-1.5 shadow-subtle sticky top-20">
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block px-2 mb-2">
            Table of Contents
          </span>
          {SCIENCE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setActiveTopicId(topic.id)}
              className={`w-full text-left px-3 py-2 rounded-control text-xs font-medium transition-colors ${
                activeTopicId === topic.id
                  ? 'bg-navy-800 text-cyan-light border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850'
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                {topic.category}
              </span>
              <span>{topic.title}</span>
            </button>
          ))}
        </nav>

        {/* Main Reading Column (720px) */}
        <article className="md:col-span-8 lg:col-span-9 bg-navy-900 border border-navy-border rounded-panel p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          {/* Topic Title & Category */}
          <div className="border-b border-navy-border/80 pb-4">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              {activeTopic.category}
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mt-1">
              {activeTopic.title}
            </h2>
          </div>

          {/* Plain Summary */}
          <div className="text-sm text-slate-200 leading-relaxed space-y-3">
            <p>{activeTopic.summary}</p>
          </div>

          {/* Equations if available */}
          {activeTopic.equationsLatex && activeTopic.equationsLatex.length > 0 && (
            <div className="p-4 bg-navy-950 border border-navy-border rounded-control space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                Mathematical Formulations
              </span>
              <div className="space-y-2 pt-1">
                {activeTopic.equationsLatex.map((eq, i) => (
                  <KatexMath key={i} math={eq} block />
                ))}
              </div>
            </div>
          )}

          {/* Assumptions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Model Assumptions & Boundary Conditions</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              {activeTopic.assumptions.map((ass, i) => (
                <li key={i}>{ass}</li>
              ))}
            </ul>
          </div>

          {/* Known Limitations */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Known Physical & Numerical Limitations</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
              {activeTopic.limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>

          {/* Peer-Reviewed Citations */}
          <div className="pt-4 border-t border-navy-border/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>References & Peer-Reviewed Literature</span>
            </div>
            <ul className="space-y-1.5 text-xs font-mono text-slate-400">
              {activeTopic.citations.map((cite, i) => (
                <li key={i} className="p-2 bg-navy-950 rounded border border-navy-border/60">
                  {cite}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
};

