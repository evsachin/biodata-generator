import { useEffect, useRef } from 'react';
import { IconX } from './Icons';

/** Marathi text with a smaller, muted English companion. */
export const Bi = ({ mr, en, className = '', enClassName = '' }) => (
  <span className={className}>
    {mr}
    {en && <span className={`ml-1.5 text-[0.8em] font-normal opacity-70 ${enClassName}`}>{en}</span>}
  </span>
);

const VARIANTS = {
  primary: 'bg-plum-700 text-white hover:bg-plum-800 active:bg-plum-900 disabled:bg-ink-200 disabled:text-ink-400',
  secondary: 'bg-white text-ink-800 border border-ink-200 hover:border-plum-300 hover:bg-plum-50 disabled:text-ink-300',
  gold: 'bg-zari-400 text-ink-900 hover:bg-zari-300 active:bg-zari-500 disabled:bg-ink-200 disabled:text-ink-400',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
  danger: 'bg-red-700 text-white hover:bg-red-800 active:bg-red-900',
};
const SIZES = {
  md: 'min-h-[44px] px-4 text-[15px]',
  lg: 'min-h-[52px] px-5 text-base',
  sm: 'min-h-[36px] px-3 text-sm',
};

export function Button({ variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...rest }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function IconButton({ label, className = '', children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input:not([disabled]),select,[tabindex]:not([tabindex="-1"])';

/** Accessible modal: Esc to close, focus trapped inside, page scroll locked. */
export function Modal({ title, titleEn, onClose, children, footer, size = 'md', dismissible = true, labelledBy = 'modal-title' }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector('[data-autofocus]') || panel?.querySelector(FOCUSABLE) || panel;
    first?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape' && dismissible) {
        e.stopPropagation();
        onClose?.();
      }
      if (e.key === 'Tab' && panel) {
        const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const width = size === 'lg' ? 'sm:max-w-2xl' : size === 'sm' ? 'sm:max-w-sm' : 'sm:max-w-md';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink-900/55" onClick={dismissible ? onClose : undefined} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl outline-none sm:rounded-2xl ${width}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-5 py-4">
          <h2 id={labelledBy} className="font-display text-xl leading-snug text-plum-800">
            {title}
            {titleEn && <span className="mt-0.5 block font-ui text-sm font-normal text-ink-500">{titleEn}</span>}
          </h2>
          {dismissible && (
            <IconButton label="बंद करा · Close" onClick={onClose} className="-mr-2 -mt-1">
              <IconX />
            </IconButton>
          )}
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-ink-100 px-5 py-4 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, titleEn, message, messageEn, confirmLabel, cancelLabel, onConfirm, onCancel, danger = true }) {
  return (
    <Modal
      title={title}
      titleEn={titleEn}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} data-autofocus>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[15px] leading-relaxed text-ink-800">{message}</p>
      {messageEn && <p className="mt-1 text-sm leading-relaxed text-ink-500">{messageEn}</p>}
    </Modal>
  );
}

export function Segmented({ value, onChange, options, label, columns, disabled = false }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={`grid gap-2 ${columns || ''} ${disabled ? 'opacity-50' : ''}`}
      style={columns ? undefined : { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          disabled={disabled}
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className="chip px-2 text-center leading-tight disabled:cursor-not-allowed"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
