// background.js — context menu, webRequest header injection, image fetcher.
//
// Two responsibilities:
//   1. Route the right-click "Translate" menu item to the right place.
//   2. When the content script can't extract image bytes from the page DOM
//      (canvas tainted by cross-origin without CORS — pixiv, gelbooru, etc.)
//      fetch the image here in the background. Background fetches have
//      cross-origin read access via host_permissions=<all_urls>, AND we use
//      a webRequest blocking listener to inject the right Referer header.
//      That bypasses hotlink protection without the CORS issues that come
//      with content-script fetches.

// ---------------------------------------------------------------------------
// Context menu
// ---------------------------------------------------------------------------

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "translate",
    title: "Translate",
    contexts: ["image", "selection"]
  });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "translate") return;

  const settings = await browser.storage.local.get({ targetLang: "en" });
  const targetLang = settings.targetLang || "en";

  if (info.mediaType === "image" && info.srcUrl) {
    const tabId = tab && tab.id != null ? tab.id : "";
    const popupUrl = browser.runtime.getURL("popup.html") +
      `?src=${encodeURIComponent(info.srcUrl)}` +
      `&tl=${encodeURIComponent(targetLang)}` +
      `&tab=${encodeURIComponent(tabId)}`;
    await browser.windows.create({
      url: popupUrl,
      type: "popup",
      width: 1100,
      height: 850
    });
    return;
  }

  if (info.selectionText && tab && tab.id) {
    try {
      await browser.tabs.sendMessage(tab.id, {
        action: "showTranslation",
        text: info.selectionText,
        targetLang
      });
    } catch (e) {
      const fallbackUrl = browser.runtime.getURL("popup.html") +
        `?text=${encodeURIComponent(info.selectionText)}&tl=${encodeURIComponent(targetLang)}`;
      await browser.windows.create({
        url: fallbackUrl,
        type: "popup",
        width: 480,
        height: 320
      });
    }
  }
});

// ---------------------------------------------------------------------------
// Referer injection via webRequest
// ---------------------------------------------------------------------------
//
// pendingReferers holds (URL → Referer to inject) entries set by the
// fetchImageWithReferer handler before it issues fetch(). The webRequest
// listener pops the entry when the request fires and rewrites the Referer
// header on the wire. The browser would normally refuse to let us set
// Referer through fetch's headers (it's a "forbidden header"), but
// webRequest blocking is allowed to mutate it.

const pendingReferers = new Map();

browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const referer = pendingReferers.get(details.url);
    if (!referer) return; // Not one of our requests
    pendingReferers.delete(details.url);

    // Strip any existing Referer, then add ours.
    const headers = (details.requestHeaders || [])
      .filter(h => h.name.toLowerCase() !== "referer");
    headers.push({ name: "Referer", value: referer });
    return { requestHeaders: headers };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// ---------------------------------------------------------------------------
// Image fetch helper (called by content script as fallback)
// ---------------------------------------------------------------------------

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function mimeFromUrl(url) {
  const m = url.toLowerCase().match(/\.(png|jpe?g|webp|gif|bmp|tiff)(?:\?|#|$)/);
  if (!m) return "image/jpeg";
  const ext = m[1] === "jpg" ? "jpeg" : m[1] === "tif" ? "tiff" : m[1];
  return `image/${ext}`;
}

browser.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.action !== "fetchImageWithReferer" || !msg.url) return;

  // IMPORTANT: return a Promise (not async-function shorthand) so the message
  // channel knows we'll respond. Returning the result of an async IIFE works.
  return (async () => {
    pendingReferers.set(msg.url, msg.referer || "");
    try {
      // Background fetches run in the extension origin; with
      // host_permissions=<all_urls>, cross-origin responses are readable.
      // The webRequest listener above has already queued the Referer override.
      const res = await fetch(msg.url, { credentials: "include" });
      pendingReferers.delete(msg.url);

      if (!res.ok) {
        return { ok: false, status: res.status, error: `HTTP ${res.status}` };
      }
      const buf = await res.arrayBuffer();
      const ct = res.headers.get("content-type") || "";
      // Reject obvious non-image responses (HTML anti-hotlink pages, etc.)
      if (ct && !ct.startsWith("image/") && !ct.startsWith("application/octet-stream")) {
        return { ok: false, status: res.status,
                 error: `non-image response: ${ct}` };
      }
      return {
        ok: true,
        status: res.status,
        base64: arrayBufferToBase64(buf),
        mime: ct || mimeFromUrl(msg.url),
        length: buf.byteLength,
        method: "background-fetch+referer"
      };
    } catch (e) {
      pendingReferers.delete(msg.url);
      return { ok: false, error: e.message };
    }
  })();
});
