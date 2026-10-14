// SVG ornaments for the biodata borders. They are generated as data URIs so the colours follow
// the chosen palette and they survive html-to-image / print without extra network requests.

const uri = (svg) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}")`;

// Repeating Paithani-style border tile (diamond + dot). 22 x 22 so strips and corners line up.
export const paithaniTile = (accent, zari, bg) =>
  uri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <rect width="22" height="22" fill="${accent}"/>
    <path d="M11 2.2 L19.8 11 L11 19.8 L2.2 11 Z" fill="none" stroke="${zari}" stroke-width="1.6"/>
    <path d="M11 6.2 L15.8 11 L11 15.8 L6.2 11 Z" fill="${zari}"/>
    <circle cx="11" cy="11" r="1.5" fill="${accent}"/>
    <rect x="0" y="0" width="22" height="22" fill="none" stroke="${bg}" stroke-opacity=".0"/>
  </svg>`);

// Hanging mango-leaf garland (toran). Tile is repeated horizontally along the top edge.
export const toranTile = (accent, zari) =>
  uri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">
    <path d="M0 4 H46" stroke="${zari}" stroke-width="2"/>
    <path d="M23 6 C14 15 14 32 23 44 C32 32 32 15 23 6 Z" fill="${accent}"/>
    <path d="M23 9 V40" stroke="${zari}" stroke-opacity=".75" stroke-width="1.2"/>
    <circle cx="23" cy="5" r="3.6" fill="${zari}"/>
    <circle cx="0" cy="4" r="2.2" fill="${zari}"/>
    <circle cx="46" cy="4" r="2.2" fill="${zari}"/>
  </svg>`);

// Corner flourish drawn for the top-left; the page rotates it for the other corners.
export const cornerOrnament = (accent, zari) =>
  uri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84" fill="none">
    <path d="M4 80 V26 C4 13 13 4 26 4 H80" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M14 80 V34 C14 23 23 14 34 14 H80" stroke="${zari}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M24 24 C24 38 38 38 38 24 C38 12 24 12 24 24 Z" fill="${zari}" fill-opacity=".9"/>
    <circle cx="31" cy="24" r="3" fill="${accent}"/>
    <path d="M4 58 C14 58 14 48 4 48" stroke="${zari}" stroke-width="1.2"/>
    <path d="M58 4 C58 14 48 14 48 4" stroke="${zari}" stroke-width="1.2"/>
  </svg>`);

// Neutral silhouette shown in previews (never in the final export) so the photo position is visible.
export const SILHOUETTE = uri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 180">
    <rect width="140" height="180" fill="#ECE9F3"/>
    <circle cx="70" cy="68" r="29" fill="#BDB6D0"/>
    <path d="M14 180 C14 130 40 110 70 110 C100 110 126 130 126 180 Z" fill="#BDB6D0"/>
  </svg>`);
