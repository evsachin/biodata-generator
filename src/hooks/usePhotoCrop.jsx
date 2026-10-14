import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PhotoCropper from '../components/photo/PhotoCropper';
import { readPhotoFile } from '../lib/image';
import { useBiodata } from './useBiodata';

const PhotoCropContext = createContext(null);

/**
 * Owns the photo upload -> crop flow so both the Information and Design steps can start it.
 * chooseFile(file): read + down-scale the file, then open the cropper
 * recrop():         re-open the cropper on the stored original
 */
export function PhotoCropProvider({ children }) {
  const { data, setPhoto } = useBiodata();
  const [session, setSession] = useState(null); // { src }
  const [error, setError] = useState('');

  const chooseFile = useCallback(async (file) => {
    setError('');
    try {
      const original = await readPhotoFile(file);
      setSession({ src: original });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const recrop = useCallback(() => {
    const src = data.photo.original || data.photo.src;
    if (src) setSession({ src });
  }, [data.photo.original, data.photo.src]);

  const removePhoto = useCallback(() => setPhoto({ src: null, original: null }), [setPhoto]);

  const value = useMemo(
    () => ({ chooseFile, recrop, removePhoto, error, clearError: () => setError('') }),
    [chooseFile, recrop, removePhoto, error],
  );

  return (
    <PhotoCropContext.Provider value={value}>
      {children}
      {session && (
        <PhotoCropper
          src={session.src}
          shape={data.design.photoShape}
          onCancel={() => setSession(null)}
          onApply={(cropped) => {
            setPhoto({ src: cropped, original: session.src });
            setSession(null);
          }}
        />
      )}
    </PhotoCropContext.Provider>
  );
}

export const usePhotoCrop = () => {
  const ctx = useContext(PhotoCropContext);
  if (!ctx) throw new Error('usePhotoCrop must be used inside <PhotoCropProvider>');
  return ctx;
};
