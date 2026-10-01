import React, { useState, useEffect } from 'react';
import {
  ProductBrand,
  MediumDef,
  GeneratedShot,
  AspectRatioType,
  GlobalLightingMood,
  CampaignBatch,
} from './types';
import { DEFAULT_MEDIUMS, PRESET_PRODUCTS } from './data/constants';
import { Header } from './components/Header';
import { BrandForm } from './components/BrandForm';
import { MediumCard } from './components/MediumCard';
import { LightboxModal } from './components/LightboxModal';
import { AddMediumModal } from './components/AddMediumModal';
import { ConsistencyOverview } from './components/ConsistencyOverview';
import { NewProductModal } from './components/NewProductModal';
import { GridInstructionGuide } from './components/GridInstructionGuide';
import { CompareModal } from './components/CompareModal';
import { BatchHistoryModal } from './components/BatchHistoryModal';
import { GoogleDriveExportModal } from './components/GoogleDriveExportModal';
import { LandingPage } from './components/LandingPage';
import { SignInPage } from './components/SignInPage';
import { decodeCampaignState } from './utils/share';
import {
  loadStoredBrand,
  saveStoredBrand,
  loadStoredShots,
  saveStoredShots,
  loadStoredCustomProducts,
  saveStoredCustomProducts,
  loadStoredLightingMood,
  saveStoredLightingMood,
  loadStoredBatchHistory,
  saveStoredBatchHistory,
  clearStoredCampaign,
} from './utils/storage';
import { auth, initAuth, googleSignIn, logout } from './services/firebase';
import { User } from 'firebase/auth';
import {
  Sparkles,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Camera,
  RotateCcw,
  Check,
  Sun,
  CloudSun,
  Columns,
  HardDrive,
  History,
  Maximize2,
  Minimize2,
  GraduationCap,
} from 'lucide-react';

export default function App() {
  // Navigation State: 'landing' -> 'auth' -> 'app'
  const [authorizedEmail, setAuthorizedEmail] = useState<string | null>(() => {
    return localStorage.getItem('brand_studio_user_email');
  });
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'app'>(() => {
    const saved = localStorage.getItem('brand_studio_user_email');
    if (saved && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(saved.trim())) {
      return 'app';
    }
    return 'landing';
  });

  // Fullscreen / Wide mode state to eliminate empty space on sides
  const [isFullscreen, setIsFullscreen] = useState<boolean>(true);

  // Active brand and workspace states
  const [brand, setBrand] = useState<ProductBrand>(() => loadStoredBrand(PRESET_PRODUCTS[0]));
  const [customProducts, setCustomProducts] = useState<ProductBrand[]>(() =>
    loadStoredCustomProducts()
  );
  const [showNewProductModal, setShowNewProductModal] = useState<boolean>(false);
  const [showInstructionGuide, setShowInstructionGuide] = useState<boolean>(true);
  const [mediums, setMediums] = useState<MediumDef[]>(DEFAULT_MEDIUMS);
  const [shots, setShots] = useState<Record<string, GeneratedShot>>(() => loadStoredShots());
  // Strictly Nano-Banana Flash and Lite models (no 4K model)
  const [activeModel, setActiveModel] = useState<string>('gemini-3.1-flash-image');
  const [globalLighting, setGlobalLighting] = useState<GlobalLightingMood>(() =>
    loadStoredLightingMood('high-contrast')
  );
  const [batches, setBatches] = useState<CampaignBatch[]>(() => loadStoredBatchHistory());
  const [showBatchHistory, setShowBatchHistory] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [batchToExport, setBatchToExport] = useState<CampaignBatch | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => auth.currentUser);

  const [isGeneratingAll, setIsGeneratingAll] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxData, setLightboxData] = useState<{
    shot: GeneratedShot;
    medium: MediumDef;
  } | null>(null);
  const [compareData, setCompareData] = useState<{
    isOpen: boolean;
    initialShotIdA?: string;
    initialShotIdB?: string;
  }>({
    isOpen: false,
  });
  const [showAddMedium, setShowAddMedium] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleOpenCompare = (initialShotIdA?: string, initialShotIdB?: string) => {
    setLightboxData(null);
    setCompareData({
      isOpen: true,
      initialShotIdA,
      initialShotIdB,
    });
  };

  // Listen to Firebase Authentication state changes
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        if (user.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) {
          setAuthorizedEmail(user.email);
          localStorage.setItem('brand_studio_user_email', user.email);
        }
      },
      () => {
        setCurrentUser(auth.currentUser);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignInGoogle = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        const email = result.user.email || '';
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          setCurrentUser(result.user);
          setAuthorizedEmail(email);
          localStorage.setItem('brand_studio_user_email', email);
          showToast(`Signed in as ${email}! Access confirmed.`, 'success');
        } else {
          showToast(`Signed in successfully!`, 'success');
        }
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      showToast(err?.message || 'Google sign-in was cancelled or encountered an error.', 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setAuthorizedEmail(null);
      localStorage.removeItem('brand_studio_user_email');
      setCurrentPage('landing');
      showToast('Signed out of Brand Studio.', 'info');
    } catch (err: any) {
      showToast('Error during sign out.', 'error');
    }
  };

  const handleSignInSuccess = (email: string) => {
    setAuthorizedEmail(email);
    localStorage.setItem('brand_studio_user_email', email);
    setCurrentPage('app');
    showToast(`Access granted! Welcome to Brand Studio (${email})`, 'success');
  };

  const handleOpenDriveExport = (batch?: CampaignBatch) => {
    if (batch) {
      setBatchToExport(batch);
    } else {
      setBatchToExport(null);
    }
    setShowDriveModal(true);
  };

  // Auto-save active brand to localStorage
  useEffect(() => {
    saveStoredBrand(brand);
  }, [brand]);

  // Auto-save generated shots to localStorage
  useEffect(() => {
    saveStoredShots(shots);
  }, [shots]);

  // Auto-save custom products list to localStorage
  useEffect(() => {
    saveStoredCustomProducts(customProducts);
  }, [customProducts]);

  // Auto-save global lighting mood to localStorage
  useEffect(() => {
    saveStoredLightingMood(globalLighting);
  }, [globalLighting]);

  // Auto-save batch history to localStorage
  useEffect(() => {
    saveStoredBatchHistory(batches);
  }, [batches]);

  // Restore shared campaign state from URL query parameter on startup
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const campaignParam = searchParams.get('campaign');
      if (campaignParam) {
        const decoded = decodeCampaignState(campaignParam);
        if (decoded && decoded.brand && decoded.brand.name) {
          setBrand((prev) => ({
            ...prev,
            ...decoded.brand,
          }));
          if (decoded.model) {
            // Guarantee no 4K model restored
            const valid =
              decoded.model === 'gemini-3.1-flash-lite-image'
                ? 'gemini-3.1-flash-lite-image'
                : 'gemini-3.1-flash-image';
            setActiveModel(valid);
          }
          if (decoded.lighting) {
            setGlobalLighting(decoded.lighting);
          }
          if (decoded.mediumId) {
            const targetMedium = DEFAULT_MEDIUMS.find((m) => m.id === decoded.mediumId);
            if (targetMedium) {
              setActiveFilter(targetMedium.category);
            }
          }
          showToast(`Shared campaign for "${decoded.brand.name}" restored!`, 'success');
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const handleToggleGlobalLighting = (newMood?: GlobalLightingMood) => {
    const nextMood =
      newMood || (globalLighting === 'high-contrast' ? 'soft-diffused' : 'high-contrast');
    setGlobalLighting(nextMood);
    const label = nextMood === 'soft-diffused' ? 'Soft Diffused' : 'High Contrast';
    showToast(
      `Global Lighting switched to ${label}. All future shots will render with this mood.`,
      'info'
    );
  };

  // Helper to assemble full prompt enforcing consistency, lighting mood, and zero humans
  const buildPromptForMedium = (
    medium: MediumDef,
    customEnv?: string,
    lighting: GlobalLightingMood = globalLighting
  ): string => {
    const env = customEnv || medium.defaultPromptEnv;
    const colorStr = brand.colors.map((c) => `${c.name} (${c.hex})`).join(', ');

    const lightingDirective =
      lighting === 'soft-diffused'
        ? `STUDIO LIGHTING SETUP: Soft Diffused wrap-around studio lighting. Broad diffused silk softboxes overhead, buttery smooth shadow roll-off, delicate ambient bounce, zero harsh glare, even luminous tonal gradations, airy commercial look.`
        : `STUDIO LIGHTING SETUP: High Contrast dramatic studio lighting. Sculpted directional key lights, deep chiaroscuro shadow gradients, razor-sharp rim lights highlighting product geometry, tactile materials, and punchy dynamic range.`;

    return `COMMERCIAL BRAND PRODUCT SPECIFICATION:
Product Name: ${brand.name || 'Signature Product'}
Category: ${brand.category || 'Luxury Goods'}
Tagline: ${brand.tagline || ''}
Product Geometry & Proportions: ${brand.description || ''}
Tactile Materials: ${brand.materials || ''}
Surface Finish: ${brand.finish || ''}
Locked Color Palette: ${colorStr}
Logo & Embellishments: ${brand.logoDetails || ''}
LOCKED PRODUCT CONSISTENCY BLUEPRINT:
${brand.visualDnaLock}

${lightingDirective}

MEDIUM & ENVIRONMENT STAGING:
Medium: ${medium.name} (${medium.badge})
Environment Description: ${env}
Composition: Premium commercial advertising photography, razor-sharp focus, cinematic framing tailored for ${medium.name}.

PHOTO-REALISM & COMMERCIAL CINEMATOGRAPHY DIRECTIVES:
- Award-winning commercial advertising photography shot on Hasselblad H6D-100c / Phase One IQ4 150MP with 80mm prime lens at f/2.8.
- Authentic material physics: tangible brushed metal micro-grooves, unpolished stone grain, optical crystal refractions, accurate subsurface light scattering in liquids and glass, authentic matte paper fibers on packaging.
- Natural contact shadows and ambient ground occlusion anchoring the product realistically on surfaces.
- Creamy optical bokeh depth-of-field, razor-sharp focus on the product hero details.
- True-to-life Kelvin color balance, pristine dynamic range, 8k commercial resolution.
- ZERO CGI plastic sheen, ZERO cartoon saturation, ZERO digital artifacts.

STRICT NEGATIVE DIRECTIVE:
ABSOLUTELY NO PEOPLE, NO HUMANS, NO FACES, NO HANDS, NO BODY PARTS, NO PEDESTRIANS, NO MODELS. UNINHABITED SCENE ONLY. ZERO HUMAN PRESENCE.`;
  };

  // Generate a single medium shot
  const handleGenerateShot = async (mediumId: string, customEnv?: string) => {
    const targetMedium = mediums.find((m) => m.id === mediumId);
    if (!targetMedium) return;

    // Update status to generating
    setShots((prev) => ({
      ...prev,
      [mediumId]: {
        id: `shot-${mediumId}-${Date.now()}`,
        mediumId,
        mediumName: targetMedium.name,
        aspectRatio: targetMedium.aspectRatio,
        status: 'generating',
        lightingMood: globalLighting,
      },
    }));

    const startTime = Date.now();
    const prompt = buildPromptForMedium(targetMedium, customEnv, globalLighting);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio: targetMedium.aspectRatio,
          model: activeModel,
          referenceImageBase64: brand.referenceImageBase64,
          mediumId: targetMedium.id,
          mediumName: targetMedium.name,
          brand,
          lightingMood: globalLighting,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.imageUrl) {
        throw new Error(data.error || 'Failed to render image with Nano-Banana');
      }

      const durationMs = Date.now() - startTime;

      setShots((prev) => {
        const updated = {
          ...prev,
          [mediumId]: {
            id: `shot-${mediumId}-${Date.now()}`,
            mediumId,
            mediumName: targetMedium.name,
            aspectRatio: targetMedium.aspectRatio,
            imageUrl: data.imageUrl,
            status: 'completed' as const,
            promptUsed: prompt,
            lightingMood: data.lightingMood || globalLighting,
            durationMs,
            timestamp: Date.now(),
            isStudioFallback: data.isStudioFallback,
            quotaNotice: data.quotaNotice,
          },
        };

        // If no reference anchor exists yet, automatically set the first completed shot as anchor
        if (!brand.referenceImageBase64) {
          setBrand((b) => ({ ...b, referenceImageBase64: data.imageUrl }));
          showToast(
            `Rendered ${targetMedium.name} and set as master consistency anchor!`,
            'success'
          );
        } else {
          showToast(
            data.isStudioFallback
              ? `Rendered ${targetMedium.name} in Architectural Studio view!`
              : `Rendered ${targetMedium.name} with Nano-Banana!`,
            'success'
          );
        }

        return updated;
      });
    } catch (err: any) {
      setShots((prev) => ({
        ...prev,
        [mediumId]: {
          id: `shot-${mediumId}-${Date.now()}`,
          mediumId,
          mediumName: targetMedium.name,
          aspectRatio: targetMedium.aspectRatio,
          status: 'error',
          lightingMood: globalLighting,
          error: err.message || 'Generation failed',
        },
      }));
      showToast(`Notice for ${targetMedium.name}: ${err.message}`, 'error');
    }
  };

  // Batch generate all mediums in sequence
  const handleGenerateAll = async () => {
    if (isGeneratingAll) return;
    setIsGeneratingAll(true);
    showToast('Starting campaign rendering across all mediums with Nano-Banana...', 'info');

    const listToRun = filteredMediums;
    for (const m of listToRun) {
      await handleGenerateShot(m.id);
    }

    setIsGeneratingAll(false);
    showToast('Campaign render completed!', 'success');

    // Automatically record a batch iteration upon completing a full campaign generation
    setTimeout(() => {
      setShots((currentLiveShots) => {
        const completedNow = (Object.values(currentLiveShots) as GeneratedShot[]).filter(
          (s) => s.status === 'completed' && s.imageUrl
        ).length;
        if (completedNow > 0) {
          const autoBatch: CampaignBatch = {
            id: `batch-auto-${Date.now()}`,
            name: `${brand.name} - Campaign Batch (${completedNow} Shots)`,
            timestamp: Date.now(),
            trigger: 'generate-all',
            brandSnapshot: { ...brand },
            shots: { ...currentLiveShots },
            globalLighting,
            completedCount: completedNow,
            model: activeModel,
            notes: `Auto-saved batch across ${completedNow} mediums with ${globalLighting} lighting.`,
          };
          setBatches((prev) => [autoBatch, ...prev]);
        }
        return currentLiveShots;
      });
    }, 500);
  };

  // Batch History management handlers
  const handleRevertBatch = (batch: CampaignBatch, options: { restoreBrand: boolean }) => {
    setShots(batch.shots);
    if (options.restoreBrand && batch.brandSnapshot) {
      setBrand(batch.brandSnapshot);
    }
    if (batch.globalLighting) {
      setGlobalLighting(batch.globalLighting);
    }
    if (batch.model) {
      const valid =
        batch.model === 'gemini-3.1-flash-lite-image'
          ? 'gemini-3.1-flash-lite-image'
          : 'gemini-3.1-flash-image';
      setActiveModel(valid);
    }
  };

  const handleSnapshotCurrent = (customName?: string) => {
    const compCount = (Object.values(shots) as GeneratedShot[]).filter(
      (s) => s.status === 'completed' && s.imageUrl
    ).length;

    const newBatch: CampaignBatch = {
      id: `batch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: customName || `${brand.name} - Iteration #${batches.length + 1}`,
      timestamp: Date.now(),
      trigger: 'manual-snapshot',
      brandSnapshot: { ...brand },
      shots: { ...shots },
      globalLighting,
      completedCount: compCount,
      model: activeModel,
      notes: `Manual snapshot with ${compCount} rendered shot(s)`,
    };

    setBatches((prev) => [newBatch, ...prev]);
    showToast(`Saved iteration "${newBatch.name}" to Batch History!`, 'success');
  };

  const handleDeleteBatch = (batchId: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== batchId));
  };

  const handleRenameBatch = (batchId: string, newName: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, name: newName } : b))
    );
  };

  // Add a new product to imagine
  const handleCreateProduct = (newProduct: ProductBrand) => {
    setCustomProducts((prev) => {
      const exists = prev.some((p) => p.name.toLowerCase() === newProduct.name.toLowerCase());
      return exists ? prev : [newProduct, ...prev];
    });
    setBrand(newProduct);
    setShots({});
    showToast(`Loaded "${newProduct.name}"! Ready to imagine across mediums.`, 'success');
  };

  // AI Brand Enhancement
  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch('/api/brand/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brand.name,
          category: brand.category,
          roughDescription: brand.description,
          aesthetic: brand.aesthetic,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.brand) {
        throw new Error(data.error || 'Failed to refine brand');
      }

      setBrand((prev) => ({
        ...prev,
        ...data.brand,
      }));
      showToast('Visual DNA polished with high-consistency directives!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Notice: could not refresh brand DNA', 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Filter mediums
  const filteredMediums = mediums.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.category === activeFilter;
  });

  const completedCount = (Object.values(shots) as GeneratedShot[]).filter(
    (s) => s.status === 'completed' && s.imageUrl
  ).length;

  const handleSetAsReferenceAnchor = (imageUrl: string) => {
    setBrand((prev) => ({ ...prev, referenceImageBase64: imageUrl }));
    showToast('Active shot set as Master Reference Anchor for all mediums!', 'success');
  };

  const handleClearReferenceImage = () => {
    setBrand((prev) => ({ ...prev, referenceImageBase64: undefined }));
    showToast('Master Reference Anchor cleared. Shots will follow text DNA blueprint.', 'info');
  };

  const handleAddMedium = (newMedium: MediumDef) => {
    setMediums((prev) => [...prev, newMedium]);
    showToast(`Added medium: ${newMedium.name}`, 'success');
  };

  // View routing: Landing Page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => setCurrentPage('app')}
        onGoToSignIn={() => setCurrentPage('auth')}
        isAuthenticated={Boolean(authorizedEmail)}
        userEmail={authorizedEmail}
      />
    );
  }

  // View routing: Sign In Page (Restricted to @pvgceot.ac.in)
  if (currentPage === 'auth') {
    return (
      <SignInPage
        onSignInSuccess={handleSignInSuccess}
        onBackToLanding={() => setCurrentPage('landing')}
      />
    );
  }

  // Main Studio View (Enhanced for Fullscreen 3-in-a-Row without empty side borders)
  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <Header
        activeModel={activeModel}
        onModelChange={setActiveModel}
        isGeneratingAll={isGeneratingAll}
        onGenerateAll={handleGenerateAll}
        completedCount={completedCount}
        totalCount={filteredMediums.length}
        onOpenNewProductModal={() => setShowNewProductModal(true)}
        globalLighting={globalLighting}
        onToggleLighting={handleToggleGlobalLighting}
        currentUser={currentUser}
        onSignInGoogle={handleSignInGoogle}
        onSignOutGoogle={handleSignOut}
        onOpenDriveExport={() => handleOpenDriveExport()}
        onOpenBatchHistory={() => setShowBatchHistory(true)}
        batchHistoryCount={batches.length}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onGoToLanding={() => setCurrentPage('landing')}
        authorizedEmail={authorizedEmail}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 transition-all transform ease-out duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toastMessage.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : 'bg-zinc-900 text-white border-zinc-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Layout (Fluid Widescreen / Fullscreen: No large empty borders) */}
      <main
        className={`w-full mx-auto py-5 space-y-5 flex-1 transition-all ${
          isFullscreen
            ? 'max-w-none px-3 sm:px-6 lg:px-8 xl:px-10'
            : 'max-w-[1920px] px-3 sm:px-6 lg:px-8 xl:px-10'
        }`}
      >
        {/* Consistency Protocol Overview Bar */}
        <ConsistencyOverview
          brand={brand}
          mediums={mediums}
          completedCount={completedCount}
          activeModel={activeModel}
          globalLighting={globalLighting}
          onToggleLighting={handleToggleGlobalLighting}
          onOpenCompare={() => handleOpenCompare()}
        />

        {/* 2-Column Responsive Layout (Engineered for 3-in-a-row gallery rendering) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">
          {/* Left Column: Product & Visual DNA Form (Compact sticky layout on wide monitors) */}
          <div className="lg:col-span-4 xl:col-span-3.5 2xl:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-900" />
                Product & Visual DNA Blueprint
              </h2>
              <span className="text-xs text-zinc-400 font-mono">
                Consistency Engine
              </span>
            </div>

            <BrandForm
              brand={brand}
              onChange={setBrand}
              onEnhanceWithAI={handleEnhanceWithAI}
              isEnhancing={isEnhancing}
              onOpenNewProductModal={() => setShowNewProductModal(true)}
              customProducts={customProducts}
              referenceImageBase64={brand.referenceImageBase64}
              onClearReferenceImage={handleClearReferenceImage}
              onShowToast={showToast}
            />
          </div>

          {/* Right Column: Medium Imaginarium Gallery (Expansive area for 3-in-a-row cards) */}
          <div className="lg:col-span-8 xl:col-span-8.5 2xl:col-span-9 space-y-4 min-w-0">
            {/* Gallery Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200/90 shadow-2xs">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-3.5 h-3.5 text-zinc-400 ml-1 mr-1 shrink-0" />
                {[
                  { id: 'all', label: 'All', count: mediums.length },
                  {
                    id: 'outdoor',
                    label: 'Outdoor',
                    count: mediums.filter((m) => m.category === 'outdoor').length,
                  },
                  {
                    id: 'print',
                    label: 'Print',
                    count: mediums.filter((m) => m.category === 'print').length,
                  },
                  {
                    id: 'digital',
                    label: 'Digital',
                    count: mediums.filter((m) => m.category === 'digital').length,
                  },
                  {
                    id: 'retail',
                    label: 'Retail',
                    count: mediums.filter((m) => m.category === 'retail').length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeFilter === tab.id
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        activeFilter === tab.id
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center flex-wrap gap-2 shrink-0">
                {/* Save Batch to Google Drive CTA */}
                {completedCount > 0 && (
                  <button
                    type="button"
                    id="gallery-drive-save-btn"
                    onClick={() => handleOpenDriveExport()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/90 text-xs font-semibold text-blue-700 hover:bg-blue-100/90 cursor-pointer shadow-2xs transition-colors"
                    title="Save current completed shots to designated Google Drive folder"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                    <span>Save to Drive ({completedCount})</span>
                  </button>
                )}

                {/* Batch History Button */}
                <button
                  type="button"
                  id="gallery-batch-history-btn"
                  onClick={() => setShowBatchHistory(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer shadow-2xs transition-colors"
                  title="View previous batch iterations log"
                >
                  <History className="w-3.5 h-3.5 text-amber-500" />
                  <span>Batches ({batches.length})</span>
                </button>

                {completedCount > 0 && (
                  <button
                    type="button"
                    id="reset-gallery-btn"
                    onClick={() => {
                      setShots({});
                      clearStoredCampaign();
                      saveStoredBrand(brand);
                      setShowInstructionGuide(true);
                      showToast('Gallery cleared. Local storage updated.', 'info');
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/40 cursor-pointer transition-colors"
                    title="Clear rendered shots"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}

                {completedCount >= 1 && (
                  <button
                    type="button"
                    id="gallery-compare-btn"
                    onClick={() => handleOpenCompare()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer shadow-2xs transition-colors"
                    title="Compare completed shots side-by-side to verify visual consistency"
                  >
                    <Columns className="w-3.5 h-3.5 text-amber-500" />
                    <span>Compare ({completedCount})</span>
                  </button>
                )}

                <button
                  type="button"
                  id="toggle-guide-btn"
                  onClick={() => setShowInstructionGuide((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    showInstructionGuide
                      ? 'bg-zinc-100 border-zinc-300 text-zinc-900'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                  title="Toggle Workflow Guide"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Guide</span>
                </button>

                <button
                  type="button"
                  id="add-custom-medium-btn"
                  onClick={() => setShowAddMedium(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Custom Medium</span>
                </button>
              </div>
            </div>

            {/* Mediums Grid: STRICTLY 3 IN A ROW in fullscreen/wide mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 xl:gap-5">
              {/* Placeholder instruction guide within the grid area */}
              {(completedCount === 0 || showInstructionGuide) && (
                <GridInstructionGuide
                  brand={brand}
                  mediums={filteredMediums}
                  onGenerateAll={handleGenerateAll}
                  onGenerateMedium={handleGenerateShot}
                  isGeneratingAll={isGeneratingAll}
                  onOpenNewProductModal={() => setShowNewProductModal(true)}
                  onClose={() => setShowInstructionGuide(false)}
                />
              )}

              {filteredMediums.map((medium) => (
                <MediumCard
                  key={medium.id}
                  medium={medium}
                  shot={shots[medium.id]}
                  globalLighting={globalLighting}
                  onGenerate={handleGenerateShot}
                  onOpenLightbox={(shot, med) => setLightboxData({ shot, medium: med })}
                  onOpenCompare={(shotId) => handleOpenCompare(shotId)}
                  onSetAsReferenceAnchor={handleSetAsReferenceAnchor}
                  isAnchorReference={
                    Boolean(
                      shots[medium.id]?.imageUrl &&
                        shots[medium.id]?.imageUrl === brand.referenceImageBase64
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxData && (
        <LightboxModal
          shot={lightboxData.shot}
          medium={lightboxData.medium}
          brand={brand}
          globalLighting={globalLighting}
          onClose={() => setLightboxData(null)}
          onOpenCompare={(shotId) => handleOpenCompare(shotId)}
          onSetAsReferenceAnchor={handleSetAsReferenceAnchor}
          onSaveToDrive={(shot) => handleOpenDriveExport()}
          isAnchor={
            Boolean(
              lightboxData.shot.imageUrl &&
                lightboxData.shot.imageUrl === brand.referenceImageBase64
            )
          }
          activeModel={activeModel}
          onShowToast={showToast}
        />
      )}

      {/* Compare Modal */}
      <CompareModal
        isOpen={compareData.isOpen}
        onClose={() => setCompareData((prev) => ({ ...prev, isOpen: false }))}
        brand={brand}
        mediums={mediums}
        shots={shots}
        initialShotIdA={compareData.initialShotIdA}
        initialShotIdB={compareData.initialShotIdB}
        onSetAsReferenceAnchor={handleSetAsReferenceAnchor}
        onShowToast={showToast}
        globalLighting={globalLighting}
      />

      {/* Batch History Modal */}
      <BatchHistoryModal
        isOpen={showBatchHistory}
        onClose={() => setShowBatchHistory(false)}
        batches={batches}
        currentBrand={brand}
        currentShots={shots}
        mediums={mediums}
        onRevertBatch={handleRevertBatch}
        onSnapshotCurrent={handleSnapshotCurrent}
        onDeleteBatch={handleDeleteBatch}
        onRenameBatch={handleRenameBatch}
        onShowToast={showToast}
        onSaveBatchToDrive={(batch) => handleOpenDriveExport(batch)}
      />

      {/* Google Drive Batch Export Modal */}
      <GoogleDriveExportModal
        isOpen={showDriveModal}
        onClose={() => setShowDriveModal(false)}
        brand={batchToExport ? batchToExport.brandSnapshot : brand}
        batchName={batchToExport ? batchToExport.name : `${brand.name} Commercial Batch`}
        shots={batchToExport ? batchToExport.shots : shots}
        mediums={mediums}
        currentUser={currentUser}
        onShowToast={showToast}
      />

      {/* Add Custom Medium Modal */}
      <AddMediumModal
        isOpen={showAddMedium}
        onClose={() => setShowAddMedium(false)}
        onAddMedium={handleAddMedium}
      />

      {/* Add New Product Modal */}
      <NewProductModal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        onCreateProduct={handleCreateProduct}
      />
    </div>
  );
}
