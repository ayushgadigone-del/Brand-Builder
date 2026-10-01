export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ProductBrand {
  name: string;
  category: string;
  tagline: string;
  description: string;
  materials: string;
  finish: string;
  colors: ColorSwatch[];
  aesthetic: string;
  logoDetails: string;
  visualDnaLock: string; // Detailed locked specification to maintain visual consistency
  referenceImageBase64?: string; // Master reference image to anchor subsequent shots
}

export type AspectRatioType = '1:1' | '16:9' | '3:4' | '4:3' | '9:16';

export interface MediumDef {
  id: string;
  name: string;
  badge: string;
  description: string;
  aspectRatio: AspectRatioType;
  iconName: string;
  category: 'outdoor' | 'print' | 'digital' | 'retail';
  defaultPromptEnv: string;
}

export type GlobalLightingMood = 'high-contrast' | 'soft-diffused';

export interface GeneratedShot {
  id: string;
  mediumId: string;
  mediumName: string;
  aspectRatio: AspectRatioType;
  imageUrl?: string;
  status: 'idle' | 'queued' | 'generating' | 'completed' | 'error';
  promptUsed?: string;
  lightingMood?: GlobalLightingMood;
  error?: string;
  timestamp?: number;
  durationMs?: number;
  isStudioFallback?: boolean;
  quotaNotice?: string;
}

export interface PresetProduct {
  name: string;
  category: string;
  tagline: string;
  description: string;
  materials: string;
  finish: string;
  colors: ColorSwatch[];
  aesthetic: string;
  logoDetails: string;
  visualDnaLock: string;
}

export interface StylePreset {
  id: string;
  name: string;
  tagline: string;
  aesthetic: string;
  finish: string;
  suggestedMaterials?: string;
  badge?: string;
}

export interface ColorPaletteSuggestion {
  id: string;
  name: string;
  description: string;
  colors: ColorSwatch[];
}

export interface DnaOptimizationSuggestion {
  category: string;
  title: string;
  critique: string;
  recommendation: string;
}

export interface VisualDnaOptimizationResult {
  photorealismScore: number;
  optimizedScore: number;
  summary: string;
  suggestions: DnaOptimizationSuggestion[];
  optimizedVisualDna: string;
  highlightAdditions: string[];
}

export interface CampaignBatch {
  id: string;
  name: string;
  timestamp: number;
  trigger: 'generate-all' | 'single' | 'manual-snapshot' | 'imported';
  brandSnapshot: ProductBrand;
  shots: Record<string, GeneratedShot>;
  globalLighting: GlobalLightingMood;
  completedCount: number;
  model: string;
  notes?: string;
}

