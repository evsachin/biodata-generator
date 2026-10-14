import { forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './biodata.css';
import { fontStack } from '../../data/fonts';
import { hasValue, invocationText } from '../../data/schema';
import { readableOn } from '../../lib/color';
import { SILHOUETTE, cornerOrnament, paithaniTile, toranTile } from '../../lib/ornaments';

const FONT_SCALE = { s: 0.93, m: 1, l: 1.08 };
const BASE_FS = 14; // px at "medium"; the page is 794px wide
const MIN_FACTOR = 0.66; // auto-fit never shrinks below 66% of the chosen size

// Content area (px) inside each border style
const INSETS = {
  none: { top: 46, right: 50, bottom: 50, left: 50 },
  line: { top: 48, right: 52, bottom: 52, left: 52 },
  double: { top: 50, right: 54, bottom: 56, left: 54 },
  corners: { top: 56, right: 60, bottom: 60, left: 60 },
  paithani: { top: 54, right: 56, bottom: 58, left: 56 },
  toran: { top: 78, right: 54, bottom: 54, left: 54 },
};

// "label (primary) + optional English sub-label" according to the chosen language
const pick = (mr, en, lang) => {
  const a = (mr || '').trim();
  const b = (en || '').trim();
  if (lang === 'en') return { main: b || a, sub: null };
  if (lang === 'both') return { main: a || b, sub: a && b ? b : null };
  return { main: a || b, sub: null };
};

/* ------------------------------------------------------------------ borders */
function BorderLayer({ kind, accent, zari, bg }) {
  switch (kind) {
    case 'line':
      return <div className="bd-frame" style={{ inset: 22, border: `1.5px solid ${accent}` }} />;
    case 'double':
      return (
        <>
          <div className="bd-frame" style={{ inset: 18, border: `4px solid ${accent}` }} />
          <div className="bd-frame" style={{ inset: 31, border: `1px solid ${zari}` }} />
        </>
      );
    case 'corners': {
      const img = cornerOrnament(accent, zari);
      return (
        <>
          <div className="bd-frame" style={{ inset: 28, border: `1px solid ${accent}` }} />
          <div className="bd-corner" style={{ backgroundImage: img, top: 16, left: 16 }} />
          <div className="bd-corner" style={{ backgroundImage: img, top: 16, right: 16, transform: 'scaleX(-1)' }} />
          <div className="bd-corner" style={{ backgroundImage: img, bottom: 16, left: 16, transform: 'scaleY(-1)' }} />
          <div className="bd-corner" style={{ backgroundImage: img, bottom: 16, right: 16, transform: 'scale(-1,-1)' }} />
        </>
      );
    }
    case 'paithani': {
      const tile = paithaniTile(accent, zari, bg);
      const s = 22;
      const common = { backgroundImage: tile, backgroundRepeat: 'round' };
      return (
        <>
          <div className="bd-strip" style={{ ...common, top: 0, left: 0, right: 0, height: s }} />
          <div className="bd-strip" style={{ ...common, bottom: 0, left: 0, right: 0, height: s }} />
          <div className="bd-strip" style={{ ...common, top: s, bottom: s, left: 0, width: s }} />
          <div className="bd-strip" style={{ ...common, top: s, bottom: s, right: 0, width: s }} />
          <div className="bd-frame" style={{ inset: s + 9, border: `1px solid ${zari}` }} />
        </>
      );
    }
    case 'toran':
      return (
        <>
          <div className="bd-frame" style={{ top: 60, left: 26, right: 26, bottom: 26, border: `1.5px solid ${accent}` }} />
          <div className="bd-toran" style={{ top: 8, left: 26, right: 26, backgroundImage: toranTile(accent, zari), backgroundRepeat: 'round no-repeat' }} />
        </>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ building blocks */
function Photo({ src, shape, size }) {
  if (!src) return null;
  // SILHOUETTE is a CSS url("...") string; real photos are plain data URLs
  const isGhost = src === SILHOUETTE;
  return (
    <div className={`bd-photo bd-photo--${shape} bd-photo--${size}`}>
      {isGhost ? <div className="bd-ghost" style={{ backgroundImage: src }} /> : <img src={src} alt="" />}
    </div>
  );
}

function Header({ header, lang }) {
  const inv = invocationText(header);
  const { main, sub } = pick(header.titleMr, header.titleEn, lang);
  return (
    <div className="bd-header">
      {inv && <div className="bd-invocation">{inv}</div>}
      <h1 className="bd-title">
        {main}
        {sub && <small>{sub}</small>}
      </h1>
      <div className="bd-divider">
        <i className="bd-dia" />
      </div>
    </div>
  );
}

function Heading({ section, lang, styleName }) {
  const { main, sub } = pick(section.titleMr, section.titleEn, lang);
  const content = (
    <>
      {main}
      {sub && <small>{sub}</small>}
    </>
  );
  if (styleName === 'ribbon')
    return (
      <h3 className="bd-h bd-h--ribbon">
        <span>{content}</span>
      </h3>
    );
  if (styleName === 'ornament')
    return (
      <h3 className="bd-h bd-h--ornament">
        <i className="bd-dia" />
        <span>{content}</span>
        <i className="bd-dia" />
      </h3>
    );
  return <h3 className={`bd-h bd-h--${styleName}`}>{content}</h3>;
}

function Rows({ fields, lang, cols, rowStyle }) {
  return (
    <div className={`bd-rows bd-rows--${rowStyle} ${cols === 2 ? 'bd-rows--2' : ''}`}>
      {fields.map((fl) => {
        const { main, sub } = pick(fl.labelMr, fl.labelEn, lang);
        const value = fl.value.trim();
        const wide = cols === 2 && (fl.type === 'textarea' || value.length > 36 || value.includes('\n'));
        return (
          <div key={fl.id} className={`bd-row${wide ? ' bd-row--wide' : ''}`}>
            <div className="bd-lbl">
              {main}
              {sub && <small>{sub}</small>}
            </div>
            <div className="bd-sep">:</div>
            <div className="bd-val">{value}</div>
          </div>
        );
      })}
    </div>
  );
}

function Section({ section, lang, design, cols, variant }) {
  const n = section.fields.length;
  const resolvedCols = cols ?? (design.rowStyle === 'zebra' ? 1 : n >= 4 ? 2 : 1);
  const headingStyle = variant === 'side' ? 'side' : design.headingStyle;
  const Tag = variant === 'card' ? 'section' : 'section';
  return (
    <Tag className={variant === 'card' ? 'bd-card' : 'bd-sec'}>
      <Heading section={section} lang={lang} styleName={headingStyle} />
      <Rows fields={section.fields} lang={lang} cols={resolvedCols} rowStyle={variant === 'side' ? 'plain' : design.rowStyle} />
    </Tag>
  );
}

// Re-run the fit calculation once web fonts finish loading (they change text metrics)
function useFontsTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!document.fonts) return undefined;
    const bump = () => setTick((t) => t + 1);
    document.fonts.addEventListener('loadingdone', bump);
    document.fonts.ready.then(bump);
    return () => document.fonts.removeEventListener('loadingdone', bump);
  }, []);
  return tick;
}

/* ------------------------------------------------------------------ the page */
const BiodataPage = forwardRef(function BiodataPage({ data, onFit, placeholder = false, ghostPhoto = false }, ref) {
  const { header, photo, sections, design } = data;
  const pageRef = useRef(null);
  const innerRef = useRef(null);
  const onFitRef = useRef(onFit);
  onFitRef.current = onFit;
  useImperativeHandle(ref, () => pageRef.current, []);
  const fontsTick = useFontsTick();

  const lang = design.labelLang || 'mr';
  const inset = INSETS[design.border] || INSETS.line;
  const layout = design.layout;
  const photoSrc = photo?.src || (ghostPhoto ? SILHOUETTE : null);

  const visible = useMemo(
    () =>
      sections
        .map((s) => ({ ...s, fields: s.fields.filter((fl) => hasValue(fl.value)) }))
        .filter((s) => s.fields.length > 0),
    [sections],
  );

  const vars = {
    '--bd-bg': design.pageBg,
    '--bd-text': design.text,
    '--bd-accent': design.accent,
    '--bd-zari': design.secondary,
    '--bd-on-accent': readableOn(design.accent),
    '--bd-head': fontStack(design.headingFont),
    '--bd-body': fontStack(design.bodyFont),
  };

  // Auto-fit: shrink the base font size (everything is in em) until the content fits on one A4 page.
  useLayoutEffect(() => {
    const page = pageRef.current;
    const inner = innerRef.current;
    if (!page || !inner) return;
    const base = BASE_FS * (FONT_SCALE[design.fontScale] || 1);
    const min = base * MIN_FACTOR;
    let fs = base;
    page.style.setProperty('--fs', `${fs}px`);
    let guard = 0;
    while (inner.scrollHeight > inner.clientHeight + 1 && fs > min && guard < 120) {
      fs = Math.max(min, fs - 0.25);
      page.style.setProperty('--fs', `${fs}px`);
      guard += 1;
    }
    const overflow = inner.scrollHeight > inner.clientHeight + 1;
    onFitRef.current?.({ fs, base, shrunk: fs < base - 0.01, overflow });
  }, [data, fontsTick]);

  const pos = layout === 'centered' ? 'center' : design.photoPos || 'right';
  const photoEl = <Photo src={photoSrc} shape={design.photoShape} size={design.photoSize} />;

  const headerBlock =
    photoSrc && pos !== 'center' ? (
      <div className="bd-head-row">
        {pos === 'left' && photoEl}
        <Header header={header} lang={lang} />
        {pos === 'right' && photoEl}
      </div>
    ) : (
      <>
        <Header header={header} lang={lang} />
        {photoSrc && <div className="bd-center-photo">{photoEl}</div>}
      </>
    );

  let body;
  if (layout === 'sidebar') {
    const sideIds = ['contact', 'horoscope'];
    const side = visible.filter((s) => sideIds.includes(s.id));
    const main = visible.filter((s) => !sideIds.includes(s.id));
    body = (
      <div className="bd-sidebar-wrap">
        <aside className="bd-side">
          {photoEl}
          {side.map((s) => (
            <Section key={s.id} section={s} lang={lang} design={design} cols={1} variant="side" />
          ))}
        </aside>
        <div className="bd-main">
          <Header header={header} lang={lang} />
          {main.map((s) => (
            <Section key={s.id} section={s} lang={lang} design={design} cols={1} />
          ))}
        </div>
      </div>
    );
  } else if (layout === 'cards') {
    body = (
      <>
        {headerBlock}
        <div className="bd-cols">
          {visible.map((s) => (
            <Section key={s.id} section={s} lang={lang} design={design} cols={1} variant="card" />
          ))}
        </div>
      </>
    );
  } else {
    // classic (photo beside the title) and centered (photo under the title)
    body = (
      <>
        {headerBlock}
        {visible.map((s) => (
          <Section key={s.id} section={s} lang={lang} design={design} />
        ))}
      </>
    );
  }

  const isEmpty = visible.length === 0 && !photoSrc;

  return (
    <div ref={pageRef} className="bd-page" style={vars} data-layout={layout}>
      <BorderLayer kind={design.border} accent={design.accent} zari={design.secondary} bg={design.pageBg} />
      <div ref={innerRef} className="bd-inner" style={{ top: inset.top, right: inset.right, bottom: inset.bottom, left: inset.left }}>
        {body}
        {isEmpty && placeholder && <div className="bd-empty-note">माहिती भरल्यावर तुमचा बायोडाटा येथे दिसेल.</div>}
      </div>
    </div>
  );
});

export default memo(BiodataPage);
