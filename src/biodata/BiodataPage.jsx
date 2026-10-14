import { forwardRef, memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import './biodata.css';
import { Corner, Toran, Mandala } from './decor.jsx';
import { buildRenderSections, contrastColor } from '../utils/text.js';
import { fontMeta } from '../data/design.js';

const SIDEBAR_IDS = ['contact', 'horoscope'];

const DEFAULT_TITLE = { mr: 'विवाह बायोडाटा', en: 'Marriage Biodata' };

function Section({ section }) {
  return (
    <section className="bio-sec">
      <h2 className="bio-sec-title">{section.title}</h2>
      <dl className="bio-fields">
        {section.rows.map((r) => (
          <div className="bio-frow" key={r.id}>
            <dt>{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Photo({ src, design }) {
  return (
    <div className="bio-photo" data-shape={design.photoShape} data-border={String(design.photoBorder)}>
      <img src={src} alt="" />
    </div>
  );
}

/** Shrinks the font size (down to 55%) until everything fits the A4 page. */
function useAutoFit(innerRef, flowRef, baseSize) {
  const fitRef = useRef(() => {});
  fitRef.current = () => {
    const inner = innerRef.current;
    const flow = flowRef.current;
    if (!inner || !flow) return;
    let size = baseSize;
    inner.style.fontSize = `${size}px`;
    let guard = 0;
    while (flow.scrollHeight > inner.clientHeight + 1 && size > baseSize * 0.55 && guard++ < 60) {
      size -= 0.25;
      inner.style.fontSize = `${size}px`;
    }
  };
  useLayoutEffect(() => { fitRef.current(); });
  useEffect(() => {
    const run = () => fitRef.current();
    document.fonts?.ready.then(run);
    document.fonts?.addEventListener?.('loadingdone', run);
    return () => document.fonts?.removeEventListener?.('loadingdone', run);
  }, []);
}

/**
 * The A4 biodata. `data` is the whole app state (sections, lang, photo, design).
 * Empty fields and empty sections are not rendered.
 */
const BiodataPage = memo(forwardRef(function BiodataPage({ data }, ref) {
  const { design, lang, photo } = data;
  const sections = useMemo(() => buildRenderSections(data), [data]);
  const innerRef = useRef(null);
  const flowRef = useRef(null);
  useAutoFit(innerRef, flowRef, design.fontSize);

  const photoSrc = design.showPhoto && photo?.cropped ? photo.cropped : null;
  const head = fontMeta(design.headFont);
  const body = fontMeta(design.bodyFont);

  const cssVars = {
    '--primary': design.primary,
    '--accent': design.accent,
    '--bg': design.bg,
    '--text': design.text,
    '--on-primary': contrastColor(design.primary),
    '--head-font': `'${design.headFont}'`,
    '--body-font': `'${design.bodyFont}'`,
    '--bold': body.bold,
    '--head-bold': head.bold,
    '--photo-w': `${design.photoSize}px`,
  };

  const title = design.title?.trim();
  const header = (
    <header className="bio-head">
      {design.blessing && <div className="bio-blessing">{design.blessing}</div>}
      <h1 className="bio-title">{title || (lang === 'en' ? DEFAULT_TITLE.en : DEFAULT_TITLE.mr)}</h1>
      {!title && lang === 'both' && <div className="bio-subtitle">{DEFAULT_TITLE.en}</div>}
      <div className="bio-rule"><i /><b /><i /></div>
    </header>
  );

  let body_;
  if (design.layout === 'sidebar') {
    const side = sections.filter((s) => SIDEBAR_IDS.includes(s.id));
    const main = sections.filter((s) => !SIDEBAR_IDS.includes(s.id));
    body_ = (
      <div className="bio-grid-side">
        <aside className="bio-side">
          {photoSrc && <Photo src={photoSrc} design={design} />}
          {side.map((s) => <Section key={s.id} section={s} />)}
        </aside>
        <div>
          {header}
          {main.map((s) => <Section key={s.id} section={s} />)}
        </div>
      </div>
    );
  } else {
    const [first, ...rest] = sections;
    const pos = design.photoPosition;
    const photoEl = photoSrc ? <Photo src={photoSrc} design={design} /> : null;
    const restEl = design.layout === 'twoColumn'
      ? <div className="bio-cols">{rest.map((s) => <Section key={s.id} section={s} />)}</div>
      : rest.map((s) => <Section key={s.id} section={s} />);
    body_ = (
      <>
        {header}
        {photoEl && pos === 'center' && <div className="bio-photo-center">{photoEl}</div>}
        {first && (
          photoEl && pos !== 'center' ? (
            <div className="bio-toprow">
              {pos === 'left' && photoEl}
              <Section section={first} />
              {pos === 'right' && photoEl}
            </div>
          ) : <Section section={first} />
        )}
        {restEl}
      </>
    );
  }

  return (
    <div
      ref={ref}
      className="bio-page"
      style={cssVars}
      data-pattern={design.pattern}
      data-border={design.border}
      data-heading={design.headingStyle}
      data-layout={design.layout}
      data-decor={design.decor}
    >
      <div className="bio-pattern" />
      {design.decor === 'mandala' && <Mandala />}
      {design.border !== 'none' && (
        <div className="bio-frame">
          {design.border === 'ornate' && ['tl', 'tr', 'bl', 'br'].map((p) => <Corner key={p} pos={p} />)}
        </div>
      )}
      {design.decor === 'toran' && <Toran />}
      <div className="bio-inner" ref={innerRef} style={{ fontSize: design.fontSize }}>
        <div className="bio-flow" ref={flowRef}>{body_}</div>
      </div>
    </div>
  );
}));

export default BiodataPage;
