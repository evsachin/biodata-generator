import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCw, ZoomIn } from 'lucide-react';
import { Modal } from './ui.jsx';

const ASPECTS = [
  { id: '3:4', value: 3 / 4, label: '3:4 Portrait' },
  { id: '1:1', value: 1, label: '1:1 Square' },
  { id: '4:5', value: 4 / 5, label: '4:5' },
];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Renders the selected crop (with rotation) to a JPEG data URL, max 900px on the long side. */
export async function cropToDataUrl(src, area, rotation = 0) {
  const img = await loadImage(src);
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const bw = img.width * cos + img.height * sin;
  const bh = img.width * sin + img.height * cos;

  const full = document.createElement('canvas');
  full.width = bw;
  full.height = bh;
  const fctx = full.getContext('2d');
  fctx.translate(bw / 2, bh / 2);
  fctx.rotate(rad);
  fctx.drawImage(img, -img.width / 2, -img.height / 2);

  const scale = Math.min(1, 900 / Math.max(area.width, area.height));
  const out = document.createElement('canvas');
  out.width = Math.round(area.width * scale);
  out.height = Math.round(area.height * scale);
  const octx = out.getContext('2d');
  octx.fillStyle = '#fff';
  octx.fillRect(0, 0, out.width, out.height);
  octx.drawImage(full, area.x, area.y, area.width, area.height, 0, 0, out.width, out.height);
  return out.toDataURL('image/jpeg', 0.92);
}

export default function PhotoCropModal({ src, initialAspect = 3 / 4, onCancel, onDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(initialAspect);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);

  const onComplete = useCallback((_, pixels) => setArea(pixels), []);

  const apply = async () => {
    if (!area) return;
    setBusy(true);
    try {
      onDone(await cropToDataUrl(src, area, rotation));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onCancel} title="फोटो क्रॉप करा / Crop photo" wide>
      <div className="p-4 sm:p-5">
        <div className="relative h-[52vh] max-h-[460px] min-h-[260px] overflow-hidden rounded-2xl bg-stone-900">
          <Cropper
            image={src} crop={crop} zoom={zoom} rotation={rotation} aspect={aspect}
            onCropChange={setCrop} onZoomChange={setZoom} onRotationChange={setRotation}
            onCropComplete={onComplete} objectFit="contain" showGrid
          />
        </div>
        <p className="mt-2 text-center text-xs text-stone-500">
          ड्रॅग करून फोटो हलवा, झूम करून योग्य भाग निवडा • Drag to move, zoom to frame the face
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
            <ZoomIn size={18} className="shrink-0 text-maroon-700" />
            <input type="range" min={1} max={4} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-maroon-700" aria-label="Zoom" />
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
            <RotateCw size={18} className="shrink-0 text-maroon-700" />
            <input type="range" min={-45} max={45} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-maroon-700" aria-label="Rotate" />
            <span className="w-10 text-right tabular-nums text-stone-500">{rotation}°</span>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {ASPECTS.map((a) => (
            <button
              key={a.id} type="button" onClick={() => setAspect(a.value)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${aspect === a.value ? 'border-maroon-700 bg-maroon-700 text-white' : 'border-stone-300 text-stone-700'}`}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button className="btn btn-ghost" onClick={onCancel}>रद्द करा / Cancel</button>
          <button className="btn btn-primary" onClick={apply} disabled={busy || !area}>
            {busy ? 'Saving…' : 'फोटो वापरा / Use photo'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
