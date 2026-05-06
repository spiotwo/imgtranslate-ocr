# Third-Party Licenses

This extension bundles the following third-party software in `lens-bundle.js`.

## @rxliuli/chrome-lens-ocr

- **Source:** https://github.com/rxliuli/chrome-lens-ocr (fork of https://github.com/dimdenGD/chrome-lens-ocr)
- **License:** ISC
- **Version bundled:** 4.1.1

```
ISC License

Copyright (c) chrome-lens-ocr contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

## Acknowledgments

The selected-text translation flow (using the unauthenticated
`translate.googleapis.com/translate_a/single` endpoint) was inspired by
[`sienori/simple-translate`](https://github.com/sienori/simple-translate).
No code from simple-translate is included in this extension; only the
public API contract was referenced.

The danbooru-style overlay box design (cream `#ffffee` background with
black border) was inspired by Danbooru's translation notes feature.
