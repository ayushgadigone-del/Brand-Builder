import React, { useState } from 'react';
import { ProductBrand, VisualDnaOptimizationResult } from '../types';
import {
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
  Copy,
  ArrowRight,
  TrendingUp,
  Sliders,
  Camera,
  Layers,
  Info,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { copyTextToClipboard } from '../utils/share';

interface VisualDnaOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: ProductBrand;
  optimizationResult: VisualDnaOptimizationResult | null;
  isLoading: boolean;
  onApplyOptimizedDna: (newDna: string) => void;
  onReanalyze: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VisualDnaOptimizerModal: React.FC<VisualDnaOptimizerModalProps> = ({
  isOpen,
  onClose,
  brand,
  optimizationResult,
  isLoading,
  onApplyOptimizedDna,
  onReanalyze,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeDnaTab, setActiveDnaTab] = useState<'optimized' | 'diff'>('optimized');
  const [editedDna, setEditedDna] = useState<string>('');

  // Synchronize editedDna when optimizationResult updates
  React.useEffect(() => {
    if (optimizationResult?.optimizedVisualDna) {
      setEditedDna(optimizationResult.optimizedVisualDna);
    }
  }, [optimizationResult]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const textToCopy = editedDna || optimizationResult?.optimizedVisualDna || '';
    if (!textToCopy) return;
    const success = await copyTextToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      onShowToast?.('Optimized Visual DNA copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    const finalDna = editedDna.trim() || optimizationResult?.optimizedVisualDna || '';
    if (!finalDna) return;
    onApplyOptimizedDna(finalDna);
    onShowToast?.('Applied Gemini-optimized Visual DNA to product!', 'success');
    onClose();
  };

  const currentScore = optimizationResult?.photorealismScore ?? 65;
  const optimizedScore = optimizationResult?.optimizedScore ?? 96;
  const scoreBoost = Math.max(0, optimizedScore - currentScore);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Visual DNA Auto-Optimizer
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Gemini Photorealism Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                AI analysis of prompt specificity, material physics, and optical camera invariants
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="reanalyze-dna-btn"
              onClick={onReanalyze}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer disabled:opacity-50"
              title="Re-run Gemini analysis"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Re-analyze</span>
            </button>

            <button
              type="button"
              id="close-optimizer-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            /* Loading State */
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 shadow-xl animate-pulse">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Analyzing Visual DNA with Gemini...
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Critiquing physical geometry constraints, material refraction indices, subsurface scattering, and prime lens camera optics.
                </p>
              </div>
            </div>
          ) : !optimizationResult ? (
            /* Empty / Error state */
            <div className="py-16 text-center space-y-3">
              <p className="text-xs text-zinc-400">No optimization data available.</p>
              <button
                type="button"
                onClick={onReanalyze}
                className="px-4 py-2 bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-amber-300"
              >
                Analyze Now
              </button>
            </div>
          ) : (
            <>
              {/* Score Meter & Assessment Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
                {/* Current Score */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Current Specificity
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {currentScore}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 ml-auto font-semibold">
                      Moderate
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight pt-1">
                    Vague geometry risks synthetic CGI plastic textures
                  </p>
                </div>

                {/* Score Boost Arrow */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/30 to-emerald-950/30 border border-emerald-800/40 space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Photorealism Boost
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      +{scoreBoost}
                    </span>
                    <span className="text-xs font-bold text-emerald-300">points</span>
                  </div>
                  <p className="text-[11px] text-emerald-400/80 leading-tight">
                    Injected Hasselblad optics & subsurface light scattering
                  </p>
                </div>

                {/* Optimized Score */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-emerald-900/60 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Optimized Grade
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {optimizedScore}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/ 100</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 ml-auto font-bold">
                      Commercial Hero
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight pt-1">
                    Zero-human invariant, tactile micro-grooves, calibrated IOR
                  </p>
                </div>
              </div>

              {/* Executive Summary */}
              {optimizationResult.summary && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {optimizationResult.summary}
                  </p>
                </div>
              )}

              {/* Suggestions Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Specific Invariant Recommendations ({optimizationResult.suggestions?.length || 0})
                    </h3>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Critical prompts to bypass synthetic rendering clichés
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {optimizationResult.suggestions?.map((sug, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                            {sug.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-100">{sug.title}</h4>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div className="text-red-400/90 bg-red-950/20 p-2 rounded-lg border border-red-900/40">
                          <span className="font-semibold text-red-300">Why it's synthetic: </span>
                          {sug.critique}
                        </div>
                        <div className="text-emerald-300/90 bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/40">
                          <span className="font-semibold text-emerald-200">How to solve: </span>
                          {sug.recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Added Key Specifications Tags */}
              {optimizationResult.highlightAdditions && optimizationResult.highlightAdditions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Injected Physical & Optical Directives:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {optimizationResult.highlightAdditions.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 text-emerald-300 border border-emerald-800/50"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Blueprint Prompt Editor / Comparator */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <span>Optimized Visual DNA Blueprint</span>
                    <span className="text-[10px] text-zinc-500 font-normal lowercase">
                      (editable before applying)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer border border-zinc-700"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Blueprint</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Current / Original */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-500">
                      Current Prompt Lock:
                    </span>
                    <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-[11px] font-mono text-zinc-400 h-40 overflow-y-auto leading-relaxed select-text">
                      {brand.visualDnaLock || brand.description || 'No existing prompt lock defined.'}
                    </div>
                  </div>

                  {/* Optimized (Editable) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-amber-400">
                        Gemini-Optimized Blueprint:
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        Ready to Apply
                      </span>
                    </div>
                    <textarea
                      id="optimized-dna-textarea"
                      rows={6}
                      value={editedDna}
                      onChange={(e) => setEditedDna(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black/90 border border-amber-500/50 text-[11px] font-mono text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed h-40"
                      placeholder="Optimized visual blueprint..."
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="apply-optimized-dna-btn"
              onClick={handleApply}
              disabled={isLoading || !optimizationResult}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-md cursor-pointer transition-all active:scale-98 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Apply Optimized DNA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
