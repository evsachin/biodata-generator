// Payment service – ₹30 unlocks print / PDF / image download.
//
// * With VITE_RAZORPAY_KEY_ID set, the real Razorpay Checkout opens.
// * Without it, the app runs in DEMO mode (a fake checkout, no money moves) so the flow can be tested.
//
// IMPORTANT: unlocking is stored in the browser, so a determined user can bypass it. That is acceptable for a
// frontend-only first version. For production add a backend: create the order on the server (POST /orders),
// pass `order_id` to Checkout, and verify the signature (POST /payments/verify) in `verifyPayment` below.

export const PRICE_INR = 30;
export const UNLOCK_HOURS = 24; // how long one payment keeps downloads unlocked on this browser

const KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const API = import.meta.env.VITE_API_BASE_URL;
const BUSINESS = import.meta.env.VITE_BUSINESS_NAME || 'Marathi Biodata Maker';
const STORE_KEY = 'marathi-biodata-maker:payment:v1';

export const isDemoMode = !KEY_ID;

/* ---------- persisted unlock record ---------- */
export const paymentStore = {
  get() {
    try {
      const r = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      return r && r.expiresAt > Date.now() ? r : null;
    } catch { return null; }
  },
  set(record) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(record)); } catch { /* ignore */ }
  },
  clear() {
    try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
  },
};

const toRecord = (p) => ({
  ...p,
  amount: PRICE_INR,
  paidAt: Date.now(),
  expiresAt: Date.now() + UNLOCK_HOURS * 3600 * 1000,
});

/* ---------- backend hooks (stubs until a server exists) ---------- */
async function createOrder() {
  if (!API) return null; // no backend: Checkout works without an order id
  const r = await fetch(`${API}/orders`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: PRICE_INR * 100, currency: 'INR' }),
  });
  if (!r.ok) throw new Error('Could not create order');
  return r.json(); // expected: { id: 'order_xxx' }
}

async function verifyPayment(payload) {
  if (!API) return true; // trusting the client – see note at the top
  const r = await fetch(`${API}/payments/verify`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return r.ok;
}

/* ---------- Razorpay ---------- */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load Razorpay. Check your internet connection.'));
    document.body.appendChild(s);
  });
}

/** Opens Razorpay Checkout. Resolves with a payment record or rejects ({cancelled:true} if dismissed). */
export async function payWithRazorpay({ description = 'Biodata download', prefill = {} } = {}) {
  await loadRazorpayScript();
  const order = await createOrder();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: KEY_ID,
      amount: PRICE_INR * 100,
      currency: 'INR',
      name: BUSINESS,
      description,
      ...(order?.id ? { order_id: order.id } : {}),
      prefill,
      theme: { color: '#8b1a1a' },
      modal: { ondismiss: () => reject(Object.assign(new Error('Payment cancelled'), { cancelled: true })) },
      handler: async (res) => {
        try {
          const ok = await verifyPayment(res);
          if (!ok) throw new Error('Payment could not be verified');
          resolve(toRecord({ paymentId: res.razorpay_payment_id, orderId: res.razorpay_order_id || null, demo: false }));
        } catch (e) { reject(e); }
      },
    });
    rzp.on('payment.failed', (r) => reject(new Error(r?.error?.description || 'Payment failed')));
    rzp.open();
  });
}

/** DEMO mode: called by the fake checkout UI after the user presses "Pay". */
export const completeDemoPayment = () =>
  toRecord({ paymentId: `demo_${Date.now().toString(36)}`, orderId: null, demo: true });
