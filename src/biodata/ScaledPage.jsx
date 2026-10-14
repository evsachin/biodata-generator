import { useLayoutEffect, useRef, useState } from 'react';
import BiodataPage from './BiodataPage.jsx';
import { PAGE_W, PAGE_H } from '../services/exporter.js';

/** Shows the A4 page scaled to the width of its container (used for live preview and template thumbnails). */
export default function ScaledPage({ data, watermark = false, maxScale = 1.25, className = '' }) {
  const wrap = useRef(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const update = () => setScale(Math.min(maxScale, el.clientWidth / PAGE_W) || 0.5);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxScale]);

  return (
    <div ref={wrap} className={`w-full ${className}`}>
      <div className="relative overflow-hidden bg-white" style={{ height: PAGE_H * scale }}>
        <div style={{ width: PAGE_W, height: PAGE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <BiodataPage data={data} />
        </div>
        {watermark && (
          <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
            <div
              className="absolute -inset-1/4 flex flex-wrap content-center justify-center gap-x-10 gap-y-14 opacity-[0.16]"
              style={{ transform: 'rotate(-28deg)' }}
            >
              {Array.from({ length: 42 }, (_, i) => (
                <span key={i} className="whitespace-nowrap text-2xl font-bold tracking-widest text-stone-900">PREVIEW</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
