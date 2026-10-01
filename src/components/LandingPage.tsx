import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  HardDrive,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  Eye,
  Sliders,
  Sun,
  CloudSun,
  Lock,
  GraduationCap,
  ChevronRight,
  ExternalLink,
  Zap,
  Check,
  Camera,
  Mail,
} from 'lucide-react';
import { ProductBrand } from '../types';
import { PRESET_PRODUCTS } from '../data/constants';

interface LandingPageProps {
  onEnterApp: () => void;
  onGoToSignIn: () => void;
  isAuthenticated: boolean;
  userEmail?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onGoToSignIn,
  isAuthenticated,
  userEmail,
}) => {
  const [activeTabProduct, setActiveTabProduct] = useState<ProductBrand>(PRESET_PRODUCTS[0]);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'Define Visual DNA Blueprint',
      subtitle: 'Lock Silhouette, Proportions & Materials',
      desc: 'Lock exact geometric tolerances, micro-beveled chamfers, surface index of refraction, and brand logos. This invariant specification guarantees that your product renders identically across every advertisement without morphological distortion.',
      highlight: 'Zero human presence guaranteed.',
      badge: 'Step 1: Identity Lock',
    },
    {
      step: '02',
      title: 'Select Advertising Mediums & Optics',
      subtitle: 'Billboards, New York Times, Social & Retail',
      desc: 'Choose from high-impact outdoor billboards, textured broadsheet newspaper ads, square social carousels, and minimalist retail lightboxes. Toggle between dramatic High Contrast key lighting or soft wrap-around diffuse studio lighting.',
      highlight: 'Phase One IQ4 150MP optical medium format physics.',
      badge: 'Step 2: Staging & Mood',
    },
    {
      step: '03',
      title: 'Generate with Nano-Banana Flash & Lite',
      subtitle: 'Fast Renders, Zero 4K Overhead',
      desc: 'Harness state-of-the-art Nano-Banana Flash for pristine commercial output and Nano-Banana Lite for rapid composition previews. Experience Cannes Lions level specular roll-off and authentic ambient contact occlusion.',
      highlight: 'Ultra-fast inference & responsive rendering.',
      badge: 'Step 3: AI Inference',
    },
    {
      step: '04',
      title: 'Save Batches to Google Drive',
      subtitle: 'Designated Cloud Folder Synchronization',
      desc: 'Export complete batches directly into designated folders in your Google Drive with structured metadata, or browse past iterations with full timeline rollback and side-by-side consistency comparison.',
      highlight: 'Full Google Drive v3 REST API integration.',
      badge: 'Step 4: Cloud Sync',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-400 selection:text-zinc-950 font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white to-zinc-300 text-zinc-950 flex items-center justify-center font-bold tracking-tight shadow-md border border-zinc-700">
              <span className="text-sm font-mono font-black">B²</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">Brand Studio</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Commercial Grade • Zero-Human Policy
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden md:block">
                Cross-Medium Commercial Advertising Visualizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#how-it-works"
              className="hidden md:inline-flex text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="hidden md:inline-flex text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Core Capabilities
            </a>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={onEnterApp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoToSignIn}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-900" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-800/80">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Universal Access Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-semibold text-white">Commercial Staging Platform</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">Sign in with any valid email</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Imagine Any Product.{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-orange-400 bg-clip-text text-transparent">
                Consistently Across Every Medium.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Generate commercial advertising photography for any industrial product across billboards, newspapers, social feeds, and print with <strong>locked Visual DNA</strong> and <strong>strictly zero humans</strong>. Powered by Nano-Banana Flash & Lite with direct Google Drive batch export.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  id="hero-launch-app-btn"
                  onClick={onEnterApp}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all shadow-xl shadow-amber-400/20 active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  <span>Launch Brand Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  id="hero-sign-in-btn"
                  onClick={onGoToSignIn}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all shadow-xl shadow-amber-400/20 active:scale-98 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Sign In with Email or Google</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Explore Workflow</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </a>
            </div>

            {/* Badges / Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero-Human Policy Invariant
              </span>
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-blue-400" />
                Google Drive Batch Sync
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Nano-Banana Flash & Lite
              </span>
            </div>
          </div>

          {/* Interactive Hero Showcase */}
          <div className="mt-12 sm:mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Live Multi-Medium Consistency Preview:
                </span>
                <div className="flex items-center gap-1.5">
                  {PRESET_PRODUCTS.map((prod) => (
                    <button
                      key={prod.name}
                      type="button"
                      onClick={() => setActiveTabProduct(prod)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTabProduct.name === prod.name
                          ? 'bg-amber-400 text-zinc-950 shadow-xs'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {prod.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visual DNA Locked (3 in a Row Widescreen Layout)</span>
              </div>
            </div>

            {/* 3 in a row Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
              {/* Card 1: Billboard (16:9) */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col group">
                <div className="p-3 bg-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      16:9
                    </span>
                    <span className="font-bold text-white">Highway Billboard</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">Outdoor Medium</span>
                </div>
                <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-6 flex flex-col justify-between">
                    <div className="text-right">
                      <span className="text-2xl font-black tracking-widest text-zinc-200">
                        {activeTabProduct.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/40 shadow-2xl flex items-center justify-center text-center p-2 group-hover:scale-105 transition-transform duration-500">
                        <span className="text-[11px] font-mono text-amber-300 font-bold">
                          {activeTabProduct.category}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-300 font-serif italic">
                        "{activeTabProduct.tagline}"
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 text-[11px] text-zinc-400 space-y-1">
                  <p className="font-semibold text-zinc-200">Material Definition:</p>
                  <p className="line-clamp-2 text-zinc-400 text-[10px]">{activeTabProduct.materials}</p>
                </div>
              </div>

              {/* Card 2: Print Magazine (3:4) */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col group">
                <div className="p-3 bg-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      3:4
                    </span>
                    <span className="font-bold text-white">Architectural Digest</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">Print Medium</span>
                </div>
                <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-zinc-850 via-zinc-900 to-black p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                      <span>ISSUE NO. 84</span>
                      <span>PAGE SPREAD</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-zinc-700/40 to-zinc-900/80 border border-zinc-600/50 shadow-2xl flex items-center justify-center text-center p-2 group-hover:scale-105 transition-transform duration-500">
                        <span className="text-[11px] font-mono text-zinc-200 font-bold">
                          {activeTabProduct.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] text-zinc-300 font-mono tracking-wider uppercase">
                        Master Form & Surface
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 text-[11px] text-zinc-400 space-y-1">
                  <p className="font-semibold text-zinc-200">Finish Specification:</p>
                  <p className="line-clamp-2 text-zinc-400 text-[10px]">{activeTabProduct.finish}</p>
                </div>
              </div>

              {/* Card 3: Social Commercial Post (1:1) */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col group">
                <div className="p-3 bg-zinc-900/80 border-b border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      1:1
                    </span>
                    <span className="font-bold text-white">Instagram Hero Post</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">Digital Feed</span>
                </div>
                <div className="relative aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-zinc-850 via-zinc-900 to-black p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-400 text-zinc-950 text-[9px] font-black flex items-center justify-center">
                        B²
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold">
                        {activeTabProduct.name.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-zinc-700/60 shadow-2xl flex items-center justify-center text-center p-2 group-hover:scale-105 transition-transform duration-500">
                        <span className="text-[11px] font-mono text-zinc-300 font-bold">
                          {activeTabProduct.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>#commercial #object</span>
                      <span className="text-emerald-400">100% Invariant</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 text-[11px] text-zinc-400 space-y-1">
                  <p className="font-semibold text-zinc-200">Color Signature:</p>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {activeTabProduct.colors.map((c) => (
                      <span
                        key={c.name}
                        className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 border-b border-zinc-800/80 bg-zinc-900/30">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Execution Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How To Use Brand Studio
            </h2>
            <p className="text-sm text-zinc-400">
              A 4-step disciplined workflow designed for industrial design students, faculty, and advertising engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((ws, idx) => (
              <div
                key={ws.step}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  activeWorkflowStep === idx
                    ? 'bg-zinc-900 border-amber-400/80 ring-2 ring-amber-400/20 shadow-xl'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-zinc-600">
                      {ws.step}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {ws.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{ws.title}</h3>
                  <p className="text-xs font-semibold text-amber-400/90">{ws.subtitle}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">{ws.desc}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>{ws.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="features" className="py-16 md:py-24 border-b border-zinc-800/80">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              Zero Compromise Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineered for Cannes Lions Commercial Purity
            </h2>
            <p className="text-sm text-zinc-400">
              Eliminate synthetic AI artifacts, deformed human fingers, and inconsistent product geometry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Strict Zero-Human Policy</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Advertising campaigns are ruined when AI models attempt to draw human hands holding products. Brand Studio mathematically enforces uninhabited scenes with solitary commercial studio staging.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Google Drive Batch Sync</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect your Google Account and save high-resolution batches directly to designated Drive folders. Includes automatic naming, aspect ratio categorization, and direct Drive links.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Nano-Banana Flash & Lite</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Optimized strictly for Flash & Lite models without bloated 4K timeouts. Generate multi-shot batches in seconds with authentic optical depth of field and contact ambient occlusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access Gate Banner */}
      <section className="py-16 bg-gradient-to-b from-zinc-900/60 to-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Universal Access for Industrial Designers & Commercial Teams
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              Sign in with any valid email address or Google account to unlock multi-medium rendering, locked Visual DNA, and Google Drive batch sync.
            </p>
          </div>

          <div className="pt-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onEnterApp}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all shadow-lg cursor-pointer"
              >
                <span>Enter Brand Studio (Signed In: {userEmail})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoToSignIn}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm transition-all shadow-lg cursor-pointer"
              >
                <Mail className="w-4 h-4 text-zinc-950" />
                <span>Sign In with Any Valid Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 text-xs text-zinc-500">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-zinc-400">Brand Studio B²</span>
            <span>•</span>
            <span>Commercial Creative & Advertising Production Suite</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Locked Visual DNA</span>
            <span>Zero Humans</span>
            <span>Google Drive API v3</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
