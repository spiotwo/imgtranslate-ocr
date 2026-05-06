# Image Translator (OCR) — Firefox extension

Right-click any image or selected text → **Translate**. Image translations
overlay on the original image with hover-to-reveal boxes. Selection
translations show in a compact inline panel. No account, no API key.

## Features

- **Single context menu item** — appears on images and on text selections.
- **Image OCR + translation** via Google Lens (no API key required). Text
  is grouped into logical blocks (speech bubbles, paragraphs) before
  translation, so multi-line content gets full context.
- **Selection icon** — a small button appears at the end of selected text.
  One click translates it.
- **Hotlink-protected images supported** — sites like pixiv and gelbooru
  that check the `Referer` header are handled via canvas extraction (no
  network call) with a webRequest-based fetch fallback.
- **Danbooru-style overlays** — subtle cream rectangles at rest, full
  hover tooltips on demand.

## Install

### Temporary install for development

1. Clone this repo or download the latest release.
2. In Firefox, open `about:debugging` → **This Firefox** → **Load Temporary Add-on** → select `manifest.json`.

The temporary install is removed when Firefox restarts. For permanent local
install, build a signed `.xpi` via the AMO submit-and-self-distribute flow.

## How it works

```
right-click image
       ↓
opens popup window (image URL passed in)
       ↓
content script: try canvas extraction from <img> on page
       ↓ (if tainted by cross-origin)
background: fetch with webRequest-injected Referer header
       ↓
chrome-lens-ocr → text + bounding boxes
       ↓
union-find grouping (proximity + alignment, manga-translator style)
       ↓
translate.googleapis.com (per group, sl=auto)
       ↓
render hover boxes positioned over the original image
```

For selection translation, the content script handles everything inline —
right-click or icon click → fetch translation → render compact panel.

## Architecture

| File | Role |
|------|------|
| `manifest.json` | MV3 manifest, permissions, icon registration |
| `background.js` | Context menu router, webRequest Referer injection, fallback image fetcher |
| `content.js`, `content.css` | Selection panel, selection icon, canvas image extraction |
| `popup.html`, `popup.js`, `popup.css` | Image OCR popup window + overlay rendering |
| `lens-bundle.js` | Bundled `@rxliuli/chrome-lens-ocr` (see BUILD.md) |
| `options.html`, `options.js` | Settings page |
| `entry.mjs` | esbuild entry point for `lens-bundle.js` |
| `package.json`, `package-lock.json` | Pinned build dependencies |

## Caveats

- Both the Lens OCR endpoint and the `translate_a/single` translation
  endpoint are unofficial. They can change or break with no warning.
  When that happens, check the issues for
  [`chrome-lens-ocr`](https://github.com/dimdenGD/chrome-lens-ocr/issues) and
  [`simple-translate`](https://github.com/sienori/simple-translate/issues).
- Some images are unrecoverable: those loaded only into a `<canvas>` (with
  no `<img>` element on the page) can't be canvas-extracted, and any image
  served only from origins requiring auth headers other than Referer will
  fail the fallback fetch.
- The grouping heuristic works well for speech bubbles, paragraphs, and
  most manga / comics layouts. It can be wrong for unusual layouts (curved
  text, graffiti, heavily stylized fonts).

## Building

```bash
npm ci
npm run build  # produces lens-bundle.js
```

See [BUILD.md](./BUILD.md) for full reproduction details.

## Acknowledgments

- [`chrome-lens-ocr`](https://github.com/dimdenGD/chrome-lens-ocr) (and the
  [`@rxliuli` browser fork](https://github.com/rxliuli/chrome-lens-ocr))
  for the Google Lens OCR client.
- [`simple-translate`](https://github.com/sienori/simple-translate) for
  demonstrating the unauthenticated `translate_a/single` endpoint usage
  pattern.
- [Danbooru](https://danbooru.donmai.us) for the translation-notes overlay
  design language.

See [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md) for the licenses
of bundled dependencies.

## License

[MIT](./LICENSE)
