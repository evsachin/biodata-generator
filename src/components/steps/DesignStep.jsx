import { useMemo } from 'react';
import { Check, Crop } from 'lucide-react';
import {
  BLESSINGS, BORDERS, COLOR_THEMES, DECORS, FONTS, HEADING_STYLES, LAYOUTS, PATTERNS,
  PHOTO_POSITIONS, PHOTO_SHAPES, TEMPLATES,
} from '../../data/design.js';
import { SAMPLE_VALUES } from '../../data/schema.js';
import { Chips, LanguageToggle, Panel, Toggle } from '../ui.jsx';
import ScaledPage from '../../biodata/ScaledPage.jsx';

function TemplateGrid({ state, dispatch }) {
  // If the user has typed very little, show thumbnails with sample data so templates look meaningful.
  const thumbBase = useMemo(() => {
    const filled = state.sections.reduce((n, s) => n + s.fields.filter((f) => String(f.value).trim()).length, 0);
    if (filled >= 5) return state;
    return {
      ...state,
      sections: state.sections.map((s) => ({
        ...s, fields: s.fields.map((f) => (SAMPLE_VALUES[f.id] ? { ...f, value: SAMPLE_VALUES[f.id] } : f)),
      })),
      photo: state.photo,
    };
  }, [state]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {TEMPLATES.map((t) => {
        const active = state.design.template === t.id;
        const data = { ...thumbBase, design: { ...state.design, ...t.design, template: t.id } };
        return (
          <button
            key={t.id} type="button" onClick={() => dispatch({ type: 'applyTemplate', id: t.id })} aria-pressed={active}
            className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left transition ${active ? 'border-maroon-700 shadow-soft' : 'border-stone-200 hover:border-maroon-300'}`}
          >
            <div className="pointer-events-none"><ScaledPage data={data} maxScale={0.4} /></div>
            <div className="border-t border-stone-100 px-2.5 py-2">
              <div className="text-sm font-bold leading-tight text-stone-900">{t.mr}</div>
              <div className="text-xs text-stone-500">{t.en}</div>
            </div>
            {active && (
              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-maroon-700 text-white shadow">
                <Check size={15} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 px-3 py-2">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase text-stone-500">{value}</span>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded-md border border-stone-300 bg-white p-0.5" />
      </span>
    </label>
  );
}

function FontPicker({ label, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-stone-800">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {FONTS.map((f) => (
          <button key={f.id} type="button" onClick={() => onChange(f.id)} aria-pressed={value === f.id}
            className={`rounded-xl border px-3 py-2 text-left transition ${value === f.id ? 'border-maroon-700 bg-maroon-50' : 'border-stone-200 hover:border-maroon-300'}`}>
            <span className="block text-lg leading-snug text-stone-900" style={{ fontFamily: `'${f.id}'` }}>अआइ मराठी Abc</span>
            <span className="block text-[11px] font-semibold text-stone-500">{f.label} · {f.kind}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const Slider = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
  <label className="block">
    <span className="mb-1 flex justify-between text-sm font-bold text-stone-800">
      {label}<span className="font-semibold text-stone-500">{value}{unit}</span>
    </span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-maroon-700" />
  </label>
);

export default function DesignStep({ state, dispatch }) {
  const d = state.design;
  const set = (patch) => dispatch({ type: 'setDesign', patch });
  const customBlessing = !BLESSINGS.some((b) => b.text === d.blessing);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-stone-900 sm:text-2xl">डिझाईन निवडा <span className="text-base font-semibold text-stone-500">Choose a design</span></h2>
        <p className="text-sm text-stone-600">टेम्पलेट निवडा आणि रंग, फॉन्ट, बॉर्डर बदला. • Pick a template, then tweak anything.</p>
      </div>

      <Panel title="टेम्पलेट / Templates"><TemplateGrid state={state} dispatch={dispatch} /></Panel>

      <Panel title="मांडणी / Layout">
        <div className="grid gap-2 sm:grid-cols-3">
          {LAYOUTS.map((l) => (
            <button key={l.id} type="button" onClick={() => set({ layout: l.id })} aria-pressed={d.layout === l.id}
              className={`rounded-xl border px-3 py-2.5 text-left ${d.layout === l.id ? 'border-maroon-700 bg-maroon-50' : 'border-stone-200 hover:border-maroon-300'}`}>
              <span className="block font-bold text-stone-900">{l.label}</span>
              <span className="block text-xs text-stone-500">{l.hint}</span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="रंग / Colours">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COLOR_THEMES.map((c) => {
            const active = d.primary.toLowerCase() === c.primary.toLowerCase() && d.bg.toLowerCase() === c.bg.toLowerCase();
            return (
              <button key={c.id} type="button" aria-pressed={active}
                onClick={() => set({ primary: c.primary, accent: c.accent, bg: c.bg, text: c.text })}
                className={`flex items-center gap-2 rounded-xl border p-2 text-left ${active ? 'border-maroon-700 bg-maroon-50' : 'border-stone-200 hover:border-maroon-300'}`}>
                <span className="flex overflow-hidden rounded-md border border-stone-200">
                  {[c.bg, c.primary, c.accent].map((col) => <span key={col} className="h-7 w-3.5" style={{ background: col }} />)}
                </span>
                <span className="text-xs font-bold leading-tight text-stone-700">{c.name}</span>
              </button>
            );
          })}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <ColorRow label="मुख्य रंग / Main" value={d.primary} onChange={(primary) => set({ primary })} />
          <ColorRow label="सोनेरी / Accent" value={d.accent} onChange={(accent) => set({ accent })} />
          <ColorRow label="पार्श्वभूमी / Background" value={d.bg} onChange={(bg) => set({ bg })} />
          <ColorRow label="अक्षरे / Text" value={d.text} onChange={(text) => set({ text })} />
        </div>
      </Panel>

      <Panel title="फॉन्ट / Fonts">
        <div className="space-y-5">
          <FontPicker label="मजकूर फॉन्ट / Body font" value={d.bodyFont} onChange={(bodyFont) => set({ bodyFont })} />
          <FontPicker label="शीर्षक फॉन्ट / Heading font" value={d.headFont} onChange={(headFont) => set({ headFont })} />
          <Slider label="अक्षर आकार / Text size (auto-shrinks to fit one page)" value={d.fontSize} min={11} max={18} step={0.5} unit="px" onChange={(fontSize) => set({ fontSize })} />
        </div>
      </Panel>

      <Panel title="बॉर्डर व सजावट / Border & decoration">
        <div className="space-y-4">
          <div><p className="mb-2 text-sm font-bold text-stone-800">बॉर्डर / Border</p>
            <Chips value={d.border} onChange={(border) => set({ border })} options={BORDERS} render={(o) => `${o.mr} · ${o.label}`} /></div>
          <div><p className="mb-2 text-sm font-bold text-stone-800">शीर्षक शैली / Section heading</p>
            <Chips value={d.headingStyle} onChange={(headingStyle) => set({ headingStyle })} options={HEADING_STYLES} /></div>
          <div><p className="mb-2 text-sm font-bold text-stone-800">पार्श्वभूमी नक्षी / Background pattern</p>
            <Chips value={d.pattern} onChange={(pattern) => set({ pattern })} options={PATTERNS} /></div>
          <div><p className="mb-2 text-sm font-bold text-stone-800">सजावट / Decoration</p>
            <Chips value={d.decor} onChange={(decor) => set({ decor })} options={DECORS} /></div>
        </div>
      </Panel>

      <Panel title="फोटो / Photo" hint="फोटो अपलोड व क्रॉप 'माहिती' पायरीत करा. • Upload and crop in the Information step.">
        <div className="space-y-4">
          <Toggle label="फोटो दाखवा / Show photo" checked={d.showPhoto} onChange={(showPhoto) => set({ showPhoto })} />
          {!state.photo && d.showPhoto && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">अजून फोटो अपलोड केलेला नाही. / No photo uploaded yet.</p>}
          <div><p className="mb-2 text-sm font-bold text-stone-800">आकार / Shape</p>
            <Chips value={d.photoShape} onChange={(photoShape) => set({ photoShape })} options={PHOTO_SHAPES} /></div>
          <div><p className="mb-2 text-sm font-bold text-stone-800">जागा / Position {d.layout === 'sidebar' && <span className="font-medium text-stone-500">(sidebar layout keeps it on the side)</span>}</p>
            <Chips value={d.photoPosition} onChange={(photoPosition) => set({ photoPosition })} options={PHOTO_POSITIONS} /></div>
          <Slider label="फोटो आकार / Photo size" value={d.photoSize} min={90} max={210} step={2} unit="px" onChange={(photoSize) => set({ photoSize })} />
          <Toggle label="फोटोला फ्रेम / Photo frame" checked={d.photoBorder} onChange={(photoBorder) => set({ photoBorder })} />
          {state.photo && (
            <p className="flex items-center gap-1.5 text-sm text-stone-500"><Crop size={14} /> फोटोचा भाग बदलण्यासाठी माहिती पायरीत Crop वापरा. / Use Crop in the Information step to re-frame.</p>
          )}
        </div>
      </Panel>

      <Panel title="शीर्षक व भाषा / Heading & language">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-bold text-stone-800">बायोडाटाची भाषा / Biodata language</p>
            <LanguageToggle value={state.lang} onChange={(lang) => dispatch({ type: 'setLang', lang })} />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-stone-800">वरचा आशीर्वाद / Top blessing</p>
            <div className="flex flex-wrap gap-2">
              {BLESSINGS.map((b) => (
                <button key={b.id} type="button" onClick={() => set({ blessing: b.text })} aria-pressed={d.blessing === b.text}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${d.blessing === b.text ? 'border-maroon-700 bg-maroon-700 text-white' : 'border-stone-300 bg-white text-stone-700 hover:border-maroon-300'}`}>
                  {b.text || 'None / नाही'}
                </button>
              ))}
            </div>
            <input className="field-input mt-2" placeholder="स्वतःचा मजकूर / Custom text" value={customBlessing ? d.blessing : ''}
              onChange={(e) => set({ blessing: e.target.value })} aria-label="Custom blessing" />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-stone-800">शीर्षक / Title</p>
            <input className="field-input" placeholder={state.lang === 'en' ? 'Marriage Biodata' : 'विवाह बायोडाटा'} value={d.title}
              onChange={(e) => set({ title: e.target.value })} aria-label="Title" />
          </div>
          <Toggle label="मराठी अंक (०१२३) / Marathi digits" checked={d.marathiDigits} onChange={(marathiDigits) => set({ marathiDigits })} />
        </div>
      </Panel>
    </div>
  );
}
