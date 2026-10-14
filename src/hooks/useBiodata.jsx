import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { applySample, buildDefaultSections, buildDefaultState, uid } from '../data/schema';
import { templateDesign } from '../data/templates';
import { biodataRepo } from '../services/storage';

const BiodataContext = createContext(null);

const mapSection = (sections, id, fn) => sections.map((s) => (s.id === id ? fn(s) : s));

function reducer(store, action) {
  const { data } = store;
  const next = (patch, undo = null) => ({ data: { ...data, ...patch }, undo });

  switch (action.type) {
    case 'hydrate':
      return { data: action.data, undo: null };

    case 'setHeader':
      return next({ header: { ...data.header, ...action.patch } });

    case 'setValue':
      return next({
        sections: mapSection(data.sections, action.sectionId, (s) => ({
          ...s,
          fields: s.fields.map((fl) => (fl.id === action.fieldId ? { ...fl, value: action.value } : fl)),
        })),
      });

    case 'addField':
      return next({
        sections: mapSection(data.sections, action.sectionId, (s) => ({
          ...s,
          fields: [...s.fields, { id: action.field.id, labelMr: action.field.labelMr, labelEn: action.field.labelEn, value: '', custom: true }],
        })),
      });

    case 'updateField':
      return next({
        sections: mapSection(data.sections, action.sectionId, (s) => ({
          ...s,
          fields: s.fields.map((fl) => (fl.id === action.fieldId ? { ...fl, ...action.patch } : fl)),
        })),
      });

    case 'removeField': {
      const section = data.sections.find((s) => s.id === action.sectionId);
      const field = section?.fields.find((fl) => fl.id === action.fieldId);
      return next(
        {
          sections: mapSection(data.sections, action.sectionId, (s) => ({
            ...s,
            fields: s.fields.filter((fl) => fl.id !== action.fieldId),
          })),
        },
        { sections: data.sections, label: field ? field.labelMr || field.labelEn : '' },
      );
    }

    case 'restoreFields': {
      // Bring back removed built-in fields (keeps default order; custom fields stay at the end)
      const def = buildDefaultSections().find((s) => s.id === action.sectionId);
      if (!def) return store;
      return next({
        sections: mapSection(data.sections, action.sectionId, (s) => {
          const existing = new Map(s.fields.map((fl) => [fl.id, fl]));
          const merged = def.fields.map((fl) => existing.get(fl.id) || fl);
          return { ...s, fields: [...merged, ...s.fields.filter((fl) => !def.fields.some((d) => d.id === fl.id))] };
        }),
      });
    }

    case 'addSection':
      return next({
        sections: [
          ...data.sections,
          { id: action.id, titleMr: action.titleMr, titleEn: action.titleEn, custom: true, fields: [] },
        ],
      });

    case 'updateSection':
      return next({ sections: mapSection(data.sections, action.sectionId, (s) => ({ ...s, ...action.patch })) });

    case 'removeSection': {
      const section = data.sections.find((s) => s.id === action.sectionId);
      return next(
        { sections: data.sections.filter((s) => s.id !== action.sectionId) },
        { sections: data.sections, label: section ? section.titleMr || section.titleEn : '' },
      );
    }

    case 'setPhoto':
      return next({ photo: { ...data.photo, ...action.patch } });

    case 'setDesign':
      return next({ design: { ...data.design, ...action.patch, templateId: action.keepTemplate ? data.design.templateId : 'custom' } });

    case 'applyTemplate': {
      // Switching template restyles everything but keeps the person's language and text size choices.
      const keep = { labelLang: data.design.labelLang, fontScale: data.design.fontScale };
      return next({ design: { ...templateDesign(action.id), ...keep } });
    }

    case 'sample':
      return next({ sections: applySample(data.sections) });

    case 'reset':
      return { data: buildDefaultState(), undo: null };

    case 'undo':
      return store.undo ? { data: { ...data, sections: store.undo.sections }, undo: null } : store;

    case 'clearUndo':
      return store.undo ? { ...store, undo: null } : store;

    default:
      return store;
  }
}

export function BiodataProvider({ children }) {
  const [store, dispatch] = useReducer(reducer, { data: buildDefaultState(), undo: null });
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [saveNote, setSaveNote] = useState('');
  const hydrated = useRef(false);

  // Load once from the storage layer
  useEffect(() => {
    let alive = true;
    biodataRepo
      .load()
      .then((data) => {
        if (alive) dispatch({ type: 'hydrate', data });
      })
      .catch(() => {})
      .finally(() => {
        if (alive) {
          hydrated.current = true;
          setReady(true);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  // Debounced autosave
  useEffect(() => {
    if (!hydrated.current) return undefined;
    setSaveStatus('saving');
    const t = setTimeout(async () => {
      try {
        const res = await biodataRepo.save(store.data);
        setSaveNote(res?.droppedOriginal ? 'photo-original-dropped' : '');
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    }, 500);
    return () => clearTimeout(t);
  }, [store.data]);

  // The undo snackbar disappears on its own
  useEffect(() => {
    if (!store.undo) return undefined;
    const t = setTimeout(() => dispatch({ type: 'clearUndo' }), 7000);
    return () => clearTimeout(t);
  }, [store.undo]);

  const actions = useMemo(
    () => ({
      setHeader: (patch) => dispatch({ type: 'setHeader', patch }),
      setValue: (sectionId, fieldId, value) => dispatch({ type: 'setValue', sectionId, fieldId, value }),
      addField: (sectionId, labelMr, labelEn) => {
        const id = uid('c');
        dispatch({ type: 'addField', sectionId, field: { id, labelMr, labelEn } });
        return id;
      },
      updateField: (sectionId, fieldId, patch) => dispatch({ type: 'updateField', sectionId, fieldId, patch }),
      removeField: (sectionId, fieldId) => dispatch({ type: 'removeField', sectionId, fieldId }),
      restoreFields: (sectionId) => dispatch({ type: 'restoreFields', sectionId }),
      addSection: (titleMr, titleEn) => {
        const id = uid('s');
        dispatch({ type: 'addSection', id, titleMr, titleEn });
        return id;
      },
      updateSection: (sectionId, patch) => dispatch({ type: 'updateSection', sectionId, patch }),
      removeSection: (sectionId) => dispatch({ type: 'removeSection', sectionId }),
      setPhoto: (patch) => dispatch({ type: 'setPhoto', patch }),
      setDesign: (patch, keepTemplate = false) => dispatch({ type: 'setDesign', patch, keepTemplate }),
      applyTemplate: (id) => dispatch({ type: 'applyTemplate', id }),
      loadSample: () => dispatch({ type: 'sample' }),
      reset: async () => {
        dispatch({ type: 'reset' });
        await biodataRepo.clear();
      },
      undo: () => dispatch({ type: 'undo' }),
      dismissUndo: () => dispatch({ type: 'clearUndo' }),
    }),
    [],
  );

  const value = useMemo(
    () => ({ data: store.data, undo: store.undo, ready, saveStatus, saveNote, ...actions }),
    [store.data, store.undo, ready, saveStatus, saveNote, actions],
  );

  return <BiodataContext.Provider value={value}>{children}</BiodataContext.Provider>;
}

export function useBiodata() {
  const ctx = useContext(BiodataContext);
  if (!ctx) throw new Error('useBiodata must be used inside <BiodataProvider>');
  return ctx;
}

// True when there is something the person could lose by clearing everything.
export const useHasContent = () => {
  const { data } = useBiodata();
  return useMemo(
    () => Boolean(data.photo.src) || data.sections.some((s) => s.custom || s.fields.some((f) => f.custom || (f.value || '').trim())),
    [data],
  );
};
