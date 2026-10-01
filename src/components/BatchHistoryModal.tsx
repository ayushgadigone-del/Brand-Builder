import React, { useState } from 'react';
import { CampaignBatch, MediumDef, ProductBrand, GeneratedShot } from '../types';
import {
  X,
  History,
  RotateCcw,
  Columns,
  Sparkles,
  Sun,
  CloudSun,
  Trash2,
  BookmarkPlus,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Eye,
  Sliders,
  Maximize2,
  SlidersHorizontal,
  HardDrive,
} from 'lucide-react';

interface BatchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  batches: CampaignBatch[];
  currentBrand: ProductBrand;
  currentShots: Record<string, GeneratedShot>;
  mediums: MediumDef[];
  onRevertBatch: (batch: CampaignBatch, options: { restoreBrand: boolean }) => void;
  onSnapshotCurrent: (name?: string) => void;
  onDeleteBatch: (batchId: string) => void;
  onRenameBatch: (batchId: string, newName: string) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onSaveBatchToDrive?: (batch: CampaignBatch) => void;
}

export const BatchHistoryModal: React.FC<BatchHistoryModalProps> = ({
  isOpen,
  onClose,
  batches,
  currentBrand,
  currentShots,
  mediums,
  onRevertBatch,
  onSnapshotCurrent,
  onDeleteBatch,
  onRenameBatch,
  onShowToast,
  onSaveBatchToDrive,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'compare'>('list');
  const [compareBatchIdA, setCompareBatchIdA] = useState<string>('');
  const [compareBatchIdB, setCompareBatchIdB] = useState<string>('current');
  const [selectedMediumId, setSelectedMediumId] = useState<string>('all');
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [expandedDnaBatchId, setExpandedDnaBatchId] = useState<string | null>(null);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [compareInteractionMode, setCompareInteractionMode] = useState<'side-by-side' | 'split-slider'>('side-by-side');

  if (!isOpen) return null;

  // Construct a virtual "current" batch representing the live on-screen state
  const currentCompletedCount = (Object.values(currentShots) as GeneratedShot[]).filter(
    (s) => s.status === 'completed' && s.imageUrl
  ).length;

  const currentBatchVirtual: CampaignBatch = {
    id: 'current',
    name: 'Current Active Canvas',
    timestamp: Date.now(),
    trigger: 'manual-snapshot',
    brandSnapshot: currentBrand,
    shots: currentShots,
    globalLighting: ((Object.values(currentShots) as GeneratedShot[]).find((s) => s.lightingMood)?.lightingMood || 'high-contrast'),
    completedCount: currentCompletedCount,
    model: 'Active Canvas',
    notes: 'Live on-screen iteration',
  };

  const allAvailableBatches: CampaignBatch[] = [
    currentBatchVirtual,
    ...batches,
  ];

  const handleStartCompare = (batchId: string) => {
    setCompareBatchIdA(batchId);
    setCompareBatchIdB('current');
    setViewMode('compare');
  };

  const batchA = allAvailableBatches.find((b) => b.id === compareBatchIdA) || batches[0] || currentBatchVirtual;
  const batchB = allAvailableBatches.find((b) => b.id === compareBatchIdB) || currentBatchVirtual;

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (ts: number) => {
    const diffMs = Date.now() - ts;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  Campaign Batch History
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {batches.length} {batches.length === 1 ? 'Iteration' : 'Iterations'} Saved
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Browse previous generation iterations, revert campaigns, or compare iterations side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: List vs Compare */}
            <div className="inline-flex items-center bg-zinc-850 p-1 rounded-xl border border-zinc-700 text-xs">
              <button
                type="button"
                id="batch-view-list-btn"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-zinc-700 text-white shadow-2xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Iterations Log
              </button>
              <button
                type="button"
                id="batch-view-compare-btn"
                onClick={() => {
                  if (batches.length > 0) {
                    setCompareBatchIdA(batches[0].id);
                    setCompareBatchIdB('current');
                  }
                  setViewMode('compare');
                }}
                disabled={batches.length === 0}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  viewMode === 'compare'
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-2xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Compare Iterations
              </button>
            </div>

            {/* Quick Bookmark / Snapshot Button */}
            <button
              type="button"
              id="snapshot-current-batch-btn"
              onClick={() => {
                onSnapshotCurrent();
                onShowToast?.('Created iteration snapshot from active canvas!', 'success');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
              title="Bookmark current canvas state as a distinct iteration"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Snapshot Canvas</span>
            </button>

            <button
              type="button"
              id="close-batch-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {viewMode === 'list' ? (
            /* ============================================================== */
            /* VIEW 1: BATCHES TIMELINE / LOG VIEW                           */
            /* ============================================================== */
            <div className="space-y-4">
              {/* Active on-screen iteration card */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Live Active Canvas
                    </span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-300 font-semibold">
                      {currentBrand.name || 'Current Product'} ({currentBrand.category || 'Product'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-900/80 text-zinc-300 border border-zinc-800 font-mono text-[11px]">
                      {currentCompletedCount} {currentCompletedCount === 1 ? 'shot rendered' : 'shots rendered'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSnapshotCurrent()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      <BookmarkPlus className="w-3 h-3 text-zinc-950" />
                      <span>Save as Iteration</span>
                    </button>
                    {currentCompletedCount > 0 && onSaveBatchToDrive && (
                      <button
                        type="button"
                        id="save-live-canvas-to-drive-btn"
                        onClick={() => onSaveBatchToDrive(currentBatchVirtual)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                        title="Save active canvas image batch to designated Google Drive folder"
                      >
                        <HardDrive className="w-3 h-3 text-white" />
                        <span>Save to Drive</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Shots Thumbnails Preview */}
                {currentCompletedCount > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {mediums.map((m) => {
                      const s = currentShots[m.id];
                      if (!s || s.status !== 'completed' || !s.imageUrl) return null;
                      return (
                        <div
                          key={m.id}
                          className="group relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-square flex flex-col justify-end"
                        >
                          <img
                            src={s.imageUrl}
                            alt={m.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="relative z-10 p-1.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-[10px] text-white flex items-center justify-between">
                            <span className="truncate font-semibold">{m.name}</span>
                            <span className="text-[9px] font-mono opacity-80">{m.aspectRatio}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    No rendered shots currently in the live canvas. Render shots to save an iteration.
                  </p>
                )}
              </div>

              {/* Saved Iterations Timeline */}
              {batches.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-800">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 mx-auto flex items-center justify-center">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">No Previous Batches Saved Yet</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Batches are automatically saved whenever you generate campaign shots or click "Save as Iteration".
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
                    <span>SAVED CAMPAIGN ITERATIONS ({batches.length})</span>
                    <span>NEWEST FIRST</span>
                  </div>

                  {batches.map((batch, index) => {
                    const isExpandedDna = expandedDnaBatchId === batch.id;
                    const batchCompletedShots = (Object.values(batch.shots) as GeneratedShot[]).filter(
                      (s) => s.status === 'completed' && s.imageUrl
                    );

                    return (
                      <div
                        key={batch.id}
                        className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 space-y-3 hover:border-zinc-700 transition-all shadow-xs"
                      >
                        {/* Batch Header Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {editingBatchId === batch.id ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="px-2 py-1 text-xs font-bold rounded-lg bg-zinc-800 border border-amber-500/60 text-white focus:outline-none"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (editingName.trim()) {
                                        onRenameBatch(batch.id, editingName.trim());
                                      }
                                      setEditingBatchId(null);
                                    }}
                                    className="p-1 rounded bg-amber-400 text-zinc-950 font-bold"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingBatchId(null)}
                                    className="p-1 rounded bg-zinc-800 text-zinc-400"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <h3
                                  className="text-sm font-bold text-white hover:text-amber-400 cursor-pointer flex items-center gap-1.5"
                                  onClick={() => {
                                    setEditingBatchId(batch.id);
                                    setEditingName(batch.name);
                                  }}
                                  title="Click to rename"
                                >
                                  <span>{batch.name || `Iteration #${batches.length - index}`}</span>
                                </h3>
                              )}

                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                                {batchCompletedShots.length} {batchCompletedShots.length === 1 ? 'shot' : 'shots'}
                              </span>

                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                batch.globalLighting === 'soft-diffused'
                                  ? 'bg-sky-950/60 text-sky-300 border-sky-800'
                                  : 'bg-amber-950/60 text-amber-300 border-amber-800'
                              }`}>
                                {batch.globalLighting === 'soft-diffused' ? (
                                  <CloudSun className="w-2.5 h-2.5 text-sky-400" />
                                ) : (
                                  <Sun className="w-2.5 h-2.5 text-amber-400" />
                                )}
                                <span>{batch.globalLighting === 'soft-diffused' ? 'Soft Diffused' : 'High Contrast'}</span>
                              </span>

                              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zinc-500" />
                                <span>{formatTimestamp(batch.timestamp)}</span>
                                <span className="text-zinc-600">({getRelativeTime(batch.timestamp)})</span>
                              </span>
                            </div>

                            <p className="text-xs text-zinc-400">
                              <strong className="text-zinc-300">{batch.brandSnapshot?.name}</strong> • {batch.brandSnapshot?.category} • {batch.brandSnapshot?.aesthetic}
                            </p>
                          </div>

                          {/* Action Buttons for this batch */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Compare with current */}
                            <button
                              type="button"
                              onClick={() => handleStartCompare(batch.id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                              title="Compare this iteration against the active canvas"
                            >
                              <Columns className="w-3.5 h-3.5 text-amber-400" />
                              <span>Compare</span>
                            </button>

                            {/* Save to Google Drive */}
                            {batchCompletedShots.length > 0 && onSaveBatchToDrive && (
                              <button
                                type="button"
                                onClick={() => onSaveBatchToDrive(batch)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/90 text-xs font-semibold text-blue-300 hover:text-white border border-blue-800/80 transition-colors cursor-pointer"
                                title="Save this batch iteration directly to Google Drive"
                              >
                                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                                <span>Save to Drive</span>
                              </button>
                            )}

                            {/* Revert Menu */}
                            <div className="flex items-center rounded-xl bg-amber-400 hover:bg-amber-300 transition-colors shadow-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  onRevertBatch(batch, { restoreBrand: true });
                                  onShowToast?.(`Restored iteration "${batch.name}" (Shots & Brand DNA)!`, 'success');
                                  onClose();
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-zinc-950 cursor-pointer"
                                title="Revert active canvas to this iteration (restores both shots and Brand DNA)"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Revert</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onRevertBatch(batch, { restoreBrand: false });
                                  onShowToast?.(`Restored shots from "${batch.name}" (kept current Brand DNA)!`, 'success');
                                  onClose();
                                }}
                                className="px-1.5 py-1.5 border-l border-amber-500 text-[10px] font-bold text-zinc-950 hover:bg-amber-500/20 cursor-pointer"
                                title="Restore shots only, keeping your current Brand Form unchanged"
                              >
                                Shots Only
                              </button>
                            </div>

                            {/* Delete Batch */}
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteBatch(batch.id);
                                onShowToast?.(`Deleted iteration "${batch.name}"`, 'info');
                              }}
                              className="p-1.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/40 transition-colors cursor-pointer"
                              title="Delete from history"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Thumbnails of rendered mediums */}
                        {batchCompletedShots.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                            {mediums.map((m) => {
                              const s = batch.shots[m.id];
                              if (!s || s.status !== 'completed' || !s.imageUrl) return null;
                              return (
                                <div
                                  key={m.id}
                                  className="group relative rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-square flex flex-col justify-end"
                                >
                                  <img
                                    src={s.imageUrl}
                                    alt={m.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="relative z-10 p-1.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-[10px] text-white flex items-center justify-between">
                                    <span className="truncate font-semibold">{m.name}</span>
                                    <span className="text-[9px] font-mono opacity-80">{m.aspectRatio}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Visual DNA Accordion */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedDnaBatchId(isExpandedDna ? null : batch.id)
                            }
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                          >
                            <span>Visual DNA Lock</span>
                            {isExpandedDna ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>

                          {isExpandedDna && (
                            <div className="mt-2 p-3 rounded-xl bg-black/70 border border-zinc-800 font-mono text-[11px] text-zinc-300 leading-relaxed">
                              {batch.brandSnapshot?.visualDnaLock || 'No locked blueprint string.'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ============================================================== */
            /* VIEW 2: ITERATION COMPARISON VIEW (BATCH A vs BATCH B)         */
            /* ============================================================== */
            <div className="space-y-6">
              {/* Batch Selectors Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                {/* Selector A */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Iteration A (Reference)
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {batchA.id === 'current' ? 'Live Canvas' : formatTimestamp(batchA.timestamp)}
                    </span>
                  </div>
                  <select
                    value={compareBatchIdA}
                    onChange={(e) => setCompareBatchIdA(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {allAvailableBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.brandSnapshot?.name} • {Object.values(b.shots).filter((s) => s.status === 'completed').length} shots)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector B */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                      Iteration B (Comparison)
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {batchB.id === 'current' ? 'Live Canvas' : formatTimestamp(batchB.timestamp)}
                    </span>
                  </div>
                  <select
                    value={compareBatchIdB}
                    onChange={(e) => setCompareBatchIdB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    {allAvailableBatches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.brandSnapshot?.name} • {Object.values(b.shots).filter((s) => s.status === 'completed').length} shots)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visual DNA Side-by-Side Blueprint Diff */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Visual DNA Blueprint Evolution</span>
                  </h4>
                  <span className="text-[11px] text-zinc-500">
                    Compare invariant prompt specifications between iterations
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* DNA A */}
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-amber-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300">
                      <span>{batchA.name}</span>
                      <span className="font-mono text-[10px]">{batchA.globalLighting}</span>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-300 bg-black/60 p-2.5 rounded-lg border border-zinc-800/80 leading-relaxed max-h-36 overflow-y-auto">
                      {batchA.brandSnapshot?.visualDnaLock || 'No locked visual DNA blueprint string.'}
                    </div>
                  </div>

                  {/* DNA B */}
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-sky-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-sky-300">
                      <span>{batchB.name}</span>
                      <span className="font-mono text-[10px]">{batchB.globalLighting}</span>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-300 bg-black/60 p-2.5 rounded-lg border border-zinc-800/80 leading-relaxed max-h-36 overflow-y-auto">
                      {batchB.brandSnapshot?.visualDnaLock || 'No locked visual DNA blueprint string.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mediums Cross-Iteration Comparison Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Columns className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cross-Iteration Shot Comparison Matrix</span>
                  </h4>

                  {/* Medium Filter & Interaction Mode */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setCompareInteractionMode('side-by-side')}
                        className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                          compareInteractionMode === 'side-by-side'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Side by Side
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompareInteractionMode('split-slider')}
                        className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer ${
                          compareInteractionMode === 'split-slider'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Split Curtain
                      </button>
                    </div>

                    <select
                      value={selectedMediumId}
                      onChange={(e) => setSelectedMediumId(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 focus:outline-none"
                    >
                      <option value="all">All Mediums ({mediums.length})</option>
                      {mediums.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Medium Shot Rows */}
                <div className="space-y-4">
                  {mediums
                    .filter((m) => selectedMediumId === 'all' || m.id === selectedMediumId)
                    .map((medium) => {
                      const shotA = batchA.shots[medium.id];
                      const shotB = batchB.shots[medium.id];

                      const hasA = Boolean(shotA?.status === 'completed' && shotA?.imageUrl);
                      const hasB = Boolean(shotB?.status === 'completed' && shotB?.imageUrl);

                      if (!hasA && !hasB) return null;

                      return (
                        <div
                          key={medium.id}
                          className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{medium.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                {medium.aspectRatio}
                              </span>
                              <span className="text-[10px] text-zinc-500">{medium.badge}</span>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                <span>{batchA.name}</span>
                              </span>
                              <span>vs</span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-sky-400" />
                                <span>{batchB.name}</span>
                              </span>
                            </div>
                          </div>

                          {/* Image Comparison Rendering */}
                          {compareInteractionMode === 'side-by-side' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Shot A */}
                              <div className="space-y-1.5">
                                <div className="relative rounded-xl overflow-hidden bg-black border border-amber-500/40 aspect-video flex items-center justify-center">
                                  {hasA && shotA?.imageUrl ? (
                                    <img
                                      src={shotA.imageUrl}
                                      alt={`${medium.name} in ${batchA.name}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs text-zinc-500 italic">Not rendered in this iteration</span>
                                  )}
                                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                                    {batchA.name}
                                  </div>
                                </div>
                              </div>

                              {/* Shot B */}
                              <div className="space-y-1.5">
                                <div className="relative rounded-xl overflow-hidden bg-black border border-sky-500/40 aspect-video flex items-center justify-center">
                                  {hasB && shotB?.imageUrl ? (
                                    <img
                                      src={shotB.imageUrl}
                                      alt={`${medium.name} in ${batchB.name}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs text-zinc-500 italic">Not rendered in this iteration</span>
                                  )}
                                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-sky-300 border border-sky-500/40">
                                    {batchB.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Split Curtain Slider */
                            hasA && hasB && shotA?.imageUrl && shotB?.imageUrl ? (
                              <div className="space-y-2">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-700 select-none">
                                  {/* Shot B Base */}
                                  <img
                                    src={shotB.imageUrl}
                                    alt={batchB.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-sky-300 border border-sky-500/40">
                                    {batchB.name}
                                  </div>

                                  {/* Shot A Overlay with Clip Path */}
                                  <div
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ clipPath: `inset(0 ${100 - splitSliderPos}% 0 0)` }}
                                  >
                                    <img
                                      src={shotA.imageUrl}
                                      alt={batchA.name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                                      {batchA.name}
                                    </div>
                                  </div>

                                  {/* Divider Line */}
                                  <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl cursor-ew-resize flex items-center justify-center pointer-events-none"
                                    style={{ left: `${splitSliderPos}%` }}
                                  >
                                    <div className="w-5 h-5 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-lg text-[9px] font-bold">
                                      ⇄
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 px-2">
                                  <span className="text-[11px] font-semibold text-amber-400">
                                    {batchA.name}
                                  </span>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={splitSliderPos}
                                    onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                                    className="flex-1 accent-amber-400 cursor-pointer"
                                  />
                                  <span className="text-[11px] font-semibold text-sky-400">
                                    {batchB.name}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-zinc-500 italic p-4 text-center">
                                Both iterations must have rendered this medium to use Split Curtain mode.
                              </p>
                            )
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-zinc-400 text-xs">
            {viewMode === 'compare' ? (
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="inline-flex items-center gap-1.5 font-semibold text-zinc-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Iterations Log</span>
              </button>
            ) : (
              <span>Tip: Iterations store complete prompts, camera directives, and locked Visual DNA.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'compare' && batchA.id !== 'current' && (
              <button
                type="button"
                onClick={() => {
                  onRevertBatch(batchA, { restoreBrand: true });
                  onShowToast?.(`Restored iteration "${batchA.name}"!`, 'success');
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-xs cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to {batchA.name}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
