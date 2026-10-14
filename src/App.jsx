import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Eye, RotateCcw } from 'lucide-react';
import { useBiodata, usePayment } from './hooks/useBiodata.js';
import Stepper from './components/Stepper.jsx';
import InformationStep from './components/steps/InformationStep.jsx';
import DesignStep from './components/steps/DesignStep.jsx';
import PreviewStep from './components/steps/PreviewStep.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import { ConfirmDialog, Modal } from './components/ui.jsx';
import ScaledPage from './biodata/ScaledPage.jsx';
import BiodataPage from './biodata/BiodataPage.jsx';

export default function App() {
  const { state, dispatch, hydrated, clearAll } = useBiodata();
  const { unlocked, record, unlock } = usePayment();
  const [step, setStep] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const exportRef = useRef(null);

  const go = (n) => { setStep(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (!hydrated) {
    return <div className="flex min-h-dvh items-center justify-center text-stone-500">लोड होत आहे… Loading…</div>;
  }

  const showLive = step < 2;
  const phone = state.sections.flatMap((s) => s.fields).find((f) => f.id === 'phone')?.value;
  const email = state.sections.flatMap((s) => s.fields).find((f) => f.id === 'email')?.value;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-cream-100 to-white pb-24 lg:pb-10">
      <header className="sticky top-0 z-30 border-b border-amber-900/10 bg-cream-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-700 text-xl text-amber-300 shadow-soft font-display" aria-hidden="true">श्री</span>
            <div className="hidden leading-tight sm:block">
              <p className="font-display text-lg text-maroon-800">विवाह बायोडाटा मेकर</p>
              <p className="text-xs font-semibold text-stone-500">Marathi Biodata Maker</p>
            </div>
          </div>
          <div className="min-w-0 flex-1 px-1 sm:px-6"><Stepper step={step} onStep={go} /></div>
          <button type="button" onClick={() => setConfirmClear(true)} className="btn btn-ghost shrink-0 !px-3 !py-2 text-red-700" data-testid="clear-all">
            <RotateCcw size={16} /> <span className="hidden sm:inline">सर्व पुसा / Clear All</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {showLive ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="min-w-0">
              {step === 0 ? <InformationStep state={state} dispatch={dispatch} /> : <DesignStep state={state} dispatch={dispatch} />}
            </div>
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700"><Eye size={16} /> थेट पूर्वावलोकन / Live preview</p>
                <div className="overflow-hidden rounded-lg shadow-soft ring-1 ring-stone-200" data-testid="live-preview">
                  <ScaledPage data={state} watermark={false} maxScale={1} />
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <PreviewStep
            state={state} unlocked={unlocked} record={record} exportRef={exportRef}
            onUnlock={() => setPayOpen(true)} onBack={() => go(1)}
          />
        )}
      </main>

      {/* bottom navigation */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-amber-900/10 bg-white/95 backdrop-blur lg:static lg:mx-auto lg:mt-8 lg:max-w-7xl lg:border-0 lg:bg-transparent lg:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-0">
          <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}>
            <ArrowLeft size={18} /> मागे <span className="hidden sm:inline">/ Back</span>
          </button>
          {showLive && (
            <button type="button" className="btn btn-ghost lg:hidden" onClick={() => setSheet(true)} data-testid="open-sheet">
              <Eye size={18} /> Preview
            </button>
          )}
          {step < 2 && (
            <button type="button" className="btn btn-primary" onClick={() => go(step + 1)} data-testid="next">
              {step === 0 ? 'पुढे: डिझाईन' : 'पुढे: पाहा व डाउनलोड'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* mobile live preview */}
      <Modal open={sheet} onClose={() => setSheet(false)} title="थेट पूर्वावलोकन / Live preview" wide>
        <div className="p-3"><ScaledPage data={state} maxScale={1} /></div>
      </Modal>

      <ConfirmDialog
        open={confirmClear}
        title="सर्व माहिती पुसायची? / Clear everything?"
        message={(
          <>
            <p>तुम्ही भरलेली सर्व माहिती, फोटो आणि डिझाईन सेटिंग्ज कायमची पुसली जातील.</p>
            <p className="mt-1">All entered details, the photo and your design settings will be erased. This cannot be undone.</p>
            {unlocked && <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">तुमचे पेमेंट वैध राहील. / Your payment stays valid.</p>}
          </>
        )}
        confirmLabel="होय, सर्व पुसा / Yes, clear all"
        onCancel={() => setConfirmClear(false)}
        onConfirm={async () => { await clearAll(); setConfirmClear(false); go(0); }}
      />

      <PaymentModal
        open={payOpen} onClose={() => setPayOpen(false)}
        prefill={{ contact: phone || undefined, email: email || undefined }}
        onSuccess={(rec) => { unlock(rec); setPayOpen(false); }}
      />

      {/* Off-screen full-size A4 copy used for PDF / image export and for printing. Only exists after payment. */}
      {unlocked && createPortal(
        <div id="print-root" aria-hidden="true"><BiodataPage ref={exportRef} data={state} /></div>,
        document.body,
      )}
    </div>
  );
}
