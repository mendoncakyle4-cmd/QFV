import React, { useState } from 'react';
import { PERSPECTIVES_LIST } from '../../data/perspectivesData';
import { ThreeLayerPanel } from '../../components/perspectives/ThreeLayerPanel';
import { SourceDrawer } from '../../components/perspectives/SourceDrawer';
import { useNavigationStore } from '../../state/useNavigationStore';
import { 
  ArrowLeft, 
  BookOpen, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface VedicVerse {
  number: number;
  sanskrit: string;
  iast: string;
  translation: string;
  commentary: string;
}

const NASADIYA_VERSES: VedicVerse[] = [
  {
    number: 1,
    sanskrit: 'नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत् ।\nकिमावरीवः कुह कस्य शर्मन्नम्भः किमासीद्गहनं गभीरम् ॥ १ ॥',
    iast: 'nāsad āsīn no sad āsīt tadānīṃ nāsīd rajo no vyomā paro yat |\nkim āvarīvaḥ kuha kasya śarmann ambhaḥ kim āsīd gahanaṃ gabhīram || 1 ||',
    translation: 'There was neither non-existence nor existence then; there was neither the realm of space nor the sky which is beyond. What stirred? Where? In whose protection? Was there water, deep and fathomless?',
    commentary: 'The hymn opens with an ontological paradox: before manifest creation, even the dichotomy between "being" (sat) and "non-being" (asat) fails to apply.',
  },
  {
    number: 2,
    sanskrit: 'न मृत्युरासीदमृतं न तर्हि न रात्र्या अह्न आसीत्प्रकेतः ।\nआनीदवातं स्वधया तदेकं तस्माद्धान्यन्न परः किञ्चनास ॥ २ ॥',
    iast: 'na mṛtyur āsīd amṛtaṃ na tarhi na rātryā ahna āsīt praketaḥ |\nānīd avātaṃ svadhayā tad ekaṃ tasmād dhānyan na paraḥ kiñcanāsa || 2 ||',
    translation: 'There was neither death nor immortality then. There was no distinguishing sign of night nor of day. That One breathed, breathless, by its own impulse. Other than that there was nothing beyond.',
    commentary: '"Breathed breathless" (ānīd avātam) points to an unmanifest potentiality preceding biological life, space, and time.',
  },
  {
    number: 3,
    sanskrit: 'तम आसीत्तमसा गूळ्हमग्रेऽप्रकेतं सलिलं सर्वमाइदम् ।\nतुच्छ्येनाभ्वपिहितं यदासीत्तपसस्तन्महिना जायतैकम् ॥ ३ ॥',
    iast: 'tama āsīt tamasā gūḷham agre\'praketaṃ salilaṃ sarvam ā idam |\ntucchyenābhv apihitaṃ yad āsīt tapasas tan mahinā jāyataikam || 3 ||',
    translation: 'Darkness was hidden by darkness in the beginning; with no distinguishing mark, all this was water. That which became, that which was enfolded by emptiness, arose through the power of heat (tapas).',
    commentary: '"Salilam" (fluid/water) and "tapas" (ardour/heat) are traditional symbolic markers of undifferentiated potential and primordial transformative focus.',
  },
  {
    number: 7,
    sanskrit: 'इयं विसृष्टिर्यत आबभूव यदि वा दधे यदि वा न ।\nयो अस्याध्यक्षः परमे व्योमन्त्सो अङ्ग वेद यदि वा न वेद ॥ ७ ॥',
    iast: 'iyaṃ visṛṣṭir yata ābabhūva yadi vā dadhe yadi vā na |\nyo asyādhyakṣaḥ parame vyoman tso aṅga veda yadi vā na veda || 7 ||',
    translation: 'Whence this creation has arisen—perhaps it formed itself, or perhaps it did not—he who surveys it from the highest heaven, he surely knows... or perhaps even he does not know.',
    commentary: 'The hymn concludes in supreme philosophical humility: questioning whether even the creator or cosmic witness completely comprehends the ultimate origin.',
  },
];

export const VedicPerspectiveView: React.FC = () => {
  const { navigate } = useNavigationStore();
  const perspective = PERSPECTIVES_LIST.find((p) => p.slug === 'vedic') || PERSPECTIVES_LIST[0];

  const [currentChapter, setCurrentChapter] = useState(0);
  const [textLanguage, setTextLanguage] = useState<'english' | 'iast' | 'sanskrit'>('english');
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);

  const activeVerse = NASADIYA_VERSES[currentChapter];

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-66px)] bg-navy-950 p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between border-b border-navy-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/perspectives')}
            className="p-1.5 bg-navy-900 hover:bg-navy-850 text-slate-300 rounded border border-navy-border flex items-center gap-1.5 text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Perspectives</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-500/40 text-[10px] font-mono text-amber-300 rounded font-semibold uppercase">
                Ancient Philosophical Inquiry
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Rigveda 10.129
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-0.5">
              {perspective.title}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsSourceDrawerOpen(true)}
          className="px-3 py-1.5 bg-navy-900 hover:bg-navy-850 text-slate-200 border border-navy-border hover:border-cyan-500/40 rounded-control text-xs font-mono flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Source Notes</span>
        </button>
      </div>

      {/* Main Grid: Interactive Text & Visual Stage (65%) + Narrative Layers (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual & Verse Viewer (65%) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Interpretive Scene Stage Card */}
          <div className="p-6 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 border border-navy-border rounded-panel flex flex-col justify-between min-h-[440px] shadow-2xl relative overflow-hidden">
            {/* Stage Badge & Chapter Indicator */}
            <div className="flex items-center justify-between z-10 border-b border-navy-border/60 pb-3">
              <span className="px-2 py-0.5 bg-navy-950 border border-navy-border text-cyan-300 text-[11px] font-mono rounded">
                Chapter {currentChapter + 1} of {NASADIYA_VERSES.length}: Verse {activeVerse.number}
              </span>
              <div className="flex items-center gap-1 bg-navy-950 p-1 border border-navy-border rounded text-[11px] font-mono">
                <button
                  onClick={() => setTextLanguage('english')}
                  className={`px-2 py-0.5 rounded ${textLanguage === 'english' ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setTextLanguage('iast')}
                  className={`px-2 py-0.5 rounded ${textLanguage === 'iast' ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'}`}
                >
                  IAST
                </button>
                <button
                  onClick={() => setTextLanguage('sanskrit')}
                  className={`px-2 py-0.5 rounded ${textLanguage === 'sanskrit' ? 'bg-navy-800 text-cyan-light' : 'text-slate-400'}`}
                >
                  संस्कृतम्
                </button>
              </div>
            </div>

            {/* Central Typography Display */}
            <div className="my-auto py-8 text-center max-w-xl mx-auto z-10 space-y-4">
              {textLanguage === 'english' && (
                <blockquote className="text-base sm:text-lg font-serif italic text-slate-100 leading-relaxed">
                  &ldquo;{activeVerse.translation}&rdquo;
                </blockquote>
              )}
              {textLanguage === 'iast' && (
                <div className="text-sm sm:text-base font-mono text-cyan-200 leading-relaxed whitespace-pre-line">
                  {activeVerse.iast}
                </div>
              )}
              {textLanguage === 'sanskrit' && (
                <div className="text-base sm:text-lg font-sans text-amber-200 leading-relaxed whitespace-pre-line tracking-wide">
                  {activeVerse.sanskrit}
                </div>
              )}
              <p className="text-xs text-slate-400 max-w-md mx-auto pt-2 border-t border-navy-border/40">
                {activeVerse.commentary}
              </p>
            </div>

            {/* Interpretive Badge */}
            <div className="z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-navy-border/60">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Info className="w-3.5 h-3.5" />
                <span>Interpretive Visual Metaphor (Not a physical simulation)</span>
              </span>
              <span>Translation: A. L. Basham</span>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="p-3 bg-navy-900 border border-navy-border rounded-panel flex items-center justify-between">
            <button
              onClick={() => setCurrentChapter((prev) => Math.max(0, prev - 1))}
              disabled={currentChapter === 0}
              className="px-3 py-1.5 bg-navy-800 hover:bg-navy-750 text-slate-200 disabled:opacity-30 rounded text-xs font-mono flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Verse</span>
            </button>

            <div className="flex items-center gap-1.5">
              {NASADIYA_VERSES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentChapter(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentChapter ? 'bg-cyan-400 w-6' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentChapter((prev) => Math.min(NASADIYA_VERSES.length - 1, prev + 1))}
              disabled={currentChapter === NASADIYA_VERSES.length - 1}
              className="px-3 py-1.5 bg-navy-800 hover:bg-navy-750 text-slate-200 disabled:opacity-30 rounded text-xs font-mono flex items-center gap-1 transition-colors"
            >
              <span>Next Verse</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Three-Layer Rule & Guardrails (35%) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ThreeLayerPanel perspective={perspective} />

          {/* Upanishadic Context Note */}
          <div className="p-4 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-2 text-xs text-slate-300">
            <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Chāndogya & Taittirīya Upanishads</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In the later Upanishads, the question shifts from cosmogony to ontology: Uddālaka Āruṇi in Chāndogya 6.2 rejects creation from non-being, declaring that in the beginning was Being alone (Sat), one only without a second.
            </p>
          </div>
        </div>
      </div>

      <SourceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
        sources={perspective.sources}
      />
    </div>
  );
};

