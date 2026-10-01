import React from 'react';
import { ProductBrand, MediumDef } from '../types';
import {
  Sparkles,
  ShieldCheck,
  UserX,
  Tv,
  Newspaper,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Box,
} from 'lucide-react';

interface GridInstructionGuideProps {
  brand: ProductBrand;
  mediums: MediumDef[];
  onGenerateAll: () => void;
  onGenerateMedium: (mediumId: string) => void;
  isGeneratingAll: boolean;
  onOpenNewProductModal: () => void;
  onClose?: () => void;
}

export const GridInstructionGuide: React.FC<GridInstructionGuideProps> = ({
  brand,
  mediums,
  onGenerateAll,
  onGenerateMedium,
  isGeneratingAll,
  onOpenNewProductModal,
  onClose,
}) => {
  return (
    <div
      id="grid-placeholder-instruction-guide"
      className="col-span-full bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-5 md:p-6 space-y-5"
    >
      {/* Top Banner & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-zinc-100">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Commercial Staging Workflow</span>
            </span>
          </div>
          <h3 className="text-base font-bold text-zinc-950 tracking-tight">
            Visualizing &quot;{brand.name}&quot; Across Every Medium
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Generate consistent, commercial-grade product photography across advertising formats—from highway billboards to newspaper foldouts—while strictly preserving product geometry, tactile materials, and zero-human framing.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:self-start">
          {/* Active Product DNA Badge */}
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-2.5 min-w-[170px]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
              <Box className="w-3.5 h-3.5 text-zinc-600" />
              <span className="truncate">{brand.name}</span>
            </div>
            <p className="text-[10px] text-zinc-500 truncate max-w-[160px]">
              {brand.category}
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Dismiss Guide"
            >
              <span className="text-xs font-bold px-1">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-Step Guided Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/70 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-900 text-white text-xs font-bold font-mono">
                1
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Setup
              </span>
            </div>
            <h4 className="text-xs font-bold text-zinc-900">
              Confirm Product DNA
            </h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Review or edit the physical shape, tactile materials, and color swatches on the left panel, or select another brand preset.
            </p>
          </div>
          <button
            type="button"
            id="guide-switch-product-btn"
            onClick={onOpenNewProductModal}
            className="text-[11px] font-semibold text-zinc-800 hover:text-zinc-950 inline-flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>+ Add New Product</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/70 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-900 text-white text-xs font-bold font-mono">
                2
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Directives
              </span>
            </div>
            <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <UserX className="w-3.5 h-3.5 text-amber-600" />
              <span>Zero-Human Invariant</span>
            </h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Every medium is strictly rendered uninhabited—no models, faces, or hands. The spotlight remains 100% on the product and its advertising architecture.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 rounded px-2 py-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">Strict negative prompt enforced</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/70 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-zinc-900 text-white text-xs font-bold font-mono">
                3
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Generation
              </span>
            </div>
            <h4 className="text-xs font-bold text-zinc-900">
              Generate & Anchor
            </h4>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Click any medium card below to render it individually, or click the primary button to batch render the entire campaign portfolio.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-blue-700 bg-blue-50/80 border border-blue-200/60 rounded px-2 py-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="truncate">First shot locks as Master Anchor</span>
          </div>
        </div>
      </div>

      {/* Interactive Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-100/60 p-3.5 rounded-xl border border-zinc-200/80">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="guide-generate-all-btn"
            onClick={onGenerateAll}
            disabled={isGeneratingAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs cursor-pointer transition-all active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {isGeneratingAll
                ? 'Rendering Campaign...'
                : `Generate All ${mediums.length} Campaign Mediums`}
            </span>
          </button>

          <button
            type="button"
            id="guide-generate-billboard-btn"
            onClick={() => onGenerateMedium('billboard')}
            disabled={isGeneratingAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 shadow-2xs cursor-pointer transition-colors"
          >
            <Tv className="w-3.5 h-3.5 text-zinc-600" />
            <span>Try Billboard (16:9)</span>
          </button>

          <button
            type="button"
            id="guide-generate-newspaper-btn"
            onClick={() => onGenerateMedium('newspaper')}
            disabled={isGeneratingAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 shadow-2xs cursor-pointer transition-colors"
          >
            <Newspaper className="w-3.5 h-3.5 text-zinc-600" />
            <span>Try Newspaper (3:4)</span>
          </button>
        </div>

        <span className="text-[11px] text-zinc-500 font-mono sm:text-right shrink-0">
          0 of {mediums.length} mediums rendered
        </span>
      </div>
    </div>
  );
};
