// content.js — runs on every page.
//
// Three responsibilities:
//   1. Show a small floating "translate" icon near a fresh text selection.
//      Click the icon → translate selection → show panel inline.
//   2. Handle right-click "Translate" on selection (message from background).
//      Both paths funnel into the same showPanel() function.
//   3. Proxy image fetches for the popup window. The popup itself runs in the
//      extension origin, so when it fetches a hotlink-protected image
//      (pixiv, gelbooru) the server rejects it for missing/wrong Referer.
//      Fetching from the content script uses the page's natural Referer,
//      which the image host already accepts (the same image rendered fine
//      on the page).

(function () {
  const PANEL_ID  = "__imgtr_selection_panel__";
  const ICON_ID   = "__imgtr_selection_icon__";

  const DEFAULTS = {
    targetLang: "en",
    showSelectionIcon: true
  };

  let lastAnchor = null;
  let pendingIcon = null;     // setTimeout handle, while waiting to show icon
  let iconClickedText = "";   // captured at icon-creation time

  // ---------------------------------------------------------------------------
  // Translate API — same shape as sienori/simple-translate.
  // ---------------------------------------------------------------------------
  async function translate(text, targetLang) {
    const url =
      "https://translate.googleapis.com/translate_a/single" +
      `?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}` +
      `&dt=t&dj=1&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      translated: (data.sentences || []).map(s => s.trans || "").join(""),
      detectedSrc: data.src || "auto"
    };
  }

  // ---------------------------------------------------------------------------
  // Inline panel
  // ---------------------------------------------------------------------------
  function removePanel() {
    const old = document.getElementById(PANEL_ID);
    if (old) old.remove();
    document.removeEventListener("mousedown", outsideClickHandler, true);
    window.removeEventListener("scroll", repositionHandler, true);
    window.removeEventListener("resize", repositionHandler);
  }

  function outsideClickHandler(e) {
    const panel = document.getElementById(PANEL_ID);
    if (panel && !panel.contains(e.target)) removePanel();
  }

  function repositionHandler() {
    const panel = document.getElementById(PANEL_ID);
    if (panel && lastAnchor) positionPanel(panel, lastAnchor);
  }

  function positionPanel(panel, anchor) {
    const margin = 6;
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = anchor.left;
    let top  = anchor.bottom + margin;

    if (top + ph > vh - 4 && anchor.top - margin - ph > 4) {
      top = anchor.top - margin - ph;
    }
    if (left + pw > vw - 4) left = vw - pw - 4;
    if (left < 4) left = 4;

    panel.style.left = (left + window.scrollX) + "px";
    panel.style.top  = (top  + window.scrollY) + "px";
  }

  function buildPanel(text, targetLang) {
    removePanel();

    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.className = "imgtr-panel";

    const header = document.createElement("div");
    header.className = "imgtr-panel-header";
    const title = document.createElement("span");
    title.className = "imgtr-panel-title";
    title.textContent = `→ ${targetLang}`;
    const closeBtn = document.createElement("button");
    closeBtn.className = "imgtr-panel-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", removePanel);
    header.append(title, closeBtn);

    const orig = document.createElement("div");
    orig.className = "imgtr-panel-orig";
    orig.textContent = text;

    const result = document.createElement("div");
    result.className = "imgtr-panel-result";
    result.textContent = "Translating…";

    panel.append(header, orig, result);
    document.body.appendChild(panel);

    panel.addEventListener("mousedown", e => e.stopPropagation());
    return { panel, result };
  }

  // Position panel near `anchor` (DOMRect). If anchor is null, center it.
  async function showPanel(text, targetLang, anchor) {
    if (!anchor) {
      anchor = {
        left: window.innerWidth / 2 - 100,
        top:  window.innerHeight / 2,
        right: window.innerWidth / 2 + 100,
        bottom: window.innerHeight / 2,
        width: 200, height: 0
      };
    }
    lastAnchor = anchor;
    const { panel, result } = buildPanel(text, targetLang);
    positionPanel(panel, anchor);

    try {
      const { translated, detectedSrc } = await translate(text, targetLang);
      result.textContent = translated || "(no translation)";
      const titleEl = panel.querySelector(".imgtr-panel-title");
      if (titleEl) titleEl.textContent = `${detectedSrc} → ${targetLang}`;
    } catch (e) {
      result.textContent = "Error: " + e.message;
      result.classList.add("imgtr-error");
    }
    positionPanel(panel, anchor);

    document.addEventListener("mousedown", outsideClickHandler, true);
    window.addEventListener("scroll", repositionHandler, true);
    window.addEventListener("resize", repositionHandler);
  }

  // ---------------------------------------------------------------------------
  // Selection icon
  // ---------------------------------------------------------------------------

  function removeIcon() {
    if (pendingIcon) { clearTimeout(pendingIcon); pendingIcon = null; }
    const old = document.getElementById(ICON_ID);
    if (old) old.remove();
  }

  // Position icon at the bottom-right of the *last line* of the selection
  // (so it sits at the natural "end" rather than middle for multi-line).
  function getEndOfSelectionPoint(sel) {
    if (!sel.rangeCount) return null;
    const range = sel.getRangeAt(0);
    const rects = range.getClientRects();
    if (!rects || rects.length === 0) {
      const r = range.getBoundingClientRect();
      if (!r || (r.width === 0 && r.height === 0)) return null;
      return { x: r.right, y: r.bottom };
    }
    const last = rects[rects.length - 1];
    return { x: last.right, y: last.bottom };
  }

  function showIcon(text, point) {
    removeIcon();
    const icon = document.createElement("div");
    icon.id = ICON_ID;
    icon.className = "imgtr-selection-icon";
    icon.setAttribute("role", "button");
    icon.setAttribute("aria-label", "Translate selection");
    icon.title = "Translate selection";

    // Translation glyph (SVG). Inlined so host page CSS can't restyle it.
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M5 8h7M5 4h11M9 4v4M5 14c0 0 2-3 5-3s4 2 5 4 1 4 1 4M11 14h6"/>' +
      '<path d="M16 14l4 8M20 14l-4 8"/>' +
      '</svg>';

    icon.style.left = (point.x + window.scrollX + 4) + "px";
    icon.style.top  = (point.y + window.scrollY + 2) + "px";

    iconClickedText = text;

    icon.addEventListener("mousedown", e => {
      // Don't lose the page selection or trigger outside-click teardown.
      e.preventDefault();
      e.stopPropagation();
    });
    icon.addEventListener("click", async (e) => {
      e.stopPropagation();
      const settings = await browser.storage.local.get(DEFAULTS);
      const targetLang = settings.targetLang || "en";

      // Snapshot anchor before dismissing the icon.
      const sel = window.getSelection();
      let anchor = null;
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        anchor = sel.getRangeAt(0).getBoundingClientRect();
      }
      removeIcon();
      showPanel(iconClickedText, targetLang, anchor);
    });

    document.body.appendChild(icon);
  }

  // mouseup: schedule icon if there's a non-trivial selection.
  document.addEventListener("mouseup", async (e) => {
    if (e.target && e.target.closest && (
      e.target.closest("#" + PANEL_ID) || e.target.closest("#" + ICON_ID)
    )) return;

    if (pendingIcon) { clearTimeout(pendingIcon); pendingIcon = null; }

    // Small delay: lets the browser finalize the selection, and avoids
    // flicker on quick double-click word selection.
    pendingIcon = setTimeout(async () => {
      pendingIcon = null;
      const settings = await browser.storage.local.get(DEFAULTS);
      if (settings.showSelectionIcon === false) return;

      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : "";
      if (!text || text.length < 2) {
        removeIcon();
        return;
      }
      const point = getEndOfSelectionPoint(sel);
      if (!point) { removeIcon(); return; }
      showIcon(text, point);
    }, 250);
  });

  // mousedown elsewhere → dismiss icon (and panel via outsideClickHandler).
  document.addEventListener("mousedown", (e) => {
    const t = e.target;
    if (t && t.closest && (t.closest("#" + ICON_ID) || t.closest("#" + PANEL_ID))) return;
    removeIcon();
  });

  // Selection going away (Esc key, programmatic) → tear down the icon.
  document.addEventListener("selectionchange", () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setTimeout(() => {
        const s = window.getSelection();
        if (!s || s.isCollapsed) removeIcon();
      }, 50);
    }
  });

  // ---------------------------------------------------------------------------
  // Background → content messages
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Image extraction
  // ---------------------------------------------------------------------------

  // Strategy 1: read bytes from the loaded <img> via canvas. No network call.
  // Works for same-origin images and CORS-enabled cross-origin images.
  // Fails (returns null) if the canvas is tainted (cross-origin without CORS),
  // which is exactly the case for hotlink-protected hosts (pixiv, gelbooru).
  function tryCanvasExtraction(url) {
    // Find the matching <img>. Try direct src/currentSrc match first, then
    // fall back to a relaxed match that ignores the query string (some CDNs
    // append timestamps that may differ).
    const candidates = document.querySelectorAll("img");
    let target = null;
    const baseUrl = url.split("?")[0].split("#")[0];
    for (const img of candidates) {
      if (img.src === url || img.currentSrc === url) { target = img; break; }
    }
    if (!target) {
      for (const img of candidates) {
        const s = (img.currentSrc || img.src || "").split("?")[0].split("#")[0];
        if (s === baseUrl) { target = img; break; }
      }
    }
    if (!target) return null;
    if (!target.complete || target.naturalWidth === 0) return null;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = target.naturalWidth;
      canvas.height = target.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(target, 0, 0);

      // toDataURL throws SecurityError if canvas is tainted. Try it first
      // (synchronous and lets us fail fast without an async toBlob roundtrip).
      const dataUrl = canvas.toDataURL("image/png");
      // dataUrl is "data:image/png;base64,XXXX"
      const commaIdx = dataUrl.indexOf(",");
      if (commaIdx === -1) return null;
      const base64 = dataUrl.slice(commaIdx + 1);
      return {
        ok: true,
        base64,
        mime: "image/png",
        method: "canvas"
      };
    } catch (e) {
      // SecurityError → tainted canvas. Cross-origin without CORS.
      console.log("[imgtr] Canvas extraction failed (likely tainted):", e.message);
      return null;
    }
  }

  // Strategy 2: ask the background to fetch with Referer injection. Background
  // is in extension origin (cross-origin reads OK with host_permissions) and
  // uses webRequest.onBeforeSendHeaders to set the Referer header — which
  // fetch() itself isn't allowed to set (it's a forbidden header).
  async function tryBackgroundFetch(url) {
    try {
      const resp = await browser.runtime.sendMessage({
        action: "fetchImageWithReferer",
        url,
        referer: location.href
      });
      return resp || { ok: false, error: "no response from background" };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  browser.runtime.onMessage.addListener((msg) => {
    if (!msg) return;

    if (msg.action === "showTranslation") {
      const { text, targetLang } = msg;
      const sel = window.getSelection();
      let anchor = null;
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        anchor = sel.getRangeAt(0).getBoundingClientRect();
      }
      removeIcon();
      showPanel(text, targetLang, anchor);
      return; // No response needed
    }

    if (msg.action === "fetchImage" && msg.url) {
      // Return a Promise so the message channel waits for our response.
      return (async () => {
        // Strategy 1: canvas extraction (uses already-loaded bytes)
        const fromCanvas = tryCanvasExtraction(msg.url);
        if (fromCanvas) return fromCanvas;

        // Strategy 2: background fetch with Referer injection
        return await tryBackgroundFetch(msg.url);
      })();
    }
  });
})();
