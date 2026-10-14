// Persistence layer. The app only talks to `biodataStorage` (async API), so moving from
// browser storage to a real backend later means swapping the adapter below – nothing else changes.

import { STATE_VERSION } from '../state/biodataReducer.js';

const KEY = 'marathi-biodata-maker:data:v1';

/** Frontend-only adapter (default). */
export const localAdapter = {
  async load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  async save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      // Most likely quota exceeded (very large photo). Retry without the original photo.
      try {
        localStorage.setItem(KEY, JSON.stringify({ ...data, photo: data.photo && { ...data.photo, original: data.photo.cropped } }));
        return true;
      } catch {
        console.warn('Could not persist biodata', e);
        return false;
      }
    }
  },
  async clear() {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  },
};

/**
 * Backend adapter skeleton – NOT used yet. Wire it up when an API exists:
 *   GET    {base}/biodata/:id   -> data
 *   PUT    {base}/biodata/:id   <- data
 *   DELETE {base}/biodata/:id
 * (add auth headers / user id as needed; photos should move to file/object storage and be referenced by URL)
 */
export const createApiAdapter = (baseUrl, getId = () => 'me') => ({
  async load() {
    const r = await fetch(`${baseUrl}/biodata/${getId()}`);
    return r.ok ? r.json() : null;
  },
  async save(data) {
    const r = await fetch(`${baseUrl}/biodata/${getId()}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    return r.ok;
  },
  async clear() {
    await fetch(`${baseUrl}/biodata/${getId()}`, { method: 'DELETE' });
  },
});

// Swap here: e.g. `const adapter = import.meta.env.VITE_API_BASE_URL ? createApiAdapter(import.meta.env.VITE_API_BASE_URL) : localAdapter;`
const adapter = localAdapter;

export const biodataStorage = {
  async load() {
    const data = await adapter.load();
    return data && data.version === STATE_VERSION ? data : null;
  },
  save: (data) => adapter.save(data),
  clear: () => adapter.clear(),
};
