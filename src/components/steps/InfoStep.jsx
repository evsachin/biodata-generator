import { useEffect, useRef, useState } from 'react';
import { buildDefaultSections, countFilled, INVOCATIONS } from '../../data/schema';
import { useBiodata } from '../../hooks/useBiodata';
import PhotoField from '../photo/PhotoField';
import { Bi, Button, IconButton } from '../ui/primitives';
import { IconChevron, IconPlus, IconSpark, IconTrash, IconX } from '../ui/Icons';

/* ------------------------------------------------------------------ header (invocation + title) */
function HeaderEditor() {
  const { data, setHeader } = useBiodata();
  const h = data.header;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="invocation">
          <Bi mr="देवतेचे नाव (वरती)" en="Invocation at the top" />
        </label>
        <select id="invocation" className="field-input" value={h.invocation} onChange={(e) => setHeader({ invocation: e.target.value })}>
          {INVOCATIONS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.id === 'custom' ? 'स्वतःचे लिहा · Write your own' : i.id === 'none' ? 'काहीही नको · None' : i.text}
            </option>
          ))}
        </select>
        {h.invocation === 'custom' && (
          <input
            className="field-input mt-2"
            lang="mr"
            placeholder="उदा. || श्री कुलदेवता प्रसन्न ||"
            value={h.customInvocation}
            onChange={(e) => setHeader({ customInvocation: e.target.value })}
            aria-label="Custom invocation"
          />
        )}
      </div>
      <div>
        <label className="field-label" htmlFor="titleMr">
          <Bi mr="शीर्षक (मराठी)" en="Title in Marathi" />
        </label>
        <input id="titleMr" className="field-input" lang="mr" value={h.titleMr} onChange={(e) => setHeader({ titleMr: e.target.value })} />
      </div>
      <div>
        <label className="field-label" htmlFor="titleEn">
          <Bi mr="शीर्षक (English)" en="Title in English" />
        </label>
        <input id="titleEn" className="field-input" lang="en" value={h.titleEn} onChange={(e) => setHeader({ titleEn: e.target.value })} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ one field */
function FieldRow({ sectionId, field, autoFocus }) {
  const { setValue, updateField, removeField } = useBiodata();
  const ref = useRef(null);
  const inputId = `f-${field.id}`;

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const type = field.type === 'textarea' ? 'textarea' : field.type || 'text';
  const common = {
    id: inputId,
    ref,
    lang: 'mr',
    autoComplete: 'off',
    placeholder: field.hint || '',
    value: field.value,
    onChange: (e) => setValue(sectionId, field.id, e.target.value),
    className: 'field-input',
  };

  return (
    <div className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
      <div className="mb-1 flex items-start justify-between gap-2">
        {field.custom ? (
          <div className="grid flex-1 grid-cols-2 gap-2">
            <input
              aria-label="Label in Marathi"
              lang="mr"
              placeholder="नाव (मराठी)"
              className="field-input !py-1.5 text-sm font-semibold"
              value={field.labelMr}
              onChange={(e) => updateField(sectionId, field.id, { labelMr: e.target.value })}
            />
            <input
              aria-label="Label in English"
              placeholder="Label (English)"
              className="field-input !py-1.5 text-sm"
              value={field.labelEn}
              onChange={(e) => updateField(sectionId, field.id, { labelEn: e.target.value })}
            />
          </div>
        ) : (
          <label htmlFor={inputId} className="field-label !mb-0">
            <Bi mr={field.labelMr} en={field.labelEn} />
          </label>
        )}
        <button
          type="button"
          onClick={() => removeField(sectionId, field.id)}
          aria-label={`काढा · Remove ${field.labelMr || field.labelEn}`}
          title="हे फील्ड काढा · Remove field"
          className="-mr-1 -mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md text-ink-300 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <IconX size={16} />
        </button>
      </div>
      {type === 'textarea' ? (
        <textarea {...common} rows={3} className="field-input resize-y" />
      ) : (
        <input {...common} type={type === 'tel' ? 'tel' : type === 'email' ? 'email' : 'text'} inputMode={type === 'tel' ? 'tel' : undefined} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ add field */
function AddFieldForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [mr, setMr] = useState('');
  const [en, setEn] = useState('');
  const mrRef = useRef(null);

  useEffect(() => {
    if (open) mrRef.current?.focus();
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    if (!mr.trim() && !en.trim()) {
      mrRef.current?.focus();
      return;
    }
    onAdd(mr.trim(), en.trim());
    setMr('');
    setEn('');
    setOpen(false);
  };

  if (!open) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="text-plum-700">
        <IconPlus size={16} />
        <Bi mr="नवीन माहिती जोडा" en="Add field" />
      </Button>
    );
  }
  return (
    <form onSubmit={submit} className="rounded-lg border border-plum-200 bg-plum-50/60 p-3">
      <p className="mb-2 text-sm font-semibold text-plum-800">
        <Bi mr="नवीन फील्डचे नाव" en="Name of the new field" />
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <input ref={mrRef} lang="mr" className="field-input" placeholder="मराठीत नाव, उदा. छंद" value={mr} onChange={(e) => setMr(e.target.value)} aria-label="Field name in Marathi" />
        <input className="field-input" placeholder="English name, e.g. Hobbies" value={en} onChange={(e) => setEn(e.target.value)} aria-label="Field name in English" />
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit" size="sm">
          <IconPlus size={16} />
          जोडा
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          रद्द करा
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ one section (accordion) */
function SectionEditor({ section, open, onToggle }) {
  const { setValue, addField, removeSection, restoreFields, updateSection } = useBiodata();
  const [justAdded, setJustAdded] = useState(null);
  const filled = countFilled(section);
  const panelId = `sec-${section.id}`;

  const defaults = buildDefaultSections().find((s) => s.id === section.id);
  const missing = defaults ? defaults.fields.filter((d) => !section.fields.some((fl) => fl.id === d.id)).length : 0;

  return (
    <section className="border-b border-ink-200 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-[56px] w-full items-center justify-between gap-3 py-3 text-left"
        >
          <span className="font-display text-lg leading-tight text-plum-800">
            {section.titleMr || section.titleEn}
            {section.titleEn && section.titleMr && <span className="mt-0.5 block font-ui text-[13px] font-normal text-ink-500">{section.titleEn}</span>}
          </span>
          <span className="flex flex-none items-center gap-2 text-sm text-ink-500">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${filled ? 'bg-peacock-50 text-peacock-700' : 'bg-ink-100 text-ink-500'}`}>
              {filled}/{section.fields.length}
            </span>
            <IconChevron className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </span>
        </button>
      </h3>

      {open && (
        <div id={panelId} className="pb-5">
          {section.custom && (
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor={`${panelId}-tmr`}>
                  <Bi mr="विभागाचे नाव (मराठी)" en="Section title" />
                </label>
                <input id={`${panelId}-tmr`} lang="mr" className="field-input" value={section.titleMr} onChange={(e) => updateSection(section.id, { titleMr: e.target.value })} />
              </div>
              <div>
                <label className="field-label" htmlFor={`${panelId}-ten`}>
                  <Bi mr="विभागाचे नाव (English)" en="Section title" />
                </label>
                <input id={`${panelId}-ten`} className="field-input" value={section.titleEn} onChange={(e) => updateSection(section.id, { titleEn: e.target.value })} />
              </div>
            </div>
          )}

          {section.fields.length === 0 && <p className="mb-3 rounded-lg bg-ink-100 px-3 py-2 text-sm text-ink-600">या विभागात अजून माहिती नाही. खालील बटणाने फील्ड जोडा.</p>}

          <div className="grid gap-x-3 gap-y-3.5 sm:grid-cols-2">
            {section.fields.map((fl) => (
              <FieldRow key={fl.id} sectionId={section.id} field={fl} autoFocus={justAdded === fl.id} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-start gap-2">
            <AddFieldForm
              onAdd={(mr, en) => {
                const id = addField(section.id, mr, en);
                setJustAdded(id);
              }}
            />
            {missing > 0 && (
              <Button variant="ghost" size="sm" onClick={() => restoreFields(section.id)}>
                <Bi mr={`काढलेली माहिती परत आणा (${missing})`} en="Restore" />
              </Button>
            )}
            {section.custom && (
              <Button variant="ghost" size="sm" onClick={() => removeSection(section.id)} className="ml-auto text-red-700 hover:bg-red-50">
                <IconTrash size={16} />
                <Bi mr="हा विभाग काढा" en="Remove section" />
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function AddSectionForm({ onAdded }) {
  const { addSection } = useBiodata();
  const [open, setOpen] = useState(false);
  const [mr, setMr] = useState('');
  const [en, setEn] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!mr.trim() && !en.trim()) return;
    const id = addSection(mr.trim(), en.trim());
    setMr('');
    setEn('');
    setOpen(false);
    onAdded(id);
  };

  if (!open)
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <IconPlus size={18} />
        <Bi mr="नवीन विभाग जोडा" en="Add section" />
      </Button>
    );
  return (
    <form onSubmit={submit} className="rounded-xl border border-plum-200 bg-plum-50/60 p-4">
      <p className="mb-2 text-sm font-semibold text-plum-800">
        <Bi mr="नवीन विभागाचे नाव" en="Name of the new section" />
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <input autoFocus lang="mr" className="field-input" placeholder="उदा. आवडीनिवडी" value={mr} onChange={(e) => setMr(e.target.value)} aria-label="Section name in Marathi" />
        <input className="field-input" placeholder="e.g. Interests" value={en} onChange={(e) => setEn(e.target.value)} aria-label="Section name in English" />
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit" size="sm">
          जोडा
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          रद्द करा
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ the step */
export default function InfoStep() {
  const { data, loadSample, saveStatus, saveNote } = useBiodata();
  const [openIds, setOpenIds] = useState(() => new Set(['personal']));

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allOpen = data.sections.every((s) => openIds.has(s.id));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] leading-tight text-plum-800 sm:text-3xl">तुमची माहिती भरा</h1>
          <p className="mt-1 text-[15px] text-ink-600">
            जी माहिती भराल तीच बायोडाटामध्ये दिसेल; रिकामी फील्ड आपोआप लपतात.
            <span className="block text-sm text-ink-500">Only filled fields appear in the biodata. Empty ones are hidden automatically.</span>
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadSample}>
          <IconSpark size={16} />
          <Bi mr="नमुना माहिती भरा" en="Fill sample" />
        </Button>
      </div>

      <fieldset className="mb-6 border-b border-ink-200 pb-6">
        <legend className="mb-3 font-display text-lg text-plum-800">
          <Bi mr="फोटो" en="Photo" enClassName="font-ui" />
        </legend>
        <PhotoField />
      </fieldset>

      <fieldset className="mb-2 border-b border-ink-200 pb-6">
        <legend className="mb-3 font-display text-lg text-plum-800">
          <Bi mr="बायोडाटाचे शीर्षक" en="Heading" enClassName="font-ui" />
        </legend>
        <HeaderEditor />
      </fieldset>

      <div className="mb-1 mt-4 flex items-center justify-between">
        <p className="text-sm text-ink-500">
          <Bi mr="विभाग उघडा आणि माहिती भरा" en="Open a section to fill it" />
        </p>
        <button
          type="button"
          className="text-sm font-semibold text-plum-700 underline-offset-2 hover:underline"
          onClick={() => setOpenIds(allOpen ? new Set() : new Set(data.sections.map((s) => s.id)))}
        >
          {allOpen ? 'सर्व बंद करा' : 'सर्व उघडा'}
        </button>
      </div>

      <div className="border-t border-ink-200">
        {data.sections.map((s) => (
          <SectionEditor key={s.id} section={s} open={openIds.has(s.id)} onToggle={() => toggle(s.id)} />
        ))}
      </div>

      <div className="mt-5">
        <AddSectionForm onAdded={(id) => setOpenIds((prev) => new Set(prev).add(id))} />
      </div>

      <p className="mt-6 text-sm text-ink-500" role="status">
        {saveStatus === 'error'
          ? 'माहिती जतन करता आली नाही — ब्राउझरची जागा संपली असू शकते. फोटो लहान करून पाहा.'
          : saveNote === 'photo-original-dropped'
            ? 'माहिती जतन झाली. जागेअभावी फोटोची मूळ प्रत ठेवली नाही.'
            : 'तुमची माहिती आपोआप या डिव्हाइसवर जतन होते. कोणत्याही सर्व्हरवर पाठवली जात नाही.'}
      </p>
    </div>
  );
}
