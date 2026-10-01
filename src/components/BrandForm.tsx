import React, { useState } from 'react';
import { ProductBrand, PresetProduct, ColorSwatch, ColorPaletteSuggestion, VisualDnaOptimizationResult } from '../types';
import { PRESET_PRODUCTS, STYLE_PRESETS } from '../data/constants';
import { VisualDnaOptimizerModal } from './VisualDnaOptimizerModal';
import {
  Sparkles,
  Lock,
  RefreshCw,
  Layers,
  Sliders,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Plus,
  X,
  Palette,
  Check,
  Wand2,
  FileText,
  SlidersHorizontal,
  UploadCloud,
  Zap,
} from 'lucide-react';

interface BrandFormProps {
  brand: ProductBrand;
  onChange: (updated: ProductBrand) => void;
  onEnhanceWithAI: () => Promise<void>;
  isEnhancing: boolean;
  onOpenNewProductModal?: () => void;
  customProducts?: ProductBrand[];
  referenceImageBase64?: string;
  onClearReferenceImage?: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type StudioTab = 'identity' | 'visual-dna' | 'colors' | 'anchor';

export const BrandForm: React.FC<BrandFormProps> = ({
  brand,
  onChange,
  onEnhanceWithAI,
  isEnhancing,
  onOpenNewProductModal,
  customProducts = [],
  referenceImageBase64,
  onClearReferenceImage,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('identity');
  const [newColorHex, setNewColorHex] = useState('#2563EB');
  const [newColorName, setNewColorName] = useState('');
  const [showAddColor, setShowAddColor] = useState(false);
  const [isExpandingDna, setIsExpandingDna] = useState(false);
  const [expandSuccess, setExpandSuccess] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [isSuggestingPalettes, setIsSuggestingPalettes] = useState(false);
  const [paletteSuggestions, setPaletteSuggestions] = useState<ColorPaletteSuggestion[]>([]);
  const [appliedPaletteId, setAppliedPaletteId] = useState<string | null>(null);
  const [isOptimizingDna, setIsOptimizingDna] = useState(false);
  const [showOptimizerModal, setShowOptimizerModal] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<VisualDnaOptimizationResult | null>(null);

  // Match current aesthetic/finish with style presets
  const matchedPreset = STYLE_PRESETS.find(
    (p) => p.aesthetic === brand.aesthetic && p.finish === brand.finish
  );
  const currentPresetId = matchedPreset ? matchedPreset.id : selectedPresetId;

  const handleApplyStylePreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = STYLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    onChange({
      ...brand,
      aesthetic: preset.aesthetic,
      finish: preset.finish,
      materials: brand.materials.trim() ? brand.materials : (preset.suggestedMaterials || brand.materials),
    });

    onShowToast?.(`Applied style preset: "${preset.name}"`, 'info');
  };

  const loadPreset = (preset: PresetProduct) => {
    onChange({
      ...preset,
      referenceImageBase64: undefined,
    });
    onShowToast?.(`Loaded product preset: "${preset.name}"`, 'info');
  };

  const handleFieldChange = (field: keyof ProductBrand, value: any) => {
    onChange({
      ...brand,
      [field]: value,
    });
  };

  // Uses Gemini API to automatically expand description into full Visual DNA blueprint
  const handleExpandDescriptionToDna = async () => {
    if (isExpandingDna) return;
    setIsExpandingDna(true);
    setExpandSuccess(false);

    try {
      const response = await fetch('/api/brand/expand-visual-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brand.name,
          category: brand.category,
          description: brand.description,
          materials: brand.materials,
          finish: brand.finish,
          aesthetic: brand.aesthetic,
          colors: brand.colors,
        }),
      });

      const data = await response.json();
      if (data.success && data.visualDnaLock) {
        onChange({
          ...brand,
          visualDnaLock: data.visualDnaLock,
          materials: brand.materials || data.suggestedMaterials || brand.materials,
          finish: brand.finish || data.suggestedFinish || brand.finish,
        });
        setExpandSuccess(true);
        onShowToast?.(`Expanded Visual DNA blueprint for "${brand.name || brand.category}"!`, 'success');
        setTimeout(() => setExpandSuccess(false), 3000);
      } else {
        onShowToast?.('Failed to expand Visual DNA blueprint.', 'error');
      }
    } catch (err) {
      console.warn('Failed to expand Visual DNA:', err);
      onShowToast?.('Failed to expand Visual DNA blueprint.', 'error');
    } finally {
      setIsExpandingDna(false);
    }
  };

  // Analyze Visual DNA with Gemini and generate photorealism optimization suggestions
  const handleAutoOptimizeDna = async () => {
    if (isOptimizingDna) return;
    setIsOptimizingDna(true);
    setShowOptimizerModal(true);

    try {
      const response = await fetch('/api/brand/optimize-visual-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brand.name,
          category: brand.category,
          visualDnaLock: brand.visualDnaLock,
          description: brand.description,
          materials: brand.materials,
          finish: brand.finish,
          aesthetic: brand.aesthetic,
          colors: brand.colors,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOptimizationResult(data);
        onShowToast?.(
          `Photorealism analysis complete: Spec score projected to ${data.optimizedScore ?? 97}%!`,
          'success'
        );
      } else {
        onShowToast?.('Failed to optimize Visual DNA.', 'error');
      }
    } catch (err) {
      console.warn('Failed to optimize Visual DNA:', err);
      onShowToast?.('Failed to optimize Visual DNA.', 'error');
    } finally {
      setIsOptimizingDna(false);
    }
  };

  // Suggest complementary color palettes with Gemini
  const handleSuggestColorPalettes = async () => {
    if (isSuggestingPalettes) return;
    setIsSuggestingPalettes(true);

    try {
      const response = await fetch('/api/brand/suggest-color-palettes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: brand.category || 'Consumer Product',
          name: brand.name,
          aesthetic: brand.aesthetic,
          description: brand.description,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.palettes) && data.palettes.length > 0) {
        setPaletteSuggestions(data.palettes);
        onShowToast?.(`Generated ${data.palettes.length} complementary color palettes for "${brand.category || 'Product'}"!`, 'success');
      } else {
        onShowToast?.('Failed to generate color palettes. Using category defaults.', 'error');
      }
    } catch (err) {
      console.warn('Failed to suggest color palettes:', err);
      onShowToast?.('Failed to generate color palettes.', 'error');
    } finally {
      setIsSuggestingPalettes(false);
    }
  };

  const handleApplyPalette = (palette: ColorPaletteSuggestion, mode: 'replace' | 'append' = 'replace') => {
    const updatedColors = mode === 'replace'
      ? [...palette.colors]
      : [
          ...brand.colors,
          ...palette.colors.filter(
            (newC) => !brand.colors.some((cur) => cur.hex.toLowerCase() === newC.hex.toLowerCase())
          ),
        ];

    handleFieldChange('colors', updatedColors);
    setAppliedPaletteId(palette.id);
    onShowToast?.(`Applied "${palette.name}" palette (${palette.colors.length} tones)!`, 'success');
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const newColors = [...brand.colors, { name: newColorName.trim(), hex: newColorHex }];
    handleFieldChange('colors', newColors);
    setNewColorName('');
    setShowAddColor(false);
  };

  const handleRemoveColor = (index: number) => {
    const newColors = brand.colors.filter((_, i) => i !== index);
    handleFieldChange('colors', newColors);
  };

  // Image Upload Handler
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast?.('Please upload a valid image file (PNG, JPEG, WebP).', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      onShowToast?.('Image is too large. Please upload an image under 8MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onChange({
        ...brand,
        referenceImageBase64: base64,
      });
      onShowToast?.('Master reference anchor image loaded! Subsequent shots will condition on this exact product.', 'success');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* Product Switcher Bar */}
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/60">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span>Product Catalog</span>
          </div>

          {onOpenNewProductModal && (
            <button
              id="add-new-product-btn"
              type="button"
              onClick={onOpenNewProductModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs active:scale-98"
            >
              <Plus className="w-3 h-3 text-amber-300" />
              <span>+ New Product</span>
            </button>
          )}
        </div>

        {/* Preset Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {PRESET_PRODUCTS.map((preset) => {
            const isSelected = brand.name === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => loadPreset(preset)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xs'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100/80 border-zinc-200/80'
                }`}
              >
                {preset.name}
              </button>
            );
          })}

          {customProducts.map((cp) => {
            const isSelected = brand.name === cp.name;
            return (
              <button
                key={`custom-${cp.name}`}
                type="button"
                onClick={() => onChange({ ...cp, referenceImageBase64: undefined })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xs'
                    : 'bg-amber-50 text-amber-950 hover:bg-amber-100/80 border-amber-200/80'
                }`}
              >
                ★ {cp.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orderly Studio Navigation Tabs */}
      <div className="border-b border-zinc-200/80 bg-white px-4 flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'identity', label: '1. Identity', icon: FileText },
          { id: 'visual-dna', label: '2. Visual DNA', icon: SlidersHorizontal },
          { id: 'colors', label: `3. Colors (${brand.colors.length})`, icon: Palette },
          {
            id: 'anchor',
            label: brand.referenceImageBase64 ? '4. Anchor (Active)' : '4. Anchor',
            icon: ImageIcon,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as StudioTab)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                isActive
                  ? 'border-zinc-950 text-zinc-950 bg-zinc-50/50'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels Body */}
      <div className="p-5 flex-1 space-y-4">
        {/* TAB 1: PRODUCT IDENTITY */}
        {activeTab === 'identity' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Brand / Product Name
                </label>
                <input
                  type="text"
                  value={brand.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-zinc-950 focus:outline-none transition-shadow"
                  placeholder="e.g. KURA, VALO 01"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={brand.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-zinc-950 focus:outline-none transition-shadow"
                  placeholder="e.g. Cold-Pressed Botanical Elixir"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={brand.tagline}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-zinc-950 focus:outline-none transition-shadow"
                placeholder="e.g. Quiet distillation of mountain moss and yuzu blossom."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Physical Geometry & Proportions
                </label>
                <button
                  type="button"
                  onClick={handleExpandDescriptionToDna}
                  disabled={isExpandingDna}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-900 hover:text-black underline cursor-pointer"
                >
                  <Wand2 className="w-3 h-3 text-amber-500" />
                  <span>{isExpandingDna ? 'Expanding...' : 'Expand to Visual DNA with AI'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={brand.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-800 focus:ring-2 focus:ring-zinc-950 focus:outline-none leading-relaxed transition-shadow"
                placeholder="Describe the silhouette, proportions, closures, and physical geometry in detail..."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('visual-dna')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>Continue to Visual DNA →</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL DNA & STYLING */}
        {activeTab === 'visual-dna' && (
          <div className="space-y-4">
            {/* Visual DNA Blueprint Box */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-zinc-700" />
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Invariant Visual DNA Blueprint
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    id="auto-optimize-dna-btn"
                    onClick={handleAutoOptimizeDna}
                    disabled={isOptimizingDna}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-amber-400 hover:bg-amber-300 text-zinc-950 border border-amber-500/40 shadow-xs active:scale-98 disabled:opacity-50"
                    title="Analyze Visual DNA with Gemini and get suggestions to boost photorealism"
                  >
                    <Zap className={`w-3.5 h-3.5 ${isOptimizingDna ? 'animate-spin' : 'fill-zinc-950'}`} />
                    <span>{isOptimizingDna ? 'Analyzing...' : 'Auto-Optimize'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExpandDescriptionToDna}
                    disabled={isExpandingDna}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      expandSuccess
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100 shadow-2xs'
                    }`}
                  >
                    <Wand2 className={`w-3.5 h-3.5 ${isExpandingDna ? 'animate-spin text-zinc-900' : 'text-amber-500'}`} />
                    <span>{isExpandingDna ? 'Synthesizing...' : expandSuccess ? 'Blueprint Updated!' : 'Expand with AI'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500">
                This locked blueprint is injected into all campaign generation steps to ensure identical product identity.
              </p>

              <textarea
                rows={4}
                value={brand.visualDnaLock}
                onChange={(e) => handleFieldChange('visualDnaLock', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-zinc-300 bg-white text-xs font-mono text-zinc-800 focus:ring-2 focus:ring-zinc-950 focus:outline-none leading-relaxed"
                placeholder="Detailed 3-5 sentence visual blueprint string locking geometry, materials, and colors..."
              />

              {/* Photorealism Optimization Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-950">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">
                    <strong>Boost Photorealism:</strong> Gemini analyzes optical lenses, micro-textures, and physical constraints.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoOptimizeDna}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer"
                >
                  <Zap className="w-3 h-3 fill-amber-950" />
                  <span>Analyze with Gemini →</span>
                </button>
              </div>
            </div>

            {/* Materials & Finish */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Tactile Materials
                </label>
                <input
                  type="text"
                  value={brand.materials}
                  onChange={(e) => handleFieldChange('materials', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-900 focus:ring-2 focus:ring-zinc-950 focus:outline-none"
                  placeholder="e.g. Brushed titanium, low-iron glass, textured washi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Surface Finish
                </label>
                <input
                  type="text"
                  value={brand.finish}
                  onChange={(e) => handleFieldChange('finish', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-900 focus:ring-2 focus:ring-zinc-950 focus:outline-none"
                  placeholder="e.g. Satin bead-blasted matte, velvet sheen"
                />
              </div>
            </div>

            {/* Style Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Aesthetic & Style Direction
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STYLE_PRESETS.map((preset) => {
                  const isSelected = currentPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyStylePreset(preset.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xs'
                          : 'bg-zinc-50/60 text-zinc-800 hover:bg-zinc-100 border-zinc-200'
                      }`}
                    >
                      <div className="font-bold text-xs">{preset.name}</div>
                      <div className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {preset.tagline}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('identity')}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-medium cursor-pointer"
              >
                ← Back to Identity
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('colors')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>Continue to Colors →</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: COLOR PALETTE */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Brand Color Swatches
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Defines the exact chromatic fingerprint of the product.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSuggestColorPalettes}
                disabled={isSuggestingPalettes}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 cursor-pointer shadow-2xs transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSuggestingPalettes ? 'animate-spin text-zinc-900' : 'text-amber-500'}`} />
                <span>{isSuggestingPalettes ? 'Generating Palettes...' : 'Suggest with AI'}</span>
              </button>
            </div>

            {/* Current Swatches Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {brand.colors.map((color, index) => (
                <div
                  key={`${color.name}-${index}`}
                  className="p-2.5 rounded-xl border border-zinc-200 bg-white flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-6 h-6 rounded-lg border border-black/10 shrink-0 shadow-2xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900 truncate">
                        {color.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {color.hex}
                      </div>
                    </div>
                  </div>

                  {brand.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      title="Remove swatch"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add Color Card */}
              {!showAddColor ? (
                <button
                  type="button"
                  onClick={() => setShowAddColor(true)}
                  className="p-2.5 rounded-xl border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-600 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Swatch</span>
                </button>
              ) : (
                <div className="col-span-2 p-3 rounded-xl border border-zinc-300 bg-zinc-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-zinc-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Color name (e.g. Forest Moss)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-900 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAddColor(false)}
                      className="px-2.5 py-1 text-xs text-zinc-600 hover:text-zinc-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-3 py-1 bg-zinc-950 text-white rounded-lg text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Suggested Palettes */}
            {paletteSuggestions.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    AI Curated Palettes for &quot;{brand.category}&quot;
                  </span>
                  <button
                    type="button"
                    onClick={() => setPaletteSuggestions([])}
                    className="text-[11px] text-zinc-400 hover:text-zinc-700"
                  >
                    Clear Suggestions
                  </button>
                </div>

                <div className="space-y-2.5">
                  {paletteSuggestions.map((palette) => (
                    <div
                      key={palette.id}
                      className="p-3 rounded-xl border border-zinc-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-zinc-900">
                          {palette.name}
                        </div>
                        <p className="text-[11px] text-zinc-500">
                          {palette.description}
                        </p>
                        <div className="flex items-center gap-1 pt-1">
                          {palette.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 rounded-md border border-black/10"
                              style={{ backgroundColor: c.hex }}
                              title={`${c.name} (${c.hex})`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApplyPalette(palette, 'replace')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer shadow-2xs"
                        >
                          Apply Palette
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('visual-dna')}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-medium cursor-pointer"
              >
                ← Back to Visual DNA
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('anchor')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>Continue to Anchor Reference →</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: ANCHOR REFERENCE PHOTO */}
        {activeTab === 'anchor' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Master Reference Image Anchor
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Upload or pin a master product render. Nano-Banana and Gemini Flash will condition all subsequent medium shots on this physical design.
              </p>
            </div>

            {brand.referenceImageBase64 ? (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={brand.referenceImageBase64}
                      alt="Master Reference"
                      className="w-16 h-16 rounded-xl object-cover border border-emerald-300 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Anchor Active
                      </div>
                      <p className="text-xs font-bold text-zinc-900 mt-1">
                        Locked Product Visual Anchor
                      </p>
                      <p className="text-[11px] text-zinc-600">
                        All cross-medium generations are actively conditioned on this image.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClearReferenceImage}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium cursor-pointer transition-colors"
                    title="Remove Anchor"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleImageFile(e.dataTransfer.files[0]);
                  }
                }}
                className="p-8 border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-2xl bg-zinc-50/50 text-center space-y-3 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-200/80 mx-auto flex items-center justify-center text-zinc-500">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800">
                    Drag and drop your master product image here
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Supports PNG, JPEG, WebP up to 8MB
                  </p>
                </div>
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-300 text-xs font-bold text-zinc-800 hover:bg-zinc-100 cursor-pointer shadow-2xs transition-colors">
                    <span>Browse Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Tip: You can also hover over any rendered medium in the gallery and click &quot;Set Anchor&quot;.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={() => setActiveTab('colors')}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 font-medium cursor-pointer"
              >
                ← Back to Colors
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visual DNA Auto-Optimizer Modal */}
      <VisualDnaOptimizerModal
        isOpen={showOptimizerModal}
        onClose={() => setShowOptimizerModal(false)}
        brand={brand}
        optimizationResult={optimizationResult}
        isLoading={isOptimizingDna}
        onApplyOptimizedDna={(newDna) => {
          handleFieldChange('visualDnaLock', newDna);
          setShowOptimizerModal(false);
          onShowToast?.('Applied photorealism-optimized Visual DNA blueprint!', 'success');
        }}
        onReanalyze={handleAutoOptimizeDna}
        onShowToast={onShowToast}
      />
    </div>
  );
};
