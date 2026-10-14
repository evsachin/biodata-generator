import { useEffect, useReducer, useRef, useState, useCallback } from 'react';
import { biodataReducer, createInitialState } from '../state/biodataReducer.js';
import { biodataStorage } from '../services/storage.js';
import { paymentStore } from '../services/payment.js';

/** Biodata state + auto-save (debounced) through the storage adapter. */
export function useBiodata() {
  const [state, dispatch] = useReducer(biodataReducer, undefined, createInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    biodataStorage.load().then((saved) => {
      if (!alive) return;
      if (saved) dispatch({ type: 'hydrate', state: saved });
      setHydrated(true);
    });
    return () => { alive = false; };
  }, []);

  const timer = useRef();
  useEffect(() => {
    if (!hydrated) return undefined;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => biodataStorage.save(state), 400);
    return () => clearTimeout(timer.current);
  }, [state, hydrated]);

  const clearAll = useCallback(async () => {
    clearTimeout(timer.current);
    await biodataStorage.clear();
    dispatch({ type: 'reset' });
  }, []);

  return { state, dispatch, hydrated, clearAll };
}

/** Payment/unlock status for this browser. */
export function usePayment() {
  const [record, setRecord] = useState(() => paymentStore.get());
  const unlock = useCallback((rec) => { paymentStore.set(rec); setRecord(rec); }, []);
  return { unlocked: !!record, record, unlock };
}
