import React, { useState } from 'react';
import { MediumDef, GeneratedShot, GlobalLightingMood } from '../types';
import {
  Tv,
  Newspaper,
  Instagram,
  BookOpen,
  TrainFront,
  Store,
  Sparkles,
  RefreshCw,
  Maximize2,
  Download,
  AlertCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
  Anchor,
  Check,
  Sun,
  CloudSun,
  Columns,
} from 'lucide-react';

interface MediumCardProps {
  medium: MediumDef;
  shot?: GeneratedShot;
  onGenerate: (mediumId: string, customEnv?: string) => void;
  onOpenLightbox: (shot: GeneratedShot, medium: MediumDef) => void;
  onSetAsReferenceAnchor: (imageUrl: string) => void;
  isAnchorReference: boolean;
  globalLighting?: GlobalLightingMood;
  onOpenCompare?: (shotId: string) => void;
}

export const MediumCard: React.FC<MediumCardProps> = ({
  medium,
  shot,
  onGenerate,
  onOpenLightbox,
  onSetAsReferenceAnchor,
  isAnchorReference,
  globalLighting = 'high-contrast',
  onOpenCompare,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [envPrompt, setEnvPrompt] = useState(medium.defaultPromptEnv);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const getIcon = () => {
    switch (medium.iconName) {
      case 'Tv':
        return <Tv className="w-4 h-4 text-sky-600" />;
      case 'Newspaper':
        return <Newspaper className="w-4 h-4 text-stone-700" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'Subway':
        return <TrainFront className="w-4 h-4 text-emerald-600" />;
      case 'Store':
        return <Store className="w-4 h-4 text-amber-600" />;
      default:
        return <Tv className="w-4 h-4 text-zinc-600" />;
    }
  };

  const isGenerating = shot?.status === 'generating';
  const isCompleted = shot?.status === 'completed' && Boolean(shot?.imageUrl);
  const isError = shot?.status === 'error';

  // Get aspect ratio container styling
  const getAspectClass = () => {
    switch (medium.aspectRatio) {
      case '16:9':
        return 'aspect-16/9';
      case '3:4':
        return 'aspect-3/4';
      case '4:3':
        return 'aspect-4/3';
      case '9:16':
        return 'aspect-9/16';
      case '1:1':
      default:
        return 'aspect-square';
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shot?.imageUrl) return;
    const a = document.createElement('a');
    a.href = shot.imageUrl;
    a.download = `${medium.id}-shot.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id={`medium-card-${medium.id}`}
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden flex flex-col ${
        isAnchorReference
          ? 'border-blue-400 ring-2 ring-blue-100'
          : 'border-zinc-200 hover:border-zinc-300'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-zinc-100 flex items-start justify-between gap-3 bg-zinc-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shadow-2xs">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                {medium.name}
              </h3>
              {isAnchorReference && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Anchor Shot
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-medium text-zinc-500">
                {medium.badge}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-[11px] font-mono text-zinc-500">
                {medium.aspectRatio}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              showSettings
                ? 'bg-zinc-200 text-zinc-900'
                : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
            }`}
            title="Configure Medium Staging"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Settings / Environment Prompt Panel */}
      {showSettings && (
        <div className="p-3.5 bg-zinc-50 border-b border-zinc-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-700 uppercase tracking-wider text-[10px]">
              Medium Environment & Framing:
            </span>
            <button
              type="button"
              onClick={() => setEnvPrompt(medium.defaultPromptEnv)}
              className="text-zinc-400 hover:text-zinc-700 text-[10px] underline cursor-pointer"
            >
              Reset default
            </button>
          </div>
          <textarea
            rows={3}
            value={envPrompt}
            onChange={(e) => setEnvPrompt(e.target.value)}
            className="w-full p-2 border border-zinc-300 rounded-md bg-white text-xs text-zinc-800 focus:ring-1 focus:ring-zinc-900 focus:outline-none"
            placeholder="Describe the environment, lighting, architecture..."
          />
          <div className="flex items-center justify-between text-[11px] bg-zinc-50 px-2.5 py-1.5 rounded-md border border-zinc-200/80">
            <span className="text-zinc-600 flex items-center gap-1.5 font-medium">
              {globalLighting === 'soft-diffused' ? (
                <CloudSun className="w-3.5 h-3.5 text-sky-600" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>Lighting Protocol:</span>
            </span>
            <span className="font-semibold text-zinc-900">
              {globalLighting === 'soft-diffused' ? 'Soft Diffused (Silk Softbox)' : 'High Contrast (Directional Key)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span className="text-emerald-700 font-medium">
              ✓ Product DNA will be locked automatically
            </span>
            <span className="text-amber-700 font-medium">
              ✓ No humans policy enforced
            </span>
          </div>
        </div>
      )}

      {/* Media Canvas Area */}
      <div className="p-4 flex-1 flex flex-col justify-center items-center bg-zinc-100/40">
        <div
          className={`w-full relative rounded-xl overflow-hidden bg-zinc-900/5 border border-zinc-200/80 flex items-center justify-center ${getAspectClass()}`}
        >
          {isCompleted && shot?.imageUrl ? (
            <div
              className="group relative w-full h-full cursor-pointer"
              onClick={() => onOpenLightbox(shot, medium)}
            >
              <img
                src={shot.imageUrl}
                alt={`${medium.name} shot`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
                referrerPolicy="no-referrer"
              />

              {/* Lighting Mood Tag */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                <span className={`px-2 py-0.5 rounded-md backdrop-blur-xs text-[10px] font-semibold flex items-center gap-1 shadow-xs border ${
                  (shot.lightingMood || globalLighting) === 'soft-diffused'
                    ? 'bg-sky-950/80 text-sky-200 border-sky-500/30'
                    : 'bg-zinc-950/80 text-amber-200 border-amber-500/30'
                }`}>
                  {(shot.lightingMood || globalLighting) === 'soft-diffused' ? (
                    <CloudSun className="w-3 h-3 text-sky-300" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-300" />
                  )}
                  <span>{(shot.lightingMood || globalLighting) === 'soft-diffused' ? 'Soft Diffused' : 'High Contrast'}</span>
                </span>
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLightbox(shot, medium);
                  }}
                  className="p-2 rounded-lg bg-white/90 hover:bg-white text-zinc-900 text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  title="Expand Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
                {onOpenCompare && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCompare(medium.id);
                    }}
                    className="p-2 rounded-lg bg-white/90 hover:bg-white text-zinc-900 text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                    title="Compare this shot side-by-side with another"
                  >
                    <Columns className="w-3.5 h-3.5 text-amber-500" />
                    <span>Compare</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-white/90 hover:bg-white text-zinc-900 text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  title="Download Image"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetAsReferenceAnchor(shot.imageUrl!);
                  }}
                  className={`p-2 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${
                    isAnchorReference
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/90 hover:bg-white text-zinc-900'
                  }`}
                  title="Use this shot as product consistency anchor"
                >
                  <Anchor className="w-3.5 h-3.5" />
                  <span>{isAnchorReference ? 'Anchor' : 'Set Anchor'}</span>
                </button>
              </div>

              {/* Aspect Ratio & Studio Badges */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 pointer-events-none">
                {shot?.isStudioFallback && (
                  <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-amber-300 border border-amber-500/20">
                    Studio Staging
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white">
                  {medium.aspectRatio}
                </span>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800">
                  Rendering with Nano-Banana...
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Locking product consistency & zero-human framing
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="max-w-[220px]">
                <p className="text-xs font-bold text-red-900">
                  Generation Failed
                </p>
                <p className="text-[11px] text-red-600 line-clamp-2 mt-0.5">
                  {shot?.error || 'Unknown error. Click retry below.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onGenerate(medium.id, envPrompt)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium cursor-pointer transition-colors"
              >
                Retry Shot
              </button>
            </div>
          ) : (
            <div
              onClick={() => !isGenerating && onGenerate(medium.id, envPrompt)}
              className="flex flex-col items-center justify-center text-center p-6 space-y-3 cursor-pointer group/placeholder transition-all hover:bg-zinc-200/50 w-full h-full select-none"
              title={`Click to render ${medium.name}`}
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-200/80 group-hover/placeholder:bg-zinc-900 group-hover/placeholder:text-white flex items-center justify-center text-zinc-500 transition-all shadow-2xs group-hover/placeholder:scale-105">
                {getIcon()}
              </div>
              <div className="max-w-[240px] space-y-1">
                <p className="text-xs font-bold text-zinc-800 group-hover/placeholder:text-zinc-950 transition-colors">
                  {medium.name}
                </p>
                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                  {medium.description}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-[10px] font-semibold text-zinc-600 shadow-2xs group-hover/placeholder:border-zinc-400 group-hover/placeholder:text-zinc-900 transition-colors">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Click to render • {medium.aspectRatio}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 border-t border-zinc-100 bg-white flex items-center justify-between gap-2">
        <span className="text-[11px] text-zinc-500 font-medium">
          {isCompleted ? (
            <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Ready
            </span>
          ) : isGenerating ? (
            <span className="text-amber-700 font-medium animate-pulse">
              Processing...
            </span>
          ) : (
            'Not yet rendered'
          )}
        </span>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <button
              type="button"
              onClick={() => onGenerate(medium.id, envPrompt)}
              disabled={isGenerating}
              className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-xs font-medium cursor-pointer transition-colors"
              title="Regenerate this medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            id={`generate-btn-${medium.id}`}
            disabled={isGenerating}
            onClick={() => onGenerate(medium.id, envPrompt)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs ${
              isGenerating
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer active:scale-98'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isCompleted ? 'Rerender' : 'Render Shot'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
