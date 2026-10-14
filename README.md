# विवाह बायोडाटा मेकर – Marathi Biodata Maker

React + Vite + Tailwind. Three steps: **Information → Design → Preview & Download**. No backend; data lives in the browser.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Payment (₹30)
* Without config the app runs in **demo payment mode** (fake checkout, nothing is charged).
* For real payments copy `.env.example` to `.env` and set `VITE_RAZORPAY_KEY_ID` (Razorpay Checkout opens automatically).
* One payment unlocks print / PDF / PNG for 24 h on that browser (`UNLOCK_HOURS` in `src/services/payment.js`).
* The unlock is stored client-side and can be bypassed. Before launching for real, add a server:
  create the order (`createOrder`) and verify the signature (`verifyPayment`) – both are stubbed in `payment.js`.

## Structure
```
src/data/schema.js        default sections/fields (Marathi + English), dropdown options, sample data
src/data/design.js        fonts, 7 templates (presets), colour themes, border/heading/layout options
src/state/                reducer: values, add/remove fields & sections, photo, design
src/services/storage.js   async storage adapter (localStorage now; API adapter skeleton included)
src/services/payment.js   Razorpay + demo mode, unlock record
src/services/exporter.js  PNG (2382×3369), A4 PDF, print
src/biodata/              A4 renderer (BiodataPage, biodata.css, decor SVGs) with auto-fit-to-one-page
src/components/           steps, photo upload + crop, payment modal, dialogs
```

## Notes
* Fonts are bundled (`@fontsource`), so Marathi renders identically in preview, PDF, PNG and print.
* PDF/PNG are high-resolution renders of the page (text in the PDF is not selectable). Print → "Save as PDF" gives a vector, selectable PDF.
* To add a template: add an entry to `TEMPLATES` in `src/data/design.js` (colours, fonts, border, heading style, layout, pattern, decor).
* Moving to a backend: implement `createApiAdapter` in `storage.js` and select it; photos should then be uploaded and stored as URLs.
