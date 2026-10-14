import { useRef, useState } from 'react';
import { Camera, Crop, Trash2, Upload } from 'lucide-react';
import PhotoCropModal from './PhotoCropModal.jsx';

const MAX_SIDE = 1600;

/** Reads an image file and downsizes it (keeps storage small, makes cropping fast). */
function readAndShrink(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported image'));
      img.onload = () => {
        const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.9));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function PhotoUploader({ photo, onChange, shape }) {
  const input = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);
  const [pending, setPending] = useState(null); // original awaiting crop
  const [error, setError] = useState('');
  const aspect = shape === 'circle' || shape === 'square' ? 1 : 3 / 4;

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('कृपया फोटो फाईल निवडा / Please choose an image file');
    setError('');
    try {
      const original = await readAndShrink(file);
      setPending(original);
      setCropSrc(original);
    } catch {
      setError('फोटो वाचता आला नाही / Could not read this image');
    }
  };

  const done = (cropped) => {
    onChange({ original: pending || photo.original, cropped });
    setCropSrc(null);
    setPending(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <button
        type="button" onClick={() => (photo ? setCropSrc(photo.original) : input.current?.click())}
        className="group relative flex h-36 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
        aria-label={photo ? 'Re-crop photo' : 'Upload photo'}
      >
        {photo ? (
          <img src={photo.cropped} alt="Profile preview" className="h-full w-full object-cover" />
        ) : (
          <Camera size={34} strokeWidth={1.6} />
        )}
        {photo && (
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-stone-900/60 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
            <Crop size={13} /> Crop
          </span>
        )}
      </button>

      <div className="flex-1 text-center sm:text-left">
        <p className="font-bold text-stone-900">फोटो / Photo</p>
        <p className="mb-3 text-sm text-stone-500">JPG / PNG • चेहरा स्पष्ट दिसेल असा फोटो निवडा. Upload, crop and position it later in Design.</p>
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <button type="button" className="btn btn-primary !py-2" onClick={() => input.current?.click()}>
            <Upload size={17} /> {photo ? 'फोटो बदला / Change' : 'फोटो अपलोड / Upload'}
          </button>
          {photo && (
            <>
              <button type="button" className="btn btn-ghost !py-2" onClick={() => setCropSrc(photo.original)}>
                <Crop size={17} /> Crop
              </button>
              <button type="button" className="btn btn-ghost !py-2 text-red-700" onClick={() => onChange(null)}>
                <Trash2 size={17} /> Remove
              </button>
            </>
          )}
        </div>
        {error && <p className="mt-2 text-sm font-semibold text-red-600" role="alert">{error}</p>}
      </div>

      <input ref={input} type="file" accept="image/*" className="hidden" onChange={onFile} data-testid="photo-input" />
      {cropSrc && <PhotoCropModal src={cropSrc} initialAspect={aspect} onCancel={() => { setCropSrc(null); setPending(null); }} onDone={done} />}
    </div>
  );
}
