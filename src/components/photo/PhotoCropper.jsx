import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImage } from '../../lib/image';
import { Bi, Button, Modal } from '../ui/primitives';
import { IconRotate } from '../ui/Icons';

// Frame proportions match the biodata photo boxes (10.4em x 13.4em ≈ 7:9, circle = 1:1)
export const photoAspect = (shape) => (shape === 'circle' ? 1 : 7 / 9);

export default function PhotoCropper({ src, shape, onCancel, onApply }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);

  const onComplete = useCallback((_, pixels) => setArea(pixels), []);

  const apply = async () => {
    if (!area) return;
    setBusy(true);
    try {
      const dataUrl = await getCroppedImage(src, area, rotation);
      onApply(dataUrl);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title="फोटो क्रॉप करा"
      titleEn="Crop and position your photo"
      size="lg"
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            रद्द करा
          </Button>
          <Button onClick={apply} loading={busy} disabled={!area}>
            फोटो वापरा
          </Button>
        </>
      }
    >
      <p className="mb-3 text-sm text-ink-600">
        <Bi mr="फोटो ओढून योग्य जागी ठेवा आणि स्लायडरने झूम करा." en="Drag to position, use the slider to zoom." />
      </p>
      <div className="relative h-[50vh] min-h-[280px] w-full overflow-hidden rounded-lg bg-ink-900">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={photoAspect(shape)}
          cropShape={shape === 'circle' ? 'round' : 'rect'}
          showGrid={false}
          minZoom={1}
          maxZoom={4}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onComplete}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="field-label">
            <Bi mr="झूम" en="Zoom" />
          </span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.02}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-6 w-full accent-plum-700"
            aria-label="Zoom"
          />
        </label>
        <Button variant="secondary" onClick={() => setRotation((r) => (r + 90) % 360)}>
          <IconRotate size={18} />
          <Bi mr="फिरवा" en="Rotate" />
        </Button>
      </div>
    </Modal>
  );
}
