// Elegant SVG-based luxury bag illustrations for Scatch catalog

function createBagSvg(type, color = "#1e293b", accent = "#d97706") {
  const svgs = {
    tote: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="grad_tote" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.9" />
            <stop offset="100%" stop-color="${color}" stop-opacity="1" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.25"/>
          </filter>
        </defs>
        <!-- Handles -->
        <path d="M 150 160 C 150 70, 250 70, 250 160" fill="none" stroke="${accent}" stroke-width="12" stroke-linecap="round"/>
        <path d="M 158 160 C 158 85, 242 85, 242 160" fill="none" stroke="#27272a" stroke-width="4" stroke-opacity="0.4"/>
        <!-- Bag Body -->
        <polygon points="110,160 290,160 270,330 130,330" fill="url(#grad_tote)" filter="url(#shadow)" rx="10"/>
        <!-- Leather stitch lines -->
        <line x1="120" y1="170" x2="138" y2="320" stroke="${accent}" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>
        <line x1="280" y1="170" x2="262" y2="320" stroke="${accent}" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>
        <!-- Center seam & emblem -->
        <line x1="200" y1="160" x2="200" y2="330" stroke="#000000" stroke-width="2" opacity="0.25"/>
        <rect x="186" y="225" width="28" height="18" rx="4" fill="${accent}" opacity="0.9"/>
        <circle cx="200" cy="234" r="3" fill="#ffffff"/>
        <!-- Handle attachments -->
        <rect x="142" y="152" width="16" height="22" rx="3" fill="${accent}"/>
        <rect x="242" y="152" width="16" height="22" rx="3" fill="${accent}"/>
      </svg>
    `,
    backpack: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="grad_bp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="${color}" stop-opacity="1" />
          </linearGradient>
          <filter id="shadow_bp" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" flood-opacity="0.28"/>
          </filter>
        </defs>
        <!-- Top handle -->
        <path d="M 170 120 C 170 85, 230 85, 230 120" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round"/>
        <!-- Main body -->
        <rect x="120" y="115" width="160" height="220" rx="35" fill="url(#grad_bp)" filter="url(#shadow_bp)"/>
        <!-- Top zipper arch -->
        <path d="M 135 155 C 135 130, 265 130, 265 155" fill="none" stroke="${accent}" stroke-width="4" stroke-dasharray="3,3"/>
        <!-- Front pocket -->
        <rect x="138" y="210" width="124" height="110" rx="16" fill="${color}" stroke="${accent}" stroke-width="2"/>
        <line x1="145" y1="230" x2="255" y2="230" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
        <!-- Scatch badge -->
        <rect x="182" y="255" width="36" height="14" rx="3" fill="${accent}"/>
        <text x="200" y="265" font-family="sans-serif" font-size="8" font-weight="bold" fill="#ffffff" text-anchor="middle">SCATCH</text>
      </svg>
    `,
    crossbody: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="grad_cb" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.9" />
            <stop offset="100%" stop-color="${color}" stop-opacity="1" />
          </linearGradient>
          <filter id="shadow_cb" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.25"/>
          </filter>
        </defs>
        <!-- Strap -->
        <path d="M 80 80 Q 200 130 320 80" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="105" cy="180" r="10" fill="none" stroke="${accent}" stroke-width="4"/>
        <circle cx="295" cy="180" r="10" fill="none" stroke="${accent}" stroke-width="4"/>
        <!-- Bag Body -->
        <rect x="105" y="170" width="190" height="150" rx="20" fill="url(#grad_cb)" filter="url(#shadow_cb)"/>
        <!-- Flap -->
        <path d="M 105 170 L 295 170 L 295 240 Q 200 275 105 240 Z" fill="${color}" stroke="${accent}" stroke-width="2"/>
        <!-- Gold Clasp -->
        <rect x="188" y="240" width="24" height="24" rx="6" fill="${accent}"/>
        <circle cx="200" cy="252" r="4" fill="#ffffff"/>
      </svg>
    `,
    duffle: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="grad_df" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="${color}" stop-opacity="1" />
          </linearGradient>
          <filter id="shadow_df" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" flood-opacity="0.25"/>
          </filter>
        </defs>
        <!-- Dual handles -->
        <path d="M 140 180 C 140 100, 200 100, 200 180" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
        <path d="M 200 180 C 200 100, 260 100, 260 180" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
        <!-- Duffle Barrel Body -->
        <rect x="80" y="170" width="240" height="150" rx="40" fill="url(#grad_df)" filter="url(#shadow_df)"/>
        <!-- Leather side stripes -->
        <rect x="135" y="170" width="18" height="150" fill="${accent}" opacity="0.9"/>
        <rect x="247" y="170" width="18" height="150" fill="${accent}" opacity="0.9"/>
        <!-- Center zipper line -->
        <line x1="100" y1="185" x2="300" y2="185" stroke="#ffffff" stroke-width="3" stroke-dasharray="4,4"/>
        <rect x="190" y="240" width="20" height="12" rx="3" fill="${accent}"/>
      </svg>
    `,
    briefcase: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="grad_bc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
          <filter id="shadow_bc" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.25"/>
          </filter>
        </defs>
        <!-- Rigid Handle -->
        <path d="M 170 145 L 170 120 Q 200 110 230 120 L 230 145" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Main Case -->
        <rect x="90" y="145" width="220" height="170" rx="14" fill="url(#grad_bc)" filter="url(#shadow_bc)"/>
        <!-- Case Lid seam -->
        <line x1="90" y1="215" x2="310" y2="215" stroke="${accent}" stroke-width="3"/>
        <!-- Dual Brass Latches -->
        <rect x="135" y="205" width="18" height="24" rx="4" fill="${accent}"/>
        <rect x="247" y="205" width="18" height="24" rx="4" fill="${accent}"/>
        <!-- Top stitch border -->
        <rect x="98" y="153" width="204" height="154" rx="10" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
      </svg>
    `,
    clutch: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <linearGradient id="grad_cl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.85" />
          </linearGradient>
          <filter id="shadow_cl" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.22"/>
          </filter>
        </defs>
        <!-- Envelope Clutch Body -->
        <rect x="90" y="160" width="220" height="140" rx="12" fill="url(#grad_cl)" filter="url(#shadow_cl)"/>
        <!-- Triangular flap -->
        <polygon points="90,160 310,160 200,245" fill="${color}" stroke="${accent}" stroke-width="2"/>
        <!-- Gold Monogram lock -->
        <circle cx="200" cy="242" r="14" fill="${accent}"/>
        <circle cx="200" cy="242" r="8" fill="#ffffff" opacity="0.9"/>
        <!-- Delicate wristlet strap -->
        <path d="M 90 200 C 60 200, 50 250, 75 270 C 90 280, 100 240, 90 215" fill="none" stroke="${accent}" stroke-width="4"/>
      </svg>
    `,
  };

  const svgContent = svgs[type] || svgs.tote;
  return Buffer.from(svgContent.trim());
}

module.exports = { createBagSvg };
