import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, wide = false, hideClose = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-stone-900/55 backdrop-blur-[1px]" onClick={onClose} />
      <div className={`relative flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}>
        {(title || !hideClose) && (
          <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
            <h3 className="text-lg font-bold text-stone-900">{title}</h3>
            {!hideClose && (
              <button onClick={onClose} className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100" aria-label="Close">
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel = 'रद्द करा / Cancel', onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-5 p-5">
        <div className="text-[15px] leading-relaxed text-stone-600">{message}</div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button className="btn btn-ghost" onClick={onCancel}>{cancelLabel}</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
}

/** Pill-style single choice selector. */
export function Chips({ value, onChange, options, render, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
              active ? 'border-maroon-700 bg-maroon-700 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700 hover:border-maroon-300'
            }`}
          >
            {render ? render(opt, active) : opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-[15px] font-semibold text-stone-700">
      <span>{label}</span>
      <button
        type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-maroon-700' : 'bg-stone-300'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </label>
  );
}

export function Panel({ title, hint, children, className = '' }) {
  return (
    <section className={`card p-4 sm:p-5 ${className}`}>
      {title && (
        <div className="mb-3">
          <h3 className="text-base font-bold text-stone-900">{title}</h3>
          {hint && <p className="text-sm text-stone-500">{hint}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function LanguageToggle({ value, onChange }) {
  const opts = [
    { id: 'mr', label: 'मराठी' },
    { id: 'en', label: 'English' },
    { id: 'both', label: 'दोन्ही / Both' },
  ];
  return (
    <div className="inline-flex rounded-xl bg-stone-100 p-1" role="group" aria-label="Biodata language">
      {opts.map((o) => (
        <button
          key={o.id} type="button" onClick={() => onChange(o.id)} aria-pressed={value === o.id}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${value === o.id ? 'bg-white text-maroon-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
