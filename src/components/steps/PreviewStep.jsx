import { useState } from 'react';
import { CheckCircle2, FileImage, FileText, Lock, Palette, Printer } from 'lucide-react';
import ScaledPage from '../../biodata/ScaledPage.jsx';
import { downloadImage, downloadPdf, printBiodata } from '../../services/exporter.js';
import { PRICE_INR, UNLOCK_HOURS, isDemoMode } from '../../services/payment.js';
import { safeFileName } from '../../utils/text.js';

export default function PreviewStep({ state, unlocked, record, exportRef, onUnlock, onBack }) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const families = [state.design.bodyFont, state.design.headFont];
  const nameField = state.sections.flatMap((s) => s.fields).find((f) => f.id === 'name');
  const fileBase = safeFileName(nameField?.value);

  const run = (kind, fn) => async () => {
    if (!unlocked) return onUnlock();
    setError('');
    setBusy(kind);
    try { await fn(); } catch (e) {
      console.error(e);
      setError('डाउनलोड अयशस्वी / Export failed – please try again. (' + (e?.message || 'unknown error') + ')');
    } finally { setBusy(null); }
  };

  const actions = [
    { id: 'pdf', icon: FileText, mr: 'PDF डाउनलोड', en: 'Download PDF (A4)', fn: () => downloadPdf(exportRef.current, { filename: fileBase, families }) },
    { id: 'img', icon: FileImage, mr: 'फोटो डाउनलोड', en: 'Download HD image (PNG)', fn: () => downloadImage(exportRef.current, { filename: fileBase, families }) },
    { id: 'print', icon: Printer, mr: 'प्रिंट करा', en: 'Print (A4)', fn: () => printBiodata(families) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div>
        <h2 className="mb-1 text-xl font-extrabold text-stone-900 sm:text-2xl">पाहा व डाउनलोड करा <span className="text-base font-semibold text-stone-500">Preview & download</span></h2>
        <p className="mb-4 text-sm text-stone-600">A4 आकारात तयार बायोडाटा. • Your biodata at actual A4 proportions.</p>
        <div className="mx-auto max-w-[720px] overflow-hidden rounded-lg shadow-soft ring-1 ring-stone-200">
          <ScaledPage data={state} watermark={!unlocked} maxScale={1} />
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card space-y-4 p-5">
          {unlocked ? (
            <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 p-3 text-emerald-900">
              <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-bold">अनलॉक झाले! / Unlocked</p>
                <p>Payment {record?.demo ? '(demo) ' : ''}received. Valid for {UNLOCK_HOURS}h on this device – edit and download as often as you like.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-600 p-4 text-white">
              <p className="flex items-center gap-2 text-sm font-semibold text-white/85"><Lock size={15} /> फक्त ₹{PRICE_INR} मध्ये अनलॉक करा</p>
              <p className="mt-1 text-3xl font-extrabold">₹{PRICE_INR} <span className="text-sm font-medium text-white/80">one-time</span></p>
              <ul className="mt-2 space-y-0.5 text-sm text-white/90">
                <li>✓ वॉटरमार्क शिवाय PDF / PDF without watermark</li>
                <li>✓ HD फोटो (PNG) / HD image</li>
                <li>✓ A4 प्रिंट / A4 print</li>
              </ul>
              {isDemoMode && <p className="mt-2 text-xs text-amber-200">Demo payment mode</p>}
            </div>
          )}

          <div className="space-y-2.5">
            {actions.map(({ id, icon: Icon, mr, en, fn }) => (
              <button key={id} type="button" onClick={run(id, fn)} disabled={!!busy}
                className={`btn w-full justify-start !py-3 text-left ${unlocked ? 'btn-primary' : 'btn-ghost'}`} data-testid={`action-${id}`}>
                {unlocked ? <Icon size={20} /> : <Lock size={18} className="text-stone-400" />}
                <span className="leading-tight">
                  <span className="block">{busy === id ? 'तयार होत आहे… / Preparing…' : mr}</span>
                  <span className={`block text-xs font-medium ${unlocked ? 'text-white/80' : 'text-stone-500'}`}>{en}</span>
                </span>
              </button>
            ))}
          </div>

          {!unlocked && (
            <button type="button" className="btn btn-gold w-full !py-3.5 text-base" onClick={onUnlock} data-testid="unlock-button">
              <Lock size={18} /> ₹{PRICE_INR} भरा आणि अनलॉक करा
            </button>
          )}
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">{error}</p>}

          <button type="button" onClick={onBack} className="flex w-full items-center justify-center gap-2 text-sm font-bold text-maroon-700 hover:underline">
            <Palette size={16} /> डिझाईन बदला / Change design
          </button>
          <p className="text-xs leading-relaxed text-stone-500">
            टीप: प्रिंट डायलॉगमध्ये “Save as PDF” निवडल्यास सिलेक्ट करता येणारे वेक्टर PDF मिळते. Tip: choosing “Save as PDF” in the print dialog gives a text-selectable vector PDF.
          </p>
        </div>
      </aside>
    </div>
  );
}
