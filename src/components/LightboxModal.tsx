import React, { useState } from 'react';
import { GeneratedShot, MediumDef, ProductBrand, GlobalLightingMood } from '../types';
import { X, Download, Anchor, Copy, Check, ShieldCheck, Sparkles, Cpu, Share2, Sun, CloudSun, Columns, HardDrive } from 'lucide-react';
import { buildShareableCampaignUrl, copyTextToClipboard } from '../utils/share';

interface LightboxModalProps {
  shot: GeneratedShot | null;
  medium?: MediumDef;
  brand: ProductBrand;
  onClose: () => void;
  onSetAsReferenceAnchor: (imageUrl: string) => void;
  isAnchor: boolean;
  activeModel: string;
  globalLighting?: GlobalLightingMood;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenCompare?: (shotId: string) => void;
  onSaveToDrive?: (shot: GeneratedShot) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  shot,
  medium,
  brand,
  onClose,
  onSetAsReferenceAnchor,
  isAnchor,
  activeModel,
  globalLighting = 'high-contrast',
  onShowToast,
  onOpenCompare,
  onSaveToDrive,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  if (!shot || !shot.imageUrl) return null;

  const currentLighting = shot.lightingMood || globalLighting;

  const handleCopyPrompt = () => {
    if (shot.promptUsed) {
      navigator.clipboard.writeText(shot.promptUsed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareUrl = buildShareableCampaignUrl(brand, medium?.id, activeModel, currentLighting);
    const success = await copyTextToClipboard(shareUrl);
    if (success) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
      onShowToast?.(`Shareable link for "${brand.name}" copied to clipboard!`, 'success');
    } else {
      onShowToast?.('Could not copy link automatically. Please copy manually below.', 'error');
    }
  };

  const handleDownload = () => {
    if (!shot.imageUrl) return;
    const a = document.createElement('a');
    a.href = shot.imageUrl;
    a.download = `${medium?.id || 'brand'}-nano-banana.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between text-white bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-xs text-amber-400">
              {shot.aspectRatio}
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {medium?.name || shot.mediumName}
              </h3>
              <p className="text-xs text-zinc-400">
                Rendered with Nano-Banana ({activeModel})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Action */}
            <button
              type="button"
              id="lightbox-share-btn"
              onClick={handleShare}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                shareCopied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
              title="Copy shareable campaign link to clipboard"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Compare Action */}
            {onOpenCompare && (
              <button
                type="button"
                id="lightbox-compare-btn"
                onClick={() => onOpenCompare(shot.mediumId || shot.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer border border-zinc-700/80 shadow-2xs hover:border-amber-400/60"
                title="Open side-by-side comparison mode to verify consistency with another shot"
              >
                <Columns className="w-3.5 h-3.5 text-amber-400" />
                <span>Compare</span>
              </button>
            )}

            {onSaveToDrive && (
              <button
                type="button"
                id="lightbox-drive-btn"
                onClick={() => onSaveToDrive(shot)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900/90 text-xs font-semibold text-blue-300 hover:text-white border border-blue-800 transition-colors cursor-pointer"
                title="Save this high-resolution image asset directly to Google Drive"
              >
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                <span>Save to Drive</span>
              </button>
            )}

            <button
              type="button"
              id="lightbox-download-btn"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              id="lightbox-anchor-btn"
              onClick={() => onSetAsReferenceAnchor(shot.imageUrl!)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isAnchor
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              <Anchor className="w-3.5 h-3.5" />
              <span>{isAnchor ? 'Active Anchor' : 'Set as Product Anchor'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area: image + metadata breakdown */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Visual */}
          <div className="lg:col-span-2 flex items-center justify-center bg-black/40 rounded-xl p-2 border border-zinc-800/80">
            <img
              src={shot.imageUrl}
              alt={medium?.name || 'Shot'}
              className="max-h-[68vh] w-auto object-contain rounded-lg shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details & Consistency Inspector */}
          <div className="space-y-4 text-xs">
            {/* Share Campaign Snapshot Box */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-zinc-200 font-semibold text-xs">
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Share Campaign State</span>
                </div>
                {shareCopied && (
                  <span className="text-[10px] font-semibold text-emerald-400 inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied!
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Generates a shareable URL preserving <span className="text-zinc-200 font-medium">{brand.name}</span>&apos;s locked visual DNA, physical finishes, swatches, and medium directives.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 bg-black/60 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-zinc-400 truncate border border-zinc-800/80 select-all">
                  {buildShareableCampaignUrl(brand, medium?.id, activeModel)}
                </div>
                <button
                  type="button"
                  id="lightbox-copy-link-btn"
                  onClick={handleShare}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1"
                >
                  {shareCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Compare Consistency Quick Action */}
            {onOpenCompare && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Columns className="w-3.5 h-3.5 text-amber-400" />
                    <span>Compare Visual Consistency</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Place side-by-side with another shot or use the split slider.
                  </p>
                </div>
                <button
                  type="button"
                  id="lightbox-inspector-compare-btn"
                  onClick={() => onOpenCompare(shot.mediumId || shot.id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs active:scale-98"
                >
                  Compare
                </button>
              </div>
            )}

            {/* Policy Badges */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Product Consistency Enforced</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Rendered with strict invariant product attributes: materials, finish, colors, silhouette, and logo placement.
              </p>
              <div className="flex items-center gap-2 text-amber-400 font-semibold pt-1 border-t border-zinc-800">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Human Constraint: 0 People</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Negative constraints guaranteed: no persons, faces, hands, or models in composition.
              </p>
            </div>

            {/* Global Lighting Mood Badge */}
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-zinc-200">
                  {currentLighting === 'soft-diffused' ? (
                    <CloudSun className="w-4 h-4 text-sky-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400" />
                  )}
                  <span>
                    {currentLighting === 'soft-diffused'
                      ? 'Soft Diffused Lighting'
                      : 'High Contrast Lighting'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {currentLighting === 'soft-diffused' ? 'Wrap Fill' : 'Directional Key'}
                </span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {currentLighting === 'soft-diffused'
                  ? 'Broad overhead silk softboxes with buttery smooth shadow roll-off, delicate ambient fill bounce, and even tonal gradation.'
                  : 'Hard directional key lighting with pronounced specular catchlights, deep chiaroscuro shadow gradients, and sculpted rim highlights.'}
              </p>
            </div>

            {/* Prompt Inspector */}
            {shot.promptUsed && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 font-semibold uppercase tracking-wider text-[10px]">
                    Full Generation Prompt:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-white text-[11px] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 bg-black/60 rounded-lg text-[11px] font-mono text-zinc-300 max-h-56 overflow-y-auto leading-relaxed border border-zinc-800/60 whitespace-pre-wrap">
                  {shot.promptUsed}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

