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
npm run build
```

`npm ci` installs the exact versions of `@rxliuli/chrome-lens-ocr` and
`esbuild` pinned in `package-lock.json`. **Use `npm ci`, not `npm install`**
— `npm install` may resolve to newer versions and produce a non-matching
build.

`npm run build` runs two steps:

1. `esbuild` bundles `entry.mjs` into `lens-bundle.js` (~430 KB).
2. `patch-bundle.js` replaces all 24 occurrences of
   `Function("return this")()` (a dead-code fallback in the bundled
   `google-protobuf` library, used when `globalThis` is unavailable) with
   `globalThis` directly. This is required because Mozilla's add-on
   validator flags `Function`-constructor calls as a static analysis
   warning, and the fallback is unreachable in any browser supporting
   `globalThis` (which is required since Firefox 65; we require Firefox
   142+).

The patch is a deterministic literal-string replacement, so reproducible
builds are preserved. Each clean build produces byte-identical output.

## Verifying the build

```bash
md5sum lens-bundle.js
# Expected: 50bca2e115e840f6e6a930d16497a4b3
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

## What `patch-bundle.js` does

A small Node.js script (~30 lines, no dependencies) that reads
`lens-bundle.js`, replaces every occurrence of the literal string
`Function("return this")()` with `globalThis`, and writes the file back.
The script is deterministic and idempotent (running it twice on a fresh
build produces an error on the second run because no occurrences remain
to replace).

The replaced code originates in `google-protobuf`'s generated message
modules. Each module begins with the legacy global-object-finder idiom:

```javascript
var d = typeof globalThis < "u" && globalThis
     || typeof window < "u" && window
     || typeof d < "u" && d
     || typeof self < "u" && self
     || function() { return this; }.call(null)
     || Function("return this")();
```

In any environment that defines `globalThis` (every browser since 2020),
the first branch evaluates truthy and the rest is dead code. Since this
extension requires Firefox 140+, the `Function`-constructor branch is
guaranteed unreachable.
