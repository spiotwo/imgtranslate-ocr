// popup.js
// Two modes:
//   1. ?src=<image_url> -> OCR + translate + danbooru-style hover overlays.
//   2. ?text=<text>     -> simple text translation (fallback when content
//                          script couldn't run on the source page).
//
// Image flow:
//   1. Fetch image bytes -> render <img>.
//   2. Run Google Lens (chrome-lens-ocr bundle) -> get array of segments
//      (one per detected line) with text + pixel bounding box.
//   3. Group spatially-related lines via union-find (proximity + alignment).
//      Each group becomes one note overlay covering the group's combined
//      bounding box.
//   4. Translate the combined text of each group with sl=auto, so the
//      translate API auto-detects per group (handles mixed languages).
//   5. Render hover boxes; tooltip on hover shows the original + translated
//      text for the whole group.

const params = new URLSearchParams(location.search);
const SRC_URL = params.get("src") || "";
const TEXT_INPUT = params.get("text") || "";
const TARGET_LANG = params.get("tl") || "en";
const TAB_ID = (() => {
  const v = params.get("tab");
  if (v == null || v === "") return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
})();

const statusEl = document.getElementById("status");
const stageEl = document.getElementById("stage");
const imgEl = document.getElementById("img");
const notesEl = document.getElementById("notes");
const tooltipEl = document.getElementById("tooltip");
const segmentsEl = document.getElementById("segments");
const segListEl = document.getElementById("segList");
const toggleEl = document.getElementById("toggleNotes");
const copyBtn = document.getElementById("copyAll");

const textFallback = document.getElementById("textFallback");
const textHeader = document.getElementById("textHeader");
const textOrig = document.getElementById("textOrig");
const textResult = document.getElementById("textResult");

function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = kind || "";
}

toggleEl.addEventListener("change", () => {
  notesEl.style.display = toggleEl.checked ? "" : "none";
  hideTooltip();
});

let allTranslations = [];
copyBtn.addEventListener("click", async () => {
  if (!allTranslations.length) return;
  await navigator.clipboard.writeText(allTranslations.join("\n\n"));
  copyBtn.textContent = "Copied!";
  setTimeout(() => { copyBtn.textContent = "Copy text"; }, 1200);
});

// ---------------------------------------------------------------------------
// Translation API — same shape as sienori/simple-translate.
// sl=auto so the endpoint auto-detects per call (multi-language images).
// ---------------------------------------------------------------------------
async function translateText(text, targetLang) {
  if (!text || !text.trim()) return { translated: "", detectedSrc: "" };
  const url =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}` +
    `&dt=t&dj=1&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translate API ${res.status}`);
  const data = await res.json();
  const translated = (data.sentences || []).map(s => s.trans || "").join("");
  return { translated, detectedSrc: data.src || "auto" };
}

// ---------------------------------------------------------------------------
// Grouping: union-find on bounding boxes by orientation + proximity.
// Returns groups; each group has combined bbox, ordered text, member segments.
// ---------------------------------------------------------------------------

// Classify a single bbox as horizontal-text, vertical-text, or ambiguous.
// Heuristic only — based on aspect ratio of the bounding box, which is the
// standard signal used by manga OCR pipelines.
function orientationOf(c) {
  if (c.height === 0) return "horizontal";
  const ar = c.width / c.height;
  if (ar > 1.3) return "horizontal";
  if (ar < 0.7) return "vertical";
  return "ambiguous";
}

// Whether two bounding boxes should merge into the same logical group.
// Two lines group when: same orientation (or one is ambiguous) AND
// their gap on the across-flow axis is at most ~1.0× line size AND
// they overlap meaningfully on the along-flow axis.
function shouldGroup(a, b) {
  const oa = orientationOf(a);
  const ob = orientationOf(b);
  if (oa !== "ambiguous" && ob !== "ambiguous" && oa !== ob) return false;
  const orient =
    (oa !== "ambiguous") ? oa :
    (ob !== "ambiguous") ? ob : "horizontal";

  if (orient === "horizontal") {
    // Lines stack vertically; check vertical gap and horizontal overlap.
    const avgH = (a.height + b.height) / 2;
    const aBottom = a.y + a.height, bBottom = b.y + b.height;
    const vGap = Math.max(0, Math.max(a.y, b.y) - Math.min(aBottom, bBottom));
    if (vGap > 1.0 * avgH) return false;

    const hOverlap = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const minW = Math.min(a.width, b.width);
    // Either: lines overlap horizontally a fair bit, OR
    //          their centers are close (justified text in a narrow column)
    const centerXDiff = Math.abs((a.x + a.width / 2) - (b.x + b.width / 2));
    if (hOverlap >= 0.3 * minW) return true;
    if (centerXDiff <= 0.5 * Math.max(a.width, b.width)) return true;
    return false;
  } else {
    // Vertical text — columns stack horizontally; mirror the logic.
    const avgW = (a.width + b.width) / 2;
    const aRight = a.x + a.width, bRight = b.x + b.width;
    const hGap = Math.max(0, Math.max(a.x, b.x) - Math.min(aRight, bRight));
    if (hGap > 1.0 * avgW) return false;

    const vOverlap = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    const minH = Math.min(a.height, b.height);
    const centerYDiff = Math.abs((a.y + a.height / 2) - (b.y + b.height / 2));
    if (vOverlap >= 0.3 * minH) return true;
    if (centerYDiff <= 0.5 * Math.max(a.height, b.height)) return true;
    return false;
  }
}

function unionFindGroup(segments) {
  const n = segments.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (i) => {
    while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; }
    return i;
  };
  const union = (i, j) => {
    const pi = find(i), pj = find(j);
    if (pi !== pj) parent[pi] = pj;
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (shouldGroup(segments[i].boundingBox.pixelCoords,
                      segments[j].boundingBox.pixelCoords)) {
        union(i, j);
      }
    }
  }

  const buckets = new Map();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if (!buckets.has(root)) buckets.set(root, []);
    buckets.get(root).push(segments[i]);
  }
  return Array.from(buckets.values());
}

// Determine an overall reading orientation for a group and order its members.
// For vertical text we order columns right-to-left (Japanese convention);
// horizontal text orders top-to-bottom, left-to-right within rows.
function orderGroupMembers(group) {
  let hCount = 0, vCount = 0;
  for (const s of group) {
    const o = orientationOf(s.boundingBox.pixelCoords);
    if (o === "horizontal") hCount++;
    else if (o === "vertical") vCount++;
  }
  const orient = vCount > hCount ? "vertical" : "horizontal";

  if (orient === "vertical") {
    // Columns right-to-left, then top-to-bottom within each column. Since
    // each line is itself one column-segment here, just sort by x descending.
    group.sort((a, b) => {
      const ax = a.boundingBox.pixelCoords.x, bx = b.boundingBox.pixelCoords.x;
      if (Math.abs(ax - bx) > 8) return bx - ax;  // right first
      return a.boundingBox.pixelCoords.y - b.boundingBox.pixelCoords.y;
    });
  } else {
    // Top-to-bottom; within roughly-equal y, left-to-right.
    group.sort((a, b) => {
      const ay = a.boundingBox.pixelCoords.y, by = b.boundingBox.pixelCoords.y;
      if (Math.abs(ay - by) > 8) return ay - by;
      return a.boundingBox.pixelCoords.x - b.boundingBox.pixelCoords.x;
    });
  }
  return { orient, members: group };
}

function groupBoundingBox(group) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of group) {
    const c = s.boundingBox.pixelCoords;
    if (c.x < minX) minX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.x + c.width > maxX) maxX = c.x + c.width;
    if (c.y + c.height > maxY) maxY = c.y + c.height;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

// ---------------------------------------------------------------------------
// Image / IO helpers
// ---------------------------------------------------------------------------
function mimeFromUrl(url) {
  const m = url.toLowerCase().match(/\.(png|jpe?g|webp|gif|bmp|tiff)(?:\?|#|$)/);
  if (!m) return "image/jpeg";
  const ext = m[1] === "jpg" ? "jpeg" : m[1] === "tif" ? "tiff" : m[1];
  return `image/${ext}`;
}

// base64 -> Uint8Array
function base64ToUint8(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Try fetching the image via the content script in the originating tab so
// the request carries the page's natural Referer (this is what bypasses
// hotlink protection on pixiv, gelbooru, etc.). If that fails for any reason
// (no tab id, content script not loaded, message error), fall back to a
// direct fetch from this popup. Most images don't care about Referer and
// the direct fetch works fine for them.
async function fetchImage(url) {
  if (TAB_ID != null) {
    try {
      const resp = await browser.tabs.sendMessage(TAB_ID, {
        action: "fetchImage",
        url
      });
      if (resp && resp.ok) {
        return {
          bytes: base64ToUint8(resp.base64),
          mime: resp.mime || mimeFromUrl(url)
        };
      }
      // Content script reachable but fetch failed there — surface the error
      // rather than retry, since direct fetch from extension origin will
      // almost certainly fail the same way (different reasons, same outcome).
      if (resp && resp.error) {
        throw new Error(resp.error + " (via page)");
      }
    } catch (e) {
      // sendMessage failed (tab gone, no content script) — fall through.
      console.warn("Content-script fetch failed, falling back:", e.message);
    }
  }

  // Fallback: direct fetch from extension origin.
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
  const buf = await res.arrayBuffer();
  return { bytes: new Uint8Array(buf), mime: res.headers.get("content-type") || mimeFromUrl(url) };
}

function loadImageElement(uint8, mime) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([uint8], { type: mime });
    const objUrl = URL.createObjectURL(blob);
    imgEl.onload = () => resolve({ width: imgEl.naturalWidth, height: imgEl.naturalHeight });
    imgEl.onerror = () => reject(new Error("Image failed to render"));
    imgEl.src = objUrl;
  });
}

// ---------------------------------------------------------------------------
// Rendering: one note box per group; tooltip on hover
// ---------------------------------------------------------------------------

function showTooltip(box, original, translated) {
  // Build content
  tooltipEl.innerHTML = "";
  const src = document.createElement("div");
  src.className = "src";
  src.textContent = original;
  const main = document.createElement("div");
  main.textContent = translated || "(no translation)";
  tooltipEl.append(src, main);

  // Reset before measuring so size is correct
  tooltipEl.hidden = false;
  tooltipEl.style.left = "0px";
  tooltipEl.style.top = "0px";

  // Position: prefer below the box. If overflow, flip above. Clamp to stage.
  const stageRect = stageEl.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
  const ttW = tooltipEl.offsetWidth;
  const ttH = tooltipEl.offsetHeight;

  // Coordinates relative to stage (since tooltip is inside stage).
  let left = boxRect.left - stageRect.left;
  let top = boxRect.bottom - stageRect.top + 4;

  if (top + ttH > stageRect.height && (boxRect.top - stageRect.top) - ttH - 4 > 0) {
    top = (boxRect.top - stageRect.top) - ttH - 4;
  }
  if (left + ttW > stageRect.width) left = stageRect.width - ttW - 2;
  if (left < 2) left = 2;

  tooltipEl.style.left = left + "px";
  tooltipEl.style.top = top + "px";
}

function hideTooltip() {
  tooltipEl.hidden = true;
}

function renderGroups(groups, translations, naturalW, naturalH) {
  notesEl.innerHTML = "";
  for (let i = 0; i < groups.length; i++) {
    const { combinedBbox, combinedText } = groups[i];
    const t = translations[i] || "";

    const box = document.createElement("div");
    box.className = "imgtr-note-box";
    box.style.left = (combinedBbox.x / naturalW * 100) + "%";
    box.style.top = (combinedBbox.y / naturalH * 100) + "%";
    box.style.width = (combinedBbox.width / naturalW * 100) + "%";
    box.style.height = (combinedBbox.height / naturalH * 100) + "%";

    box.addEventListener("mouseenter", () => showTooltip(box, combinedText, t));
    box.addEventListener("mouseleave", hideTooltip);

    notesEl.appendChild(box);
  }
}

function renderGroupList(groups, translations) {
  if (!groups.length) {
    segmentsEl.hidden = true;
    return;
  }
  segListEl.innerHTML = "";
  for (let i = 0; i < groups.length; i++) {
    const li = document.createElement("li");
    const src = document.createElement("div");
    src.className = "src";
    src.textContent = groups[i].combinedText;
    const tr = document.createElement("div");
    tr.textContent = translations[i] || "";
    li.append(src, tr);
    segListEl.appendChild(li);
  }
  segmentsEl.hidden = false;
}

// Concurrency limiter so we don't fire 50 translate calls at once.
async function mapConcurrent(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      try { out[idx] = await fn(items[idx], idx); }
      catch (e) { out[idx] = ""; console.error("worker error:", e); }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return out;
}

// ---------------------------------------------------------------------------
// Image entrypoint
// ---------------------------------------------------------------------------
async function runImage() {
  if (!window.LensCore) {
    setStatus("Lens bundle failed to load", "error");
    return;
  }
  try {
    setStatus("Fetching image…");
    const { bytes: uint8, mime } = await fetchImage(SRC_URL);
    const { width, height } = await loadImageElement(uint8, mime);

    setStatus("Running OCR via Google Lens…");
    const lens = new LensCore({ targetLanguage: TARGET_LANG });
    const result = await lens.scanByData(uint8, mime, [width, height]);

    if (!result.segments || !result.segments.length) {
      setStatus("No text detected", "done");
      return;
    }

    setStatus(`Grouping ${result.segments.length} lines…`);
    const rawGroups = unionFindGroup(result.segments);

    // Build group objects with combined bbox + ordered text.
    //
    // CRITICAL: join with a space, NOT a newline. The translate_a/single
    // endpoint treats newlines as hard sentence boundaries — it splits the
    // input on \n, returns one entry in `sentences[]` per chunk, and
    // translates each chunk in isolation. Joining with \n therefore defeats
    // the whole point of grouping: each OCR line gets translated alone, then
    // we concatenate the results, identical to translating per line.
    //
    // With spaces, the API sees one continuous string and decides sentence
    // boundaries from actual punctuation in the content, so a group that
    // represents a single sentence wrapped across OCR lines is translated
    // as one sentence, with full cross-line context.
    //
    // For Japanese vertical text the same logic applies — Google Translate
    // tolerates spaces between Japanese characters fine.
    const groups = rawGroups.map(rawGroup => {
      const { orient, members } = orderGroupMembers(rawGroup);
      const combinedBbox = groupBoundingBox(members);
      const combinedText = members
        .map(m => m.text.trim())
        .filter(Boolean)
        .join(" ");
      return { members, combinedBbox, combinedText, orient };
    });

    setStatus(`Translating ${groups.length} groups…`);
    const translations = await mapConcurrent(groups, 5, async (g) => {
      const r = await translateText(g.combinedText, TARGET_LANG);
      return r.translated;
    });

    allTranslations = translations.filter(Boolean);
    renderGroups(groups, translations, width, height);
    renderGroupList(groups, translations);
    setStatus(`Done — ${result.segments.length} lines in ${groups.length} groups → ${TARGET_LANG}`, "done");
  } catch (err) {
    console.error(err);
    setStatus("Error: " + err.message, "error");
  }
}

// ---------------------------------------------------------------------------
// Text-fallback entrypoint (used only when content script couldn't run)
// ---------------------------------------------------------------------------
async function runText() {
  // Hide image-flow UI; show text-flow UI.
  document.querySelector("header").style.display = "none";
  stageEl.style.display = "none";
  textFallback.hidden = false;

  textOrig.textContent = TEXT_INPUT;
  try {
    const r = await translateText(TEXT_INPUT, TARGET_LANG);
    textResult.textContent = r.translated || "(no translation)";
    textHeader.textContent = `${r.detectedSrc || "auto"} → ${TARGET_LANG}`;
  } catch (e) {
    textResult.textContent = "Error: " + e.message;
    textResult.style.color = "#c00";
  }
}

// Reposition tooltip on resize so it tracks the box.
window.addEventListener("resize", hideTooltip);

if (SRC_URL) runImage();
else if (TEXT_INPUT) runText();
else setStatus("No input", "error");
