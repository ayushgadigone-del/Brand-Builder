import { ProductBrand, GlobalLightingMood } from '../types';

export interface CampaignSharePayload {
  brand: {
    name: string;
    category: string;
    tagline: string;
    description: string;
    materials: string;
    finish: string;
    colors: Array<{ name: string; hex: string }>;
    aesthetic: string;
    logoDetails: string;
    visualDnaLock: string;
  };
  mediumId?: string;
  model?: string;
  lighting?: GlobalLightingMood;
  v: number;
}

export function buildShareableCampaignUrl(
  brand: ProductBrand,
  mediumId?: string,
  model?: string,
  lighting?: GlobalLightingMood
): string {
  try {
    const payload: CampaignSharePayload = {
      brand: {
        name: brand.name || '',
        category: brand.category || '',
        tagline: brand.tagline || '',
        description: brand.description || '',
        materials: brand.materials || '',
        finish: brand.finish || '',
        colors: brand.colors || [],
        aesthetic: brand.aesthetic || '',
        logoDetails: brand.logoDetails || '',
        visualDnaLock: brand.visualDnaLock || '',
      },
      mediumId,
      model,
      lighting,
      v: 1,
    };

    const json = JSON.stringify(payload);
    // Safe Unicode to base64 encoding
    const base64 = btoa(
      encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );

    const url = new URL(window.location.href);
    url.searchParams.set('campaign', base64);
    return url.toString();
  } catch (err) {
    console.warn('Failed to encode campaign URL:', err);
    return window.location.href;
  }
}

export function decodeCampaignState(
  encoded: string
): CampaignSharePayload | null {
  try {
    const json = decodeURIComponent(
      atob(encoded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(encoded));
    } catch {
      return null;
    }
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Try modern navigator.clipboard API
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to execCommand below
  }

  // Fallback for sandboxed iframe environments
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
