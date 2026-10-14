// Image helpers for the photo upload + crop flow.

const MAX_INPUT_BYTES = 20 * 1024 * 1024;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image could not be read'));
    img.src = src;
  });
}

// Read a File, down-scale so it fits in browser storage, return a JPEG data URL.
export async function readPhotoFile(file, maxSide = 1400) {
  if (!file || !/^image\//.test(file.type)) {
    throw new Error('कृपया JPG किंवा PNG फोटो निवडा. · Please choose a JPG or PNG photo.');
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('फोटो खूप मोठा आहे (२० MB पेक्षा कमी हवा). · Photo is too large (max 20 MB).');
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.88);
  } catch {
    throw new Error('ही फाईल वाचता आली नाही. JPG किंवा PNG वापरा. · Could not read this file. Try a JPG or PNG.');
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Crop (with optional rotation) using the pixel rectangle from react-easy-crop.
export async function getCroppedImage(imageSrc, pixelCrop, rotation = 0, maxWidth = 900) {
  const image = await loadImage(imageSrc);
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const boxW = image.width * cos + image.height * sin;
  const boxH = image.width * sin + image.height * cos;

  const rotated = document.createElement('canvas');
  rotated.width = Math.round(boxW);
  rotated.height = Math.round(boxH);
  const rctx = rotated.getContext('2d');
  rctx.translate(boxW / 2, boxH / 2);
  rctx.rotate(rad);
  rctx.translate(-image.width / 2, -image.height / 2);
  rctx.drawImage(image, 0, 0);

  const scale = Math.min(1, maxWidth / pixelCrop.width);
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(pixelCrop.width * scale));
  out.height = Math.max(1, Math.round(pixelCrop.height * scale));
  const octx = out.getContext('2d');
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(rotated, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, out.width, out.height);
  return out.toDataURL('image/jpeg', 0.92);
}
