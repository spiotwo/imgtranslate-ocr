const targetLangEl = document.getElementById("targetLang");
const showIconEl = document.getElementById("showSelectionIcon");
const statusEl = document.getElementById("status");

const DEFAULTS = { targetLang: "en", showSelectionIcon: true };

async function load() {
  const stored = await browser.storage.local.get(DEFAULTS);
  targetLangEl.value = stored.targetLang || DEFAULTS.targetLang;
  showIconEl.checked = stored.showSelectionIcon !== false;
}

function save() {
  browser.storage.local.set({
    targetLang: targetLangEl.value,
    showSelectionIcon: showIconEl.checked
  }).then(() => {
    statusEl.textContent = "Saved";
    setTimeout(() => { statusEl.textContent = ""; }, 1200);
  });
}

targetLangEl.addEventListener("change", save);
showIconEl.addEventListener("change", save);
load();
