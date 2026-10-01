import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Plus,
  Sun,
  CloudSun,
  HardDrive,
  History,
  LogOut,
  ChevronDown,
  Maximize2,
  Minimize2,
  GraduationCap,
  Home,
} from 'lucide-react';
import { GlobalLightingMood } from '../types';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeModel: string;
  onModelChange: (model: string) => void;
  isGeneratingAll: boolean;
  onGenerateAll: () => void;
  completedCount: number;
  totalCount: number;
  onOpenNewProductModal: () => void;
  globalLighting?: GlobalLightingMood;
  onToggleLighting?: (mood?: GlobalLightingMood) => void;
  currentUser?: User | null;
  onSignInGoogle?: () => void;
  onSignOutGoogle?: () => void;
  onOpenDriveExport?: () => void;
  onOpenBatchHistory?: () => void;
  batchHistoryCount?: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onGoToLanding?: () => void;
  authorizedEmail?: string | null;
}

// Strictly Nano-Banana Flash and Lite models only. No 4K model per explicit instructions.
const SUPPORTED_MODELS = [
  {
    id: 'gemini-3.1-flash-image',
    label: 'Nano-Banana Flash',
    sublabel: 'High-Fidelity Commercial Rendering',
    badge: 'Flash',
  },
  {
    id: 'gemini-3.1-flash-lite-image',
    label: 'Nano-Banana Lite',
    sublabel: 'Rapid Draft & Composition Preview',
    badge: 'Lite',
  },
];

export const Header: React.FC<HeaderProps> = ({
  activeModel,
  onModelChange,
  isGeneratingAll,
  onGenerateAll,
  completedCount,
  totalCount,
  onOpenNewProductModal,
  globalLighting = 'high-contrast',
  onToggleLighting,
  currentUser = null,
  onSignInGoogle,
  onSignOutGoogle,
  onOpenDriveExport,
  onOpenBatchHistory,
  batchHistoryCount = 0,
  isFullscreen = false,
  onToggleFullscreen,
  onGoToLanding,
  authorizedEmail = null,
}) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  return (
    <header className="border-b border-zinc-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Studio Logo & Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onGoToLanding && (
            <button
              type="button"
              id="header-home-btn"
              onClick={onGoToLanding}
              className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer mr-0.5"
              title="Return to Brand Studio Overview & Landing Page"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold tracking-tight shadow-xs border border-zinc-800">
            <span className="text-sm tracking-tighter font-mono font-black">B²</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-950 tracking-tight">
                Brand Studio
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {authorizedEmail ? authorizedEmail : 'Zero-Human Policy'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block">
              Cross-Medium Commercial Visualization • 3-in-a-Row Fullscreen
            </p>
          </div>
        </div>

        {/* Global Controls Toolbar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Global Studio Lighting Toggle */}
          <div className="flex items-center bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/80 text-xs">
            <button
              type="button"
              id="header-lighting-high-contrast-btn"
              onClick={() => onToggleLighting?.('high-contrast')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                globalLighting === 'high-contrast'
                  ? 'bg-white text-zinc-950 shadow-2xs font-bold border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="High Contrast: Sculpted directional key lights, deep shadows & punchy reflections"
            >
              <Sun
                className={`w-3.5 h-3.5 ${
                  globalLighting === 'high-contrast' ? 'text-amber-500' : 'text-zinc-400'
                }`}
              />
              <span className="hidden lg:inline">High Contrast</span>
              <span className="lg:hidden">Hard</span>
            </button>
            <button
              type="button"
              id="header-lighting-soft-diffused-btn"
              onClick={() => onToggleLighting?.('soft-diffused')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                globalLighting === 'soft-diffused'
                  ? 'bg-white text-zinc-950 shadow-2xs font-bold border border-zinc-200/60'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="Soft Diffused: Silk softbox wrap-around lighting, smooth falloff & airy studio atmosphere"
            >
              <CloudSun
                className={`w-3.5 h-3.5 ${
                  globalLighting === 'soft-diffused' ? 'text-sky-500' : 'text-zinc-400'
                }`}
              />
              <span className="hidden lg:inline">Soft Diffused</span>
              <span className="lg:hidden">Soft</span>
            </button>
          </div>

          {/* Model Selector (Strictly Nano-Banana Flash and Lite only, NO 4K) */}
          <div className="relative inline-flex items-center bg-zinc-100/90 rounded-xl p-1 border border-zinc-200/80 text-xs">
            <div className="hidden xl:flex items-center gap-1 pr-1 pl-1.5 text-zinc-500 font-semibold text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-zinc-600" />
              <span>Model:</span>
            </div>
            <div className="flex items-center gap-0.5">
              {SUPPORTED_MODELS.map((m) => {
                const isActive = activeModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onModelChange(m.id)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs ${
                      isActive
                        ? 'bg-white text-zinc-950 shadow-2xs font-bold border border-zinc-200/60'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                    title={`${m.label}: ${m.sublabel}`}
                  >
                    <span className="hidden sm:inline">{m.label}</span>
                    <span className="sm:hidden">{m.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Google Drive Save Action */}
          <button
            type="button"
            id="header-save-to-drive-btn"
            onClick={onOpenDriveExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 shadow-2xs cursor-pointer transition-colors"
            title="Save generated image batch to designated Google Drive folder"
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Save to Drive</span>
            <span className="md:hidden">Drive</span>
          </button>

          {/* Batch History Button */}
          {onOpenBatchHistory && (
            <button
              type="button"
              id="header-batch-history-btn"
              onClick={onOpenBatchHistory}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-2xs cursor-pointer transition-colors"
              title="View Batch History log and past iterations"
            >
              <History className="w-3.5 h-3.5 text-zinc-700" />
              <span className="hidden lg:inline">Batch History</span>
              {batchHistoryCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-zinc-900 text-white text-[10px] font-mono">
                  {batchHistoryCount}
                </span>
              )}
            </button>
          )}

          {/* Fullscreen / Widescreen Viewport Toggle */}
          {onToggleFullscreen && (
            <button
              type="button"
              id="header-fullscreen-toggle-btn"
              onClick={onToggleFullscreen}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                isFullscreen
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                  : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
              title={isFullscreen ? 'Switch to Standard Width' : 'Expand to Fullscreen 3-Column Studio'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-zinc-600" />
              )}
              <span className="hidden xl:inline">{isFullscreen ? 'Standard' : 'Fullscreen'}</span>
            </button>
          )}

          {/* New Product Quick Action */}
          <button
            type="button"
            id="header-add-product-btn"
            onClick={onOpenNewProductModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-2xs cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-700" />
            <span>Product</span>
          </button>

          {/* Batch Generate Primary CTA */}
          <button
            id="generate-all-campaign-btn"
            type="button"
            disabled={isGeneratingAll}
            onClick={onGenerateAll}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
              isGeneratingAll
                ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white active:scale-98'
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${
                isGeneratingAll ? 'animate-spin text-amber-300' : 'text-amber-300'
              }`}
            />
            <span>
              {isGeneratingAll
                ? `Rendering (${completedCount}/${totalCount})`
                : 'Render All'}
            </span>
          </button>

          {/* Google Account Authentication & Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                id="header-user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 text-xs font-medium text-zinc-800 transition-colors cursor-pointer"
                title={currentUser.email || 'Google Account'}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'G'}
                  </div>
                )}
                <span className="hidden xl:inline max-w-[90px] truncate text-[11px]">
                  {currentUser.displayName || currentUser.email}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-zinc-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-zinc-100">
                    <p className="text-xs font-bold text-zinc-900 truncate">
                      {currentUser.displayName || 'Google User'}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Google Drive Connected</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenDriveExport?.();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                    <span>Save to Google Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOutGoogle?.();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-zinc-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Official Material Google Sign-In Button (Mandatory per skill) */
            <button
              type="button"
              id="header-sign-in-btn"
              onClick={onSignInGoogle}
              className="gsi-material-button relative inline-flex items-center justify-center px-3 py-1.5 bg-white text-zinc-800 font-medium text-xs rounded-xl shadow-2xs hover:bg-zinc-50 border border-zinc-200 transition-all cursor-pointer"
              title="Sign in with Google to enable saving image batches to Google Drive"
            >
              <div className="gsi-material-button-content-wrapper flex items-center gap-2">
                <div className="gsi-material-button-icon w-4 h-4 flex items-center justify-center">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    style={{ display: 'block', width: '100%', height: '100%' }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-semibold text-zinc-800 hidden sm:inline">
                  Sign in
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
