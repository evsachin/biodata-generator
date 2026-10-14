import { OPTIONS } from '../data/schema.js';

const DEVANAGARI_DIGITS = '०१२३४५६७८९';
export const toMarathiDigits = (s) => String(s).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[d]);

/** Label in the chosen biodata language: 'mr' | 'en' | 'both'. */
export function pickLabel(mr, en, lang) {
  const a = (mr || '').trim();
  const b = (en || '').trim();
  if (lang === 'mr') return a || b;
  if (lang === 'en') return b || a;
  return a && b && a !== b ? `${a} / ${b}` : a || b;
}

function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

function formatTime(hhmm, lang) {
  const m = /^(\d{2}):(\d{2})/.exec(hhmm);
  if (!m) return hhmm;
  const h = Number(m[1]);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const time = `${String(h12).padStart(2, '0')}:${m[2]}`;
  const en = `${time} ${h < 12 ? 'AM' : 'PM'}`;
  const part = h >= 4 && h < 12 ? 'सकाळी' : h >= 12 && h < 16 ? 'दुपारी' : h >= 16 && h < 20 ? 'सायंकाळी' : 'रात्री';
  const mr = `${part} ${time}`;
  if (lang === 'mr') return mr;
  if (lang === 'en') return en;
  return `${mr} / ${en}`;
}

/** Human-readable value of a field for the biodata (empty string = hide). */
export function formatValue(field, lang, marathiDigits) {
  const raw = (field.value ?? '').toString().trim();
  if (!raw) return '';
  let out = raw;
  if (field.type === 'select' && field.options) {
    const opt = (OPTIONS[field.options] || []).find((x) => x.mr === raw);
    if (opt) out = lang === 'mr' ? opt.mr : lang === 'en' ? opt.en : opt.mr === opt.en ? opt.mr : `${opt.mr} / ${opt.en}`;
  } else if (field.type === 'date') out = formatDate(raw);
  else if (field.type === 'time') out = formatTime(raw, lang);
  return marathiDigits ? toMarathiDigits(out) : out;
}

/** Sections reduced to what should actually be printed: empty fields and empty sections vanish. */
export function buildRenderSections(data) {
  const { sections, lang, design } = data;
  return sections
    .map((s) => ({
      id: s.id,
      title: pickLabel(s.mr, s.en, lang),
      rows: s.fields
        .map((f) => ({ id: f.id, label: pickLabel(f.mr, f.en, lang), value: formatValue(f, lang, design.marathiDigits) }))
        .filter((r) => r.value),
    }))
    .filter((s) => s.rows.length > 0);
}

export const countFilled = (section) => section.fields.filter((f) => (f.value ?? '').toString().trim()).length;

export function contrastColor(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#1f1410' : '#ffffff';
}

export function safeFileName(name, fallback = 'Marathi-Biodata') {
  const clean = (name || '').replace(/[\\/:*?"<>|]+/g, '').trim().replace(/\s+/g, '-');
  return clean ? `Biodata-${clean}` : fallback;
}
