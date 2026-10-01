import { ProductBrand, GeneratedShot, GlobalLightingMood, CampaignBatch } from '../types';

export const STORAGE_KEYS = {
  BRAND: 'brand_builder_active_brand_v1',
  SHOTS: 'brand_builder_generated_shots_v1',
  CUSTOM_PRODUCTS: 'brand_builder_custom_products_v1',
  GLOBAL_LIGHTING: 'brand_builder_global_lighting_v1',
  BATCH_HISTORY: 'brand_builder_batch_history_v1',
  LAST_SAVED: 'brand_builder_last_saved_timestamp_v1',
} as const;

/**
 * Safely reads the stored brand from localStorage.
 */
export function loadStoredBrand(fallback: ProductBrand): ProductBrand {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRAND);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && typeof parsed.name === 'string' && parsed.name.trim()) {
      return {
        ...fallback,
        ...parsed,
        colors: Array.isArray(parsed.colors) ? parsed.colors : fallback.colors,
      };
    }
  } catch (err) {
    console.warn('[Storage] Notice: Failed to load stored brand from localStorage:', err);
  }
  return fallback;
}

/**
 * Safely saves active brand to localStorage.
 */
export function saveStoredBrand(brand: ProductBrand): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.BRAND, JSON.stringify(brand));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, Date.now().toString());
    return true;
  } catch (err) {
    console.warn('[Storage] Notice: Failed to save brand to localStorage:', err);
    return false;
  }
}

/**
 * Safely reads the stored shots dictionary from localStorage.
 */
export function loadStoredShots(): Record<string, GeneratedShot> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHOTS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      // Normalize any shots that were left in generating or queued state to completed or idle
      const cleanShots: Record<string, GeneratedShot> = {};
      for (const [mediumId, shot] of Object.entries(parsed as Record<string, GeneratedShot>)) {
        if (shot && typeof shot === 'object') {
          cleanShots[mediumId] = {
            ...shot,
            // If the user refreshed while generating, reset to completed if imageUrl exists, else idle
            status: shot.imageUrl ? 'completed' : shot.status === 'generating' ? 'idle' : shot.status,
          };
        }
      }
      return cleanShots;
    }
  } catch (err) {
    console.warn('[Storage] Notice: Failed to load stored shots from localStorage:', err);
  }
  return {};
}

/**
 * Safely saves generated shots to localStorage with quota-exceeded fallback.
 */
export function saveStoredShots(shots: Record<string, GeneratedShot>): boolean {
  try {
    const json = JSON.stringify(shots);
    localStorage.setItem(STORAGE_KEYS.SHOTS, json);
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, Date.now().toString());
    return true;
  } catch (err: any) {
    console.warn('[Storage] Quota exceeded or storage restricted. Attempting compact persistence:', err?.message);
    try {
      // Fallback: prune oversized images if quota limit hit, preserving metadata and prompt
      const compacted: Record<string, GeneratedShot> = {};
      for (const [key, shot] of Object.entries(shots)) {
        compacted[key] = {
          ...shot,
          // Only preserve image if it is reasonable size or external URL
          imageUrl: shot.imageUrl && shot.imageUrl.length < 300000 ? shot.imageUrl : undefined,
        };
      }
      localStorage.setItem(STORAGE_KEYS.SHOTS, JSON.stringify(compacted));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Safely reads custom products list.
 */
export function loadStoredCustomProducts(): ProductBrand[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRODUCTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((p) => p && typeof p.name === 'string');
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Safely saves custom products list.
 */
export function saveStoredCustomProducts(products: ProductBrand[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PRODUCTS, JSON.stringify(products));
  } catch {
    // ignore
  }
}

/**
 * Safely reads the global lighting mood from localStorage.
 */
export function loadStoredLightingMood(fallback: GlobalLightingMood = 'high-contrast'): GlobalLightingMood {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GLOBAL_LIGHTING);
    if (raw === 'high-contrast' || raw === 'soft-diffused') {
      return raw;
    }
  } catch (err) {
    console.warn('[Storage] Notice: Failed to load stored lighting mood:', err);
  }
  return fallback;
}

/**
 * Safely saves the global lighting mood to localStorage.
 */
export function saveStoredLightingMood(mood: GlobalLightingMood): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_LIGHTING, mood);
    return true;
  } catch (err) {
    console.warn('[Storage] Notice: Failed to save lighting mood:', err);
    return false;
  }
}

/**
 * Clears the stored campaign state (shots and active brand override).
 */
export function clearStoredCampaign(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SHOTS);
    localStorage.removeItem(STORAGE_KEYS.BRAND);
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
  } catch {
    // ignore
  }
}

/**
 * Safely loads the batch history list from localStorage.
 */
export function loadStoredBatchHistory(): CampaignBatch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BATCH_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((b) => b && typeof b.id === 'string' && b.shots);
    }
  } catch (err) {
    console.warn('[Storage] Notice: Failed to load batch history:', err);
  }
  return [];
}

/**
 * Safely saves the batch history list to localStorage.
 */
export function saveStoredBatchHistory(history: CampaignBatch[]): boolean {
  try {
    const trimmed = history.slice(0, 15);
    localStorage.setItem(STORAGE_KEYS.BATCH_HISTORY, JSON.stringify(trimmed));
    return true;
  } catch (err) {
    console.warn('[Storage] Quota hit while saving batch history. Trimming to recent:', err);
    try {
      const compact = history.slice(0, 6).map((b) => ({
        ...b,
        shots: Object.fromEntries(
          Object.entries(b.shots).map(([k, s]) => [
            k,
            {
              ...s,
              imageUrl: s.imageUrl && s.imageUrl.length < 350000 ? s.imageUrl : undefined,
            },
          ])
        ),
      }));
      localStorage.setItem(STORAGE_KEYS.BATCH_HISTORY, JSON.stringify(compact));
      return true;
    } catch {
      return false;
    }
  }
}
