// Fonts available for the biodata. `css` must match the family name declared by @fontsource.
export const FONTS = [
  { id: 'mukta', name: 'Mukta', kind: 'sans', css: "'Mukta'" },
  { id: 'hind', name: 'Hind', kind: 'sans', css: "'Hind'" },
  { id: 'noto', name: 'Noto Sans Devanagari', kind: 'sans', css: "'Noto Sans Devanagari'" },
  { id: 'baloo', name: 'Baloo 2', kind: 'rounded', css: "'Baloo 2'" },
  { id: 'tiro', name: 'Tiro Devanagari Marathi', kind: 'serif', css: "'Tiro Devanagari Marathi'" },
  { id: 'martel', name: 'Martel', kind: 'serif', css: "'Martel'" },
  { id: 'yatra', name: 'Yatra One', kind: 'display', css: "'Yatra One'" },
  { id: 'rozha', name: 'Rozha One', kind: 'display', css: "'Rozha One'" },
];

const FALLBACK = "'Mukta', 'Noto Sans Devanagari', sans-serif";

export const fontStack = (id) => {
  const font = FONTS.find((f) => f.id === id) || FONTS[0];
  return `${font.css}, ${FALLBACK}`;
};

export const fontFamilyName = (id) => (FONTS.find((f) => f.id === id) || FONTS[0]).name;
