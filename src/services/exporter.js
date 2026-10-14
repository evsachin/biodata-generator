// Export helpers: A4 image, PDF and print.
//
// The biodata is rendered by the browser itself (so Devanagari shaping is always correct) and captured with
// html-to-image together with the embedded bundled fonts. The PDF embeds that high-resolution render on an
// A4 page, which guarantees Marathi conjuncts look exactly like the preview.
// (For a vector / selectable-text PDF, users can also choose "Save as PDF" in the Print dialog.)

import { toJpeg, toPng, getFontEmbedCSS } from 'html-to-image';
import { fontMeta } from '../data/design.js';

export const PAGE_W = 794; // CSS px for 210mm @ 96dpi
export const PAGE_H = 1123; // CSS px for 297mm

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

async function ensureFonts(families) {
  if (!document.fonts) return;
  const loads = [];
  for (const fam of families) {
    const bold = fontMeta(fam).bold;
    loads.push(document.fonts.load(`400 16px "${fam}"`, 'अआइ Abc'));
    loads.push(document.fonts.load(`${bold} 16px "${fam}"`, 'अआइ Abc'));
  }
  await Promise.allSettled(loads);
  await document.fonts.ready;
}

const fontCssCache = new Map();
async function fontCss(node, families) {
  const key = [...families].sort().join('|');
  if (!fontCssCache.has(key)) fontCssCache.set(key, await getFontEmbedCSS(node));
  return fontCssCache.get(key);
}

async function capture(node, { families, pixelRatio = 3, type = 'png' }) {
  if (!node) throw new Error('Nothing to export yet');
  await ensureFonts(families);
  const options = {
    width: PAGE_W, height: PAGE_H, pixelRatio, cacheBust: false,
    fontEmbedCSS: await fontCss(node, families),
    style: { transform: 'none', margin: '0' },
    quality: 0.95,
  };
  const render = type === 'jpeg' ? toJpeg : toPng;
  if (isSafari()) await render(node, options); // Safari needs a warm-up render for fonts/images
  return render(node, options);
}

function triggerDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** High-resolution PNG (≈ 2382 × 3369 px, A4 at ~288 dpi). */
export async function downloadImage(node, { filename, families }) {
  const dataUrl = await capture(node, { families, pixelRatio: 3, type: 'png' });
  triggerDownload(dataUrl, `${filename}.png`);
}

/** A4 PDF with the high-resolution render embedded. */
export async function downloadPdf(node, { filename, families }) {
  const [{ jsPDF }, dataUrl] = await Promise.all([
    import('jspdf'),
    capture(node, { families, pixelRatio: 3, type: 'jpeg' }),
  ]);
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  pdf.setProperties({ title: filename, creator: 'Marathi Biodata Maker' });
  pdf.addImage(dataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  pdf.save(`${filename}.pdf`);
}

/** Opens the browser print dialog; print CSS (index.css) shows only the A4 biodata. */
export async function printBiodata(families) {
  await ensureFonts(families);
  window.print();
}
