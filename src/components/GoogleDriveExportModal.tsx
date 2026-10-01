import React, { useState, useEffect } from 'react';
import { ProductBrand, MediumDef, GeneratedShot } from '../types';
import { googleSignIn, getAccessToken, auth, initAuth } from '../services/firebase';
import { saveBatchToGoogleDrive, DriveBatchExportResult } from '../services/googleDrive';
import { User } from 'firebase/auth';
import {
  X,
  HardDrive,
  FolderPlus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  ArrowRight,
  FileImage,
  Sparkles,
} from 'lucide-react';

interface GoogleDriveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: ProductBrand;
  batchName?: string;
  shots: Record<string, GeneratedShot>;
  mediums: MediumDef[];
  currentUser: User | null;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GoogleDriveExportModal: React.FC<GoogleDriveExportModalProps> = ({
  isOpen,
  onClose,
  brand,
  batchName,
  shots,
  mediums,
  currentUser,
  onShowToast,
}) => {
  const [folderName, setFolderName] = useState<string>(() => {
    return `Brand Studio - ${brand.name || 'Commercial'} Assets`;
  });
  const [selectedShotIds, setSelectedShotIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    currentFileName: string;
  } | null>(null);
  const [exportResult, setExportResult] = useState<DriveBatchExportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirmStep, setShowConfirmStep] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Available completed shots
  const completedShots: GeneratedShot[] = (Object.values(shots) as GeneratedShot[]).filter(
    (s) => s.status === 'completed' && Boolean(s.imageUrl)
  );

  // Initialize selected shots when modal opens or completed shots change
  useEffect(() => {
    if (isOpen) {
      setSelectedShotIds(completedShots.map((s) => s.id));
      setFolderName(`Brand Studio - ${brand.name || 'Commercial'} Assets`);
      setExportResult(null);
      setErrorMsg(null);
      setShowConfirmStep(false);
      setUploadProgress(null);
    }
  }, [isOpen, brand.name]);

  if (!isOpen) return null;

  const handleToggleShot = (shotId: string) => {
    setSelectedShotIds((prev) =>
      prev.includes(shotId) ? prev.filter((id) => id !== shotId) : [...prev, shotId]
    );
  };

  const handleSelectAll = () => {
    if (selectedShotIds.length === completedShots.length) {
      setSelectedShotIds([]);
    } else {
      setSelectedShotIds(completedShots.map((s) => s.id));
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      await googleSignIn();
      onShowToast('Signed in with Google! Ready to save to Drive.', 'success');
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setErrorMsg(err?.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleStartSave = () => {
    if (selectedShotIds.length === 0) {
      setErrorMsg('Please select at least one high-resolution asset to save.');
      return;
    }
    setErrorMsg(null);
    // Mandatory user confirmation step before mutating/uploading to user Drive
    setShowConfirmStep(true);
  };

  const handleConfirmAndUpload = async () => {
    setShowConfirmStep(false);
    setIsUploading(true);
    setErrorMsg(null);
    setUploadProgress({
      current: 0,
      total: selectedShotIds.length,
      currentFileName: 'Preparing assets...',
    });

    try {
      let token = await getAccessToken();
      if (!token) {
        // Prompt sign in if token is missing
        const signinResult = await googleSignIn();
        token = signinResult?.accessToken || null;
        if (!token) {
          throw new Error('Google authorization token not available. Please sign in again.');
        }
      }

      const shotsToSave = completedShots.filter((s) => selectedShotIds.includes(s.id));

      const result = await saveBatchToGoogleDrive({
        brand,
        batchName: batchName || `${brand.name} Batch`,
        folderName: folderName.trim() || `Brand Studio - ${brand.name}`,
        shots: shotsToSave,
        mediums,
        accessToken: token,
        userId: auth.currentUser?.uid,
        onProgress: (current, total, currentFileName) => {
          setUploadProgress({ current, total, currentFileName });
        },
      });

      setExportResult(result);
      onShowToast(
        `Successfully saved ${result.savedFiles.length} assets to "${result.folderName}" in Google Drive!`,
        'success'
      );
    } catch (err: any) {
      console.error('Export to Drive error:', err);
      setErrorMsg(err?.message || 'Failed to save batch to Google Drive. Check permissions.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyFolderLink = () => {
    if (exportResult?.folderUrl) {
      navigator.clipboard.writeText(exportResult.folderUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onShowToast('Google Drive folder link copied!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Save Image Batch to Google Drive
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Google Drive API
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Direct export of high-resolution commercial assets into a designated Drive folder
              </p>
            </div>
          </div>
          <button
            type="button"
            id="drive-modal-close-btn"
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-zinc-200">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Operation Notice</p>
                <p className="text-rose-300/90 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Authentication Barrier: Official Sign in with Google if not connected */}
          {!currentUser && (
            <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Sign In to Save Directly to Google Drive</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">
                  Connect your Google account with permission to store and organize your generated advertising assets in a custom designated folder.
                </p>
              </div>

              {/* Official Google Material Sign-In Button */}
              <button
                type="button"
                id="gdrive-sign-in-btn"
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="gsi-material-button relative inline-flex items-center justify-center px-4 py-2.5 bg-white text-zinc-800 font-medium text-sm rounded-lg shadow-sm hover:bg-zinc-50 border border-zinc-300 transition-all cursor-pointer disabled:opacity-50"
              >
                <div className="gsi-material-button-content-wrapper flex items-center gap-3">
                  <div className="gsi-material-button-icon w-5 h-5 flex items-center justify-center">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '100%', height: '100%' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents font-semibold text-zinc-800">
                    {isSigningIn ? 'Connecting...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Success View */}
          {exportResult ? (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Batch Saved to Google Drive!</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {exportResult.savedFiles.length} high-resolution commercial asset(s) successfully uploaded to:
                  </p>
                  <p className="text-sm font-semibold text-emerald-400 font-mono mt-1">
                    📁 {exportResult.folderName}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={exportResult.folderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" />
                    Open Folder in Google Drive
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyFolderLink}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'Copied Link' : 'Copy Folder Link'}
                  </button>
                </div>
              </div>

              {/* Uploaded File List */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Uploaded Assets ({exportResult.savedFiles.length})
                </h4>
                <div className="divide-y divide-zinc-850 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/60 max-h-56 overflow-y-auto">
                  {exportResult.savedFiles.map((file) => (
                    <div key={file.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileImage className="w-4 h-4 text-blue-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{file.name}</p>
                          <p className="text-[11px] text-zinc-500">
                            {file.mediumName} • {file.aspectRatio}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-[11px] shrink-0 font-medium cursor-pointer"
                      >
                        <span>View file</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : isUploading ? (
            /* Uploading Progress View */
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Saving Assets to Google Drive...</h3>
                <p className="text-xs text-zinc-400">
                  Uploading high-resolution renders to designated folder:
                </p>
                <p className="text-xs text-blue-400 font-mono font-medium truncate max-w-sm">
                  {uploadProgress?.currentFileName || folderName}
                </p>
              </div>

              {/* Progress Bar */}
              {uploadProgress && (
                <div className="w-full max-w-md space-y-1.5">
                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                    <span>
                      Asset {uploadProgress.current} of {uploadProgress.total}
                    </span>
                    <span>
                      {Math.round((uploadProgress.current / (uploadProgress.total || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.round(
                          (uploadProgress.current / (uploadProgress.total || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : showConfirmStep ? (
            /* Mandatory Confirmation Dialog Step */
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/50 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    Confirm Upload to Google Drive
                  </h3>
                  <p className="text-xs text-zinc-300">
                    Are you sure you want to upload <span className="font-bold text-white">{selectedShotIds.length} high-resolution image asset(s)</span> directly to your Google Drive?
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Destination Folder:</span>
                  <span className="text-zinc-200 font-semibold">{folderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Assets:</span>
                  <span className="text-zinc-200 font-semibold">{selectedShotIds.length} files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Format:</span>
                  <span className="text-zinc-200 font-semibold">Lossless PNG (High-Res)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  id="confirm-cancel-btn"
                  onClick={() => setShowConfirmStep(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-proceed-btn"
                  onClick={handleConfirmAndUpload}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Confirm & Save
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Configure Batch Export Options */
            <div className="space-y-4">
              {/* Designated Folder Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="gdrive-folder-name-input"
                  className="text-xs font-semibold text-zinc-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
                    Designated Folder Name in Google Drive
                  </span>
                  <span className="text-[11px] text-zinc-500 font-normal">
                    Created if it doesn't exist
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="gdrive-folder-name-input"
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="e.g. Brand Studio - Solis Ads"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Asset Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                    Select High-Resolution Assets ({selectedShotIds.length}/{completedShots.length})
                  </span>
                  {completedShots.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                    >
                      {selectedShotIds.length === completedShots.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>

                {completedShots.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-zinc-800 text-center space-y-2">
                    <p className="text-xs text-zinc-400">
                      No completed images in this batch yet. Generate images to save them to Google Drive.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
                    {completedShots.map((shot) => {
                      const isSelected = selectedShotIds.includes(shot.id);
                      const medium = mediums.find((m) => m.id === shot.mediumId);
                      const mediumName = medium?.name || shot.mediumName || 'Shot';

                      return (
                        <div
                          key={shot.id}
                          onClick={() => handleToggleShot(shot.id)}
                          className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-950/20'
                              : 'border-zinc-800 bg-zinc-900/60 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="aspect-video w-full bg-zinc-950 relative overflow-hidden">
                            {shot.imageUrl ? (
                              <img
                                src={shot.imageUrl}
                                alt={mediumName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : null}
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-zinc-900/90 border border-zinc-700 flex items-center justify-center">
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-blue-400" />
                              ) : null}
                            </div>
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/75 text-zinc-300 backdrop-blur-xs">
                              {shot.aspectRatio}
                            </div>
                          </div>
                          <div className="p-2">
                            <p className="text-[11px] font-bold text-white truncate">{mediumName}</p>
                            <p className="text-[10px] text-zinc-400 truncate">
                              {shot.lightingMood === 'soft-diffused' ? 'Soft Diffused' : 'High Contrast'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between gap-3 text-xs">
          <div className="text-zinc-500 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted transmission • Direct Google Drive v3 integration</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="drive-modal-cancel-btn"
              onClick={onClose}
              disabled={isUploading}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {exportResult ? 'Close' : 'Cancel'}
            </button>

            {!exportResult && !isUploading && (
              <button
                type="button"
                id="drive-modal-start-save-btn"
                onClick={handleStartSave}
                disabled={selectedShotIds.length === 0 || !folderName.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HardDrive className="w-4 h-4" />
                <span>Save {selectedShotIds.length} Assets to Drive</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
