import React, { useState } from 'react';
import { ProductBrand, MediumDef, GlobalLightingMood } from '../types';
import { ShieldCheck, UserX, Cpu, Sun, CloudSun, ChevronDown, ChevronUp, Sparkles, Columns } from 'lucide-react';

interface ConsistencyOverviewProps {
  brand: ProductBrand;
  mediums: MediumDef[];
  completedCount: number;
  activeModel: string;
  globalLighting?: GlobalLightingMood;
  onToggleLighting?: (mood?: GlobalLightingMood) => void;
  onOpenCompare?: () => void;
}

export const ConsistencyOverview: React.FC<ConsistencyOverviewProps> = ({
  brand,
  mediums,
  completedCount,
  activeModel,
  globalLighting = 'high-contrast',
  onToggleLighting,
  onOpenCompare,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSoftDiffused = globalLighting === 'soft-diffused';

  const modelFriendlyName = activeModel.includes('flash-image')
    ? 'Gemini 2.5 Flash / Nano-Banana 2'
    : activeModel.includes('lite')
    ? 'Nano-Banana Lite'
    : 'Nano-Banana Pro (4K Studio)';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden transition-all">
      {/* Compact High-Order Protocol Strip */}
      <div className="px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {/* Item 1: Active Product Blueprint */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
            <span className="font-semibold text-zinc-900">
              {brand.name || 'Signature Product'}
            </span>
            <span className="text-zinc-400">|</span>
            <span className="text-zinc-600 font-medium truncate max-w-[200px] sm:max-w-xs">
              {brand.category || 'Product'}
            </span>
          </div>

          {/* Item 2: Zero Humans Policy */}
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-700 font-medium">
            <UserX className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Zero Humans Policy Enforced</span>
          </div>

          {/* Item 3: Lighting Mood */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="protocol-lighting-toggle-btn"
              onClick={() => onToggleLighting?.()}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold cursor-pointer border transition-colors ${
                isSoftDiffused
                  ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
              title="Click to toggle studio lighting mood"
            >
              {isSoftDiffused ? (
                <CloudSun className="w-3.5 h-3.5 text-sky-600" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{isSoftDiffused ? 'Soft Diffused' : 'High Contrast'} Lighting</span>
            </button>
          </div>

          {/* Item 4: Model Engine */}
          <div className="hidden md:flex items-center gap-1.5 text-zinc-600">
            <Cpu className="w-3.5 h-3.5 text-zinc-600" />
            <span className="font-mono text-[11px] text-zinc-800 font-medium">
              {modelFriendlyName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Compare Mode Trigger */}
          {completedCount >= 2 && onOpenCompare && (
            <button
              type="button"
              id="protocol-compare-btn"
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-900 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Open Compare Mode to verify visual consistency across mediums"
            >
              <Columns className="w-3 h-3 text-zinc-950" />
              <span>Compare ({completedCount})</span>
            </button>
          )}

          {/* Completion Meter */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-lg">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{completedCount} of {mediums.length} Mediums Staged</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer transition-colors"
            title={isExpanded ? 'Collapse Consistency Protocol' : 'Expand Consistency Details'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Protocol Specifications */}
      {isExpanded && (
        <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/70 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Locked Visual DNA Protocol</span>
            </div>
            <p className="text-zinc-600 leading-relaxed">
              Materials ({brand.materials || 'Machined alloys and glass'}), silhouette geometry, and Pantone swatches are embedded into every generation prompt to guarantee invariant brand identity.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              <UserX className="w-4 h-4 text-amber-600" />
              <span>Inhabited Scene Negative Invariants</span>
            </div>
            <p className="text-zinc-600 leading-relaxed">
              Rigorous negative constraints prohibit people, faces, hands, fingers, and silhouettes, placing 100% focus on the solitary hero commercial product.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900">
              {isSoftDiffused ? <CloudSun className="w-4 h-4 text-sky-600" /> : <Sun className="w-4 h-4 text-amber-600" />}
              <span>{isSoftDiffused ? 'Soft Diffused Optics' : 'High Contrast Chiaroscuro'}</span>
            </div>
            <p className="text-zinc-600 leading-relaxed">
              {isSoftDiffused
                ? 'Broad overhead softboxes, gentle wrap-around fill, and subtle shadow roll-off with no harsh specular glare.'
                : 'Sculpted directional key lights, deep shadow falloff, razor specular catchlights, and punchy dynamic range.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
