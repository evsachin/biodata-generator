import { DEFAULT_SECTIONS, SAMPLE_VALUES } from '../data/schema.js';
import { createDesign, templateById } from '../data/design.js';

export const STATE_VERSION = 1;

const uid = (p = 'c') => `${p}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

const freshSection = (s) => ({
  id: s.id, mr: s.mr, en: s.en, custom: false,
  fields: s.fields.map((f) => ({ ...f, value: '' })),
});

export function createInitialState() {
  return {
    version: STATE_VERSION,
    lang: 'mr', // language of labels in the printed biodata: 'mr' | 'en' | 'both'
    sections: DEFAULT_SECTIONS.map(freshSection),
    photo: null, // { original, cropped }
    design: createDesign('maharashtrian'),
  };
}

const SAMPLE_PHOTO = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#f6d9b8'/><stop offset='1' stop-color='#e9b98c'/></linearGradient></defs>
  <rect width='600' height='800' fill='url(#g)'/>
  <circle cx='300' cy='290' r='120' fill='#8a5a3b'/>
  <path d='M70 800 C70 560 190 500 300 500 C410 500 530 560 530 800 Z' fill='#a93a3a'/>
  <circle cx='300' cy='310' r='95' fill='#f1c9a0'/>
  <path d='M205 290 C205 190 395 190 395 290 C360 240 240 240 205 290Z' fill='#3b2417'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
})();

export function biodataReducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'reset':
      return createInitialState();
    case 'setLang':
      return { ...state, lang: action.lang };

    case 'setValue':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id !== action.sectionId ? s : {
            ...s, fields: s.fields.map((f) => (f.id === action.fieldId ? { ...f, value: action.value } : f)),
          }),
      };

    case 'addField': {
      const { mr, en, type } = action.field;
      const field = { id: uid('f'), mr: mr.trim(), en: en.trim(), type: type || 'text', value: '', custom: true };
      return {
        ...state,
        sections: state.sections.map((s) => (s.id === action.sectionId ? { ...s, fields: [...s.fields, field] } : s)),
      };
    }

    case 'removeField':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId ? { ...s, fields: s.fields.filter((f) => f.id !== action.fieldId) } : s),
      };

    // Bring back default fields the user removed (keeps typed values and custom fields).
    case 'restoreFields':
      return {
        ...state,
        sections: state.sections.map((s) => {
          const def = DEFAULT_SECTIONS.find((d) => d.id === s.id);
          if (s.id !== action.sectionId || !def) return s;
          const byId = new Map(s.fields.map((f) => [f.id, f]));
          const defaults = def.fields.map((f) => byId.get(f.id) || { ...f, value: '' });
          return { ...s, fields: [...defaults, ...s.fields.filter((f) => f.custom)] };
        }),
      };

    case 'addSection': {
      const section = {
        id: uid('s'), mr: action.mr.trim(), en: action.en.trim(), custom: true,
        fields: [{ id: uid('f'), mr: 'माहिती', en: 'Details', type: 'textarea', value: '', custom: true }],
      };
      return { ...state, sections: [...state.sections, section] };
    }

    case 'removeSection':
      return { ...state, sections: state.sections.filter((s) => s.id !== action.sectionId) };

    case 'setPhoto':
      return { ...state, photo: action.photo };

    case 'setDesign':
      return { ...state, design: { ...state.design, ...action.patch } };

    case 'applyTemplate':
      return { ...state, design: { ...state.design, ...templateById(action.id).design, template: action.id } };

    case 'fillSample':
      return {
        ...state,
        sections: state.sections.map((s) => ({
          ...s,
          fields: s.fields.map((f) => (!f.custom && SAMPLE_VALUES[f.id] ? { ...f, value: SAMPLE_VALUES[f.id] } : f)),
        })),
        photo: state.photo || { original: SAMPLE_PHOTO, cropped: SAMPLE_PHOTO },
      };

    default:
      return state;
  }
}
