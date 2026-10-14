// Fonts (all bundled locally in src/fonts.js), templates, colour themes and design option lists.

export const FONTS = [
  { id: 'Mukta', label: 'Mukta', kind: 'Clean sans', bold: 700 },
  { id: 'Hind', label: 'Hind', kind: 'Neutral sans', bold: 700 },
  { id: 'Noto Sans Devanagari', label: 'Noto Sans', kind: 'Modern sans', bold: 700 },
  { id: 'Martel', label: 'Martel', kind: 'Classic serif', bold: 700 },
  { id: 'Laila', label: 'Laila', kind: 'Soft serif', bold: 700 },
  { id: 'Tiro Devanagari Marathi', label: 'Tiro', kind: 'Elegant serif', bold: 400 },
  { id: 'Amita', label: 'Amita', kind: 'Calligraphic', bold: 700 },
  { id: 'Kalam', label: 'Kalam', kind: 'Handwritten', bold: 700 },
  { id: 'Yatra One', label: 'Yatra One', kind: 'Display', bold: 400 },
];

export const fontMeta = (id) => FONTS.find((x) => x.id === id) || FONTS[0];

export const BORDERS = [
  { id: 'none', label: 'None', mr: 'नाही' },
  { id: 'single', label: 'Single', mr: 'एकेरी' },
  { id: 'double', label: 'Double', mr: 'दुहेरी' },
  { id: 'dashed', label: 'Dashed', mr: 'तुटक' },
  { id: 'thick', label: 'Bold', mr: 'जाड' },
  { id: 'ornate', label: 'Ornate', mr: 'नक्षीदार' },
];

export const HEADING_STYLES = [
  { id: 'band', label: 'Band' },
  { id: 'underline', label: 'Underline' },
  { id: 'ornament', label: 'Ornament' },
  { id: 'pill', label: 'Pill' },
  { id: 'leftbar', label: 'Side bar' },
];

export const LAYOUTS = [
  { id: 'stacked', label: 'Classic', hint: 'Sections one below another' },
  { id: 'twoColumn', label: 'Two column', hint: 'Compact, fits more' },
  { id: 'sidebar', label: 'Sidebar', hint: 'Photo & contact on the side' },
];

export const PATTERNS = [
  { id: 'none', label: 'Plain' },
  { id: 'dots', label: 'Dots' },
  { id: 'lattice', label: 'Lattice' },
  { id: 'glow', label: 'Glow' },
  { id: 'blossom', label: 'Blossom' },
];

export const DECORS = [
  { id: 'none', label: 'None' },
  { id: 'toran', label: 'Toran' },
  { id: 'mandala', label: 'Mandala' },
];

export const PHOTO_SHAPES = [
  { id: 'rounded', label: 'Rounded' },
  { id: 'arch', label: 'Arch' },
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
];

export const PHOTO_POSITIONS = [
  { id: 'left', label: 'Left' },
  { id: 'center', label: 'Centre' },
  { id: 'right', label: 'Right' },
];

export const BLESSINGS = [
  { id: 'ganesh', text: '|| श्री गणेशाय नमः ||' },
  { id: 'shri', text: '|| श्री ||' },
  { id: 'om', text: '|| ॐ ||' },
  { id: 'swami', text: '|| श्री स्वामी समर्थ ||' },
  { id: 'bhavani', text: '|| जय भवानी ||' },
  { id: 'none', text: '' },
];

export const COLOR_THEMES = [
  { id: 'maroon', name: 'Maroon & Gold', primary: '#8B1A1A', accent: '#D9922E', bg: '#FFF8EC', text: '#3A2418' },
  { id: 'purple', name: 'Royal Purple', primary: '#5B1F7A', accent: '#C99A12', bg: '#FBF6FF', text: '#2B1636' },
  { id: 'teal', name: 'Peacock Teal', primary: '#0F766E', accent: '#D99A1E', bg: '#F4FBFA', text: '#12302D' },
  { id: 'rose', name: 'Rose Pink', primary: '#BE185D', accent: '#E8A33D', bg: '#FFF5F8', text: '#4A1230' },
  { id: 'green', name: 'Leaf Green', primary: '#166534', accent: '#C2410C', bg: '#F6FBF1', text: '#1D3A22' },
  { id: 'navy', name: 'Navy Blue', primary: '#1E3A8A', accent: '#D97706', bg: '#F5F8FF', text: '#17203D' },
  { id: 'haldi', name: 'Haldi Yellow', primary: '#B91C1C', accent: '#E69A0B', bg: '#FFF1A8', text: '#4A2A10' },
  { id: 'midnight', name: 'Midnight Gold', primary: '#E3B04B', accent: '#C98B2B', bg: '#1A1033', text: '#F4EAD5' },
];

// A template is a preset of design options. Choosing one overwrites those options; the user can then tweak anything.
export const TEMPLATES = [
  {
    id: 'maharashtrian', mr: 'महाराष्ट्रीयन पारंपरिक', en: 'Maharashtrian Classic',
    design: {
      primary: '#8B1A1A', accent: '#D9922E', bg: '#FFF8EC', text: '#3A2418',
      bodyFont: 'Mukta', headFont: 'Tiro Devanagari Marathi', border: 'ornate', headingStyle: 'band',
      layout: 'stacked', pattern: 'none', decor: 'none', photoShape: 'rounded', photoPosition: 'right',
    },
  },
  {
    id: 'paithani', mr: 'रॉयल पैठणी', en: 'Royal Paithani',
    design: {
      primary: '#5B1F7A', accent: '#C99A12', bg: '#FBF6FF', text: '#2B1636',
      bodyFont: 'Laila', headFont: 'Amita', border: 'double', headingStyle: 'ornament',
      layout: 'stacked', pattern: 'lattice', decor: 'none', photoShape: 'arch', photoPosition: 'center',
    },
  },
  {
    id: 'shubh', mr: 'शुभ विवाह (तोरण)', en: 'Shubh Vivah Toran',
    design: {
      primary: '#C2410C', accent: '#15803D', bg: '#FFFCEF', text: '#3B2412',
      bodyFont: 'Hind', headFont: 'Yatra One', border: 'single', headingStyle: 'pill',
      layout: 'stacked', pattern: 'glow', decor: 'toran', photoShape: 'rounded', photoPosition: 'right',
    },
  },
  {
    id: 'modern', mr: 'आधुनिक साधे', en: 'Modern Sidebar',
    design: {
      primary: '#0F766E', accent: '#D99A1E', bg: '#FFFFFF', text: '#12302D',
      bodyFont: 'Noto Sans Devanagari', headFont: 'Noto Sans Devanagari', border: 'none', headingStyle: 'leftbar',
      layout: 'sidebar', pattern: 'none', decor: 'none', photoShape: 'rounded', photoPosition: 'center',
    },
  },
  {
    id: 'rose', mr: 'गुलाबी फुलोरा', en: 'Rose Blossom',
    design: {
      primary: '#BE185D', accent: '#E8A33D', bg: '#FFF5F8', text: '#4A1230',
      bodyFont: 'Laila', headFont: 'Kalam', border: 'dashed', headingStyle: 'pill',
      layout: 'twoColumn', pattern: 'blossom', decor: 'mandala', photoShape: 'circle', photoPosition: 'left',
    },
  },
  {
    id: 'haldi', mr: 'हळदी पिवळा', en: 'Haldi Yellow',
    design: {
      primary: '#B91C1C', accent: '#E69A0B', bg: '#FFF1A8', text: '#4A2A10',
      bodyFont: 'Martel', headFont: 'Martel', border: 'thick', headingStyle: 'leftbar',
      layout: 'stacked', pattern: 'dots', decor: 'none', photoShape: 'square', photoPosition: 'left',
    },
  },
  {
    id: 'royal', mr: 'राजेशाही गडद', en: 'Royal Midnight',
    design: {
      primary: '#E3B04B', accent: '#C98B2B', bg: '#1A1033', text: '#F4EAD5',
      bodyFont: 'Hind', headFont: 'Amita', border: 'ornate', headingStyle: 'ornament',
      layout: 'stacked', pattern: 'lattice', decor: 'mandala', photoShape: 'arch', photoPosition: 'right',
    },
  },
];

export const templateById = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

export const BASE_DESIGN = {
  template: 'maharashtrian',
  fontSize: 14,
  blessing: '|| श्री गणेशाय नमः ||',
  title: '',
  photoSize: 128,
  photoBorder: true,
  showPhoto: true,
  marathiDigits: false,
};

export const createDesign = (templateId = 'maharashtrian') => ({
  ...BASE_DESIGN,
  ...templateById(templateId).design,
  template: templateId,
});
