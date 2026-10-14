// ---------------------------------------------------------------------------
// Templates are just presets of the `design` object. The same renderer draws all of them,
// so every value below can also be changed individually in the Design step.
//
// layout:        classic | centered | sidebar | cards
// headingStyle:  band | underline | ribbon | ornament | pill | plain
// border:        none | line | double | corners | paithani | toran
// rowStyle:      lines | zebra | plain
// photoShape:    rect | rounded | circle | arch
// photoSize:     s | m | l          photoPos: right | left | center
// fontScale:     s | m | l
// labelLang:     mr | en | both
// ---------------------------------------------------------------------------

const base = {
  labelLang: 'mr',
  fontScale: 'm',
  rowStyle: 'lines',
  photoSize: 'm',
  photoPos: 'right',
};

export const TEMPLATES = [
  {
    id: 'paithani',
    nameMr: 'पैठणी',
    nameEn: 'Paithani',
    design: {
      ...base,
      layout: 'classic',
      headingStyle: 'band',
      border: 'paithani',
      headingFont: 'tiro',
      bodyFont: 'mukta',
      accent: '#6B1D5C',
      secondary: '#C99A2E',
      pageBg: '#FFFFFF',
      text: '#2A1B2E',
      photoShape: 'arch',
    },
  },
  {
    id: 'haldi',
    nameMr: 'हळद',
    nameEn: 'Haldi',
    design: {
      ...base,
      layout: 'centered',
      headingStyle: 'ornament',
      border: 'double',
      headingFont: 'baloo',
      bodyFont: 'hind',
      accent: '#A8650A',
      secondary: '#E0A526',
      pageBg: '#FFFBEB',
      text: '#3A2A10',
      photoShape: 'circle',
      rowStyle: 'plain',
    },
  },
  {
    id: 'kumkum',
    nameMr: 'कुंकू',
    nameEn: 'Kumkum',
    design: {
      ...base,
      layout: 'sidebar',
      headingStyle: 'underline',
      border: 'line',
      headingFont: 'yatra',
      bodyFont: 'mukta',
      accent: '#9F1D24',
      secondary: '#D9A441',
      pageBg: '#FFFFFF',
      text: '#2B1517',
      photoShape: 'rounded',
      rowStyle: 'lines',
    },
  },
  {
    id: 'toran',
    nameMr: 'तोरण',
    nameEn: 'Toran',
    design: {
      ...base,
      layout: 'cards',
      headingStyle: 'pill',
      border: 'toran',
      headingFont: 'yatra',
      bodyFont: 'hind',
      accent: '#1F6F4A',
      secondary: '#E08A1E',
      pageBg: '#FBFDF8',
      text: '#14281E',
      photoShape: 'rounded',
      photoPos: 'right',
      rowStyle: 'plain',
    },
  },
  {
    id: 'mor',
    nameMr: 'मोरपंखी',
    nameEn: 'Peacock',
    design: {
      ...base,
      layout: 'classic',
      headingStyle: 'ribbon',
      border: 'corners',
      headingFont: 'baloo',
      bodyFont: 'noto',
      accent: '#0E6E73',
      secondary: '#C8A14A',
      pageBg: '#F5FBFB',
      text: '#10282B',
      photoShape: 'rounded',
      photoPos: 'left',
      rowStyle: 'zebra',
    },
  },
  {
    id: 'royal',
    nameMr: 'राजेशाही',
    nameEn: 'Royal',
    design: {
      ...base,
      layout: 'centered',
      headingStyle: 'ornament',
      border: 'corners',
      headingFont: 'rozha',
      bodyFont: 'tiro',
      accent: '#1D2D6B',
      secondary: '#B8923A',
      pageBg: '#FFFFFF',
      text: '#1B1F33',
      photoShape: 'arch',
      rowStyle: 'lines',
    },
  },
  {
    id: 'saadha',
    nameMr: 'साधा',
    nameEn: 'Simple',
    design: {
      ...base,
      layout: 'classic',
      headingStyle: 'plain',
      border: 'none',
      headingFont: 'noto',
      bodyFont: 'noto',
      accent: '#222222',
      secondary: '#888888',
      pageBg: '#FFFFFF',
      text: '#1A1A1A',
      photoShape: 'rect',
      rowStyle: 'lines',
    },
  },
];

export const templateDesign = (id) => {
  const t = TEMPLATES.find((x) => x.id === id) || TEMPLATES[0];
  return { templateId: t.id, ...t.design };
};

// Preset colour swatches shown in the Design step
export const ACCENT_SWATCHES = [
  { name: 'जांभळा Plum', value: '#6B1D5C' },
  { name: 'कुंकू Kumkum', value: '#9F1D24' },
  { name: 'हळद Haldi', value: '#A8650A' },
  { name: 'मेहंदी Mehendi', value: '#1F6F4A' },
  { name: 'मोरपंखी Peacock', value: '#0E6E73' },
  { name: 'निळा Royal', value: '#1D2D6B' },
  { name: 'गुलाबी Rose', value: '#B03A6B' },
  { name: 'काळा Black', value: '#222222' },
];

export const ZARI_SWATCHES = [
  { name: 'जरी Zari', value: '#C99A2E' },
  { name: 'केशरी Saffron', value: '#E08A1E' },
  { name: 'सोनेरी Gold', value: '#E0A526' },
  { name: 'चंदेरी Silver', value: '#9AA0A6' },
  { name: 'तांबे Copper', value: '#B4673A' },
  { name: 'हिरवा Green', value: '#3E8E5E' },
];

export const PAGE_BG_SWATCHES = [
  { name: 'पांढरा White', value: '#FFFFFF' },
  { name: 'हळदी Haldi tint', value: '#FFFBEB' },
  { name: 'गुलाबी Rose tint', value: '#FFF5F7' },
  { name: 'हिरवट Mint tint', value: '#F5FBF7' },
  { name: 'निळसर Sky tint', value: '#F4F8FF' },
  { name: 'लव्हेंडर Lavender', value: '#F8F4FC' },
];
