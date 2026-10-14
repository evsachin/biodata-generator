import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildUnlockRecord, pay } from '../services/payment';
import { unlockRepo } from '../services/storage';

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const [record, setRecord] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | paying | error
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    unlockRepo.load().then((rec) => alive && setRecord(rec));
    return () => {
      alive = false;
    };
  }, []);

  // Re-lock automatically when the unlock window ends
  useEffect(() => {
    if (!record) return undefined;
    const ms = record.expiresAt - Date.now();
    if (ms <= 0) {
      setRecord(null);
      return undefined;
    }
    const t = setTimeout(() => setRecord(null), Math.min(ms, 2 ** 31 - 1));
    return () => clearTimeout(t);
  }, [record]);

  const startPayment = useCallback(async () => {
    setStatus('paying');
    setError('');
    try {
      const result = await pay();
      const rec = buildUnlockRecord(result);
      await unlockRepo.save(rec);
      setRecord(rec);
      setStatus('idle');
      return true;
    } catch (err) {
      if (err?.cancelled) {
        setStatus('idle');
      } else {
        setStatus('error');
        setError(err?.message || 'Payment failed');
      }
      return false;
    }
  }, []);

  const resetError = useCallback(() => {
    setStatus('idle');
    setError('');
  }, []);

  const value = useMemo(
    () => ({ unlocked: Boolean(record), record, status, error, startPayment, resetError }),
    [record, status, error, startPayment, resetError],
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used inside <PaymentProvider>');
  return ctx;
}
