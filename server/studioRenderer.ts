export interface StudioRenderParams {
  productName: string;
  category: string;
  tagline: string;
  description: string;
  materials: string;
  finish: string;
  colors: Array<{ name: string; hex: string }>;
  mediumId: string;
  mediumName: string;
  aspectRatio: string;
  prompt: string;
  lightingMood?: 'high-contrast' | 'soft-diffused';
}

export function generateStudioMockup(params: StudioRenderParams): string {
  const {
    productName,
    category,
    tagline,
    colors,
    mediumId,
    aspectRatio,
    lightingMood = 'high-contrast',
  } = params;

  // Dimensions based on aspect ratio
  let width = 1200;
  let height = 675; // default 16:9

  switch (aspectRatio) {
    case '1:1':
      width = 1000;
      height = 1000;
      break;
    case '3:4':
      width = 900;
      height = 1200;
      break;
    case '4:3':
      width = 1200;
      height = 900;
      break;
    case '9:16':
      width = 720;
      height = 1280;
      break;
    case '16:9':
    default:
      width = 1280;
      height = 720;
      break;
  }

  const primaryColor = colors[0]?.hex || '#2B4C3F';
  const secondaryColor = colors[1]?.hex || '#D97706';
  const accentColor = colors[2]?.hex || '#E2E8F0';

  const cleanName = (productName || 'SIGNATURE PRODUCT').toUpperCase();
  const cleanTagline = tagline || 'Form, materiality, and enduring precision.';
  const cleanCategory = (category || 'Luxury Goods').toUpperCase();

  // Route by medium
  let contentSvg = '';

  if (mediumId.includes('billboard')) {
    contentSvg = renderBillboard(width, height, cleanName, cleanTagline, cleanCategory, primaryColor, secondaryColor, accentColor, category);
  } else if (mediumId.includes('newspaper')) {
    contentSvg = renderNewspaper(width, height, cleanName, cleanTagline, cleanCategory, primaryColor, secondaryColor, accentColor, category);
  } else if (mediumId.includes('social') || mediumId.includes('instagram')) {
    contentSvg = renderSocialPost(width, height, cleanName, cleanTagline, cleanCategory, primaryColor, secondaryColor, accentColor, category);
  } else if (mediumId.includes('subway') || mediumId.includes('transit')) {
    contentSvg = renderSubwayPoster(width, height, cleanName, cleanTagline, cleanCategory, primaryColor, secondaryColor, accentColor, category);
  } else if (mediumId.includes('magazine')) {
    contentSvg = renderMagazineSpread(width, height, cleanName, cleanTagline, cleanCategory, primaryColor, secondaryColor, accentColor, category);
  } else if (mediumId.includes('storefront') || mediumId.includes('retail')) {
    contentSvg = renderStorefront(width, height, cleanName, cleanTagline, cleanCategory, primaryColor, secondaryColor, accentColor, category);
  } else {
    // General / Custom medium
    contentSvg = renderGenericMedium(width, height, cleanName, cleanTagline, cleanCategory, primaryColor, secondaryColor, accentColor, category);
  }

  const isSoftDiffused = lightingMood === 'soft-diffused';
  const lightingBadgeText = isSoftDiffused ? 'SOFT DIFFUSED LIGHT' : 'HIGH CONTRAST LIGHT';
  const lightingBadgeBg = isSoftDiffused ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.85)';
  const lightingBadgeBorder = isSoftDiffused ? 'rgba(255, 255, 255, 0.3)' : 'rgba(245, 158, 11, 0.4)';
  const lightingBadgeDot = isSoftDiffused ? '#38BDF8' : '#F59E0B';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="${secondaryColor}" />
      </linearGradient>
      <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="${isSoftDiffused ? 8 : 20}" stdDeviation="${isSoftDiffused ? 32 : 18}" flood-opacity="${isSoftDiffused ? 0.15 : 0.32}" flood-color="#0F172A" />
      </filter>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="${isSoftDiffused ? 14 : 6}" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <pattern id="newsprintHalftone" width="4" height="4" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.75" fill="#1C1917" opacity="0.12" />
      </pattern>
      <radialGradient id="lightingAtmosphere" cx="${isSoftDiffused ? '50%' : '30%'}" cy="${isSoftDiffused ? '35%' : '20%'}" r="75%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="${isSoftDiffused ? 0.16 : 0.28}" />
        <stop offset="${isSoftDiffused ? '60%' : '40%'}" stop-color="${isSoftDiffused ? '#ffffff' : '#000000'}" stop-opacity="${isSoftDiffused ? 0.04 : 0.0}" />
        <stop offset="100%" stop-color="#000000" stop-opacity="${isSoftDiffused ? 0.1 : 0.35}" />
      </radialGradient>
    </defs>
    ${contentSvg}
    <!-- Studio Lighting Atmosphere Overlay -->
    <rect width="${width}" height="${height}" fill="url(#lightingAtmosphere)" pointer-events="none" />
  </svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// 1. HIGHWAY BILLBOARD (16:9)
function renderBillboard(
  w: number,
  h: number,
  name: string,
  tagline: string,
  category: string,
  c1: string,
  c2: string,
  c3: string,
  catRaw: string
): string {
  return `
    <!-- Sky Gradient -->
    <rect width="${w}" height="${h}" fill="#F1F5F9" />
    <rect width="${w}" height="${h * 0.7}" fill="url(#skyGrad)" />
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.8" />
        <stop offset="60%" stop-color="#BAE6FD" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#F0F9FF" stop-opacity="1" />
      </linearGradient>
      <linearGradient id="billboardCanvas" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#1E293B" />
      </linearGradient>
    </defs>

    <!-- Distant Mountains/Landscape Silhouette (Uninhabited) -->
    <path d="M 0 ${h * 0.65} Q ${w * 0.25} ${h * 0.55} ${w * 0.5} ${h * 0.62} T ${w} ${h * 0.58} L ${w} ${h} L 0 ${h} Z" fill="#CBD5E1" opacity="0.6" />
    <path d="M 0 ${h * 0.72} Q ${w * 0.3} ${h * 0.66} ${w * 0.65} ${h * 0.7} T ${w} ${h * 0.68} L ${w} ${h} L 0 ${h} Z" fill="#94A3B8" opacity="0.7" />

    <!-- Billboard Supporting Steel Beams -->
    <rect x="${w * 0.485}" y="${h * 0.65}" width="${w * 0.03}" height="${h * 0.35}" fill="#334155" />
    <line x1="${w * 0.485}" y1="${h * 0.7}" x2="${w * 0.44}" y2="${h}" stroke="#1E293B" stroke-width="4" />
    <line x1="${w * 0.515}" y1="${h * 0.7}" x2="${w * 0.56}" y2="${h}" stroke="#1E293B" stroke-width="4" />

    <!-- Billboard Main Structure (Framed Rect) -->
    <!-- Steel Backing & Lights -->
    <rect x="${w * 0.12 - 8}" y="${h * 0.1 - 8}" width="${w * 0.76 + 16}" height="${h * 0.58 + 16}" rx="8" fill="#1E293B" />
    
    <!-- Outer Shadow of Board -->
    <rect x="${w * 0.12}" y="${h * 0.1}" width="${w * 0.76}" height="${h * 0.58}" rx="4" fill="url(#billboardCanvas)" filter="url(#shadowFilter)" />

    <!-- Billboard Lighting Fixtures Top -->
    ${[0.25, 0.42, 0.58, 0.75].map(ratio => `
      <rect x="${w * ratio - 6}" y="${h * 0.05}" width="12" height="${h * 0.05}" fill="#475569" />
      <polygon points="${w * ratio - 14},${h * 0.05} ${w * ratio + 14},${h * 0.05} ${w * ratio + 8},${h * 0.03} ${w * ratio - 8},${h * 0.03}" fill="#64748B" />
      <circle cx="${w * ratio}" cy="${h * 0.04}" r="4" fill="#FEF08A" opacity="0.9" />
    `).join('')}

    <!-- Inside Billboard Display Artwork -->
    <g transform="translate(${w * 0.12}, ${h * 0.1})">
      <!-- Background Graphic Pattern -->
      <rect width="${w * 0.76}" height="${h * 0.58}" fill="#0A0F1D" />
      <circle cx="${w * 0.52}" cy="${h * 0.3}" r="${h * 0.35}" fill="${c1}" opacity="0.35" filter="url(#softGlow)" />
      
      <!-- Ambient Studio Light beam on product -->
      <polygon points="${w * 0.4},0 ${w * 0.76},0 ${w * 0.65},${h * 0.58} ${w * 0.45},${h * 0.58}" fill="#FFFFFF" opacity="0.04" />

      <!-- Left Column: Editorial Brand Copy -->
      <text x="${w * 0.06}" y="${h * 0.14}" fill="${c2}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="4">
        ${category}
      </text>

      <text x="${w * 0.06}" y="${h * 0.25}" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="900" letter-spacing="2">
        ${name}
      </text>

      <line x1="${w * 0.06}" y1="${h * 0.28}" x2="${w * 0.18}" y2="${h * 0.28}" stroke="${c2}" stroke-width="2" />

      <text x="${w * 0.06}" y="${h * 0.35}" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="400" width="300">
        ${tagline.slice(0, 48)}
      </text>

      <text x="${w * 0.06}" y="${h * 0.39}" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="400">
        ${tagline.slice(48, 96)}
      </text>

      <!-- Right Column: Sculptural Product Silhouette Render -->
      <g transform="translate(${w * 0.52}, ${h * 0.08})">
        ${renderProductSilhouette(catRaw, c1, c2, c3, h * 0.45)}
      </g>

      <!-- Bottom Catwalk on Billboard -->
      <rect y="${h * 0.58 - 14}" width="${w * 0.76}" height="14" fill="#0F172A" />
      <line x1="0" y1="${h * 0.58 - 14}" x2="${w * 0.76}" y2="${h * 0.58 - 14}" stroke="#334155" stroke-width="2" />
    </g>

    <!-- Empty Highway Road at Bottom (Zero People, Pure Architecture) -->
    <rect y="${h * 0.85}" width="${w}" height="${h * 0.15}" fill="#334155" />
    <line x1="0" y1="${h * 0.92}" x2="${w}" y2="${h * 0.92}" stroke="#E2E8F0" stroke-width="3" stroke-dasharray="24 16" />
    <rect y="${h * 0.84}" width="${w}" height="4" fill="#CBD5E1" />
  `;
}

// 2. NEWSPAPER PRINT AD (3:4)
function renderNewspaper(
  w: number,
  h: number,
  name: string,
  tagline: string,
  category: string,
  c1: string,
  c2: string,
  c3: string,
  catRaw: string
): string {
  return `
    <!-- Cream Newspaper Paper Ground -->
    <rect width="${w}" height="${h}" fill="#F5F2EB" />
    <!-- Halftone Paper Grain Texture -->
    <rect width="${w}" height="${h}" fill="url(#newsprintHalftone)" />

    <!-- Editorial Fold Shadow in center -->
    <rect x="${w * 0.495}" y="0" width="${w * 0.01}" height="${h}" fill="#1C1917" opacity="0.04" />

    <!-- Newspaper Header / Masthead -->
    <g transform="translate(${w * 0.06}, ${h * 0.04})">
      <text x="0" y="20" fill="#44403C" font-family="'Times New Roman', Georgia, serif" font-size="10" font-weight="700" letter-spacing="3">
        THE CHRONICLE INTERNATIONAL • SPECIAL DESIGN BROADSHEET • VOL. CXVIII
      </text>
      <text x="${w * 0.88}" y="20" text-anchor="end" fill="#78716C" font-family="'Times New Roman', Georgia, serif" font-size="10">
        ISSUE 4,892 • AUTUMN EDITION
      </text>
      <line x1="0" y1="30" x2="${w * 0.88}" y2="30" stroke="#1C1917" stroke-width="2.5" />
      <line x1="0" y1="34" x2="${w * 0.88}" y2="34" stroke="#1C1917" stroke-width="0.8" />
    </g>

    <!-- Editorial Columns Layout Above Ad -->
    <g transform="translate(${w * 0.06}, ${h * 0.09})">
      <text x="0" y="16" fill="#1C1917" font-family="'Times New Roman', Georgia, serif" font-size="18" font-weight="bold">
        A New Architectural Materiality in Industrial Form
      </text>
      <line x1="0" y1="24" x2="${w * 0.88}" y2="24" stroke="#78716C" stroke-width="0.5" />

      <!-- Columns of classical text lines -->
      ${[0, 1, 2].map(colIdx => `
        <g transform="translate(${colIdx * (w * 0.3)}, 32)">
          ${[0, 1, 2, 3].map(row => `
            <rect y="${row * 8}" width="${w * 0.28}" height="2" fill="#78716C" opacity="0.4" />
          `).join('')}
        </g>
      `).join('')}
    </g>

    <!-- Main Commercial Display Ad Box (The Newspaper Ad) -->
    <g transform="translate(${w * 0.06}, ${h * 0.17})">
      <rect width="${w * 0.88}" height="${h * 0.76}" fill="#FAF8F5" stroke="#1C1917" stroke-width="3" />
      <rect x="6" y="6" width="${w * 0.88 - 12}" height="${h * 0.76 - 12}" fill="none" stroke="#1C1917" stroke-width="1" />

      <!-- Ad Category Banner -->
      <text x="${w * 0.44}" y="40" text-anchor="middle" fill="#44403C" font-family="'Times New Roman', Georgia, serif" font-size="11" font-weight="bold" letter-spacing="5">
        — COMMERCIAL PRESENTATION • ${category} —
      </text>

      <!-- Headline -->
      <text x="${w * 0.44}" y="80" text-anchor="middle" fill="#1C1917" font-family="'Times New Roman', Georgia, serif" font-size="34" font-weight="900" letter-spacing="3">
        ${name}
      </text>

      <line x1="${w * 0.32}" y1="94" x2="${w * 0.56}" y2="94" stroke="#1C1917" stroke-width="1.5" />

      <!-- Tagline in Serif -->
      <text x="${w * 0.44}" y="118" text-anchor="middle" fill="#44403C" font-family="'Times New Roman', Georgia, serif" font-style="italic" font-size="14">
        "${tagline}"
      </text>

      <!-- High-Contrast Engraving Product Frame -->
      <rect x="${w * 0.1}" y="145" width="${w * 0.68}" height="${h * 0.44}" fill="#F0EDE4" stroke="#1C1917" stroke-width="1.5" />
      
      <!-- Product Engraving Illustration -->
      <g transform="translate(${w * 0.22}, 160)">
        ${renderProductSilhouette(catRaw, '#1C1917', c1, '#78716C', h * 0.38)}
      </g>

      <!-- Bottom Ad Metadata & Barcode -->
      <g transform="translate(${w * 0.08}, ${h * 0.64})">
        <text x="0" y="16" fill="#1C1917" font-family="'Times New Roman', Georgia, serif" font-size="11" font-weight="bold">
          LIMITED RUN ARCHITECTURAL EDITION
        </text>
        <text x="0" y="32" fill="#57534E" font-family="system-ui, sans-serif" font-size="9">
          Available across certified archival stockists worldwide.
        </text>

        <!-- Classic Barcode graphic -->
        <g transform="translate(${w * 0.58}, -4)">
          ${[2, 4, 1, 3, 5, 2, 4, 1, 3, 2, 5, 1, 4, 2, 3].map((barW, i) => `
            <rect x="${i * 8}" y="0" width="${barW}" height="32" fill="#1C1917" />
          `).join('')}
          <text x="50" y="44" text-anchor="middle" fill="#1C1917" font-family="monospace" font-size="8">
            0 92841 02847 1
          </text>
        </g>
      </g>
    </g>

    <!-- Bottom Page Number -->
    <text x="${w * 0.94}" y="${h * 0.98}" text-anchor="end" fill="#78716C" font-family="'Times New Roman', Georgia, serif" font-size="10">
      Page C-14
    </text>
  `;
}

// 3. SOCIAL MEDIA HERO (1:1)
function renderSocialPost(
  w: number,
  h: number,
  name: string,
  tagline: string,
  category: string,
  c1: string,
  c2: string,
  c3: string,
  catRaw: string
): string {
  return `
    <!-- Ultra-Minimalist Studio Canvas -->
    <rect width="${w}" height="${h}" fill="#F4F2EE" />

    <!-- Directional Soft Sunlight & Botanical Window Shadows -->
    <defs>
      <linearGradient id="studioWallGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FAF8F5" />
        <stop offset="60%" stop-color="#EAE7E1" />
        <stop offset="100%" stop-color="#DFDCD5" />
      </linearGradient>
      <linearGradient id="plinthGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ECE8E1" />
        <stop offset="100%" stop-color="#D4CFC6" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#studioWallGrad)" />

    <!-- Architectural Window Frame Cast Shadow -->
    <path d="M ${w * 0.1} 0 L ${w * 0.45} 0 L ${w * 0.25} ${h} L 0 ${h} Z" fill="#1E293B" opacity="0.04" />
    <path d="M ${w * 0.55} 0 L ${w * 0.95} 0 L ${w * 0.75} ${h} L ${w * 0.35} ${h} Z" fill="#1E293B" opacity="0.04" />

    <!-- Travertine Stone Plinth / Pedestal -->
    <!-- Top Face of Pedestal (Isometric) -->
    <polygon points="${w * 0.2},${h * 0.68} ${w * 0.5},${h * 0.6} ${w * 0.8},${h * 0.68} ${w * 0.5},${h * 0.76}" fill="#E8E4DC" stroke="#D3CEBF" stroke-width="1" />
    
    <!-- Left Face -->
    <polygon points="${w * 0.2},${h * 0.68} ${w * 0.5},${h * 0.76} ${w * 0.5},${h * 0.88} ${w * 0.2},${h * 0.8}" fill="#CEC8BC" stroke="#BCB6AA" stroke-width="1" />
    
    <!-- Right Face (Cast Shadowed) -->
    <polygon points="${w * 0.5},${h * 0.76} ${w * 0.8},${h * 0.68} ${w * 0.8},${h * 0.8} ${w * 0.5},${h * 0.88}" fill="#BCB6AA" stroke="#AFA99E" stroke-width="1" />

    <!-- Contact Shadow on Ground under Plinth -->
    <ellipse cx="${w * 0.5}" cy="${h * 0.89}" rx="${w * 0.32}" ry="${h * 0.05}" fill="#2D2721" opacity="0.16" filter="url(#softGlow)" />

    <!-- Product Resting Elegantly on Top of Plinth -->
    <g transform="translate(${w * 0.32}, ${h * 0.26})">
      <!-- Contact Shadow under product on stone surface -->
      <ellipse cx="${w * 0.18}" cy="${h * 0.41}" rx="${w * 0.12}" ry="${h * 0.02}" fill="#1E293B" opacity="0.28" filter="url(#softGlow)" />
      ${renderProductSilhouette(catRaw, c1, c2, c3, h * 0.44)}
    </g>

    <!-- Floating Top Clean Brand Typography -->
    <text x="${w * 0.5}" y="${h * 0.1}" text-anchor="middle" fill="#78716C" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="5">
      ${category}
    </text>

    <text x="${w * 0.5}" y="${h * 0.16}" text-anchor="middle" fill="#1C1917" font-family="system-ui, -apple-system, sans-serif" font-size="30" font-weight="800" letter-spacing="3">
      ${name}
    </text>

    <!-- Bottom Aesthetic Tagline -->
    <text x="${w * 0.5}" y="${h * 0.94}" text-anchor="middle" fill="#78716C" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" letter-spacing="2">
      ${tagline.slice(0, 50)}
    </text>

    <!-- Luxury Color Dot Swatches in corner -->
    <g transform="translate(${w * 0.08}, ${h * 0.92})">
      <circle cx="0" cy="0" r="5" fill="${c1}" stroke="#FFFFFF" stroke-width="1.5" />
      <circle cx="16" cy="0" r="5" fill="${c2}" stroke="#FFFFFF" stroke-width="1.5" />
      <circle cx="32" cy="0" r="5" fill="${c3}" stroke="#FFFFFF" stroke-width="1.5" />
    </g>
  `;
}

// 4. SUBWAY / TRANSIT LIGHTBOX POSTER (3:4)
function renderSubwayPoster(
  w: number,
  h: number,
  name: string,
  tagline: string,
  category: string,
  c1: string,
  c2: string,
  c3: string,
  catRaw: string
): string {
  return `
    <!-- Modern Metro Concrete Wall -->
    <rect width="${w}" height="${h}" fill="#1E293B" />
    <!-- Ceramic Subway Tile Lines -->
    ${[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(r => `
      <line x1="0" y1="${h * r}" x2="${w}" y2="${h * r}" stroke="#334155" stroke-width="1" opacity="0.4" />
    `).join('')}

    <!-- Subway Poster Lightbox Frame -->
    <rect x="${w * 0.08}" y="${h * 0.08}" width="${w * 0.84}" height="${h * 0.84}" rx="8" fill="#0F172A" stroke="#475569" stroke-width="5" />
    <!-- Backlit Poster Glow -->
    <rect x="${w * 0.09}" y="${h * 0.09}" width="${w * 0.82}" height="${h * 0.82}" rx="4" fill="#030712" />

    <!-- Illuminated Poster Artwork -->
    <g transform="translate(${w * 0.09}, ${h * 0.09})">
      <!-- Neon Ambient Gradient behind product -->
      <circle cx="${(w * 0.82) * 0.5}" cy="${(h * 0.82) * 0.46}" r="${w * 0.3}" fill="${c1}" opacity="0.45" filter="url(#softGlow)" />

      <text x="${(w * 0.82) * 0.5}" y="70" text-anchor="middle" fill="${c2}" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" letter-spacing="4">
        ${category}
      </text>

      <text x="${(w * 0.82) * 0.5}" y="125" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="36" font-weight="900" letter-spacing="4">
        ${name}
      </text>

      <!-- Center Product Hero in Metro Light -->
      <g transform="translate(${(w * 0.82) * 0.26}, 160)">
        ${renderProductSilhouette(catRaw, c1, c2, c3, h * 0.42)}
      </g>

      <line x1="80" y1="${(h * 0.82) - 90}" x2="${(w * 0.82) - 80}" y2="${(h * 0.82) - 90}" stroke="#334155" stroke-width="1" />

      <text x="${(w * 0.82) * 0.5}" y="${(h * 0.82) - 60}" text-anchor="middle" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="14" font-weight="500">
        ${tagline}
      </text>

      <text x="${(w * 0.82) * 0.5}" y="${(h * 0.82) - 36}" text-anchor="middle" fill="#64748B" font-family="system-ui, sans-serif" font-size="10" letter-spacing="2">
        TRANSIT TERMINAL NETWORK ADVERTISING • STRICTLY UNINHABITED
      </text>
    </g>
  `;
}

// 5. MAGAZINE SPREAD (4:3)
function renderMagazineSpread(
  w: number,
  h: number,
  name: string,
  tagline: string,
  category: string,
  c1: string,
  c2: string,
  c3: string,
  catRaw: string
): string {
  return `
    <!-- Magazine Glossy Page Ground -->
    <rect width="${w}" height="${h}" fill="#FFFFFF" />

    <!-- Center Fold of Double Page Spread -->
    <rect x="${w * 0.498}" y="0" width="${w * 0.004}" height="${h}" fill="#E2E8F0" />
    <path d="M ${w * 0.5} 0 L ${w * 0.52} 0 L ${w * 0.5} ${h} Z" fill="#000000" opacity="0.04" />

    <!-- Left Page: Hero Product Still Life on Tinted Canvas -->
    <rect x="0" y="0" width="${w * 0.5}" height="${h}" fill="#F8FAFC" />
    <circle cx="${w * 0.25}" cy="${h * 0.5}" r="${h * 0.32}" fill="${c1}" opacity="0.12" />

    <g transform="translate(${w * 0.12}, ${h * 0.2})">
      ${renderProductSilhouette(catRaw, c1, c2, c3, h * 0.55)}
    </g>

    <!-- Right Page: Editorial Design Critique & Typography -->
    <g transform="translate(${w * 0.56}, ${h * 0.12})">
      <text x="0" y="24" fill="${c2}" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" letter-spacing="3">
        VOL. 88 / MONOGRAPH
      </text>

      <text x="0" y="70" fill="#0F172A" font-family="'Times New Roman', Georgia, serif" font-size="42" font-weight="bold">
        ${name}
      </text>

      <line x1="0" y1="90" x2="${w * 0.36}" y2="90" stroke="#0F172A" stroke-width="2" />

      <text x="0" y="125" fill="#334155" font-family="system-ui, sans-serif" font-size="15" font-weight="600" width="${w * 0.35}">
        ${tagline}
      </text>

      <g transform="translate(0, 160)">
        ${[0, 1, 2, 3, 4, 5, 6].map(i => `
          <rect y="${i * 14}" width="${w * 0.36}" height="3" fill="#94A3B8" opacity="0.4" />
        `).join('')}
      </g>

      <!-- Color swatches block -->
      <g transform="translate(0, 280)">
        <text x="0" y="0" fill="#475569" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" letter-spacing="1">
          LOCKED TONAL PALETTE:
        </text>
        <rect x="0" y="10" width="40" height="24" rx="3" fill="${c1}" />
        <rect x="50" y="10" width="40" height="24" rx="3" fill="${c2}" />
        <rect x="100" y="10" width="40" height="24" rx="3" fill="${c3}" />
      </g>
    </g>
  `;
}

// 6. STOREFRONT WINDOW DISPLAY (4:3)
function renderStorefront(
  w: number,
  h: number,
  name: string,
  tagline: string,
  category: string,
  c1: string,
  c2: string,
  c3: string,
  catRaw: string
): string {
  return `
    <!-- Dark Boutique Interior -->
    <rect width="${w}" height="${h}" fill="#090D16" />

    <!-- Gallery Recessed Spotlights -->
    <polygon points="${w * 0.5},0 ${w * 0.2},${h * 0.85} ${w * 0.8},${h * 0.85}" fill="#FEF08A" opacity="0.08" />

    <!-- Illuminated Black Marble Podium -->
    <polygon points="${w * 0.3},${h * 0.72} ${w * 0.5},${h * 0.65} ${w * 0.7},${h * 0.72} ${w * 0.5},${h * 0.79}" fill="#1E293B" stroke="#334155" stroke-width="1" />
    <polygon points="${w * 0.3},${h * 0.72} ${w * 0.5},${h * 0.79} ${w * 0.5},${h * 0.9} ${w * 0.3},${h * 0.83}" fill="#0F172A" />
    <polygon points="${w * 0.5},${h * 0.79} ${w * 0.7},${h * 0.72} ${w * 0.7},${h * 0.83} ${w * 0.5},${h * 0.9}" fill="#0A0F1D" />

    <!-- Product on Podium -->
    <g transform="translate(${w * 0.35}, ${h * 0.28})">
      ${renderProductSilhouette(catRaw, c1, c2, c3, h * 0.44)}
    </g>

    <!-- Clean Gold Leaf Storefront Decal on Glass -->
    <text x="${w * 0.5}" y="${h * 0.12}" text-anchor="middle" fill="${c2}" font-family="system-ui, sans-serif" font-size="14" font-weight="700" letter-spacing="6">
      ${category}
    </text>
    <text x="${w * 0.5}" y="${h * 0.18}" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="32" font-weight="900" letter-spacing="4">
      ${name}
    </text>

    <!-- Glass Reflection Angle (No People, Just Subtle Sky/Tree Caustics) -->
    <line x1="0" y1="${h * 0.1}" x2="${w}" y2="${h * 0.6}" stroke="#FFFFFF" stroke-width="2" opacity="0.08" />
    <line x1="0" y1="${h * 0.3}" x2="${w}" y2="${h * 0.8}" stroke="#FFFFFF" stroke-width="1" opacity="0.05" />
  `;
}

// 7. GENERIC / CUSTOM MEDIUM
function renderGenericMedium(
  w: number,
  h: number,
  name: string,
  tagline: string,
  category: string,
  c1: string,
  c2: string,
  c3: string,
  catRaw: string
): string {
  return `
    <rect width="${w}" height="${h}" fill="#0F172A" />
    <circle cx="${w * 0.5}" cy="${h * 0.5}" r="${Math.min(w, h) * 0.35}" fill="${c1}" opacity="0.25" filter="url(#softGlow)" />

    <text x="${w * 0.5}" y="${h * 0.12}" text-anchor="middle" fill="${c2}" font-family="system-ui, sans-serif" font-size="12" font-weight="700" letter-spacing="4">
      ${category}
    </text>
    <text x="${w * 0.5}" y="${h * 0.18}" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="32" font-weight="900" letter-spacing="3">
      ${name}
    </text>

    <g transform="translate(${w * 0.32}, ${h * 0.24})">
      ${renderProductSilhouette(catRaw, c1, c2, c3, Math.min(w, h) * 0.5)}
    </g>

    <text x="${w * 0.5}" y="${h * 0.9}" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14">
      ${tagline}
    </text>
  `;
}

// HELPER: Renders geometric product silhouette based on category (botanical bottle, tech speaker, watch, chair, gadget)
function renderProductSilhouette(
  category: string,
  c1: string,
  c2: string,
  c3: string,
  height: number
): string {
  const cat = (category || '').toLowerCase();

  // 1. Bottled elixir / perfume / cosmetic / beverage
  if (cat.includes('bottle') || cat.includes('fragrance') || cat.includes('perfume') || cat.includes('beverage') || cat.includes('skincare') || cat.includes('elixir') || cat.includes('oil') || cat.includes('kura')) {
    const scale = height / 320;
    return `
      <g transform="scale(${scale})">
        <!-- Bottle Glass Body -->
        <rect x="60" y="80" width="140" height="200" rx="20" fill="${c1}" opacity="0.9" />
        <!-- Frosted Reflection highlight -->
        <path d="M 80 90 L 95 90 L 95 260 L 80 260 Z" fill="#FFFFFF" opacity="0.2" />
        
        <!-- Liquid Level / Tone gradient -->
        <rect x="66" y="100" width="128" height="172" rx="14" fill="${c1}" />
        <rect x="66" y="100" width="128" height="172" rx="14" fill="url(#primaryGrad)" opacity="0.6" />

        <!-- Neck -->
        <rect x="105" y="45" width="50" height="40" fill="${c1}" opacity="0.8" />
        
        <!-- Brushed Cap (Secondary Accent Color) -->
        <rect x="98" y="10" width="64" height="40" rx="4" fill="${c2}" />
        <line x1="98" y1="22" x2="162" y2="22" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4" />
        
        <!-- Label Placard -->
        <rect x="75" y="140" width="110" height="90" rx="4" fill="#F8FAFC" opacity="0.92" />
        <rect x="80" y="145" width="100" height="80" rx="2" fill="none" stroke="${c2}" stroke-width="1" />
        <text x="130" y="180" text-anchor="middle" fill="#0F172A" font-family="system-ui, sans-serif" font-size="14" font-weight="900" letter-spacing="2">PURE</text>
        <text x="130" y="196" text-anchor="middle" fill="#64748B" font-family="system-ui, sans-serif" font-size="7" font-weight="700" letter-spacing="1">ARCHIVAL</text>
      </g>
    `;
  }

  // 2. Audio Speaker / Monolith / Acoustic Object
  if (cat.includes('speaker') || cat.includes('audio') || cat.includes('sound') || cat.includes('acoustic') || cat.includes('aura')) {
    const scale = height / 320;
    return `
      <g transform="scale(${scale})">
        <!-- Monolithic Truncated Cone body -->
        <polygon points="90,40 170,40 210,270 50,270" fill="${c1}" />
        <!-- Surface Shade -->
        <polygon points="130,40 170,40 210,270 130,270" fill="#000000" opacity="0.18" />

        <!-- Top Brass Parabolic Dish -->
        <ellipse cx="130" cy="40" rx="40" ry="12" fill="${c2}" />
        <ellipse cx="130" cy="40" rx="28" ry="8" fill="#1C1917" />

        <!-- Radial micro perforations array -->
        ${[130, 155, 180, 205, 230].map(y => `
          <g transform="translate(0, ${y})">
            ${[85, 105, 125, 145, 165].map(x => `
              <circle cx="${x}" cy="0" r="1.8" fill="#1C1917" opacity="0.6" />
            `).join('')}
          </g>
        `).join('')}

        <!-- Undercut Cork Shadow Plinth -->
        <polygon points="65,270 195,270 190,285 70,285" fill="#292524" />
      </g>
    `;
  }

  // 3. Timepiece / Watch / Chronometer
  if (cat.includes('watch') || cat.includes('timepiece') || cat.includes('chronometer') || cat.includes('horology') || cat.includes('nordic')) {
    const scale = height / 320;
    return `
      <g transform="scale(${scale})">
        <!-- Strap -->
        <rect x="95" y="10" width="70" height="90" rx="6" fill="#1E293B" />
        <rect x="95" y="220" width="70" height="90" rx="6" fill="#1E293B" />

        <!-- Outer Case (Bezel) -->
        <circle cx="130" cy="160" r="75" fill="${c2}" />
        <circle cx="130" cy="160" r="68" fill="#0F172A" />

        <!-- Inner Dial -->
        <circle cx="130" cy="160" r="60" fill="${c1}" />
        
        <!-- Dial Indices -->
        ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => `
          <line x1="130" y1="108" x2="130" y2="114" stroke="#FFFFFF" stroke-width="2" transform="rotate(${deg} 130 160)" />
        `).join('')}

        <!-- Hands -->
        <line x1="130" y1="160" x2="130" y2="125" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
        <line x1="130" y1="160" x2="165" y2="160" stroke="${c2}" stroke-width="2" stroke-linecap="round" />
        <circle cx="130" cy="160" r="4" fill="#FFFFFF" />

        <!-- Crown Button -->
        <rect x="202" y="152" width="10" height="16" rx="2" fill="${c2}" />
      </g>
    `;
  }

  // Default / Geometric Industrial Product
  const scale = height / 320;
  return `
    <g transform="scale(${scale})">
      <!-- Monolithic Architectural Box -->
      <polygon points="60,100 140,50 220,100 140,150" fill="${c2}" />
      <polygon points="60,100 140,150 140,260 60,210" fill="${c1}" />
      <polygon points="140,150 220,100 220,210 140,260" fill="#0F172A" />
      
      <!-- Chamfer Highlight -->
      <line x1="140" y1="150" x2="140" y2="260" stroke="#FFFFFF" stroke-width="2" opacity="0.3" />
      <circle cx="140" cy="100" r="15" fill="#FFFFFF" opacity="0.35" />
    </g>
  `;
}
