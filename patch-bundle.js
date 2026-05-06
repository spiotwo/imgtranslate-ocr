#!/usr/bin/env node
// patch-bundle.js
//
// Post-build patch for lens-bundle.js.
//
// The bundled google-protobuf library uses the legacy global-object-finder
// idiom `Function("return this")()` as a fallback in environments without
// `globalThis`, `window`, or `self`. This is dead code in any modern
// browser, but Mozilla's add-on validator does static analysis and flags
// every Function-constructor call as a potential security issue.
//
// We require Firefox 140+ (where `globalThis` is universally available),
// so the fallback is unreachable. This script replaces the dead code
// with `globalThis` directly. There are 24 occurrences across the protobuf
// message modules — all identical.
//
// This is a deterministic source transformation: applying it to a fresh
// build always produces the same output bytes, so reproducible builds are
// preserved (`npm ci && npm run build` still produces a matching bundle).

const fs = require("fs");
const path = require("path");

const BUNDLE = path.join(__dirname, "lens-bundle.js");
const NEEDLE = 'Function("return this")()';
const REPLACEMENT = "globalThis";

const before = fs.readFileSync(BUNDLE, "utf8");
const occurrences = before.split(NEEDLE).length - 1;

if (occurrences === 0) {
  console.error(
    "patch-bundle: no occurrences of Function constructor found.\n" +
    "Either the bundle has changed shape (re-check this script) or it " +
    "was already patched."
  );
  process.exit(1);
}

const after = before.split(NEEDLE).join(REPLACEMENT);
fs.writeFileSync(BUNDLE, after);

console.log(
  `patch-bundle: replaced ${occurrences} Function-constructor call(s) ` +
  `with globalThis in lens-bundle.js`
);
