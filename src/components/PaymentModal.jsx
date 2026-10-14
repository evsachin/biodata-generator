import { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { Modal } from './ui.jsx';
import { PRICE_INR, UNLOCK_HOURS, completeDemoPayment, isDemoMode, payWithRazorpay } from '../services/payment.js';

export default function PaymentModal({ open, onClose, onSuccess, prefill }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState('upi');

  const pay = async () => {
    setError('');
    setBusy(true);
    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 900)); // simulate gateway latency
        onSuccess(completeDemoPayment());
      } else {
        onSuccess(await payWithRazorpay({ prefill }));
      }
    } catch (e) {
      if (!e?.cancelled) setError(e?.message || 'Payment failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={busy ? undefined : onClose} title="डाउनलोड अनलॉक करा / Unlock downloads">
      <div className="space-y-5 p-5">
        <div className="flex items-end justify-between rounded-2xl bg-gradient-to-br from-maroon-800 to-maroon-600 p-5 text-white">
          <div>
            <p className="text-sm text-white/80">एकदाच शुल्क / One-time fee</p>
            <p className="text-4xl font-extrabold">₹{PRICE_INR}</p>
          </div>
          <p className="max-w-[11rem] text-right text-xs text-white/80">Print • PDF • HD image<br />for the next {UNLOCK_HOURS} hours on this device</p>
        </div>

        {isDemoMode && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <b>डेमो मोड / Demo mode</b> – no real payment is taken. Add <code className="rounded bg-white px-1">VITE_RAZORPAY_KEY_ID</code> to enable Razorpay.
          </div>
        )}

        {isDemoMode && (
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Payment method">
            {[{ id: 'upi', label: 'UPI', icon: Smartphone }, { id: 'card', label: 'Card', icon: CreditCard }].map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" role="radio" aria-checked={method === id} onClick={() => setMethod(id)}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 font-bold ${method === id ? 'border-maroon-700 bg-maroon-50 text-maroon-800' : 'border-stone-200 text-stone-600'}`}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
        )}

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">{error}</p>}

        <button className="btn btn-gold w-full !py-3.5 text-base" onClick={pay} disabled={busy} data-testid="pay-button">
          <Lock size={18} /> {busy ? 'प्रक्रिया सुरू आहे… / Processing…' : `₹${PRICE_INR} भरा / Pay securely`}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-stone-500">
          <ShieldCheck size={14} /> {isDemoMode ? 'Demo checkout' : 'Secured by Razorpay – UPI, cards, net banking, wallets'}
        </p>
      </div>
    </Modal>
  );
}
