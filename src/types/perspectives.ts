export type VisualisationKind =
  | 'mathematical-rendering'
  | 'classical-simulation'
  | 'quantum-model'
  | 'spacetime-model'
  | 'historical-reconstruction'
  | 'schematic-diagram'
  | 'interpretive-metaphor'
  | 'cinematic-introduction'
  | 'data-driven-visualisation';

export type EvidenceKind =
  | 'primary-source'
  | 'historical-context'
  | 'scientific-framework'
  | 'scholarly-interpretation'
  | 'artistic-interpretation'
  | 'proposed-framework';

export type PerspectiveCategory =
  | 'ancient-philosophy'
  | 'classical-physics'
  | 'relativity'
  | 'quantum-interpretation'
  | 'modern-physics'
  | 'proposed-framework';

export interface PerspectiveSource {
  id: string;
  perspectiveId: string;
  title: string;
  author?: string;
  date?: string;
  sourceType: EvidenceKind;
  publisher?: string;
  url: string;
  section?: string;
  translator?: string;
  edition?: string;
  rightsStatus: 'public-domain' | 'licensed' | 'link-only' | 'fair-use-excerpt';
  supports: string[];
  reviewedAt: string;
  notes?: string;
}

export interface PerspectiveSceneMetadata {
  id: string;
  title: string;
  kind: VisualisationKind;
  evidenceStatus: EvidenceKind;
  description: string;
  whatAmISeeing: {
    inPlainEnglish: string;
    thisEncodes: string[];
    thisDoesNotMean: string[];
  };
  assumptions: string[];
  limitations: string[];
  sourceIds: string[];
}

export interface PerspectiveItem {
  slug: string;
  title: string;
  subtitle: string;
  category: PerspectiveCategory;
  categoryLabel: string;
  historicalPeriod: string;
  keyFigureOrTradition: string;
  coreQuestion: string;
  summary: string;
  evidenceBadge: string;
  estimatedMinutes: number;
  featured: boolean;
  colorAccent: string; // hex
  threeLayerRule: {
    layerA: {
      heading: string;
      sourceText: string;
      context: string;
    };
    layerB: {
      heading: string;
      visualMetaphor: string;
      whatControlsChange: string;
    };
    layerC: {
      heading: string;
      scientificComparison: string;
      whatIsNotEquivalent: string;
    };
  };
  sources: PerspectiveSource[];
  scenes: PerspectiveSceneMetadata[];
}

export type ScaleStageId =
  | 'local-patch'
  | 'structure-and-interaction'
  | 'matter-and-systems'
  | 'astronomical-systems'
  | 'galaxies-and-cosmic-web'
  | 'universe-and-cosmology';

export interface PerspectiveScaleScene {
  perspectiveSlug: string;
  stageId: ScaleStageId;
  stageNumber: number;
  title: string;
  scaleLabel: string;
  narrative: string;
  sceneType: VisualisationKind;
  evidenceStatus: EvidenceKind;
  whatIsRepresented: string;
  transitionNote?: string;
  isSupported: boolean;
}

export interface ComparisonRecord {
  questionId: string;
  questionText: string;
  answers: Record<string, {
    text: string;
    status: EvidenceKind;
    sourceRef: string;
  }>;
  nonEquivalenceNote: string;
}

