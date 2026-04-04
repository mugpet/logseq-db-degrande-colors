const STARTUP_ERROR_PREFIX = "[Degrande Colors] Failed to start";
const FALLBACK_PLUGIN_VERSION = "0.1.6";
let pluginStartupPromise = null;

function getPluginVersion() {
  return document
    .querySelector('meta[name="degrande-colors-version"]')
    ?.getAttribute("content")
    || FALLBACK_PLUGIN_VERSION;
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
      const pluginModule = await import(moduleUrl);

      if (typeof pluginModule?.main !== "function") {
        throw new Error("plugin-main.js does not export main()");
      }

      await pluginModule.main();
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
