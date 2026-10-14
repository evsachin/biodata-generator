// App-wide configuration. Everything that a future backend / business decision may change lives here.
export const CONFIG = {
  appNameMr: 'मराठी बायोडाटा मेकर',
  appNameEn: 'Marathi Biodata Maker',

  // Payment
  price: 30, // in rupees
  currency: 'INR',
  // How long a successful payment keeps downloads/print unlocked on this device.
  // Edits stay free during this window so people can fix a typo and download again.
  unlockHours: 24,
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  merchantName: import.meta.env.VITE_MERCHANT_NAME || 'Marathi Biodata Maker',

  // Storage namespace (bump the version if the saved data shape changes incompatibly)
  storagePrefix: 'mbm:v1:',
};

// A4 at 96 dpi (210mm x 297mm). The biodata is always laid out at this fixed size
// and then scaled with CSS for previews, so print / PDF / image all match exactly.
export const A4 = { w: 794, h: 1123 };
