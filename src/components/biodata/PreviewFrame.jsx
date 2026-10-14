import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { A4 } from '../../config';
import BiodataPage from './BiodataPage';

/**
 * Shows the fixed-size A4 biodata scaled (with CSS transform) to the width of its container.
 * The page node itself is never transformed, so exports can capture it at full resolution.
 *
 * viewportOffset: if set, the page is also limited so it fits in (window height - offset),
 *                 which keeps a sticky desktop preview fully visible.
 * overlay:        node, or (scale) => node, drawn on top of the page (e.g. the "sample" watermark)
 */
export default function PreviewFrame({
  data,
  maxScale = 1,
  pageRef,
  onFit,
  overlay,
  placeholder = false,
  ghostPhoto = false,
  shadow = true,
  viewportOffset,
}) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 900));

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (viewportOffset == null) return undefined;
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [viewportOffset]);

  let scale = width ? Math.min(maxScale, width / A4.w) : 0.4;
  if (viewportOffset != null) scale = Math.min(scale, Math.max(0.3, (vh - viewportOffset) / A4.h));

  return (
    <div ref={wrapRef} className="w-full">
      <div
        className={`relative mx-auto overflow-hidden bg-white ${shadow ? 'shadow-sheet' : ''}`}
        style={{ width: A4.w * scale, height: A4.h * scale }}
      >
        <div style={{ width: A4.w, height: A4.h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <BiodataPage ref={pageRef} data={data} onFit={onFit} placeholder={placeholder} ghostPhoto={ghostPhoto} />
        </div>
        {typeof overlay === 'function' ? overlay(scale) : overlay}
      </div>
    </div>
  );
}
