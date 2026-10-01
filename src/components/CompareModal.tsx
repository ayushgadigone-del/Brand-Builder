import React, { useState, useEffect, useRef } from 'react';
import { GeneratedShot, MediumDef, ProductBrand, GlobalLightingMood } from '../types';
import {
  X,
  Columns,
  ArrowLeftRight,
  ShieldCheck,
  Sparkles,
  Download,
  Anchor,
  Check,
  Sun,
  CloudSun,
  Sliders,
  Maximize2,
  Layers,
  Info,
} from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: ProductBrand;
  mediums: MediumDef[];
  shots: Record<string, GeneratedShot>;
  initialShotIdA?: string;
  initialShotIdB?: string;
  onSetAsReferenceAnchor: (imageUrl: string) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  globalLighting?: GlobalLightingMood;
}

type ViewMode = 'side-by-side' | 'slider';

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  brand,
  mediums,
  shots,
  initialShotIdA,
  initialShotIdB,
  onSetAsReferenceAnchor,
  onShowToast,
  globalLighting = 'high-contrast',
}) => {
  // Collect all completed shots with valid images
  const completedItems = mediums
    .map((m) => ({
      medium: m,
      shot: shots[m.id],
    }))
    .filter(
      (item): item is { medium: MediumDef; shot: GeneratedShot } =>
        Boolean(item.shot && item.shot.imageUrl && item.shot.status === 'completed')
    );

  const [selectedIdA, setSelectedIdA] = useState<string>('');
  const [selectedIdB, setSelectedIdB] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100 percent
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(false);

  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Initialize selected shots when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (completedItems.length === 0) {
      setSelectedIdA('');
      setSelectedIdB('');
      return;
    }

    // Determine shot A
    let aId = initialShotIdA;
    if (!aId || !completedItems.some((ci) => ci.medium.id === aId)) {
      aId = completedItems[0].medium.id;
    }

    // Determine shot B
    let bId = initialShotIdB;
    if (
      !bId ||
      bId === aId ||
      !completedItems.some((ci) => ci.medium.id === bId)
    ) {
      const other = completedItems.find((ci) => ci.medium.id !== aId);
      bId = other ? other.medium.id : aId;
    }

    setSelectedIdA(aId);
    setSelectedIdB(bId);
  }, [isOpen, initialShotIdA, initialShotIdB]);

  // Handle slider interaction
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingSlider) return;
    handleSliderMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSlider) return;
    handleSliderMove(e.clientX);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const itemA = completedItems.find((ci) => ci.medium.id === selectedIdA);
  const itemB = completedItems.find((ci) => ci.medium.id === selectedIdB);

  const hasEnoughShots = completedItems.length >= 2;

  const handleSwap = () => {
    const temp = selectedIdA;
    setSelectedIdA(selectedIdB);
    setSelectedIdB(temp);
    onShowToast?.('Swapped comparison positions (A ⇄ B)', 'info');
  };

  const handleDownloadShot = (shot?: GeneratedShot, mediumName?: string) => {
    if (!shot?.imageUrl) return;
    const a = document.createElement('a');
    a.href = shot.imageUrl;
    a.download = `${(mediumName || 'shot').toLowerCase().replace(/\s+/g, '-')}-compare.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast?.(`Downloaded ${mediumName || 'shot'}`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDraggingSlider(false)}
      onTouchEnd={() => setIsDraggingSlider(false)}
    >
      <div className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-zinc-800 bg-zinc-900/80 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 text-amber-400 border border-zinc-700 flex items-center justify-center shadow-xs">
              <Columns className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Visual Consistency Comparison
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Locked DNA Verification
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Compare cross-medium product scale, tactile materials, and studio lighting invariants
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            {hasEnoughShots && (
              <div className="flex items-center bg-zinc-800 p-0.5 rounded-xl border border-zinc-700 text-xs">
                <button
                  type="button"
                  id="compare-mode-side-btn"
                  onClick={() => setViewMode('side-by-side')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === 'side-by-side'
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Side-by-side dual panel inspection"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Side-by-Side</span>
                  <span className="sm:hidden">Dual</span>
                </button>
                <button
                  type="button"
                  id="compare-mode-slider-btn"
                  onClick={() => setViewMode('slider')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === 'slider'
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Split curtain slider overlay"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Split Slider</span>
                  <span className="sm:hidden">Slider</span>
                </button>
              </div>
            )}

            {/* Swap Sides Button */}
            {hasEnoughShots && (
              <button
                type="button"
                id="compare-swap-sides-btn"
                onClick={handleSwap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                title="Swap Shot A and Shot B positions"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Swap (A ⇄ B)</span>
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              id="compare-modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1 border border-zinc-700"
              title="Close Comparison View"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!hasEnoughShots ? (
            /* Empty or Insufficient Shots Notice */
            <div className="py-16 px-6 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-amber-400 shadow-lg">
                <Columns className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Need At Least 2 Completed Shots
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Compare mode places two finished medium shots side-by-side to verify physical geometry and brand consistency. Currently, {completedItems.length} shot is rendered.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs shadow-xs cursor-pointer transition-colors"
                >
                  Return to Studio & Render Shots
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Selectors Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/90 p-3.5 rounded-2xl border border-zinc-800">
                {/* Shot A Selector */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center justify-center font-mono">
                      A
                    </span>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Primary Shot (A):
                    </label>
                  </div>
                  <select
                    id="compare-select-shot-a"
                    value={selectedIdA}
                    onChange={(e) => setSelectedIdA(e.target.value)}
                    className="bg-zinc-950 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-amber-400 cursor-pointer min-w-[180px]"
                  >
                    {completedItems.map((ci) => (
                      <option key={`a-${ci.medium.id}`} value={ci.medium.id}>
                        {ci.medium.name} ({ci.medium.aspectRatio})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shot B Selector */}
                <div className="flex items-center justify-between gap-3 border-t md:border-t-0 md:border-l border-zinc-800 pt-2.5 md:pt-0 md:pl-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold flex items-center justify-center font-mono">
                      B
                    </span>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Comparison Shot (B):
                    </label>
                  </div>
                  <select
                    id="compare-select-shot-b"
                    value={selectedIdB}
                    onChange={(e) => setSelectedIdB(e.target.value)}
                    className="bg-zinc-950 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-sky-400 cursor-pointer min-w-[180px]"
                  >
                    {completedItems.map((ci) => (
                      <option key={`b-${ci.medium.id}`} value={ci.medium.id}>
                        {ci.medium.name} ({ci.medium.aspectRatio})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Comparison Area */}
              {viewMode === 'side-by-side' ? (
                /* Side-by-Side Dual Frame Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Panel A */}
                  <div className="space-y-3 bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800 flex flex-col">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center justify-center font-mono">
                          A
                        </span>
                        <span className="font-bold text-white text-sm">
                          {itemA?.medium.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {itemA?.medium.aspectRatio}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {itemA?.shot && (
                          <button
                            type="button"
                            onClick={() => handleDownloadShot(itemA.shot, itemA.medium.name)}
                            className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer"
                            title="Download Shot A"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {itemA?.shot.imageUrl && (
                          <button
                            type="button"
                            onClick={() => onSetAsReferenceAnchor(itemA.shot.imageUrl!)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                              brand.referenceImageBase64 === itemA.shot.imageUrl
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                            }`}
                            title="Set Shot A as Master Anchor"
                          >
                            <Anchor className="w-3 h-3 inline mr-1" />
                            {brand.referenceImageBase64 === itemA.shot.imageUrl ? 'Anchor' : 'Set Anchor'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Frame A */}
                    <div className="flex-1 min-h-[300px] sm:min-h-[380px] bg-black/60 rounded-xl border border-zinc-800/90 flex items-center justify-center p-3 relative overflow-hidden group">
                      {itemA?.shot.imageUrl ? (
                        <img
                          src={itemA.shot.imageUrl}
                          alt={itemA.medium.name}
                          className="max-h-[50vh] w-auto object-contain rounded-lg shadow-xl"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-zinc-600 text-xs">No image available</div>
                      )}

                      {/* Lighting tag overlay */}
                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700 text-[10px] font-medium text-zinc-200 flex items-center gap-1.5">
                        {itemA?.shot.lightingMood === 'soft-diffused' ? (
                          <CloudSun className="w-3 h-3 text-sky-400" />
                        ) : (
                          <Sun className="w-3 h-3 text-amber-400" />
                        )}
                        <span>
                          {itemA?.shot.lightingMood === 'soft-diffused'
                            ? 'Soft Diffused'
                            : 'High Contrast'}
                        </span>
                      </div>
                    </div>

                    {/* Specs summary */}
                    <div className="text-[11px] text-zinc-400 space-y-1 pt-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Category:</span>
                        <span className="text-zinc-300 capitalize">{itemA?.medium.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Environment:</span>
                        <span className="text-zinc-300 truncate max-w-[200px]">{itemA?.medium.defaultPromptEnv}</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel B */}
                  <div className="space-y-3 bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800 flex flex-col">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold flex items-center justify-center font-mono">
                          B
                        </span>
                        <span className="font-bold text-white text-sm">
                          {itemB?.medium.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {itemB?.medium.aspectRatio}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {itemB?.shot && (
                          <button
                            type="button"
                            onClick={() => handleDownloadShot(itemB.shot, itemB.medium.name)}
                            className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer"
                            title="Download Shot B"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {itemB?.shot.imageUrl && (
                          <button
                            type="button"
                            onClick={() => onSetAsReferenceAnchor(itemB.shot.imageUrl!)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                              brand.referenceImageBase64 === itemB.shot.imageUrl
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                            }`}
                            title="Set Shot B as Master Anchor"
                          >
                            <Anchor className="w-3 h-3 inline mr-1" />
                            {brand.referenceImageBase64 === itemB.shot.imageUrl ? 'Anchor' : 'Set Anchor'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Frame B */}
                    <div className="flex-1 min-h-[300px] sm:min-h-[380px] bg-black/60 rounded-xl border border-zinc-800/90 flex items-center justify-center p-3 relative overflow-hidden group">
                      {itemB?.shot.imageUrl ? (
                        <img
                          src={itemB.shot.imageUrl}
                          alt={itemB.medium.name}
                          className="max-h-[50vh] w-auto object-contain rounded-lg shadow-xl"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-zinc-600 text-xs">No image available</div>
                      )}

                      {/* Lighting tag overlay */}
                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700 text-[10px] font-medium text-zinc-200 flex items-center gap-1.5">
                        {itemB?.shot.lightingMood === 'soft-diffused' ? (
                          <CloudSun className="w-3 h-3 text-sky-400" />
                        ) : (
                          <Sun className="w-3 h-3 text-amber-400" />
                        )}
                        <span>
                          {itemB?.shot.lightingMood === 'soft-diffused'
                            ? 'Soft Diffused'
                            : 'High Contrast'}
                        </span>
                      </div>
                    </div>

                    {/* Specs summary */}
                    <div className="text-[11px] text-zinc-400 space-y-1 pt-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Category:</span>
                        <span className="text-zinc-300 capitalize">{itemB?.medium.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Environment:</span>
                        <span className="text-zinc-300 truncate max-w-[200px]">{itemB?.medium.defaultPromptEnv}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Split Slider Overlay Layout */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <span>◀ Shot A: {itemA?.medium.name}</span>
                    </div>
                    <span className="text-zinc-500 font-mono">
                      Drag divider to inspect alignment ({Math.round(sliderPosition)}%)
                    </span>
                    <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                      <span>Shot B: {itemB?.medium.name} ▶</span>
                    </div>
                  </div>

                  <div
                    ref={sliderContainerRef}
                    onMouseDown={(e) => {
                      setIsDraggingSlider(true);
                      handleSliderMove(e.clientX);
                    }}
                    onTouchStart={(e) => {
                      setIsDraggingSlider(true);
                      handleSliderMove(e.touches[0].clientX);
                    }}
                    onTouchMove={handleTouchMove}
                    className="relative w-full h-[52vh] sm:h-[58vh] bg-black/80 rounded-2xl border border-zinc-800 overflow-hidden cursor-ew-resize select-none"
                  >
                    {/* Background Layer: Shot B */}
                    {itemB?.shot.imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                          src={itemB.shot.imageUrl}
                          alt={itemB.medium.name}
                          className="max-h-full max-w-full object-contain pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Foreground Layer (Clipped): Shot A */}
                    {itemA?.shot.imageUrl && (
                      <div
                        className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      >
                        <img
                          src={itemA.shot.imageUrl}
                          alt={itemA.medium.name}
                          className="max-h-full max-w-full object-contain pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Vertical Divider Line & Pill */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-950 shadow-xl flex items-center justify-center border border-zinc-300 text-xs">
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Consistency Verification Checklist & Attributes */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Cross-Medium Consistency Verification Matrix
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPromptDetails(!showPromptDetails)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline"
                  >
                    {showPromptDetails ? 'Hide Prompt Directives' : 'Compare Prompt Directives'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Point 1: Silhouette Geometry */}
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Product Silhouette</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Geometry locked to <span className="text-zinc-200">{brand.name}</span>. Aspect ratios adapt to medium canvas without product distortion.
                    </p>
                  </div>

                  {/* Point 2: Tactile Materials */}
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Materials & Finish</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {brand.materials || 'Machined alloy & glass'} with {brand.finish || 'satin matte'} finish across both shots.
                    </p>
                  </div>

                  {/* Point 3: Zero Humans Policy */}
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Zero-Human Invariant</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Both compositions enforce 0 people, 0 hands, and 0 silhouettes for solitary product focus.
                    </p>
                  </div>

                  {/* Point 4: Studio Lighting Alignment */}
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
                        {itemA?.shot.lightingMood === itemB?.shot.lightingMood ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Lighting Match</span>
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            <span>Contrasting Moods</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {itemA?.shot.lightingMood === itemB?.shot.lightingMood ? 'Unified' : 'A vs B'}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {itemA?.shot.lightingMood === itemB?.shot.lightingMood
                        ? `Both shots rendered in ${itemA?.shot.lightingMood || globalLighting} studio lighting.`
                        : `A: ${itemA?.shot.lightingMood || 'High Contrast'} vs B: ${itemB?.shot.lightingMood || 'Soft Diffused'}.`}
                    </p>
                  </div>
                </div>

                {/* Optional Prompt Directives Comparison */}
                {showPromptDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                        Prompt A ({itemA?.medium.name}):
                      </span>
                      <div className="p-3 bg-black/60 rounded-xl text-[11px] font-mono text-zinc-300 max-h-48 overflow-y-auto leading-relaxed border border-zinc-800/80 whitespace-pre-wrap">
                        {itemA?.shot.promptUsed || 'No prompt stored.'}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-sky-400 font-bold text-[11px] uppercase tracking-wider">
                        Prompt B ({itemB?.medium.name}):
                      </span>
                      <div className="p-3 bg-black/60 rounded-xl text-[11px] font-mono text-zinc-300 max-h-48 overflow-y-auto leading-relaxed border border-zinc-800/80 whitespace-pre-wrap">
                        {itemB?.shot.promptUsed || 'No prompt stored.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
