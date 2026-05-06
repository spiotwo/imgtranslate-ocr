# Build Instructions

This document tells AMO reviewers how to reproduce `lens-bundle.js` from
source. Following these steps must produce a file byte-identical to the
`lens-bundle.js` shipped in the extension.

## What is `lens-bundle.js`?

`lens-bundle.js` is the npm package
[`@rxliuli/chrome-lens-ocr`](https://www.npmjs.com/package/@rxliuli/chrome-lens-ocr)
(a fork of [`chrome-lens-ocr`](https://github.com/dimdenGD/chrome-lens-ocr)
adapted for browser environments) bundled into a single self-contained file
by esbuild. The extension calls Google Lens's public OCR endpoint to extract
text from images. The library's source is published under the ISC license
on npm and on GitHub.

The extension does NOT load any code at runtime — `lens-bundle.js` is a
static asset shipped inside the .xpi.

## Requirements

- Node.js (any recent LTS version; tested with v22)
- Internet access to download dependencies from `registry.npmjs.org`

## Reproduction steps

From the extracted source code directory:

```bash
npm ci
npx esbuild entry.mjs --bundle --format=iife --outfile=lens-bundle.js --target=firefox115
```

The first command installs the exact versions of `@rxliuli/chrome-lens-ocr`
and `esbuild` pinned in `package-lock.json`. **Use `npm ci`, not `npm install`**
— `npm install` may resolve to newer versions and produce a non-matching
build.

The second command runs esbuild with the same flags used to build the
shipped bundle. The output `lens-bundle.js` should match the file in the
extension exactly.

## Verifying the build

```bash
# After running the two commands above, in the source directory:
md5sum lens-bundle.js
# Expected: 696a57fd5e9eaa6aef782d0cb01986ef
```

## Pinned versions

- `@rxliuli/chrome-lens-ocr`: 4.1.1
- `esbuild`: 0.24.0

Both are pinned exactly (no `^` or `~`) in `package.json` and locked further
by `package-lock.json`.

## What `entry.mjs` does

Two lines:

```javascript
import { LensCore } from '@rxliuli/chrome-lens-ocr/core';
window.LensCore = LensCore;
```

It imports the `LensCore` class from the npm package and assigns it to
`window.LensCore` so the popup script (`popup.js`) can access it after the
bundle is loaded via `<script src="lens-bundle.js">`.
