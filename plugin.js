const STARTUP_ERROR_PREFIX = "[Degrande Colors] Failed to start";
const FALLBACK_PLUGIN_VERSION = "0.4.37";
const MAIN_SCRIPT_DATA_ATTRIBUTE = "data-degrande-colors-main";
let pluginStartupPromise = null;

function getPluginVersion() {
  return document
    .querySelector('meta[name="degrande-colors-version"]')
    ?.getAttribute("content")
    || FALLBACK_PLUGIN_VERSION;
}

function loadMainScript(moduleUrl, version) {
  const existingScript = document.querySelector(`script[${MAIN_SCRIPT_DATA_ATTRIBUTE}="${version}"]`);

  if (existingScript) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = moduleUrl;
    script.async = true;
    script.setAttribute(MAIN_SCRIPT_DATA_ATTRIBUTE, version);
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error(`Unable to load ${moduleUrl}`)), { once: true });
    document.head.appendChild(script);
  });
}

function startDegrandeColors() {
  if (pluginStartupPromise) {
    return;
  }

  const version = getPluginVersion();
  const resourcePath = `plugin-main.js?v=${encodeURIComponent(version)}`;

  pluginStartupPromise = Promise.resolve()
    .then(async () => {
      const moduleUrl = typeof logseq.resolveResourceFullUrl === "function"
        ? logseq.resolveResourceFullUrl(resourcePath)
        : `./${resourcePath}`;
      await loadMainScript(moduleUrl, version);
      const pluginMain = window.__degrandeColorsMain;

      if (typeof pluginMain !== "function") {
        throw new Error("plugin-main.js did not register window.__degrandeColorsMain()");
      }

      await pluginMain();
    })
    .catch((error) => {
      pluginStartupPromise = null;
      console.error(STARTUP_ERROR_PREFIX, error);
    });
}

logseq.ready(() => {
  startDegrandeColors();
}).catch((error) => {
  console.error(STARTUP_ERROR_PREFIX, error);
});
