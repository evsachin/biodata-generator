import { useState } from 'react';
import { ChevronDown, FolderPlus, Plus, RotateCcw, Sparkles, Trash2, X } from 'lucide-react';
import { OPTIONS, DEFAULT_SECTIONS } from '../../data/schema.js';
import { countFilled } from '../../utils/text.js';
import { LanguageToggle, Panel } from '../ui.jsx';
import PhotoUploader from '../PhotoUploader.jsx';

function FieldInput({ field, onChange, onRemove }) {
  const id = `fld-${field.id}`;
  let control;
  if (field.type === 'select') {
    control = (
      <select id={id} className="field-input" value={field.value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— निवडा / Select —</option>
        {(OPTIONS[field.options] || []).map((o) => (
          <option key={o.mr} value={o.mr}>{o.mr === o.en ? o.mr : `${o.mr} / ${o.en}`}</option>
        ))}
      </select>
    );
  } else if (field.type === 'textarea') {
    control = (
      <textarea id={id} rows={3} className="field-input resize-y" value={field.value} placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)} />
    );
  } else {
    control = (
      <input id={id} type={field.type} className="field-input" value={field.value} placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)} inputMode={field.type === 'tel' ? 'tel' : undefined} />
    );
  }

  const wide = field.type === 'textarea';
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold leading-tight text-stone-800">
          {field.mr || field.en}
          {field.mr && field.en && field.mr !== field.en && <span className="ml-1.5 text-xs font-medium text-stone-500">{field.en}</span>}
          {field.custom && <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">custom</span>}
        </label>
        <button type="button" onClick={onRemove} title="Remove field" aria-label={`Remove ${field.en || field.mr}`}
          className="-mr-1 shrink-0 rounded-md p-1 text-stone-400 hover:bg-red-50 hover:text-red-600">
          <X size={16} />
        </button>
      </div>
      {control}
    </div>
  );
}

function AddFieldForm({ onAdd, onCancel }) {
  const [mr, setMr] = useState('');
  const [en, setEn] = useState('');
  const [type, setType] = useState('text');
  const valid = mr.trim() || en.trim();
  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onAdd({ mr: mr.trim() || en.trim(), en: en.trim() || mr.trim(), type });
  };
  return (
    <form onSubmit={submit} className="mt-4 rounded-xl border border-amber-300 bg-amber-50/60 p-3">
      <p className="mb-2 text-sm font-bold text-amber-900">नवीन माहिती जोडा / Add a custom field</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <input className="field-input" placeholder="नाव (मराठी) उदा. छंद" value={mr} onChange={(e) => setMr(e.target.value)} aria-label="Field name in Marathi" autoFocus />
        <input className="field-input" placeholder="Name (English) e.g. Hobbies" value={en} onChange={(e) => setEn(e.target.value)} aria-label="Field name in English" />
        <select className="field-input" value={type} onChange={(e) => setType(e.target.value)} aria-label="Field type">
          <option value="text">एक ओळ / Short text</option>
          <option value="textarea">मोठा मजकूर / Long text</option>
          <option value="date">तारीख / Date</option>
        </select>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" className="btn btn-ghost !py-1.5" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary !py-1.5" disabled={!valid}><Plus size={16} /> Add field</button>
      </div>
    </form>
  );
}

function SectionCard({ section, open, onToggle, dispatch }) {
  const [adding, setAdding] = useState(false);
  const def = DEFAULT_SECTIONS.find((d) => d.id === section.id);
  const missing = def ? def.fields.filter((f) => !section.fields.some((x) => x.id === f.id)).length : 0;
  const filled = countFilled(section);

  return (
    <section className="card overflow-hidden">
      <button type="button" onClick={onToggle} aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5">
        <span>
          <span className="block text-base font-bold text-stone-900">{section.mr}</span>
          <span className="block text-xs text-stone-500">{section.en}</span>
        </span>
        <span className="flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${filled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
            {filled}/{section.fields.length}
          </span>
          <ChevronDown size={20} className={`text-stone-500 transition ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="border-t border-stone-100 px-4 pb-5 pt-4 sm:px-5">
          {section.fields.length === 0 && <p className="mb-2 text-sm text-stone-500">या विभागात माहिती नाही. नवीन माहिती जोडा. / No fields here – add one.</p>}
          <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
            {section.fields.map((f) => (
              <FieldInput key={f.id} field={f}
                onChange={(value) => dispatch({ type: 'setValue', sectionId: section.id, fieldId: f.id, value })}
                onRemove={() => dispatch({ type: 'removeField', sectionId: section.id, fieldId: f.id })} />
            ))}
          </div>

          {adding ? (
            <AddFieldForm onCancel={() => setAdding(false)}
              onAdd={(field) => { dispatch({ type: 'addField', sectionId: section.id, field }); setAdding(false); }} />
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" className="btn btn-ghost !py-1.5 text-maroon-800" onClick={() => setAdding(true)}>
                <Plus size={16} /> नवीन माहिती / Add field
              </button>
              {missing > 0 && (
                <button type="button" className="btn btn-ghost !py-1.5" onClick={() => dispatch({ type: 'restoreFields', sectionId: section.id })}>
                  <RotateCcw size={15} /> Restore {missing} removed
                </button>
              )}
              {section.custom && (
                <button type="button" className="btn btn-ghost !py-1.5 ml-auto text-red-700"
                  onClick={() => dispatch({ type: 'removeSection', sectionId: section.id })}>
                  <Trash2 size={15} /> Delete section
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function AddSection({ dispatch }) {
  const [open, setOpen] = useState(false);
  const [mr, setMr] = useState('');
  const [en, setEn] = useState('');
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 py-3.5 font-semibold text-stone-600 hover:border-maroon-300 hover:text-maroon-800">
        <FolderPlus size={18} /> नवीन विभाग जोडा / Add a new section
      </button>
    );
  }
  const valid = mr.trim() || en.trim();
  return (
    <form className="card p-4" onSubmit={(e) => {
      e.preventDefault();
      if (!valid) return;
      dispatch({ type: 'addSection', mr: mr.trim() || en.trim(), en: en.trim() || mr.trim() });
      setMr(''); setEn(''); setOpen(false);
    }}>
      <p className="mb-2 font-bold">नवीन विभाग / New section</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="field-input" placeholder="विभागाचे नाव (मराठी)" value={mr} onChange={(e) => setMr(e.target.value)} autoFocus />
        <input className="field-input" placeholder="Section title (English)" value={en} onChange={(e) => setEn(e.target.value)} />
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" className="btn btn-ghost !py-1.5" onClick={() => setOpen(false)}>Cancel</button>
        <button type="submit" className="btn btn-primary !py-1.5" disabled={!valid}>Add section</button>
      </div>
    </form>
  );
}

export default function InformationStep({ state, dispatch }) {
  const [openIds, setOpenIds] = useState(() => new Set(['personal']));
  const toggle = (id) => setOpenIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const allOpen = openIds.size === state.sections.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 sm:text-2xl">तुमची माहिती भरा <span className="text-base font-semibold text-stone-500">Enter your details</span></h2>
          <p className="text-sm text-stone-600">रिकामी माहिती बायोडाटामध्ये आपोआप लपते. • Empty fields are hidden automatically.</p>
        </div>
        <LanguageToggle value={state.lang} onChange={(lang) => dispatch({ type: 'setLang', lang })} />
      </div>

      <Panel>
        <PhotoUploader photo={state.photo} shape={state.design.photoShape}
          onChange={(photo) => dispatch({ type: 'setPhoto', photo })} />
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={() => dispatch({ type: 'fillSample' })}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-maroon-700 hover:underline">
          <Sparkles size={16} /> नमुना माहिती भरा / Fill sample data
        </button>
        <button type="button" className="text-sm font-semibold text-stone-500 hover:text-stone-800"
          onClick={() => setOpenIds(allOpen ? new Set() : new Set(state.sections.map((s) => s.id)))}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {state.sections.map((s) => (
        <SectionCard key={s.id} section={s} open={openIds.has(s.id)} onToggle={() => toggle(s.id)} dispatch={dispatch} />
      ))}
      <AddSection dispatch={dispatch} />
    </div>
  );
}
