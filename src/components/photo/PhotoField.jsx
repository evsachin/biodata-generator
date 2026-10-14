import { useRef, useState } from 'react';
import { useBiodata } from '../../hooks/useBiodata';
import { usePhotoCrop } from '../../hooks/usePhotoCrop';
import { Bi, Button } from '../ui/primitives';
import { IconAlert, IconCrop, IconTrash, IconUpload } from '../ui/Icons';

export default function PhotoField() {
  const { data } = useBiodata();
  const { chooseFile, recrop, removePhoto, error, clearError } = usePhotoCrop();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const src = data.photo.src;

  const onFiles = (files) => {
    const file = files?.[0];
    if (file) chooseFile(file);
    if (inputRef.current) inputRef.current.value = ''; // allow choosing the same file again
  };

  const picker = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="sr-only"
      id="photo-input"
      onChange={(e) => onFiles(e.target.files)}
    />
  );

  return (
    <div>
      {picker}
      {!src ? (
        <label
          htmlFor="photo-input"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors focus-within:ring-2 focus-within:ring-plum-300 ${
            dragging ? 'border-plum-500 bg-plum-50' : 'border-ink-200 bg-white hover:border-plum-300 hover:bg-plum-50/50'
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-plum-100 text-plum-700">
            <IconUpload />
          </span>
          <span className="text-[15px] font-semibold text-ink-900">
            <Bi mr="फोटो निवडा" en="Choose photo" />
          </span>
          <span className="text-sm text-ink-500">
            <Bi mr="किंवा येथे फोटो ओढून आणा." en="or drag a photo here" />
          </span>
        </label>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-3">
          <img src={src} alt="निवडलेला फोटो" className="h-24 w-[74px] flex-none rounded-md border border-ink-100 object-cover" />
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={recrop}>
              <IconCrop size={16} />
              <Bi mr="क्रॉप / जागा" en="Crop" />
            </Button>
            <label htmlFor="photo-input" className="inline-flex min-h-[36px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-3 text-sm font-semibold text-ink-800 transition-colors hover:border-plum-300 hover:bg-plum-50 focus-within:ring-2 focus-within:ring-plum-300">
              <IconUpload size={16} />
              <Bi mr="बदला" en="Replace" />
            </label>
            <Button variant="ghost" size="sm" onClick={removePhoto} className="text-red-700 hover:bg-red-50">
              <IconTrash size={16} />
              <Bi mr="काढा" en="Remove" />
            </Button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          <IconAlert size={18} className="mt-0.5 flex-none" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={clearError} className="font-semibold underline">
            ठीक आहे
          </button>
        </p>
      )}
    </div>
  );
}
