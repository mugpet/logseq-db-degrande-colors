(() => {
const CONTROL_STORAGE_KEY = "custom-theme-loader-controls.json";
const FALLBACK_PLUGIN_VERSION = "0.1.37";
const STARTUP_SYNC_RETRY_DELAYS_MS = [1200, 4000, 9000];
const TAG_COLOR_STORAGE_KEY = "custom-theme-loader-tag-colors.json";
const GRADIENT_STORAGE_KEY = "custom-theme-loader-gradients.json";
const GRAPH_SYNC_CONFIG_KEY = "mugpet-degrande-colors";
const GRAPH_SYNC_TAG_COLOR_VERSION = 1;
const GRAPH_SYNC_STORAGE_PAGE_NAME = "mugpet-degrande-colors-sync-state";
const GRAPH_SYNC_CONTROL_PROPERTY = "mugpet_degrande_colors_controls";
const GRAPH_SYNC_GRADIENT_PROPERTY = "mugpet_degrande_colors_gradients";
const GRAPH_SYNC_TAG_COLOR_PROPERTY = "mugpet_degrande_colors_tag_colors";
const GRAPH_SYNC_REVISION_PROPERTY = "mugpet_degrande_colors_sync_revision";
const SYNC_REVISION_EVENT_NAME = "degrande:sync-revision-changed";
const SETTINGS_CONTROL_STATE_KEY = "degrandeControlState";
const SETTINGS_GRADIENT_STATE_KEY = "degrandeGradientState";
const BASE_STYLE_ELEMENT_ID = "degrande-colors-base-style";
const MANAGED_STYLE_ELEMENT_ID = "degrande-colors-managed-style";
const TOOLBAR_STYLE_ELEMENT_ID = "degrande-colors-toolbar-style";
const TOOLBAR_BUTTON_ID = "degrande-colors-toolbar-button";
const TOOLBAR_OBSERVER_KEY = "__degrandeColorsToolbarObserver";
const TOOLBAR_RENDER_TIMER_KEY = "__degrandeColorsToolbarRenderTimer";
const HOST_COLOR_SYNC_OBSERVER_KEY = "__degrandeColorsHostColorObserver";
const HOST_COLOR_SYNC_TIMER_KEY = "__degrandeColorsHostColorSyncTimer";
const PANEL_HOST_CLASS = "degrande-panel-host";
const MAIN_UI_INLINE_STYLE = {
  position: "fixed",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
  zIndex: 999,
  width: "100vw",
  height: "100vh",
  maxWidth: "100vw",
  maxHeight: "100vh",
  overflow: "hidden",
  background: "transparent",
};

function getPluginVersion() {
  return document
    .querySelector('meta[name="degrande-colors-version"]')
    ?.getAttribute("content")
    || FALLBACK_PLUGIN_VERSION;
}

const PLUGIN_VERSION = getPluginVersion();

const COLOR_PRESETS = [
  { token: "red", label: "Red", lightBg: "#fce7e7", lightBorder: "#ef4444", darkBg: "#7f1d1d", darkBorder: "#f87171", lightText: "#991b1b", darkText: "#fee2e2" },
  { token: "orange", label: "Orange", lightBg: "#fff0e1", lightBorder: "#fb923c", darkBg: "#7c2d12", darkBorder: "#fdba74", lightText: "#9a3412", darkText: "#ffedd5" },
  { token: "yellow", label: "Yellow", lightBg: "#fef9c3", lightBorder: "#eab308", darkBg: "#4d3b00", darkBorder: "#facc15", lightText: "#854d0e", darkText: "#fef08a" },
  { token: "green", label: "Green", lightBg: "#dcfce7", lightBorder: "#22c55e", darkBg: "#14532d", darkBorder: "#4ade80", lightText: "#166534", darkText: "#dcfce7" },
  { token: "teal", label: "Teal", lightBg: "#d9fbfb", lightBorder: "#14b8a6", darkBg: "#134e4a", darkBorder: "#2dd4bf", lightText: "#115e59", darkText: "#ccfbf1" },
  { token: "blue", label: "Blue", lightBg: "#dbeafe", lightBorder: "#3b82f6", darkBg: "#1e3a8a", darkBorder: "#60a5fa", lightText: "#1e40af", darkText: "#dbeafe" },
  { token: "indigo", label: "Indigo", lightBg: "#e8eaff", lightBorder: "#6366f1", darkBg: "#312e81", darkBorder: "#818cf8", lightText: "#3730a3", darkText: "#e0e7ff" },
  { token: "purple", label: "Purple", lightBg: "#f2e8ff", lightBorder: "#a855f7", darkBg: "#581c87", darkBorder: "#c084fc", lightText: "#6b21a8", darkText: "#f3e8ff" },
  { token: "pink", label: "Pink", lightBg: "#fce7f3", lightBorder: "#ec4899", darkBg: "#831843", darkBorder: "#f472b6", lightText: "#9d174d", darkText: "#fce7f3" },
  { token: "grey", label: "Grey", lightBg: "#f3f4f6", lightBorder: "#9ca3af", darkBg: "#374151", darkBorder: "#9ca3af", lightText: "#374151", darkText: "#f3f4f6" },
  { token: "mint", label: "Mint", lightBg: "#dffcf2", lightBorder: "#34d399", darkBg: "#064e3b", darkBorder: "#6ee7b7", lightText: "#065f46", darkText: "#d1fae5" },
  { token: "rose", label: "Rose", lightBg: "#ffe4e6", lightBorder: "#f43f5e", darkBg: "#881337", darkBorder: "#fb7185", lightText: "#9f1239", darkText: "#ffe4e6" },
  { token: "amber", label: "Amber", lightBg: "#fff7d6", lightBorder: "#f59e0b", darkBg: "#78350f", darkBorder: "#fbbf24", lightText: "#92400e", darkText: "#fef3c7" },
  { token: "sky", label: "Sky", lightBg: "#e0f2fe", lightBorder: "#38bdf8", darkBg: "#0c4a6e", darkBorder: "#7dd3fc", lightText: "#075985", darkText: "#e0f2fe" },
  { token: "lime", label: "Lime", lightBg: "#f1f9c9", lightBorder: "#84cc16", darkBg: "#365314", darkBorder: "#bef264", lightText: "#3f6212", darkText: "#ecfccb" },
  { token: "slate", label: "Slate", lightBg: "#e2e8f0", lightBorder: "#64748b", darkBg: "#1e293b", darkBorder: "#94a3b8", lightText: "#334155", darkText: "#e2e8f0" },
];

const COLOR_PRESET_MAP = Object.fromEntries(COLOR_PRESETS.map((preset) => [preset.token, preset]));
const TAGS_DATASCRIPT_QUERY = '[:find ?name :where [_ :block/tags ?t] [?t :block/name ?name]]';
const REFS_DATASCRIPT_QUERY = '[:find ?name :where [_ :block/refs ?p] [?p :block/name ?name]]';
const GRADIENT_AREAS = {
  node: {
    label: "Tagged Block Gradient",
    linkedLabel: "Linked Tag Color",
    previewLinkedColor: "rgba(16, 185, 129, 0.24)",
  },
  title: {
    label: "Page Title Gradient",
    linkedLabel: "Linked Tag Color",
    previewLinkedColor: "rgba(245, 158, 11, 0.24)",
  },
  quote: {
    label: "Quote Gradient",
    linkedLabel: "Quote Color",
    previewLinkedColor: "rgba(99, 102, 241, 0.18)",
  },
  background: {
    label: "Background Gradient",
    linkedLabel: "Logseq Block Color",
    previewLinkedColor: "rgba(244, 114, 182, 0.18)",
  },
};

function createDefaultGradientState() {
  return {
    node: {
      angle: 90,
      stops: [
        { source: "transparent", position: 0 },
        { source: "linked", position: 50 },
        { source: "transparent", position: 80 },
      ],
    },
    title: {
      angle: 90,
      stops: [
        { source: "transparent", position: 0 },
        { source: "linked", position: 30 },
        { source: "transparent", position: 60 },
      ],
    },
    quote: {
      angle: 130,
      stops: [
        { source: "linked", position: 0 },
        { source: "transparent", position: 40 },
        { source: "transparent", position: 70 },
        { source: "linked", position: 100 },
      ],
    },
    background: {
      angle: 170,
      stops: [
        { source: "linked", position: 0 },
        { source: "transparent", position: 30 },
        { source: "transparent", position: 80 },
        { source: "linked", position: 100 },
      ],
    },
  };
}

function cloneGradientState(state) {
  return JSON.parse(JSON.stringify(state));
}

const CONTROL_SECTIONS = [
  {
    title: "Tag Chips",
    description: "Shape and lift for inline tag pills.",
    controls: [
      { key: "tagRadius", label: "Radius", min: 0, max: 18, step: 1, unit: "px", defaultValue: 6 },
      { key: "tagFontSize", label: "Font Size", min: 9, max: 16, step: 1, unit: "px", defaultValue: 11 },
      { key: "tagHeight", label: "Height", min: 14, max: 28, step: 1, unit: "px", defaultValue: 18 },
      { key: "tagPaddingX", label: "Horizontal Padding", min: 2, max: 14, step: 1, unit: "px", defaultValue: 6 },
      { key: "tagBorderWidth", label: "Border Width", min: 0, max: 3, step: 1, unit: "px", defaultValue: 1 },
      { key: "tagHoverLift", label: "Hover Lift", min: 0, max: 4, step: 0.25, unit: "px", defaultValue: 1 },
    ],
  },
  {
    title: "Tag Block Gradients",
    description: "Sweep for tag-driven block highlights.",
    controls: [
      { key: "nodeAngle", label: "Angle", min: 0, max: 360, step: 1, unit: "deg", defaultValue: 90 },
      { key: "nodePeak", label: "Peak Position", min: 0, max: 100, step: 1, unit: "%", defaultValue: 50 },
      { key: "nodeFadeEnd", label: "Fade End", min: 10, max: 100, step: 1, unit: "%", defaultValue: 80 },
    ],
  },
  {
    title: "Page Title Gradients",
    description: "Highlight spread for page and journal titles.",
    controls: [
      { key: "titleAngle", label: "Angle", min: 0, max: 360, step: 1, unit: "deg", defaultValue: 90 },
      { key: "titlePeak", label: "Light Peak", min: 0, max: 100, step: 1, unit: "%", defaultValue: 30 },
      { key: "titleFadeEnd", label: "Light Fade End", min: 10, max: 100, step: 1, unit: "%", defaultValue: 60 },
      { key: "darkTitlePeak", label: "Dark Peak", min: 0, max: 100, step: 1, unit: "%", defaultValue: 3 },
      { key: "darkTitleFadeEnd", label: "Dark Fade End", min: 10, max: 100, step: 1, unit: "%", defaultValue: 35 },
    ],
  },
  {
    title: "Quote Gradients",
    description: "Glow, spacing, and border weight for quote blocks.",
    controls: [
      { key: "quoteAngle", label: "Angle", min: 0, max: 360, step: 1, unit: "deg", defaultValue: 130 },
      { key: "quoteClearStart", label: "Clear Start", min: 0, max: 100, step: 1, unit: "%", defaultValue: 40 },
      { key: "quoteClearEnd", label: "Clear End", min: 0, max: 100, step: 1, unit: "%", defaultValue: 70 },
      { key: "quoteLightOpacity", label: "Light Edge Opacity", min: 0, max: 0.4, step: 0.01, unit: "", defaultValue: 0.1 },
      { key: "quoteDarkOpacity", label: "Dark Edge Opacity", min: 0, max: 0.5, step: 0.01, unit: "", defaultValue: 0.15 },
      { key: "quoteBorderWidth", label: "Border Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 4 },
      { key: "quoteRadius", label: "Radius", min: 0, max: 16, step: 1, unit: "px", defaultValue: 8 },
      { key: "quotePaddingY", label: "Vertical Padding", min: 0, max: 20, step: 1, unit: "px", defaultValue: 10 },
      { key: "quotePaddingX", label: "Horizontal Padding", min: 0, max: 28, step: 1, unit: "px", defaultValue: 16 },
    ],
  },
  {
    title: "Background Blocks",
    description: "Gradient spread for regular colored block backgrounds.",
    controls: [
      { key: "bgAngle", label: "Angle", min: 0, max: 360, step: 1, unit: "deg", defaultValue: 170 },
      { key: "bgClearStart", label: "Clear Start", min: 0, max: 100, step: 1, unit: "%", defaultValue: 30 },
      { key: "bgClearEnd", label: "Clear End", min: 0, max: 100, step: 1, unit: "%", defaultValue: 80 },
      { key: "bgRadius", label: "Radius", min: 0, max: 16, step: 1, unit: "px", defaultValue: 6 },
      { key: "bgPaddingY", label: "Vertical Padding", min: 0, max: 12, step: 1, unit: "px", defaultValue: 2 },
      { key: "bgPaddingX", label: "Horizontal Padding", min: 0, max: 16, step: 1, unit: "px", defaultValue: 4 },
    ],
  },
];

const ALL_CONTROLS = CONTROL_SECTIONS.flatMap((section) => section.controls);
const CONTROL_MAP = Object.fromEntries(ALL_CONTROLS.map((control) => [control.key, control]));
const DEFAULT_CONTROL_STATE = Object.fromEntries(ALL_CONTROLS.map((control) => [control.key, control.defaultValue]));

const QUOTE_COLOR_RULES = [
  { selector: 'div[data-node-type="quote"][style*="red"]', token: 'red' },
  { selector: 'div[data-node-type="quote"][style*="yellow"]', token: 'yellow' },
  { selector: 'div[data-node-type="quote"][style*="green"]', token: 'green' },
  { selector: 'div[data-node-type="quote"][style*="blue"]', token: 'blue' },
  { selector: 'div[data-node-type="quote"][style*="purple"]', token: 'purple' },
  { selector: 'div[data-node-type="quote"][style*="pink"]', token: 'pink' },
  { selector: 'div[data-node-type="quote"][style*="gray"], div[data-node-type="quote"][style*="grey"]', token: 'grey' },
];

const BACKGROUND_BLOCK_RULES = [
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="red"]', token: 'red' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="yellow"]', token: 'yellow' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="green"]', token: 'green' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="blue"]', token: 'blue' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="purple"]', token: 'purple' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="pink"]', token: 'pink' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="gray"], .with-bg-color:not([data-node-type="quote"])[style*="grey"]', token: 'grey' },
];

const panelState = {
  baseCssText: "",
  cssText: "",
  themeMode: "light",
  controlState: { ...DEFAULT_CONTROL_STATE },
  gradientState: createDefaultGradientState(),
  gradientSelections: Object.fromEntries(Object.keys(GRADIENT_AREAS).map((areaKey) => [areaKey, 0])),
  gradientDrag: null,
  colorDrag: null,
  suppressGradientClick: false,
  tagColorAssignments: {},
  baseTagColorMap: {},
  tags: [],
  tagEntityMap: {},
  tagSourceMap: {},
  tagColorCleanupChecked: false,
  graphIndexed: false,
  pendingGraphPageState: {},
  pendingTagColorMigration: null,
  propertyIdentMap: {},
  propertyAttrMap: {},
  selectedTag: "",
  tagCustomColorDraft: "#14b8a6",
  tagCustomForegroundDraft: "#0f172a",
  tagCustomModeDrafts: {
    light: { backgroundColor: "#14b8a6", foregroundColor: "#0f172a" },
    dark: { backgroundColor: "#14b8a6", foregroundColor: "#f8fafc" },
  },
  tagSortMode: "name",
  tagFilter: "",
  tagSourceFilters: {
    tags: true,
    pages: true,
  },
  activeTab: "tags",
  lastAppliedAt: null,
  mounted: false,
  currentGraphKey: "",
  currentGraphInfo: null,
  syncState: "pending",
  syncRevision: 0,
  lastLocalSyncRevision: 0,
  lastNotifiedSyncRevision: 0,
  persistTimer: null,
  gradientPersistTimer: null,
  tagPersistTimer: null,
  dbStateRefreshTimer: null,
  startupSyncTimerIds: [],
  pendingTagPersistKeys: [],
  tagClickTimer: null,
  hostTagContextMenuBound: false,
};

function getHostDocument() {
  try {
    if (window.top?.document) {
      return window.top.document;
    }
  } catch (error) {
    // Ignore cross-frame access issues and fall back to the current document.
  }

  try {
    if (window.parent?.document) {
      return window.parent.document;
    }
  } catch (error) {
    // Ignore cross-frame access issues and fall back to the current document.
  }

  return document;
}

function canAccessExternalHostDocument() {
  try {
    if (window.top && window.top !== window && window.top.document && window.top.document !== document) {
      return true;
    }
  } catch (error) {
    // Ignore cross-frame access issues and fall back to the current document.
  }

  try {
    if (window.parent && window.parent !== window && window.parent.document && window.parent.document !== document) {
      return true;
    }
  } catch (error) {
    // Ignore cross-frame access issues and fall back to the current document.
  }

  return false;
}

function shouldUseProvideStyleFallback() {
  return window.top !== window && !canAccessExternalHostDocument();
}

function ensureHostStyleElement(styleId) {
  const hostDocument = getHostDocument();
  let styleElement = hostDocument.getElementById(styleId);

  if (!styleElement) {
    styleElement = hostDocument.createElement("style");
    styleElement.id = styleId;
    (hostDocument.head || hostDocument.documentElement).appendChild(styleElement);
  }

  return styleElement;
}

function setHostStyleText(styleId, cssText) {
  const styleElement = ensureHostStyleElement(styleId);

  if (styleElement.textContent !== cssText) {
    styleElement.textContent = cssText;
  }
}

function applyPluginStyleText(cssText) {
  if (!cssText || typeof logseq?.provideStyle !== "function") {
    return;
  }

  logseq.provideStyle(cssText);
}

function cleanupLegacyManagedStyles() {
  const hostDocument = getHostDocument();

  hostDocument.querySelectorAll("style").forEach((styleElement) => {
    if (
      styleElement.id !== MANAGED_STYLE_ELEMENT_ID
      && styleElement.textContent?.includes("CUSTOM THEME LOADER MANAGED OVERRIDES")
    ) {
      styleElement.remove();
    }
  });
}

function normalizeGraphSyncRevision(value) {
  const parsed = parsePersistedPropertyValue(value);
  const rawValue = parsed && typeof parsed === "object"
    ? (parsed.value ?? parsed.revision ?? 0)
    : parsed;
  const revision = Number(rawValue);

  return Number.isFinite(revision) && revision > 0
    ? Math.trunc(revision)
    : 0;
}

function formatSyncRevisionLabel(revision) {
  return revision
    ? `r${String(revision).slice(-6)}`
    : "r0";
}

function getSyncRevisionLabel() {
  return formatSyncRevisionLabel(panelState.syncRevision);
}

function getSyncRevisionTooltip() {
  return panelState.syncRevision
    ? `Graph revision ${panelState.syncRevision}`
    : "Graph revision not set yet.";
}

function emitSyncRevisionChangedEvent(detail) {
  try {
    const event = new CustomEvent(SYNC_REVISION_EVENT_NAME, { detail });
    window.dispatchEvent(event);
    document.dispatchEvent(new CustomEvent(SYNC_REVISION_EVENT_NAME, { detail }));
  } catch (error) {
    console.warn("[Degrande Colors] Failed to emit sync revision event", error);
  }
}

async function handleObservedSyncRevisionChange(previousRevision, nextRevision) {
  if (!nextRevision || nextRevision === previousRevision) {
    return;
  }

  const origin = nextRevision === panelState.lastLocalSyncRevision
    ? "local"
    : previousRevision > 0
      ? "remote"
      : "initial";
  const detail = {
    previousRevision,
    revision: nextRevision,
    label: formatSyncRevisionLabel(nextRevision),
    origin,
    graphKey: panelState.currentGraphKey,
    graphInfo: panelState.currentGraphInfo,
  };

  panelState.lastNotifiedSyncRevision = nextRevision;
  emitSyncRevisionChangedEvent(detail);

  if (origin === "remote" && typeof logseq.UI?.showMsg === "function") {
    await logseq.UI.showMsg(
      `Degrande detected synced graph revision ${detail.label}.`,
      "success",
      { timeout: 2800 }
    );
  }
}

function getSyncIndicatorTooltip() {
  const stateText = panelState.syncState === "synced"
    ? "Graph data is in sync. Click for manual sync."
    : "Graph sync is pending or in progress. Click for manual sync.";

  return `${stateText} Current revision: ${getSyncRevisionLabel()}.`;
}

function syncSyncIndicator() {
  const indicator = document.querySelector('[data-role="sync-indicator"]');
  const revision = document.querySelector('[data-role="sync-revision"]');

  if (revision) {
    const revisionTooltip = getSyncRevisionTooltip();
    revision.textContent = getSyncRevisionLabel();
    revision.setAttribute("title", revisionTooltip);
    revision.setAttribute("aria-label", revisionTooltip);
  }

  if (!indicator) {
    return;
  }

  indicator.dataset.syncState = panelState.syncState;
  const tooltip = getSyncIndicatorTooltip();
  indicator.setAttribute("title", tooltip);
  indicator.setAttribute("aria-label", tooltip);
}

function setSyncState(nextState) {
  panelState.syncState = nextState === "synced" ? "synced" : "pending";
  syncSyncIndicator();
}

function getToolbarStyle() {
  return `
.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] {
  display: inline-flex;
  align-items: center;
}

.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] a,
.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] a.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: var(--ls-primary-text-color, currentColor);
  opacity: 0.82;
}

.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] a:hover,
.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] a.button:hover {
  opacity: 1;
}

.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] :is(.ti, .tie) {
  font-size: 18px;
  line-height: 1;
}
`;
}

function getToolbarHost() {
  const hostDocument = getHostDocument();
  const selectors = [
    '.ui-items-container[data-type="toolbar"]',
    '.ui-items-container[data-type="toolbar"] > .list-wrap',
    '.cp__header .r',
    '#head .r',
    '.cp__header-right-menu',
    'header .r',
  ];

  for (const selector of selectors) {
    const match = hostDocument.querySelector(selector);

    if (match) {
      return match;
    }
  }

  return null;
}

function createToolbarButton(hostDocument) {
  const wrapper = hostDocument.createElement("div");
  wrapper.className = "injected-ui-item-toolbar";
  wrapper.setAttribute("data-injected-ui", "custom-theme-loader-open");
  wrapper.setAttribute("data-toolbar-fallback", "false");

  const button = hostDocument.createElement("button");
  button.type = "button";
  button.id = TOOLBAR_BUTTON_ID;
  button.setAttribute("aria-label", "Open Degrande Colors");
  button.setAttribute("title", "Open Degrande Colors");
  button.innerHTML = buildLauncherIconMarkup();
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleThemeLoader();
  });

  wrapper.appendChild(button);
  return wrapper;
}

function ensureFloatingLauncherButton() {
  const hostDocument = getHostDocument();
  setHostStyleText(TOOLBAR_STYLE_ELEMENT_ID, getToolbarStyle());

  let button = hostDocument.getElementById(TOOLBAR_BUTTON_ID);

  if (!button) {
    button = hostDocument.createElement("button");
    button.type = "button";
    button.id = TOOLBAR_BUTTON_ID;
    button.setAttribute("data-floating-launcher", "true");
    button.setAttribute("aria-label", "Open Degrande Colors");
    button.setAttribute("title", "Open Degrande Colors");
    button.innerHTML = buildLauncherIconMarkup();
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleThemeLoader();
    });
  }

  button.setAttribute("data-floating-launcher", "true");

  if (button.parentElement !== hostDocument.body) {
    hostDocument.body.appendChild(button);
  }
}

function ensureToolbarButton() {
  const hostDocument = getHostDocument();
  setHostStyleText(TOOLBAR_STYLE_ELEMENT_ID, getToolbarStyle());

  const toolbarHost = getToolbarHost();

  if (!toolbarHost) {
    let fallback = hostDocument.getElementById(TOOLBAR_BUTTON_ID)?.parentElement;

    if (!fallback) {
      fallback = createToolbarButton(hostDocument);
    }

    fallback.setAttribute("data-toolbar-fallback", "true");

    if (fallback.parentElement !== hostDocument.body) {
      hostDocument.body.appendChild(fallback);
    }

    return false;
  }

  let button = hostDocument.getElementById(TOOLBAR_BUTTON_ID)?.parentElement;

  if (!button) {
    button = createToolbarButton(hostDocument);
  }

  button.setAttribute("data-toolbar-fallback", "false");

  if (button.parentElement !== toolbarHost) {
    const toolbarContainer = toolbarHost.matches('.ui-items-container[data-type="toolbar"]')
      ? toolbarHost
      : toolbarHost.closest('.ui-items-container[data-type="toolbar"]');
    const anchor = toolbarContainer?.querySelector(".toolbar-dots-btn")?.closest("button, a, div");

    if (anchor?.parentElement === toolbarHost) {
      toolbarHost.insertBefore(button, anchor);
    } else if (toolbarHost.matches('.ui-items-container[data-type="toolbar"]')) {
      const listWrap = toolbarHost.querySelector(':scope > .list-wrap');

      if (listWrap) {
        toolbarHost.insertBefore(button, listWrap);
      } else {
        toolbarHost.appendChild(button);
      }
    } else {
      toolbarHost.appendChild(button);
    }
  }

  return true;
}

function scheduleToolbarButtonRender() {
  const hostDocument = getHostDocument();
  const hostWindow = hostDocument.defaultView || window;

  if (hostWindow[TOOLBAR_RENDER_TIMER_KEY]) {
    return;
  }

  hostWindow[TOOLBAR_RENDER_TIMER_KEY] = hostWindow.setTimeout(() => {
    hostWindow[TOOLBAR_RENDER_TIMER_KEY] = null;
    ensureToolbarButton();
  }, 40);
}

function observeToolbarHost() {
  const hostDocument = getHostDocument();
  const hostWindow = hostDocument.defaultView || window;
  const HostMutationObserver = hostWindow.MutationObserver || MutationObserver;

  hostWindow[TOOLBAR_OBSERVER_KEY]?.disconnect?.();

  const observer = new HostMutationObserver(() => {
    scheduleToolbarButtonRender();
  });

  observer.observe(hostDocument.body || hostDocument.documentElement, {
    childList: true,
    subtree: true,
  });

  hostWindow[TOOLBAR_OBSERVER_KEY] = observer;
  ensureToolbarButton();
}

function scheduleHostColorSync() {
  const hostDocument = getHostDocument();
  const hostWindow = hostDocument.defaultView || window;

  if (hostWindow[HOST_COLOR_SYNC_TIMER_KEY]) {
    return;
  }

  hostWindow[HOST_COLOR_SYNC_TIMER_KEY] = hostWindow.setTimeout(() => {
    hostWindow[HOST_COLOR_SYNC_TIMER_KEY] = null;
    syncHostColorVariables();
  }, 40);
}

function observeHostColorTargets() {
  const hostDocument = getHostDocument();
  const hostWindow = hostDocument.defaultView || window;
  const HostMutationObserver = hostWindow.MutationObserver || MutationObserver;

  hostWindow[HOST_COLOR_SYNC_OBSERVER_KEY]?.disconnect?.();

  const observer = new HostMutationObserver(() => {
    scheduleHostColorSync();
  });

  observer.observe(hostDocument.body || hostDocument.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });

  hostWindow[HOST_COLOR_SYNC_OBSERVER_KEY] = observer;
  scheduleHostColorSync();
}

function isDuplicateRegistrationError(error) {
  return /already exist/i.test(String(error?.message || error || ""));
}

function registerCommandPaletteSafely(config, handler) {
  try {
    logseq.App.registerCommandPalette(config, handler);
  } catch (error) {
    if (isDuplicateRegistrationError(error)) {
      console.info(`[Degrande Colors] Skipping duplicate command registration: ${config.key}`);
      return false;
    }

    throw error;
  }

  return true;
}

function registerToolbarItemSafely(config) {
  try {
    logseq.App.registerUIItem("toolbar", config);
  } catch (error) {
    if (isDuplicateRegistrationError(error)) {
      console.info(`[Degrande Colors] Skipping duplicate toolbar registration: ${config.key}`);
      return false;
    }

    throw error;
  }

  return true;
}

async function loadWorkspaceCss() {
  const cssUrl = typeof logseq.resolveResourceFullUrl === "function"
    ? logseq.resolveResourceFullUrl("custom.css")
    : "./custom.css";
  const response = await fetch(cssUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load custom.css (${response.status})`);
  }

  return response.text();
}

function setThemeMode(mode) {
  panelState.themeMode = mode === "dark" ? "dark" : "light";
  document.body.classList.toggle("theme-dark", panelState.themeMode === "dark");
}

function getThemeToggleLabel() {
  return panelState.themeMode === "dark" ? "Switch to Light" : "Switch to Dark";
}

async function toggleLogseqTheme() {
  const nextTheme = panelState.themeMode === "dark" ? "light" : "dark";

  try {
    await logseq.App.invokeExternalCommand("logseq.ui/toggle-theme");
    refreshPanel(`Switching Logseq to ${nextTheme} mode`, {
      rerenderPreview: true,
      rerenderTags: true,
    });
  } catch (error) {
    console.error("[Local Custom Theme Loader] Failed to toggle Logseq theme", error);
    renderPanel("Unable to toggle the Logseq theme");
    await logseq.UI.showMsg("Unable to toggle the Logseq theme.", "warning");
  }
}

function formatControlValue(control, value) {
  if (control.step < 1) {
    return `${Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}${control.unit}`;
  }

  return `${Math.round(value)}${control.unit}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttributeValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normalizeTagName(tag) {
  if (!tag) {
    return "";
  }

  if (typeof tag === "string") {
    return tag.trim().replace(/^#+/, "");
  }

  if (Array.isArray(tag)) {
    return normalizeTagName(tag[0]);
  }

  const candidates = [
    tag.originalName,
    tag.fullTitle,
    tag.title,
    tag.content,
    tag.name,
    tag.label,
    tag.tag,
    typeof tag.ident === "string" ? tag.ident.split("/").pop() : "",
  ];

  const rawName = candidates.find((value) => typeof value === "string" && value.trim()) || "";

  return String(rawName).trim().replace(/^#+/, "");
}

function hasCapitalLetters(value) {
  return /[A-Z]/.test(value);
}

function choosePreferredTagName(currentName, nextName) {
  if (!currentName) {
    return nextName;
  }

  if (!nextName) {
    return currentName;
  }

  const currentHasCaps = hasCapitalLetters(currentName);
  const nextHasCaps = hasCapitalLetters(nextName);

  if (currentHasCaps !== nextHasCaps) {
    return nextHasCaps ? nextName : currentName;
  }

  return currentName.length >= nextName.length ? currentName : nextName;
}

function dedupeTagNames(tagNames) {
  const tagMap = new Map();

  for (const tagName of tagNames) {
    const normalizedKey = tagName.toLowerCase();
    const currentName = tagMap.get(normalizedKey);
    tagMap.set(normalizedKey, choosePreferredTagName(currentName, tagName));
  }

  return Array.from(tagMap.values());
}

function normalizeCollectedTags(rawTags) {
  return dedupeTagNames((rawTags || [])
    .map(normalizeTagName)
    .filter(Boolean)
    .filter((tagName) => tagName.toLowerCase() !== "tags"))
    .sort((left, right) => left.localeCompare(right));
}

function isTagCandidatePage(page) {
  if (!page || typeof page !== "object") {
    return false;
  }

  return !page.journalDay && page["journal?"] !== true;
}

function collectTagCatalogEntry(tagMap, rawTag, sourceKey) {
  const tagName = normalizeTagName(rawTag);

  if (!tagName || tagName.toLowerCase() === "tags") {
    return;
  }

  const normalizedKey = tagName.toLowerCase();
  const currentEntry = tagMap.get(normalizedKey) || {
    name: "",
    tags: false,
    pages: false,
    uuid: "",
    id: null,
  };

  currentEntry.name = choosePreferredTagName(currentEntry.name, tagName);
  currentEntry[sourceKey] = true;

  if (rawTag && typeof rawTag === "object") {
    if (!currentEntry.uuid && typeof rawTag.uuid === "string") {
      currentEntry.uuid = rawTag.uuid;
    }

    if (currentEntry.id == null && rawTag.id != null) {
      currentEntry.id = rawTag.id;
    }
  }

  tagMap.set(normalizedKey, currentEntry);
}

async function collectTagCatalog() {
  const tagMap = new Map();
  const sourceCounts = {};

  if (typeof logseq.Editor.getAllTags === "function") {
    try {
      const tags = await logseq.Editor.getAllTags();
      (tags || []).forEach((tag) => collectTagCatalogEntry(tagMap, tag, "tags"));
      sourceCounts.getAllTags = tags?.length || 0;
    } catch (error) {
      if (isBenignGetAllTagsError(error)) {
        sourceCounts.getAllTags = 0;
      } else {
        console.warn("[Local Custom Theme Loader] Failed to load tags from logseq.Editor.getAllTags", error);
      }
    }
  }

  if (typeof logseq.DB?.datascriptQuery === "function") {
    try {
      const tagRows = await logseq.DB.datascriptQuery(TAGS_DATASCRIPT_QUERY);
      (tagRows || []).forEach((tag) => collectTagCatalogEntry(tagMap, tag, "tags"));
      sourceCounts.datascriptTags = tagRows?.length || 0;
    } catch (error) {
      console.warn("[Local Custom Theme Loader] Failed to load tags from datascript tag query", error);
    }

    try {
      const refRows = await logseq.DB.datascriptQuery(REFS_DATASCRIPT_QUERY);
      (refRows || []).forEach((tag) => collectTagCatalogEntry(tagMap, tag, "tags"));
      sourceCounts.datascriptRefs = refRows?.length || 0;
    } catch (error) {
      console.warn("[Local Custom Theme Loader] Failed to load tags from datascript refs query", error);
    }
  }

  if (typeof logseq.Editor.getAllPages === "function") {
    try {
      const pages = await logseq.Editor.getAllPages();
      const candidatePages = (pages || []).filter(isTagCandidatePage);
      candidatePages.forEach((page) => collectTagCatalogEntry(tagMap, page, "pages"));
      sourceCounts.allPages = candidatePages.length;
    } catch (error) {
      console.warn("[Local Custom Theme Loader] Failed to load pages from logseq.Editor.getAllPages", error);
    }
  }

  console.info("[Local Custom Theme Loader] Loaded tag candidates", sourceCounts);

  const sortedEntries = Array.from(tagMap.entries())
    .sort((left, right) => left[1].name.localeCompare(right[1].name));

  return {
    tags: sortedEntries.map(([, entry]) => entry.name),
    tagEntityMap: Object.fromEntries(sortedEntries.map(([key, entry]) => [key, { uuid: entry.uuid || "", id: entry.id ?? null }])),
    tagSourceMap: Object.fromEntries(sortedEntries.map(([key, entry]) => [key, { tags: entry.tags, pages: entry.pages }])),
  };
}

function normalizeGraphIdentityPart(value) {
  return String(value || "").trim().toLowerCase();
}

function getGraphIdentity(graphInfo) {
  if (!graphInfo || typeof graphInfo !== "object") {
    return "";
  }

  return normalizeGraphIdentityPart(graphInfo.path || graphInfo.url || graphInfo.name);
}

function doesRepoMatchGraph(repo, graphInfo = panelState.currentGraphInfo) {
  const repoKey = normalizeGraphIdentityPart(repo);

  if (!repoKey || !graphInfo || typeof graphInfo !== "object") {
    return false;
  }

  const candidates = [graphInfo.path, graphInfo.url, graphInfo.name]
    .map(normalizeGraphIdentityPart)
    .filter(Boolean);

  return candidates.some((candidate) => candidate === repoKey || candidate.endsWith(repoKey) || repoKey.endsWith(candidate));
}

async function syncCurrentGraphInfo() {
  if (typeof logseq.App?.getCurrentGraph !== "function") {
    return {
      changed: false,
      graphKey: panelState.currentGraphKey,
      graphInfo: panelState.currentGraphInfo,
    };
  }

  try {
    const graphInfo = await logseq.App.getCurrentGraph();
    const graphKey = getGraphIdentity(graphInfo);
    const changed = Boolean(graphKey && graphKey !== panelState.currentGraphKey);

    panelState.currentGraphInfo = graphInfo || null;

    if (graphKey) {
      panelState.currentGraphKey = graphKey;
    }

    return { changed, graphKey, graphInfo };
  } catch (error) {
    console.warn("[Degrande Colors] Failed to resolve current graph", error);

    return {
      changed: false,
      graphKey: panelState.currentGraphKey,
      graphInfo: panelState.currentGraphInfo,
    };
  }
}

function clearGraphTagState() {
  panelState.tags = [];
  panelState.tagEntityMap = {};
  panelState.tagSourceMap = {};
  panelState.tagColorCleanupChecked = false;
  panelState.graphIndexed = false;
  panelState.pendingGraphPageState = {};
  panelState.pendingTagColorMigration = null;
  panelState.selectedTag = "";
  panelState.syncRevision = 0;
  panelState.lastLocalSyncRevision = 0;
  panelState.lastNotifiedSyncRevision = 0;
}

function normalizeRefreshTagsOptions(showToastOrOptions) {
  if (showToastOrOptions && typeof showToastOrOptions === "object") {
    return {
      showToast: false,
      fallbackToPrevious: true,
      ...showToastOrOptions,
    };
  }

  return {
    showToast: Boolean(showToastOrOptions),
    fallbackToPrevious: true,
  };
}

async function collectRawTags() {
  const rawTags = [];
  const sourceCounts = {};

  if (typeof logseq.Editor.getAllTags === "function") {
    try {
      const tags = await logseq.Editor.getAllTags();
      rawTags.push(...(tags || []));
      sourceCounts.getAllTags = tags?.length || 0;
    } catch (error) {
      if (isBenignGetAllTagsError(error)) {
        sourceCounts.getAllTags = 0;
      } else {
        console.warn("[Local Custom Theme Loader] Failed to load tags from logseq.Editor.getAllTags", error);
      }
    }
  }

  if (typeof logseq.DB?.datascriptQuery === "function") {
    try {
      const tagRows = await logseq.DB.datascriptQuery(TAGS_DATASCRIPT_QUERY);
      rawTags.push(...(tagRows || []));
      sourceCounts.datascriptTags = tagRows?.length || 0;
    } catch (error) {
      console.warn("[Local Custom Theme Loader] Failed to load tags from datascript tag query", error);
    }

    try {
      const refRows = await logseq.DB.datascriptQuery(REFS_DATASCRIPT_QUERY);
      rawTags.push(...(refRows || []));
      sourceCounts.datascriptRefs = refRows?.length || 0;
    } catch (error) {
      console.warn("[Local Custom Theme Loader] Failed to load tags from datascript refs query", error);
    }
  }

  if (typeof logseq.Editor.getAllPages === "function") {
    try {
      const pages = await logseq.Editor.getAllPages();
      const candidatePages = (pages || []).filter(isTagCandidatePage);
      rawTags.push(...candidatePages);
      sourceCounts.allPages = candidatePages.length;
    } catch (error) {
      console.warn("[Local Custom Theme Loader] Failed to load pages from logseq.Editor.getAllPages", error);
    }
  }

  console.info("[Local Custom Theme Loader] Loaded tag candidates", sourceCounts);

  return rawTags;
}

function getPresetMeta(token) {
  return COLOR_PRESET_MAP[token] || null;
}

function normalizeHexColor(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) {
    return null;
  }

  if (trimmed.length === 4) {
    return `#${trimmed.slice(1).split("").map((char) => char + char).join("")}`.toLowerCase();
  }

  if (trimmed.length === 5) {
    return `#${trimmed.slice(1).split("").map((char) => char + char).join("")}`.toLowerCase();
  }

  return trimmed.toLowerCase();
}

function hexToRgb(hexColor) {
  const normalized = normalizeHexColor(hexColor);

  if (!normalized) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
    a: normalized.length === 9 ? Number.parseInt(normalized.slice(7, 9), 16) / 255 : 1,
  };
}

function rgbToHex(rgb) {
  const toHex = (value) => Math.min(255, Math.max(0, Number(value) || 0)).toString(16).padStart(2, "0");
  const alpha = Number.isFinite(rgb.a) ? Math.min(1, Math.max(0, rgb.a)) : 1;
  const alphaHex = toHex(Math.round(alpha * 255));
  const base = `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  return alpha >= 0.999 ? base : `${base}${alphaHex}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHsv(rgb) {
  const red = clamp((rgb.r ?? 0) / 255, 0, 1);
  const green = clamp((rgb.g ?? 0) / 255, 0, 1);
  const blue = clamp((rgb.b ?? 0) / 255, 0, 1);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta > 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
  }

  hue = Math.round((((hue * 60) + 360) % 360));

  return {
    h: hue,
    s: max === 0 ? 0 : delta / max,
    v: max,
    a: Number.isFinite(rgb.a) ? clamp(rgb.a, 0, 1) : 1,
  };
}

function hsvToRgb(hsv) {
  const hue = ((Number(hsv.h) % 360) + 360) % 360;
  const saturation = clamp(Number(hsv.s), 0, 1);
  const value = clamp(Number(hsv.v), 0, 1);
  const alpha = clamp(Number(hsv.a ?? 1), 0, 1);
  const chroma = value * saturation;
  const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = value - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = chroma;
    green = secondary;
  } else if (hue < 120) {
    red = secondary;
    green = chroma;
  } else if (hue < 180) {
    green = chroma;
    blue = secondary;
  } else if (hue < 240) {
    green = secondary;
    blue = chroma;
  } else if (hue < 300) {
    red = secondary;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondary;
  }

  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
    a: alpha,
  };
}

function mixRgb(source, target, amount) {
  return {
    r: Math.round(source.r + (target.r - source.r) * amount),
    g: Math.round(source.g + (target.g - source.g) * amount),
    b: Math.round(source.b + (target.b - source.b) * amount),
  };
}

function rgbToCss(rgb, alpha = undefined) {
  const resolvedAlpha = alpha == null
    ? (Number.isFinite(rgb?.a) ? rgb.a : 1)
    : alpha;

  if (resolvedAlpha >= 1) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${resolvedAlpha})`;
}

function parseCssColorValue(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const normalizedHex = hexToRgb(value.trim());

  if (normalizedHex) {
    return normalizedHex;
  }

  const match = value.trim().match(/^rgba?\(([^)]+)\)$/i);

  if (!match) {
    return null;
  }

  const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim())).filter(Number.isFinite);

  if (parts.length < 3) {
    return null;
  }

  return {
    r: clamp(parts[0], 0, 255),
    g: clamp(parts[1], 0, 255),
    b: clamp(parts[2], 0, 255),
    a: clamp(parts[3] ?? 1, 0, 1),
  };
}

function getDerivedGradientColor(colorValue, alphaMultiplier = 0.65, minAlpha = 0.16, maxAlpha = 0.38) {
  const rgb = parseCssColorValue(colorValue);

  if (!rgb) {
    return null;
  }

  const baseAlpha = Number.isFinite(rgb.a) ? rgb.a : 1;
  const gradientAlpha = clamp(baseAlpha * alphaMultiplier, minAlpha, maxAlpha);
  return rgbToCss(rgb, gradientAlpha);
}

function syncHostColorVariables() {
  const hostDocument = getHostDocument();
  const hostWindow = hostDocument.defaultView || window;

  hostDocument.querySelectorAll('.with-bg-color:not([data-node-type="quote"])').forEach((element) => {
    if (!(element instanceof hostWindow.Element)) {
      return;
    }

    const gradientColor = getDerivedGradientColor(
      element.style.backgroundColor || element.style.background,
      0.72,
      0.16,
      0.34
    );

    if (gradientColor) {
      element.style.setProperty("--ctl-bg-sweep-color", gradientColor);
    } else {
      element.style.removeProperty("--ctl-bg-sweep-color");
    }
  });

  hostDocument.querySelectorAll('div[data-node-type="quote"]').forEach((element) => {
    if (!(element instanceof hostWindow.Element)) {
      return;
    }

    const gradientColor = getDerivedGradientColor(
      element.style.borderLeftColor || element.style.backgroundColor || element.style.background,
      0.85,
      0.14,
      0.42
    );

    if (gradientColor) {
      element.style.setProperty("--ctl-quote-color", gradientColor);
    } else {
      element.style.removeProperty("--ctl-quote-color");
    }
  });
}

function getRgbLuminance(rgb) {
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

function getRelativeLuminance(rgb) {
  const toLinear = (channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

function getContrastRatio(foreground, background) {
  const lighter = Math.max(getRelativeLuminance(foreground), getRelativeLuminance(background));
  const darker = Math.min(getRelativeLuminance(foreground), getRelativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function getReadableToneFromBase(baseRgb, backgroundRgb, preferLight = false, minimumRatio = 4.5) {
  if (getContrastRatio(baseRgb, backgroundRgb) >= minimumRatio) {
    return {
      r: baseRgb.r,
      g: baseRgb.g,
      b: baseRgb.b,
    };
  }

  const target = preferLight
    ? { r: 255, g: 255, b: 255 }
    : { r: 0, g: 0, b: 0 };

  for (let amount = 0.12; amount <= 1.0001; amount += 0.08) {
    const candidate = mixRgb(baseRgb, target, amount);

    if (getContrastRatio(candidate, backgroundRgb) >= minimumRatio) {
      return candidate;
    }
  }

  return target;
}

function getContrastTextColor(rgb) {
  const luminance = getRgbLuminance(rgb);
  return luminance > 0.62 ? "#0f172a" : "#f8fafc";
}

function getCustomColorTheme(colorInput) {
  const backgroundColor = typeof colorInput === "string"
    ? normalizeHexColor(colorInput)
    : normalizeHexColor(colorInput?.backgroundColor || colorInput?.baseColor);
  const foregroundColor = typeof colorInput === "string"
    ? null
    : normalizeHexColor(colorInput?.foregroundColor);
  const rgb = hexToRgb(backgroundColor);

  if (!rgb) {
    return null;
  }

  const baseAlpha = Number.isFinite(rgb.a) ? rgb.a : 1;
  const luminance = getRgbLuminance(rgb);
  const foregroundRgb = hexToRgb(foregroundColor) || rgb;
  const lightBg = luminance < 0.18
    ? mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.06)
    : { r: rgb.r, g: rgb.g, b: rgb.b };
  const lightBorder = luminance < 0.4
    ? mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.24)
    : mixRgb(rgb, { r: 0, g: 0, b: 0 }, 0.18);
  const lightText = getReadableToneFromBase(foregroundRgb, lightBg, getRgbLuminance(lightBg) < 0.5);

  const darkLightenAmount = luminance < 0.2
    ? 0.82
    : luminance < 0.35
      ? 0.72
      : luminance < 0.5
        ? 0.6
        : 0.42;
  const darkBg = mixRgb(rgb, { r: 255, g: 255, b: 255 }, darkLightenAmount);
  const darkBorder = mixRgb(darkBg, { r: 255, g: 255, b: 255 }, 0.16);
  const darkText = getReadableToneFromBase(foregroundRgb, darkBg, getRgbLuminance(darkBg) < 0.5);

  return {
    lightBg: rgbToCss(lightBg, Math.max(0.92, baseAlpha)),
    lightBorder: rgbToCss(lightBorder, Math.max(0.84, baseAlpha)),
    lightText: rgbToCss(lightText),
    lightBackgroundColor: rgbToHex({ ...lightBg, a: Math.max(0.92, baseAlpha) }),
    lightForegroundColor: rgbToHex(lightText),
    darkBg: rgbToCss(darkBg, Math.max(0.88, baseAlpha)),
    darkBorder: rgbToCss(darkBorder, Math.max(0.82, baseAlpha)),
    darkText: rgbToCss(darkText),
    darkBackgroundColor: rgbToHex({ ...darkBg, a: Math.max(0.88, baseAlpha) }),
    darkForegroundColor: rgbToHex(darkText),
    gradient: rgbToCss(rgb, Math.max(0.06, baseAlpha * 0.25)),
    border: rgbToCss(rgb, Math.max(0.24, baseAlpha * 0.78)),
  };
}

function normalizeTagColorAssignment(entry) {
  if (!entry) {
    return null;
  }

  if (typeof entry === "string") {
    return COLOR_PRESET_MAP[entry] ? { type: "preset", token: entry } : null;
  }

  if (typeof entry === "object") {
    if (entry.type === "preset" && COLOR_PRESET_MAP[entry.token]) {
      return { type: "preset", token: entry.token };
    }

    if (entry.type === "custom") {
      const backgroundColor = normalizeHexColor(entry.backgroundColor || entry.baseColor);
      const foregroundColor = normalizeHexColor(entry.foregroundColor);
      const lightBackgroundColor = normalizeHexColor(entry.lightBackgroundColor);
      const lightForegroundColor = normalizeHexColor(entry.lightForegroundColor);
      const darkBackgroundColor = normalizeHexColor(entry.darkBackgroundColor);
      const darkForegroundColor = normalizeHexColor(entry.darkForegroundColor);

      if (backgroundColor || lightBackgroundColor || darkBackgroundColor) {
        return {
          type: "custom",
          ...(backgroundColor ? { backgroundColor } : {}),
          ...(foregroundColor ? { foregroundColor } : {}),
          ...(lightBackgroundColor ? { lightBackgroundColor } : {}),
          ...(lightForegroundColor ? { lightForegroundColor } : {}),
          ...(darkBackgroundColor ? { darkBackgroundColor } : {}),
          ...(darkForegroundColor ? { darkForegroundColor } : {}),
        };
      }
    }
  }

  return null;
}

function getTagColorAssignment(tagName) {
  const normalized = String(tagName).toLowerCase();
  return normalizeTagColorAssignment(panelState.tagColorAssignments[normalized])
    || normalizeTagColorAssignment(panelState.baseTagColorMap[normalized]);
}

function getCanonicalTagName(tagName) {
  const normalized = String(tagName || "").toLowerCase();
  return panelState.tags.find((entry) => entry.toLowerCase() === normalized) || String(tagName || "");
}

function getTagColorToken(tagName) {
  const assignment = getTagColorAssignment(tagName);

  if (!assignment) {
    return null;
  }

  return assignment.type === "preset" ? assignment.token : "custom";
}

function getRandomPresetToken(excludedToken = null) {
  const presets = COLOR_PRESETS.filter((preset) => preset.token !== excludedToken);
  const pool = presets.length ? presets : COLOR_PRESETS;

  if (!pool.length) {
    return null;
  }

  return pool[Math.floor(Math.random() * pool.length)]?.token || null;
}

function clearPendingTagSelection() {
  if (panelState.tagClickTimer) {
    clearTimeout(panelState.tagClickTimer);
    panelState.tagClickTimer = null;
  }
}

function scheduleTagSelection(tagName) {
  clearPendingTagSelection();
  panelState.tagClickTimer = setTimeout(() => {
    panelState.tagClickTimer = null;
    panelState.selectedTag = tagName;
    renderPanel(`Selected ${tagName}`);
  }, 220);
}

function setTagPresetColor(tagName, token, statusMessage = null) {
  if (!tagName || !COLOR_PRESET_MAP[token]) {
    return false;
  }

  panelState.selectedTag = tagName;
  panelState.tagColorAssignments[tagName.toLowerCase()] = {
    type: "preset",
    token,
  };
  void applyManagedOverrides(false, statusMessage || `Set ${tagName} to ${token}`);
  schedulePersistTagColors([tagName]);
  return true;
}

function clearTagColorAssignment(tagName, statusMessage = null) {
  if (!tagName) {
    return false;
  }

  panelState.selectedTag = tagName;

  if (!panelState.tagColorAssignments[tagName.toLowerCase()]) {
    renderPanel(statusMessage || `${tagName} already uses the default color`);
    return false;
  }

  delete panelState.tagColorAssignments[tagName.toLowerCase()];
  void applyManagedOverrides(false, statusMessage || `Reset ${tagName} to the default color`);
  schedulePersistTagColors([tagName]);
  return true;
}

function getBulkColorableTags() {
  return getVisibleTags().filter((tagName) => getTagSourceFlags(tagName).tags);
}

function addRandomColorsToUncoloredTags() {
  const bulkColorableTags = getBulkColorableTags();

  if (!bulkColorableTags.length) {
    renderPanel("Bulk add only applies to tag entries. Page-only results were skipped.");
    return 0;
  }

  const uncoloredTags = bulkColorableTags.filter((tagName) => !getTagColorToken(tagName));

  if (!uncoloredTags.length) {
    renderPanel("All filtered tag entries already have colors");
    return 0;
  }

  uncoloredTags.forEach((tagName) => {
    const token = getRandomPresetToken();

    if (!token) {
      return;
    }

    panelState.tagColorAssignments[tagName.toLowerCase()] = {
      type: "preset",
      token,
    };
  });

  void applyManagedOverrides(false, `Added random colors to ${uncoloredTags.length} filtered tags`);
  schedulePersistTagColors(uncoloredTags);
  return uncoloredTags.length;
}

function getTagSourceFlags(tagName) {
  return panelState.tagSourceMap[String(tagName).toLowerCase()] || { tags: false, pages: false };
}

function matchesTagSourceFilters(tagName) {
  const sourceFlags = getTagSourceFlags(tagName);
  const { tags, pages } = panelState.tagSourceFilters;

  if (!tags && !pages) {
    return false;
  }

  return (tags && sourceFlags.tags) || (pages && sourceFlags.pages);
}

function getSourceCount(sourceKey) {
  return panelState.tags.filter((tagName) => getTagSourceFlags(tagName)[sourceKey]).length;
}

function getVisibleAssignedTagCount() {
  return getVisibleTags().filter((tagName) => Boolean(panelState.tagColorAssignments[tagName.toLowerCase()])).length;
}

function getVisibleAssignedTags() {
  return getVisibleTags().filter((tagName) => Boolean(panelState.tagColorAssignments[tagName.toLowerCase()]));
}

function getManagedOverrideTagNames() {
  const emitResetRules = shouldUseProvideStyleFallback();

  if (emitResetRules) {
    return getKnownTagNames();
  }

  return Array.from(new Set(
    Object.keys(panelState.tagColorAssignments)
      .map((tagName) => getCanonicalTagName(tagName))
      .filter(Boolean)
  )).sort((left, right) => left.localeCompare(right));
}

function buildGroupedTagChipSelectors(tagNames, themePrefix = "") {
  return tagNames.flatMap((tagName) => {
    const escapedTagName = escapeAttributeValue(tagName);

    return [
      `${themePrefix}a.tag[data-ref="${escapedTagName}" i]`,
      `${themePrefix}a.tag[data-ref="${escapedTagName}" i]:hover`,
    ];
  }).join(",\n");
}

function buildGroupedTagInnerSelector(tagNames) {
  return tagNames
    .map((tagName) => `a.tag[data-ref="${escapeAttributeValue(tagName)}" i]`)
    .join(", ");
}

function buildGroupedDirectTitleSelector(tagNames, themePrefix = "") {
  const selectors = tagNames.flatMap((tagName) => {
    const escapedTagName = escapeAttributeValue(tagName);

    return [
      `${themePrefix}.ls-block > div:first-child:has(> h1.title):has(> a.tag[data-ref="${escapedTagName}" i])`,
      `${themePrefix}.ls-block > div:first-child:has(> h1.title):has(> * a.tag[data-ref="${escapedTagName}" i])`,
      `${themePrefix}.ls-block > div:first-child:has(> .journal-title):has(> a.tag[data-ref="${escapedTagName}" i])`,
      `${themePrefix}.ls-block > div:first-child:has(> .journal-title):has(> * a.tag[data-ref="${escapedTagName}" i])`,
    ];
  });

  return selectors.length ? `:is(\n  ${selectors.join(",\n  ")}\n)` : "";
}

function buildGroupedTagRule(tagNames, config) {
  if (!tagNames.length) {
    return "";
  }

  const innerSelector = buildGroupedTagInnerSelector(tagNames);
  const directSelector = buildGroupedDirectTitleSelector(tagNames);
  const darkDirectSelector = buildGroupedDirectTitleSelector(tagNames, ".dark-theme ");

  return `
${buildGroupedTagChipSelectors(tagNames)} {
  ${config.lightChipDeclarations}
}

${buildGroupedTagChipSelectors(tagNames, ".dark-theme ")} {
  ${config.darkChipDeclarations}
}

:is(.ls-block > div:first-child, h1.title, .journal-title):has(:is(${innerSelector})) {
  --node-color: ${config.lightNodeColor};
}

.ls-block > div:first-child:has(.block-content-or-editor-wrap.ls-page-title-container):has(.ls-block-right :is(${innerSelector})) {
  --node-color: ${config.lightNodeColor};
}

.dark-theme :is(.ls-block > div:first-child, h1.title, .journal-title):has(:is(${innerSelector})) {
  --node-color: ${config.darkNodeColor};
}

.dark-theme .ls-block > div:first-child:has(.block-content-or-editor-wrap.ls-page-title-container):has(.ls-block-right :is(${innerSelector})) {
  --node-color: ${config.darkNodeColor};
}

${directSelector} {
  --node-color: ${config.lightNodeColor};
}

${darkDirectSelector} {
  --node-color: ${config.darkNodeColor};
}
`;
}

function getTagChipThemeStyle(assignmentOrToken) {
  const assignment = typeof assignmentOrToken === "string"
    ? normalizeTagColorAssignment(assignmentOrToken)
    : normalizeTagColorAssignment(assignmentOrToken);
  const isDark = panelState.themeMode === "dark";

  if (assignment?.type === "custom") {
    const customTheme = getResolvedCustomTagTheme(assignment, isDark ? "dark" : "light");

    if (customTheme) {
      return {
        background: customTheme.background,
        borderColor: customTheme.borderColor,
        color: customTheme.color,
      };
    }
  }

  const preset = getPresetMeta(assignment?.type === "preset" ? assignment.token : "grey") || getPresetMeta("grey");

  return {
    background: isDark ? preset.darkBg : preset.lightBg,
    borderColor: isDark ? preset.darkBorder : preset.lightBorder,
    color: isDark ? preset.darkText : preset.lightText,
  };
}

function getResolvedCustomTagTheme(assignment, mode = panelState.themeMode) {
  if (assignment?.type !== "custom") {
    return null;
  }

  const resolvedMode = mode === "dark" ? "dark" : "light";
  const derivedTheme = getCustomColorTheme(assignment);
  const explicitBackgroundColor = normalizeHexColor(assignment[`${resolvedMode}BackgroundColor`]);
  const explicitForegroundColor = normalizeHexColor(assignment[`${resolvedMode}ForegroundColor`]);

  if (!explicitBackgroundColor && !explicitForegroundColor) {
    if (!derivedTheme) {
      return null;
    }

    return {
      background: resolvedMode === "dark" ? derivedTheme.darkBg : derivedTheme.lightBg,
      borderColor: resolvedMode === "dark" ? derivedTheme.darkBorder : derivedTheme.lightBorder,
      color: resolvedMode === "dark" ? derivedTheme.darkText : derivedTheme.lightText,
      backgroundColor: resolvedMode === "dark" ? derivedTheme.darkBackgroundColor : derivedTheme.lightBackgroundColor,
      foregroundColor: resolvedMode === "dark" ? derivedTheme.darkForegroundColor : derivedTheme.lightForegroundColor,
    };
  }

  const fallbackBackgroundColor = explicitBackgroundColor
    || (resolvedMode === "dark" ? derivedTheme?.darkBackgroundColor : derivedTheme?.lightBackgroundColor)
    || assignment.backgroundColor
    || "#14b8a6";
  const backgroundRgb = hexToRgb(fallbackBackgroundColor);

  if (!backgroundRgb) {
    return null;
  }

  const backgroundBase = {
    r: backgroundRgb.r,
    g: backgroundRgb.g,
    b: backgroundRgb.b,
  };
  const backgroundAlpha = Number.isFinite(backgroundRgb.a) ? backgroundRgb.a : 1;
  const luminance = getRgbLuminance(backgroundBase);
  const borderRgb = luminance < 0.5
    ? mixRgb(backgroundBase, { r: 255, g: 255, b: 255 }, resolvedMode === "dark" ? 0.18 : 0.24)
    : mixRgb(backgroundBase, { r: 0, g: 0, b: 0 }, resolvedMode === "dark" ? 0.12 : 0.18);
  const fallbackForegroundColor = explicitForegroundColor
    || (resolvedMode === "dark" ? derivedTheme?.darkForegroundColor : derivedTheme?.lightForegroundColor)
    || assignment.foregroundColor;
  const foregroundRgb = hexToRgb(fallbackForegroundColor) || backgroundBase;
  const textRgb = explicitForegroundColor
    ? {
        r: foregroundRgb.r,
        g: foregroundRgb.g,
        b: foregroundRgb.b,
      }
    : getReadableToneFromBase(foregroundRgb, backgroundBase, luminance < 0.5);

  return {
    background: rgbToCss(backgroundRgb),
    borderColor: rgbToCss(borderRgb, Math.max(resolvedMode === "dark" ? 0.8 : 0.84, backgroundAlpha)),
    color: rgbToCss(textRgb),
    backgroundColor: rgbToHex(backgroundRgb),
    foregroundColor: explicitForegroundColor || rgbToHex(textRgb),
  };
}

function getCustomTagGradientColor(assignment, mode = panelState.themeMode) {
  if (assignment?.type !== "custom") {
    return null;
  }

  const resolvedMode = mode === "dark" ? "dark" : "light";
  const resolvedTheme = getResolvedCustomTagTheme(assignment, resolvedMode);
  const backgroundColor = resolvedTheme?.backgroundColor
    || normalizeHexColor(assignment[`${resolvedMode}BackgroundColor`])
    || normalizeHexColor(assignment.backgroundColor || assignment.baseColor);
  const foregroundColor = resolvedTheme?.foregroundColor
    || normalizeHexColor(assignment[`${resolvedMode}ForegroundColor`])
    || normalizeHexColor(assignment.foregroundColor);

  if (!backgroundColor) {
    return null;
  }

  return getCustomColorTheme({
    backgroundColor,
    ...(foregroundColor ? { foregroundColor } : {}),
  })?.gradient || null;
}

function getTagModeDraft(mode = panelState.themeMode) {
  const resolvedMode = mode === "dark" ? "dark" : "light";
  return panelState.tagCustomModeDrafts[resolvedMode] || panelState.tagCustomModeDrafts.light;
}

function getOppositeThemeMode(mode = panelState.themeMode) {
  return mode === "dark" ? "light" : "dark";
}

function getCopyTagColorsButtonLabel(mode = panelState.themeMode) {
  return mode === "dark" ? "Copy From Light Mode" : "Copy From Dark Mode";
}

function getTagCustomColors(selectedAssignment = null, mode = panelState.themeMode) {
  const resolvedTheme = selectedAssignment?.type === "custom"
    ? getResolvedCustomTagTheme(selectedAssignment, mode)
    : null;
  const draft = getTagModeDraft(mode);

  return {
    backgroundColor: resolvedTheme?.backgroundColor || draft.backgroundColor || panelState.tagCustomColorDraft || "#14b8a6",
    foregroundColor: resolvedTheme?.foregroundColor || draft.foregroundColor || panelState.tagCustomForegroundDraft || "#0f172a",
  };
}

function copyTagColorsFromOtherMode() {
  if (!panelState.selectedTag) {
    return false;
  }

  const selectedAssignment = getTagColorAssignment(panelState.selectedTag);

  if (selectedAssignment?.type !== "custom") {
    return false;
  }

  const currentMode = panelState.themeMode === "dark" ? "dark" : "light";
  const sourceMode = getOppositeThemeMode(currentMode);
  const sourceColors = getTagCustomColors(selectedAssignment, sourceMode);

  getTagModeDraft(currentMode).backgroundColor = sourceColors.backgroundColor;
  getTagModeDraft(currentMode).foregroundColor = sourceColors.foregroundColor;
  panelState.tagCustomColorDraft = sourceColors.backgroundColor;
  panelState.tagCustomForegroundDraft = sourceColors.foregroundColor;

  panelState.tagColorAssignments[panelState.selectedTag.toLowerCase()] = {
    type: "custom",
    lightBackgroundColor: currentMode === "light" ? sourceColors.backgroundColor : getTagCustomColors(selectedAssignment, "light").backgroundColor,
    lightForegroundColor: currentMode === "light" ? sourceColors.foregroundColor : getTagCustomColors(selectedAssignment, "light").foregroundColor,
    darkBackgroundColor: currentMode === "dark" ? sourceColors.backgroundColor : getTagCustomColors(selectedAssignment, "dark").backgroundColor,
    darkForegroundColor: currentMode === "dark" ? sourceColors.foregroundColor : getTagCustomColors(selectedAssignment, "dark").foregroundColor,
  };

  schedulePersistTagColors([panelState.selectedTag]);
  return true;
}

function parseBaseTagColorMap(cssText) {
  const mapping = {};
  const matcher = /a\.tag\[data-ref="([^"]+)" i\]\s*\{[^}]*background-color:\s*var\(--bg-([a-z-]+)\)/gi;
  let match = matcher.exec(cssText);

  while (match) {
    mapping[match[1].trim().toLowerCase()] = { type: "preset", token: match[2] };
    match = matcher.exec(cssText);
  }

  return mapping;
}

function getKnownTagNames() {
  return Array.from(new Set([
    ...panelState.tags,
    ...Object.keys(panelState.tagColorAssignments),
    ...Object.keys(panelState.baseTagColorMap),
  ].map((tagName) => String(tagName || "").trim()).filter(Boolean))).sort((left, right) => left.localeCompare(right));
}

function mergeStoredControls(saved) {
  const merged = { ...DEFAULT_CONTROL_STATE };

  for (const control of ALL_CONTROLS) {
    if (saved?.[control.key] == null) {
      continue;
    }

    const nextValue = Number(saved[control.key]);

    if (Number.isFinite(nextValue)) {
      merged[control.key] = nextValue;
    }
  }

  return merged;
}

function mergeStoredTagColors(saved) {
  const merged = {};

  for (const [tagName, assignment] of Object.entries(saved || {})) {
    if (!tagName) {
      continue;
    }

    const normalizedAssignment = normalizeTagColorAssignment(assignment);

    if (!normalizedAssignment) {
      continue;
    }

    merged[String(tagName).toLowerCase()] = normalizedAssignment;
  }

  return merged;
}

function normalizeGradientStop(stop) {
  if (!stop || typeof stop !== "object") {
    return null;
  }

  const source = ["linked", "transparent", "preset", "custom"].includes(stop.source) ? stop.source : "transparent";
  const position = Math.min(100, Math.max(0, Number(stop.position ?? 0)));
  const normalized = { source, position };

  if (source === "preset" && COLOR_PRESET_MAP[stop.token]) {
    normalized.token = stop.token;
  }

  if (source === "custom") {
    const color = normalizeHexColor(stop.color);

    if (color) {
      normalized.color = color;
    } else {
      normalized.source = "transparent";
    }
  }

  return normalized;
}

function mergeStoredGradients(saved) {
  const merged = createDefaultGradientState();

  for (const areaKey of Object.keys(merged)) {
    const savedArea = saved?.[areaKey];

    if (!savedArea || typeof savedArea !== "object") {
      continue;
    }

    const nextAngle = Number(savedArea.angle);

    if (Number.isFinite(nextAngle)) {
      merged[areaKey].angle = Math.min(360, Math.max(0, nextAngle));
    }

    if (Array.isArray(savedArea.stops)) {
      const stops = savedArea.stops
        .map(normalizeGradientStop)
        .filter(Boolean)
        .sort((left, right) => left.position - right.position);

      if (stops.length >= 2) {
        merged[areaKey].stops = stops;
      }
    }
  }

  return merged;
}

function isMissingStorageError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return message.includes("file not existed") || message.includes("enoent") || message.includes("not exist");
}

function isBenignGetAllTagsError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return message.includes("indexaccess._datoms") || message.includes("defined for type null");
}

function isRecoverableGraphSyncWriteError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return message.includes("get-block error")
    || message.includes("defined for type null")
    || message.includes("no protocol method iswap.-swap! defined for type null");
}

function getLocalPersistenceBackend() {
  try {
    return window.localStorage || null;
  } catch (error) {
    return null;
  }
}

function getLocalPersistenceKey(storageKey) {
  const pluginId = normalizeGraphIdentityPart(logseq?.baseInfo?.id || "degrande-colors") || "degrande-colors";
  return `${pluginId}/${storageKey}`;
}

function readLocalPersistedItem(storageKey) {
  const storage = getLocalPersistenceBackend();

  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(getLocalPersistenceKey(storageKey));
  } catch (error) {
    console.warn(`[Degrande Colors] Failed to read local persisted item: ${storageKey}`, error);
    return null;
  }
}

function writeLocalPersistedItem(storageKey, value) {
  const storage = getLocalPersistenceBackend();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(getLocalPersistenceKey(storageKey), value);
  } catch (error) {
    console.warn(`[Degrande Colors] Failed to write local persisted item: ${storageKey}`, error);
  }
}

function removeLocalPersistedItem(storageKey) {
  const storage = getLocalPersistenceBackend();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(getLocalPersistenceKey(storageKey));
  } catch (error) {
    console.warn(`[Degrande Colors] Failed to remove local persisted item: ${storageKey}`, error);
  }
}

async function loadStoredItemWithLegacyFallback(storageKey) {
  return readLocalPersistedItem(storageKey);
}

function readPluginSettingValue(settingKey) {
  const settings = logseq?.settings || logseq?.baseInfo?.settings || null;

  if (!settings || typeof settings !== "object") {
    return null;
  }

  return settings[settingKey] ?? null;
}

function persistPluginSettingValue(settingKey, value) {
  if (typeof logseq.updateSettings !== "function") {
    return false;
  }

  try {
    logseq.updateSettings({ [settingKey]: value });
    return true;
  } catch (error) {
    console.error(`[Degrande Colors] Failed to persist plugin setting: ${settingKey}`, error);
    return false;
  }
}

function getDegrandeSettingsSchema() {
  return [
    {
      key: SETTINGS_CONTROL_STATE_KEY,
      type: "object",
      default: { ...DEFAULT_CONTROL_STATE },
      title: "Degrande Control State",
      description: "Internal persisted slider values for Degrande Colors.",
    },
    {
      key: SETTINGS_GRADIENT_STATE_KEY,
      type: "object",
      default: createDefaultGradientState(),
      title: "Degrande Gradient State",
      description: "Internal persisted gradient state for Degrande Colors.",
    },
  ];
}

function registerDegrandeSettingsSchema() {
  if (typeof logseq.useSettingsSchema !== "function") {
    return;
  }

  try {
    logseq.useSettingsSchema(getDegrandeSettingsSchema());
  } catch (error) {
    console.error("[Degrande Colors] Failed to register settings schema", error);
  }
}

function getPluginPropertyIdent(propertyKey) {
  const pluginId = String(logseq?.baseInfo?.id || "").trim();
  return pluginId ? `:plugin.property.${pluginId}/${propertyKey}` : "";
}

async function resolveGraphSyncPropertyIdent(propertyKey) {
  if (panelState.propertyIdentMap[propertyKey]) {
    return panelState.propertyIdentMap[propertyKey];
  }

  const fallbackIdent = getPluginPropertyIdent(propertyKey);

  if (typeof logseq.Editor?.getProperty !== "function") {
    panelState.propertyAttrMap[propertyKey] = [fallbackIdent].filter(Boolean);
    return fallbackIdent;
  }

  try {
    const property = await logseq.Editor.getProperty(propertyKey);
    const ident = String(property?.ident || property?.["db/ident"] || fallbackIdent || "");
    const attributeCandidates = Array.from(new Set([
      ident,
      fallbackIdent,
      property?.id,
      property?.["db/id"],
    ].filter((value) => value != null && value !== "").map((value) => String(value))));

    if (ident) {
      panelState.propertyIdentMap[propertyKey] = ident;
    }

    panelState.propertyAttrMap[propertyKey] = attributeCandidates;

    return ident;
  } catch (error) {
    console.warn(`[Degrande Colors] Failed to resolve property ident: ${propertyKey}`, error);
    panelState.propertyAttrMap[propertyKey] = [fallbackIdent].filter(Boolean);
    return fallbackIdent;
  }
}

function getGraphSyncPropertyAttrCandidates(propertyKey) {
  return [
    ...(panelState.propertyAttrMap[propertyKey] || []),
    panelState.propertyIdentMap[propertyKey],
    getPluginPropertyIdent(propertyKey),
  ].filter(Boolean);
}

function parsePersistedPropertyValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

function preferDatascriptGraphReads() {
  return typeof logseq.DB?.datascriptQuery === "function";
}

function canWriteGraphSyncState() {
  return !preferDatascriptGraphReads() || panelState.graphIndexed;
}

function queueDeferredGraphPageState(propertyKey, value) {
  panelState.pendingGraphPageState[propertyKey] = value;
}

function queueDeferredTagColorMigration(options = {}) {
  const existing = panelState.pendingTagColorMigration || { cleanupTagNames: [], entityMap: {} };
  panelState.pendingTagColorMigration = {
    cleanupTagNames: Array.from(new Set([
      ...existing.cleanupTagNames,
      ...((Array.isArray(options.cleanupTagNames) ? options.cleanupTagNames : [])
        .map(getCanonicalTagName)
        .filter(Boolean)),
    ])),
    entityMap: {
      ...existing.entityMap,
      ...(options.entityMap || {}),
    },
  };
}

async function flushDeferredGraphSyncWrites() {
  if (!canWriteGraphSyncState()) {
    return false;
  }

  let flushedAny = false;
  const pendingPageState = { ...panelState.pendingGraphPageState };

  for (const [propertyKey, value] of Object.entries(pendingPageState)) {
    const saved = await saveGraphBackedPageState(propertyKey, value, { suppressReadyErrors: true });

    if (saved) {
      delete panelState.pendingGraphPageState[propertyKey];
      flushedAny = true;
    }
  }

  if (panelState.pendingTagColorMigration) {
    const pendingTagMigration = panelState.pendingTagColorMigration;
    const saved = await saveGraphSyncedTagColors(Object.keys(panelState.tagColorAssignments), {
      suppressReadyErrors: true,
      entityMap: pendingTagMigration.entityMap,
      cleanupTagNames: pendingTagMigration.cleanupTagNames,
    });

    if (saved) {
      panelState.pendingTagColorMigration = null;
      flushedAny = true;
    }
  }

  return flushedAny;
}

function getGraphSyncPropertyDisplayName(propertyKey) {
  switch (propertyKey) {
    case GRAPH_SYNC_CONTROL_PROPERTY:
      return "Degrande Colors Controls";
    case GRAPH_SYNC_GRADIENT_PROPERTY:
      return "Degrande Colors Gradients";
    case GRAPH_SYNC_TAG_COLOR_PROPERTY:
      return "Degrande Colors Tag Sync";
    case GRAPH_SYNC_REVISION_PROPERTY:
      return "Degrande Colors Revision";
    default:
      return "Degrande Colors State";
  }
}

async function getGraphSyncStoragePage(createIfMissing = false) {
  if (typeof logseq.Editor?.getPage !== "function") {
    return null;
  }

  let page = await logseq.Editor.getPage(GRAPH_SYNC_STORAGE_PAGE_NAME);

  if (page || !createIfMissing || typeof logseq.Editor.createPage !== "function") {
    return page;
  }

  try {
    page = await logseq.Editor.createPage(
      GRAPH_SYNC_STORAGE_PAGE_NAME,
      {},
      { redirect: false }
    );
  } catch (error) {
    console.warn("[Degrande Colors] Failed to create sync storage page, retrying lookup", error);
    page = await logseq.Editor.getPage(GRAPH_SYNC_STORAGE_PAGE_NAME);
  }

  return page;
}

async function ensureGraphSyncProperty(propertyKey) {
  if (typeof logseq.Editor?.upsertProperty !== "function") {
    return;
  }

  try {
    await logseq.Editor.upsertProperty(
      propertyKey,
      { type: "json", hide: true, public: false },
      { name: getGraphSyncPropertyDisplayName(propertyKey) }
    );
    void resolveGraphSyncPropertyIdent(propertyKey);
  } catch (error) {
    console.warn(`[Degrande Colors] Failed to ensure graph sync property schema: ${propertyKey}`, error);
  }
}

async function ensureGraphSyncTagColorProperty() {
  await ensureGraphSyncProperty(GRAPH_SYNC_TAG_COLOR_PROPERTY);
}

async function loadGraphSyncRevisionState() {
  const state = await loadGraphBackedPageState(GRAPH_SYNC_REVISION_PROPERTY);
  panelState.syncRevision = state.exists ? normalizeGraphSyncRevision(state.value) : 0;
  syncSyncIndicator();

  return {
    exists: state.exists,
    value: panelState.syncRevision,
  };
}

function getNextGraphSyncRevision() {
  const now = Date.now();
  return now > panelState.syncRevision ? now : panelState.syncRevision + 1;
}

async function bumpGraphSyncRevision(reason = "update") {
  const nextRevision = getNextGraphSyncRevision();
  const saved = await saveGraphBackedPageState(GRAPH_SYNC_REVISION_PROPERTY, nextRevision);

  if (saved) {
    panelState.syncRevision = nextRevision;
    panelState.lastLocalSyncRevision = nextRevision;
    panelState.lastNotifiedSyncRevision = nextRevision;
    syncSyncIndicator();
  } else {
    console.warn(`[Degrande Colors] Failed to bump sync revision after ${reason}`);
  }

  return saved;
}

async function loadGraphBackedPageState(propertyKey, mergeValue) {
  if (typeof logseq.DB?.datascriptQuery !== "function" && typeof logseq.Editor?.getBlockProperty !== "function") {
    return { exists: false, value: null };
  }

  try {
    const propertyIdent = await resolveGraphSyncPropertyIdent(propertyKey);

    if (typeof logseq.DB?.datascriptQuery === "function" && propertyIdent) {
      const rows = await logseq.DB.datascriptQuery(`
        [:find ?v .
         :where
         [?p :block/name "${GRAPH_SYNC_STORAGE_PAGE_NAME}"]
         [?p ${propertyIdent} ?v]]
      `);

      if (rows != null) {
        const parsed = parsePersistedPropertyValue(rows);

        return {
          exists: true,
          value: typeof mergeValue === "function" ? mergeValue(parsed) : parsed,
        };
      }
    }

    // In DB graphs, avoid the block-property fallback during startup.
    // Datascript becomes reliable after indexing, while getBlockProperty can
    // raise noisy get-block errors before the graph is ready.
    if (preferDatascriptGraphReads()) {
      return { exists: false, value: null };
    }

    const page = await getGraphSyncStoragePage(false);

    if (!page) {
      return { exists: false, value: null };
    }

    const saved = await logseq.Editor.getBlockProperty(page.uuid, propertyKey);

    if (saved == null) {
      return { exists: false, value: null };
    }

    const resolved = typeof saved === "object" && saved !== null && "value" in saved
      ? saved.value
      : saved;
    const parsed = typeof resolved === "string" ? JSON.parse(resolved) : resolved;

    return {
      exists: true,
      value: typeof mergeValue === "function" ? mergeValue(parsed) : parsed,
    };
  } catch (error) {
    console.error(`[Degrande Colors] Failed to load graph-backed state: ${propertyKey}`, error);
    return { exists: false, value: null };
  }
}

async function saveGraphBackedPageState(propertyKey, value, options = {}) {
  if (typeof logseq.Editor?.upsertBlockProperty !== "function") {
    return false;
  }

  if (!canWriteGraphSyncState() && (options.deferUntilIndexed || options.suppressReadyErrors)) {
    queueDeferredGraphPageState(propertyKey, value);
    return false;
  }

  try {
    await ensureGraphSyncProperty(propertyKey);
    const page = await getGraphSyncStoragePage(true);

    if (!page) {
      return false;
    }

    await logseq.Editor.upsertBlockProperty(page.uuid, propertyKey, value, { reset: true });
    await resolveGraphSyncPropertyIdent(propertyKey);
    return true;
  } catch (error) {
    if (options.suppressReadyErrors && isRecoverableGraphSyncWriteError(error)) {
      return false;
    }

    console.error(`[Degrande Colors] Failed to persist graph-backed state: ${propertyKey}`, error);
    return false;
  }
}

async function removeGraphBackedPageState(propertyKey) {
  if (typeof logseq.Editor?.removeBlockProperty !== "function") {
    return false;
  }

  try {
    const page = await getGraphSyncStoragePage(false);

    if (!page) {
      return true;
    }

    await logseq.Editor.removeBlockProperty(page.uuid, propertyKey);
    return true;
  } catch (error) {
    console.error(`[Degrande Colors] Failed to clear graph-backed state: ${propertyKey}`, error);
    return false;
  }
}

async function loadPageBackedTagColorState() {
  if (typeof logseq.DB?.datascriptQuery !== "function" && typeof logseq.Editor?.getBlockProperty !== "function") {
    return { exists: false, tagColors: {} };
  }

  try {
    const propertyIdent = await resolveGraphSyncPropertyIdent(GRAPH_SYNC_TAG_COLOR_PROPERTY);

    if (typeof logseq.DB?.datascriptQuery === "function" && propertyIdent) {
      const row = await logseq.DB.datascriptQuery(`
        [:find ?v .
         :where
         [?p :block/name "${GRAPH_SYNC_STORAGE_PAGE_NAME}"]
         [?p ${propertyIdent} ?v]]
      `);

      if (row != null) {
        return {
          exists: true,
          tagColors: mergeStoredTagColors(parsePersistedPropertyValue(row)),
        };
      }
    }

    // Query-backed DB reads are the primary source in Logseq DB mode.
    // Skip the page/block fallback there to avoid startup get-block noise.
    if (preferDatascriptGraphReads()) {
      return { exists: false, tagColors: {} };
    }

    const page = await getGraphSyncStoragePage(false);

    if (!page) {
      return { exists: false, tagColors: {} };
    }

    const saved = await logseq.Editor.getBlockProperty(page.uuid, GRAPH_SYNC_TAG_COLOR_PROPERTY);

    if (saved == null) {
      return { exists: false, tagColors: {} };
    }

    const resolved = typeof saved === "object" && saved !== null && "value" in saved
      ? saved.value
      : saved;

    return {
      exists: true,
      tagColors: mergeStoredTagColors(typeof resolved === "string" ? JSON.parse(resolved) : resolved),
    };
  } catch (error) {
    console.error("[Degrande Colors] Failed to load page-backed tag colors", error);
    return { exists: false, tagColors: {} };
  }
}

async function resolveTagStorageTarget(tagName, tagCatalog = null) {
  const canonicalTagName = getCanonicalTagName(tagName);
  const normalizedKey = canonicalTagName.toLowerCase();
  const entityMap = tagCatalog?.tagEntityMap || panelState.tagEntityMap;
  const existing = entityMap?.[normalizedKey];

  if (existing?.uuid || existing?.id != null) {
    return existing.uuid || existing.id;
  }

  let target = null;

  if (typeof logseq.Editor?.getPage === "function") {
    target = await logseq.Editor.getPage(canonicalTagName);
  }

  if (!target && typeof logseq.Editor?.getTag === "function") {
    target = await logseq.Editor.getTag(canonicalTagName);
  }

  if (!target && typeof logseq.Editor?.getTagsByName === "function") {
    const matches = await logseq.Editor.getTagsByName(canonicalTagName);
    target = matches?.[0] || null;
  }

  if (!target) {
    return null;
  }

  panelState.tagEntityMap[normalizedKey] = {
    uuid: typeof target.uuid === "string" ? target.uuid : "",
    id: target.id ?? null,
  };

  return panelState.tagEntityMap[normalizedKey].uuid || panelState.tagEntityMap[normalizedKey].id;
}

async function loadEntityBackedTagColorState(tagCatalog = null) {
  if (typeof logseq.Editor?.getBlockProperty !== "function") {
    return { exists: false, tagColors: {}, tagCatalog };
  }

  const resolvedTagCatalog = tagCatalog || await collectTagCatalog();
  const tagColors = {};

  for (const tagName of resolvedTagCatalog.tags || []) {
    const target = await resolveTagStorageTarget(tagName, resolvedTagCatalog);

    if (typeof target !== "string" || !target) {
      continue;
    }

    try {
      const saved = await logseq.Editor.getBlockProperty(target, GRAPH_SYNC_TAG_COLOR_PROPERTY);

      if (saved == null) {
        continue;
      }

      const resolved = typeof saved === "object" && saved !== null && "value" in saved
        ? saved.value
        : saved;
      const assignment = normalizeTagColorAssignment(typeof resolved === "string" ? JSON.parse(resolved) : resolved);

      if (assignment) {
        tagColors[tagName.toLowerCase()] = assignment;
      }
    } catch (error) {
      console.warn(`[Degrande Colors] Failed to load tag color for ${tagName}`, error);
    }
  }

  return {
    exists: Object.keys(tagColors).length > 0,
    tagColors,
    tagCatalog: resolvedTagCatalog,
  };
}

async function loadQueryBackedTagColorState() {
  if (typeof logseq.DB?.datascriptQuery !== "function") {
    return { exists: false, tagColors: {}, tagNames: [], tagEntityMap: {}, tagSourceMap: {} };
  }

  const propertyIdent = await resolveGraphSyncPropertyIdent(GRAPH_SYNC_TAG_COLOR_PROPERTY);

  if (!propertyIdent) {
    return { exists: false, tagColors: {}, tagNames: [], tagEntityMap: {}, tagSourceMap: {} };
  }

  try {
    const rows = await logseq.DB.datascriptQuery(`
      [:find (pull ?b [:db/id :block/uuid :block/name :block/original-name :block/title :block/type]) ?v
       :where
       [?b ${propertyIdent} ?v]]
    `);
    const tagColors = {};
    const tagEntityMap = {};
    const tagSourceMap = {};
    const tagNames = [];

    for (const row of rows || []) {
      const [entity, rawValue] = Array.isArray(row) ? row : [null, null];
      const tagName = normalizeTagName(entity);

      if (!tagName || tagName.toLowerCase() === GRAPH_SYNC_STORAGE_PAGE_NAME.toLowerCase()) {
        continue;
      }

      const assignment = normalizeTagColorAssignment(parsePersistedPropertyValue(rawValue));

      if (!assignment) {
        continue;
      }

      const normalizedKey = tagName.toLowerCase();
      tagColors[normalizedKey] = assignment;
      tagEntityMap[normalizedKey] = {
        uuid: typeof entity?.uuid === "string" ? entity.uuid : "",
        id: entity?.id ?? entity?.["db/id"] ?? null,
      };

      const entityType = String(entity?.type || entity?.["block/type"] || "").toLowerCase();
      tagSourceMap[normalizedKey] = {
        tags: entityType === "class",
        pages: entityType === "page" || entityType === "class" || !entityType,
      };
      tagNames.push(tagName);
    }

    return {
      exists: Object.keys(tagColors).length > 0,
      tagColors,
      tagNames: dedupeTagNames(tagNames),
      tagEntityMap,
      tagSourceMap,
    };
  } catch (error) {
    console.error("[Degrande Colors] Failed to query synced tag colors from DB", error);
    return { exists: false, tagColors: {}, tagNames: [], tagEntityMap: {}, tagSourceMap: {} };
  }
}

async function cleanupLegacyEntityBackedTagColors(tagNames = [], entityMap = {}, options = {}) {
  if (typeof logseq.Editor?.removeBlockProperty !== "function") {
    return false;
  }

  const namesToClean = Array.from(new Set((Array.isArray(tagNames) ? tagNames : [tagNames])
    .map((tagName) => getCanonicalTagName(tagName))
    .filter(Boolean)));

  if (!namesToClean.length) {
    return true;
  }

  let removedAny = false;

  for (const tagName of namesToClean) {
    const normalizedKey = tagName.toLowerCase();
    const mappedEntity = entityMap?.[normalizedKey] || panelState.tagEntityMap?.[normalizedKey] || null;
    const target = mappedEntity?.uuid || mappedEntity?.id || await resolveTagStorageTarget(tagName);

    if (!target) {
      continue;
    }

    try {
      await logseq.Editor.removeBlockProperty(target, GRAPH_SYNC_TAG_COLOR_PROPERTY);
      removedAny = true;
    } catch (error) {
      if (options.suppressReadyErrors && isRecoverableGraphSyncWriteError(error)) {
        continue;
      }

      console.warn(`[Degrande Colors] Failed to clear legacy tag color property for ${tagName}`, error);
    }
  }

  return removedAny;
}

async function loadLegacyGraphConfigTagColorState() {
  if (typeof logseq.App?.getCurrentGraphConfigs !== "function") {
    return { exists: false, tagColors: {} };
  }

  try {
    const saved = await logseq.App.getCurrentGraphConfigs(GRAPH_SYNC_CONFIG_KEY);

    if (!saved || typeof saved !== "object") {
      return { exists: false, tagColors: {} };
    }

    return {
      exists: true,
      tagColors: mergeStoredTagColors(saved.tagColors),
    };
  } catch (error) {
    console.error("[Degrande Colors] Failed to load legacy graph-config tag colors", error);
    return { exists: false, tagColors: {} };
  }
}

async function saveGraphSyncedTagColors(tagNames = null, options = {}) {
  const normalizedTagColors = mergeStoredTagColors(panelState.tagColorAssignments);

  if (typeof logseq.Editor?.upsertBlockProperty !== "function") {
    writeLocalPersistedItem(TAG_COLOR_STORAGE_KEY, JSON.stringify(normalizedTagColors));
    return false;
  }

  const namesToCleanup = Array.from(new Set([
    ...((Array.isArray(options.cleanupTagNames) ? options.cleanupTagNames : []).map(getCanonicalTagName)),
    ...((Array.isArray(tagNames) && tagNames.length ? tagNames : Object.keys(normalizedTagColors)).map(getCanonicalTagName)),
  ].filter(Boolean)));

  if (!canWriteGraphSyncState() && options.suppressReadyErrors) {
    queueDeferredTagColorMigration({
      cleanupTagNames: namesToCleanup,
      entityMap: options.entityMap,
    });
    return false;
  }

  try {
    await ensureGraphSyncTagColorProperty();

    const saved = Object.keys(normalizedTagColors).length
      ? await saveGraphBackedPageState(GRAPH_SYNC_TAG_COLOR_PROPERTY, normalizedTagColors, {
        ...options,
        deferUntilIndexed: true,
      })
      : await removeGraphBackedPageState(GRAPH_SYNC_TAG_COLOR_PROPERTY);

    if (!saved) {
      return false;
    }

    if (namesToCleanup.length) {
      await cleanupLegacyEntityBackedTagColors(namesToCleanup, options.entityMap, {
        suppressReadyErrors: options.suppressReadyErrors,
      });
    }

    removeLocalPersistedItem(TAG_COLOR_STORAGE_KEY);
    await bumpGraphSyncRevision("tag-colors");
    return true;
  } catch (error) {
    if (options.suppressReadyErrors && isRecoverableGraphSyncWriteError(error)) {
      return false;
    }

    console.error("[Degrande Colors] Failed to persist graph-backed tag colors", error);
    return false;
  }
}

async function loadStoredControls() {
  try {
    const graphBackedState = await loadGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, mergeStoredControls);

    if (graphBackedState.exists) {
      panelState.controlState = graphBackedState.value;
      return;
    }

    const settingsValue = readPluginSettingValue(SETTINGS_CONTROL_STATE_KEY);

    if (settingsValue != null) {
      panelState.controlState = mergeStoredControls(settingsValue);
      await saveGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, panelState.controlState, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });
      return;
    }

    const saved = await loadStoredItemWithLegacyFallback(CONTROL_STORAGE_KEY);

    if (!saved) {
      return;
    }

    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
    panelState.controlState = mergeStoredControls(parsed);
    await saveGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, panelState.controlState, {
      suppressReadyErrors: true,
      deferUntilIndexed: true,
    });
  } catch (error) {
    if (isMissingStorageError(error)) {
      return;
    }

    console.error("[Local Custom Theme Loader] Failed to load stored controls", error);
  }
}

async function loadStoredTagColors(options = {}) {
  const allowEntityFallback = options.allowEntityFallback ?? typeof logseq.DB?.datascriptQuery !== "function";

  try {
    const pageBackedState = await loadPageBackedTagColorState();

    if (pageBackedState.exists) {
      panelState.tagColorAssignments = pageBackedState.tagColors;

      if (!panelState.tagColorCleanupChecked) {
        const queryBackedState = await loadQueryBackedTagColorState();

        if (queryBackedState.exists) {
          panelState.tagEntityMap = {
            ...panelState.tagEntityMap,
            ...queryBackedState.tagEntityMap,
          };
          panelState.tagSourceMap = {
            ...panelState.tagSourceMap,
            ...queryBackedState.tagSourceMap,
          };
          panelState.tags = dedupeTagNames([
            ...panelState.tags,
            ...queryBackedState.tagNames,
          ]);

          if (canWriteGraphSyncState()) {
            await cleanupLegacyEntityBackedTagColors(queryBackedState.tagNames, queryBackedState.tagEntityMap, {
              suppressReadyErrors: true,
            });
          } else {
            queueDeferredTagColorMigration({
              cleanupTagNames: queryBackedState.tagNames,
              entityMap: queryBackedState.tagEntityMap,
            });
          }

          panelState.tagColorCleanupChecked = false;
        } else {
          panelState.tagColorCleanupChecked = true;
        }
      }

      return;
    }

    const queryBackedState = await loadQueryBackedTagColorState();

    if (queryBackedState.exists) {
      panelState.tagColorAssignments = queryBackedState.tagColors;
      panelState.tagEntityMap = {
        ...panelState.tagEntityMap,
        ...queryBackedState.tagEntityMap,
      };
      panelState.tagSourceMap = {
        ...panelState.tagSourceMap,
        ...queryBackedState.tagSourceMap,
      };
      panelState.tags = dedupeTagNames([
        ...panelState.tags,
        ...queryBackedState.tagNames,
      ]);

      if (!panelState.selectedTag && panelState.tags.length) {
        panelState.selectedTag = panelState.tags[0];
      }

      await saveGraphSyncedTagColors(Object.keys(panelState.tagColorAssignments), {
        suppressReadyErrors: true,
        entityMap: queryBackedState.tagEntityMap,
        cleanupTagNames: queryBackedState.tagNames,
      });
      panelState.tagColorCleanupChecked = false;
      return;
    }

    if (allowEntityFallback) {
      const tagCatalog = await collectTagCatalog();
      panelState.tagEntityMap = tagCatalog.tagEntityMap || {};

      const entityBackedState = await loadEntityBackedTagColorState(tagCatalog);

      if (entityBackedState.exists) {
        panelState.tagColorAssignments = entityBackedState.tagColors;
        await saveGraphSyncedTagColors(Object.keys(panelState.tagColorAssignments), {
          suppressReadyErrors: true,
          entityMap: tagCatalog.tagEntityMap,
          cleanupTagNames: Object.keys(entityBackedState.tagColors),
        });
        panelState.tagColorCleanupChecked = false;
        return;
      }
    }

    const legacyGraphConfigState = await loadLegacyGraphConfigTagColorState();

    if (legacyGraphConfigState.exists) {
      panelState.tagColorAssignments = legacyGraphConfigState.tagColors;

      if (Object.keys(panelState.tagColorAssignments).length) {
        await saveGraphSyncedTagColors(Object.keys(panelState.tagColorAssignments), {
          suppressReadyErrors: true,
        });
      }

      panelState.tagColorCleanupChecked = true;

      return;
    }

    const saved = await loadStoredItemWithLegacyFallback(TAG_COLOR_STORAGE_KEY);

    if (!saved) {
      panelState.tagColorAssignments = {};
      return;
    }

    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
    panelState.tagColorAssignments = mergeStoredTagColors(parsed);

    if (Object.keys(panelState.tagColorAssignments).length) {
      await saveGraphSyncedTagColors(Object.keys(panelState.tagColorAssignments), {
        suppressReadyErrors: true,
      });
    }

    panelState.tagColorCleanupChecked = true;
  } catch (error) {
    if (isMissingStorageError(error)) {
      return;
    }

    console.error("[Local Custom Theme Loader] Failed to load stored tag colors", error);
  }
}

async function loadStoredGradients() {
  try {
    const graphBackedState = await loadGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, mergeStoredGradients);

    if (graphBackedState.exists) {
      panelState.gradientState = graphBackedState.value;
      return;
    }

    const settingsValue = readPluginSettingValue(SETTINGS_GRADIENT_STATE_KEY);

    if (settingsValue != null) {
      panelState.gradientState = mergeStoredGradients(settingsValue);
      await saveGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, panelState.gradientState, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });
      return;
    }

    const saved = await loadStoredItemWithLegacyFallback(GRADIENT_STORAGE_KEY);

    if (!saved) {
      return;
    }

    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
    panelState.gradientState = mergeStoredGradients(parsed);
    await saveGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, panelState.gradientState, {
      suppressReadyErrors: true,
      deferUntilIndexed: true,
    });
  } catch (error) {
    if (isMissingStorageError(error)) {
      return;
    }

    console.error("[Local Custom Theme Loader] Failed to load stored gradients", error);
  }
}

function schedulePersistControls() {
  if (panelState.persistTimer) {
    clearTimeout(panelState.persistTimer);
  }

  setSyncState("pending");

  panelState.persistTimer = setTimeout(async () => {
    try {
      const saved = await saveGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, panelState.controlState);

      if (saved) {
        removeLocalPersistedItem(CONTROL_STORAGE_KEY);
        await bumpGraphSyncRevision("controls");
        setSyncState("synced");
      }
    } catch (error) {
      console.error("[Local Custom Theme Loader] Failed to persist controls", error);
      setSyncState("pending");
    } finally {
      panelState.persistTimer = null;
      syncSyncIndicator();
    }
  }, 120);
}

function schedulePersistTagColors(tagNames = []) {
  const names = (Array.isArray(tagNames) ? tagNames : [tagNames])
    .map((tagName) => getCanonicalTagName(tagName))
    .filter(Boolean);

  if (names.length) {
    panelState.pendingTagPersistKeys = Array.from(new Set([
      ...panelState.pendingTagPersistKeys,
      ...names,
    ]));
  }

  setSyncState("pending");

  if (panelState.tagPersistTimer) {
    clearTimeout(panelState.tagPersistTimer);
  }

  panelState.tagPersistTimer = setTimeout(async () => {
    const pendingTagNames = panelState.pendingTagPersistKeys.slice();
    panelState.pendingTagPersistKeys = [];

    try {
      const saved = await saveGraphSyncedTagColors(pendingTagNames);
      setSyncState(saved ? "synced" : "pending");
    } catch (error) {
      console.error("[Local Custom Theme Loader] Failed to persist tag colors", error);
      setSyncState("pending");
    } finally {
      panelState.tagPersistTimer = null;
      syncSyncIndicator();
    }
  }, 120);
}

function schedulePersistGradients() {
  if (panelState.gradientPersistTimer) {
    clearTimeout(panelState.gradientPersistTimer);
  }

  setSyncState("pending");

  panelState.gradientPersistTimer = setTimeout(async () => {
    try {
      const saved = await saveGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, panelState.gradientState);

      if (saved) {
        removeLocalPersistedItem(GRADIENT_STORAGE_KEY);
        await bumpGraphSyncRevision("gradients");
        setSyncState("synced");
      }
    } catch (error) {
      console.error("[Local Custom Theme Loader] Failed to persist gradients", error);
      setSyncState("pending");
    } finally {
      panelState.gradientPersistTimer = null;
      syncSyncIndicator();
    }
  }, 120);
}

function getGradientArea(areaKey) {
  return panelState.gradientState[areaKey];
}

function getSelectedGradientStopIndex(areaKey) {
  const area = getGradientArea(areaKey);

  if (!area || !area.stops.length) {
    panelState.gradientSelections[areaKey] = 0;
    return 0;
  }

  const currentIndex = Number(panelState.gradientSelections[areaKey] ?? 0);
  const safeIndex = Math.min(area.stops.length - 1, Math.max(0, currentIndex));
  panelState.gradientSelections[areaKey] = safeIndex;
  return safeIndex;
}

function setSelectedGradientStop(areaKey, stopIndex) {
  const area = getGradientArea(areaKey);

  if (!area || !area.stops.length) {
    panelState.gradientSelections[areaKey] = 0;
    return;
  }

  panelState.gradientSelections[areaKey] = Math.min(area.stops.length - 1, Math.max(0, Number(stopIndex) || 0));
}

function getSuggestedGradientStopPosition(area) {
  if (!area?.stops?.length) {
    return 50;
  }

  const sortedStops = area.stops.slice().sort((left, right) => left.position - right.position);
  let bestGap = -1;
  let suggestedPosition = 50;

  for (let index = 0; index < sortedStops.length - 1; index += 1) {
    const current = sortedStops[index];
    const next = sortedStops[index + 1];
    const gap = next.position - current.position;

    if (gap > bestGap) {
      bestGap = gap;
      suggestedPosition = current.position + (gap / 2);
    }
  }

  return Math.round(Math.min(100, Math.max(0, suggestedPosition)));
}

function getGradientStripElement(areaKey) {
  return document.querySelector(`[data-gradient-strip][data-area-key="${areaKey}"]`);
}

function getGradientPositionFromClientX(areaKey, clientX) {
  const strip = getGradientStripElement(areaKey);

  if (!strip) {
    return null;
  }

  const rect = strip.getBoundingClientRect();
  const relativeX = clientX - rect.left;
  return Math.round(Math.min(100, Math.max(0, (relativeX / Math.max(rect.width, 1)) * 100)));
}

function getGradientStopColor(stop, linkedColor, mode = "runtime") {
  if (!stop) {
    return "transparent";
  }

  if (stop.source === "linked") {
    return linkedColor;
  }

  if (stop.source === "transparent") {
    return "transparent";
  }

  if (stop.source === "preset" && stop.token && COLOR_PRESET_MAP[stop.token]) {
    if (mode === "runtime") {
      return `var(--grad-${stop.token})`;
    }

    const preset = COLOR_PRESET_MAP[stop.token];
    return panelState.themeMode === "dark" ? preset.darkBorder : preset.lightBorder;
  }

  if (stop.source === "custom" && stop.color) {
    const rgb = hexToRgb(stop.color);
    return rgb ? rgbToCss(rgb) : stop.color;
  }

  return "transparent";
}

function buildGradientCss(areaKey, linkedColor, mode = "runtime") {
  const area = getGradientArea(areaKey);

  if (!area) {
    return "none";
  }

  const stops = area.stops
    .slice()
    .sort((left, right) => left.position - right.position)
    .map((stop) => `${getGradientStopColor(stop, linkedColor, mode)} ${stop.position}%`)
    .join(", ");

  return `linear-gradient(${area.angle}deg, ${stops})`;
}

function updateGradientStop(areaKey, stopIndex, patch) {
  const area = getGradientArea(areaKey);
  const stop = area?.stops?.[stopIndex];

  if (!area || !stop) {
    return;
  }

  Object.assign(stop, patch);

  if (stop.source === "preset" && !COLOR_PRESET_MAP[stop.token]) {
    stop.token = COLOR_PRESETS[0].token;
    delete stop.color;
  }

  if (stop.source === "custom") {
    stop.color = normalizeHexColor(stop.color) || "#14b8a6";
    delete stop.token;
  }

  if (stop.source === "transparent" || stop.source === "linked") {
    delete stop.token;
    delete stop.color;
  }

  stop.position = Math.min(100, Math.max(0, Number(stop.position ?? 0)));
  setSelectedGradientStop(areaKey, area.stops.indexOf(stop));
}

function addGradientStop(areaKey, position = null) {
  const area = getGradientArea(areaKey);

  if (!area) {
    return 0;
  }

  const selectedStop = area.stops[getSelectedGradientStopIndex(areaKey)] || null;
  const nextStop = selectedStop
    ? {
        source: selectedStop.source,
        ...(selectedStop.token ? { token: selectedStop.token } : {}),
        ...(selectedStop.color ? { color: selectedStop.color } : {}),
      }
    : {
        source: "linked",
      };

  nextStop.position = Math.min(100, Math.max(0, Number(position ?? getSuggestedGradientStopPosition(area))));

  area.stops.push(nextStop);
  area.stops.sort((left, right) => left.position - right.position);
  const nextIndex = area.stops.indexOf(nextStop);
  setSelectedGradientStop(areaKey, nextIndex);
  return nextIndex;
}

function removeGradientStop(areaKey, stopIndex) {
  const area = getGradientArea(areaKey);

  if (!area || area.stops.length <= 2) {
    return;
  }

  area.stops.splice(stopIndex, 1);
  setSelectedGradientStop(areaKey, Math.min(stopIndex, area.stops.length - 1));
}

function getVisibleTags() {
  const filter = panelState.tagFilter.trim().toLowerCase();

  const filtered = panelState.tags.filter((tagName) => {
    return matchesTagSourceFilters(tagName) && (!filter || tagName.toLowerCase().includes(filter));
  });

  return filtered.sort((left, right) => {
    const leftColor = getTagColorToken(left) || "zzzz";
    const rightColor = getTagColorToken(right) || "zzzz";
    const leftAssigned = Boolean(panelState.tagColorAssignments[left.toLowerCase()]);
    const rightAssigned = Boolean(panelState.tagColorAssignments[right.toLowerCase()]);

    if (panelState.tagSortMode === "color") {
      return leftColor.localeCompare(rightColor) || left.localeCompare(right);
    }

    if (panelState.tagSortMode === "customized") {
      return Number(rightAssigned) - Number(leftAssigned) || left.localeCompare(right);
    }

    return left.localeCompare(right);
  });
}

function buildTagChipStyleAttribute(tagName) {
  const style = getTagChipThemeStyle(getTagColorAssignment(tagName));
  const controls = panelState.controlState;
  const isDark = panelState.themeMode === "dark";
  const baseShadow = isDark
    ? "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 1px 2px rgba(2, 6, 23, 0.28)"
    : "inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 1px 2px rgba(15, 23, 42, 0.08)";
  const hoverShadow = isDark
    ? "inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 2px 4px rgba(2, 6, 23, 0.34)"
    : "inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 2px 4px rgba(15, 23, 42, 0.12)";

  return [
    `background:${style.background}`,
    `border:${controls.tagBorderWidth}px solid ${style.borderColor}`,
    `color:${style.color}`,
    `border-radius:${controls.tagRadius}px`,
    `font-size:${controls.tagFontSize}px`,
    `line-height:1.2`,
    "font-weight:500",
    `height:${controls.tagHeight}px`,
    `padding:1px ${controls.tagPaddingX}px`,
    `box-shadow:${baseShadow}`,
    `--ctl-tag-chip-base-shadow:${baseShadow}`,
    `--ctl-tag-chip-hover-shadow:${hoverShadow}`,
  ].join(";");
}

function buildTagListMarkup() {
  const tags = getVisibleTags();

  if (!tags.length) {
    return '<div class="ctl-tag-empty">No entries matched the current filters.</div>';
  }

  return tags.map((tagName) => {
    const isSelected = panelState.selectedTag === tagName;
    const token = getTagColorToken(tagName);
    const label = token ? `${tagName} · ${token}` : tagName;
    const hint = `${label}. Click to select. Double-click to assign a random preset color. Right-click to reset.`;

    return `
      <button
        class="ctl-tag-chip${isSelected ? " is-selected" : ""}"
        type="button"
        data-select-tag="${escapeHtml(tagName)}"
        data-tag-chip-name="${escapeHtml(tagName)}"
        title="${escapeHtml(hint)}"
        style="${buildTagChipStyleAttribute(tagName)}"
      >#${escapeHtml(tagName)}</button>
    `;
  }).join("");
}

function buildColorPaletteMarkup() {
  if (!panelState.selectedTag) {
    return '<div class="ctl-tag-empty">Select a tag to assign one of the preset colors.</div>';
  }

  return COLOR_PRESETS.map((preset) => {
    const isActive = getTagColorToken(panelState.selectedTag) === preset.token;
    const style = getTagChipThemeStyle(preset.token);

    return `
      <button
        class="ctl-color-option${isActive ? " is-active" : ""}"
        type="button"
        data-set-tag-color="${preset.token}"
        aria-label="Set ${escapeHtml(panelState.selectedTag)} to ${preset.label}"
        title="Set ${escapeHtml(panelState.selectedTag)} to ${preset.label}"
        style="background:${style.background};border-color:${style.borderColor};color:${style.color};"
      ></button>
    `;
  }).join("");
}

function buildCustomTagColorMarkup() {
  const selectedAssignment = panelState.selectedTag ? getTagColorAssignment(panelState.selectedTag) : null;
  const { backgroundColor, foregroundColor } = getTagCustomColors(selectedAssignment);

  return `
    <div class="ctl-custom-color-box">
      <div class="ctl-custom-color-head">
        <strong>Custom Tag Colors</strong>
        <span>Choose a color and it applies directly to the selected tag.</span>
      </div>
      <div class="ctl-custom-color-grid">
        <section class="ctl-custom-color-panel">
          <span class="ctl-custom-color-label">Background</span>
          ${buildInlineColorEditorMarkup({
            color: backgroundColor,
            scope: "tag-custom-background",
            disabled: !panelState.selectedTag,
          })}
        </section>
        <section class="ctl-custom-color-panel">
          <span class="ctl-custom-color-label">Foreground</span>
          ${buildInlineColorEditorMarkup({
            color: foregroundColor,
            scope: "tag-custom-foreground",
            disabled: !panelState.selectedTag,
          })}
        </section>
      </div>
    </div>
  `;
}

function buildInlineColorEditorMarkup({ color, scope, areaKey = "", stopIndex = "", disabled = false }) {
  const rgb = hexToRgb(color) || { r: 20, g: 184, b: 166, a: 1 };
  const hsv = rgbToHsv(rgb);
  const normalized = normalizeHexColor(color) || rgbToHex(rgb);
  const disabledAttr = disabled ? " disabled" : "";
  const scopeAttrs = `data-inline-color-editor data-color-scope="${scope}" data-color-value="${normalized}" data-inline-color-disabled="${disabled ? "true" : "false"}"${areaKey ? ` data-area-key="${areaKey}"` : ""}${stopIndex !== "" ? ` data-stop-index="${stopIndex}"` : ""}`;
  const hueColor = rgbToCss(hsvToRgb({ h: hsv.h, s: 1, v: 1, a: 1 }));
  const alphaBase = rgbToCss({ r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });

  return `
    <div class="ctl-inline-color-editor" ${scopeAttrs}>
      <div class="ctl-inline-color-top">
        <span class="ctl-inline-color-swatch" data-inline-color-swatch style="background-color:${normalized};"></span>
        <input class="ctl-input ctl-inline-color-hex" type="text" value="${normalized}" maxlength="9" spellcheck="false" data-inline-color-hex${disabledAttr}>
      </div>
      <div class="ctl-inline-color-spectrum" data-inline-color-spectrum style="--ctl-picker-hue:${hueColor};">
        <div class="ctl-inline-color-spectrum-thumb" data-inline-color-spectrum-thumb style="left:${hsv.s * 100}%; top:${(1 - hsv.v) * 100}%;"></div>
      </div>
      <div class="ctl-inline-color-sliders">
        <label class="ctl-inline-color-slider">
          <span>Hue</span>
          <input class="ctl-range ctl-inline-color-range" type="range" min="0" max="360" step="1" value="${hsv.h}" data-inline-color-hue${disabledAttr}>
          <strong data-inline-color-hue-value>${Math.round(hsv.h)}deg</strong>
        </label>
        <label class="ctl-inline-color-slider">
          <span>Alpha</span>
          <input class="ctl-range ctl-inline-color-range ctl-inline-color-alpha" type="range" min="0" max="100" step="1" value="${Math.round(hsv.a * 100)}" data-inline-color-alpha style="--ctl-alpha-base:${alphaBase};"${disabledAttr}>
          <strong data-inline-color-alpha-value>${Math.round(hsv.a * 100)}%</strong>
        </label>
      </div>
    </div>
  `;
}

function buildPaneIntroMarkup(title, description) {
  return `
    <section class="ctl-section ctl-section-inline">
      <div class="ctl-section-head">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(description)}</p>
        </div>
      </div>
    </section>
  `;
}

function buildTagsPaneMarkup() {
  const tags = getVisibleTags();
  const bulkColorableTags = getBulkColorableTags();
  const selectedTag = panelState.selectedTag;
  const selectedColor = selectedTag ? getTagColorToken(selectedTag) : null;
  const selectedAssignment = selectedTag ? getTagColorAssignment(selectedTag) : null;
  const hasCustomAssignment = selectedAssignment?.type === "custom";
  const hasTagAssignments = Object.keys(panelState.tagColorAssignments).length > 0;
  const hasUncoloredTags = bulkColorableTags.some((tagName) => !getTagColorToken(tagName));

  return `
    ${buildPaneIntroMarkup(
      "Start With Tags",
      "Assign tag colors here first. Then switch to Appearance to tune chip spacing and graph-wide gradients for your Logseq DB graph."
    )}
    <div class="ctl-tags-layout">
      <section class="ctl-tags-browser">
        <div class="ctl-tags-toolbar">
          <label class="ctl-field">
            <span>Filter</span>
            <input class="ctl-input" data-tag-filter type="search" value="${escapeHtml(panelState.tagFilter)}" placeholder="Search tags">
          </label>
          <label class="ctl-field ctl-field-select">
            <span>Sort</span>
            <select class="ctl-select" data-tag-sort>
              <option value="name"${panelState.tagSortMode === "name" ? " selected" : ""}>Name</option>
              <option value="color"${panelState.tagSortMode === "color" ? " selected" : ""}>Color</option>
              <option value="customized"${panelState.tagSortMode === "customized" ? " selected" : ""}>Customized First</option>
            </select>
          </label>
        </div>
        <div class="ctl-filter-toggle-grid" role="group" aria-label="Tag source filters">
          <button class="ctl-button ctl-button-secondary ctl-button-small ctl-filter-toggle${panelState.tagSourceFilters.tags ? " is-active" : ""}" type="button" data-action="toggle-tag-source-filter" data-role="tag-source-filter-tags" data-source-filter="tags" aria-pressed="${panelState.tagSourceFilters.tags ? "true" : "false"}">
            <span>Tags</span>
            <span class="ctl-filter-toggle-count">${getSourceCount("tags")}</span>
          </button>
          <button class="ctl-button ctl-button-secondary ctl-button-small ctl-filter-toggle${panelState.tagSourceFilters.pages ? " is-active" : ""}" type="button" data-action="toggle-tag-source-filter" data-role="tag-source-filter-pages" data-source-filter="pages" aria-pressed="${panelState.tagSourceFilters.pages ? "true" : "false"}">
            <span>Pages</span>
            <span class="ctl-filter-toggle-count">${getSourceCount("pages")}</span>
          </button>
        </div>
        <div class="ctl-tags-summary" data-role="tags-summary">${tags.length} visible entries · ${getVisibleAssignedTagCount()} custom assignments</div>
        <div class="ctl-tag-grid" data-role="tag-grid">${buildTagListMarkup()}</div>
      </section>
      <section class="ctl-tags-detail">
        <div class="ctl-tags-detail-head">
          <strong>${selectedTag ? `#${escapeHtml(selectedTag)}` : "Tag Color"}</strong>
          <span data-role="selected-tag-color-label">${selectedTag ? `Current color: ${selectedColor || "default"}` : "Choose a tag to edit its color"}</span>
        </div>
        <div class="ctl-selected-tag-preview-wrap">
          ${selectedTag ? `<span class="ctl-selected-tag-preview" data-role="selected-tag-preview" style="${buildTagChipStyleAttribute(selectedTag)}">#${escapeHtml(selectedTag)}</span>` : ""}
        </div>
        <div class="ctl-tags-detail-scroll" data-role="tags-detail-scroll">
          <div class="ctl-color-grid">${buildColorPaletteMarkup()}</div>
          ${buildCustomTagColorMarkup()}
          <div class="ctl-tags-actions">
            <button class="ctl-button ctl-button-secondary" type="button" data-action="add-random-tag-colors" data-role="add-random-tag-colors-button"${hasUncoloredTags ? "" : " disabled"}>Add Colors To Tags</button>
            <button class="ctl-button ctl-button-secondary" type="button" data-action="copy-tag-colors-from-other-mode"${selectedTag && hasCustomAssignment ? "" : " disabled"}>${getCopyTagColorsButtonLabel()}</button>
            <button class="ctl-button ctl-button-secondary" type="button" data-action="clear-tag-color"${selectedTag && hasCustomAssignment ? "" : " disabled"}>Clear Custom Color</button>
            <button class="ctl-button ctl-button-secondary" type="button" data-action="reset-tag-colors" data-role="reset-tag-colors-button"${getVisibleAssignedTagCount() ? "" : " disabled"}>Reset Filtered Tag Colors</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderTagsPane() {
  const container = document.querySelector('[data-role="tags-pane"]');

  if (!container) {
    return;
  }

  container.innerHTML = buildTagsPaneMarkup();
}

function buildNumericControlsMarkup(controlKeys) {
  return controlKeys.map((key) => {
    const control = CONTROL_MAP[key];

    if (!control) {
      return "";
    }

    return `
      <label class="ctl-control" for="ctl-${control.key}">
        <div class="ctl-control-header">
          <span class="ctl-control-label">${control.label}</span>
          <strong class="ctl-control-value" data-control-value-for="${control.key}">${formatControlValue(control, panelState.controlState[control.key])}</strong>
        </div>
        <input
          class="ctl-range"
          id="ctl-${control.key}"
          type="range"
          data-control-key="${control.key}"
          min="${control.min}"
          max="${control.max}"
          step="${control.step}"
          value="${panelState.controlState[control.key]}"
        >
      </label>
    `;
  }).join("");
}

function buildGradientModeOptionsMarkup(areaKey, stopIndex, selectedStop, areaConfig) {
  const options = [
    { mode: "linked", title: areaConfig.linkedLabel, caption: "Follows the live graph color" },
    { mode: "transparent", title: "Transparent", caption: "Leaves the stop clear" },
  ];

  return options.map((option) => `
    <button
      class="ctl-mode-option${selectedStop.source === option.mode ? " is-active" : ""}"
      type="button"
      data-action="set-gradient-stop-mode"
      data-area-key="${areaKey}"
      data-stop-index="${stopIndex}"
      data-stop-mode="${option.mode}"
      title="${option.caption}"
    >
      <strong>${option.title}</strong>
      <span>${option.caption}</span>
    </button>
  `).join("");
}

function buildGradientPresetPaletteMarkup(areaKey, stopIndex, selectedStop) {
  return COLOR_PRESETS.map((preset) => {
    const style = getTagChipThemeStyle(preset.token);
    const isActive = selectedStop.source === "preset" && selectedStop.token === preset.token;

    return `
      <button
        class="ctl-preset-option${isActive ? " is-active" : ""}"
        type="button"
        data-action="set-gradient-stop-preset"
        data-area-key="${areaKey}"
        data-stop-index="${stopIndex}"
        data-stop-token="${preset.token}"
        aria-label="Use ${preset.label} for this stop"
        style="background:${style.background};border-color:${style.borderColor};color:${style.color};"
        title="Use ${preset.label} for this stop"
      ></button>
    `;
  }).join("");
}

function buildGradientCustomColorMarkup(areaKey, stopIndex, selectedStop) {
  const customColor = selectedStop.source === "custom"
    ? selectedStop.color || "#14b8a6"
    : panelState.tagCustomColorDraft;

  return `
    <div class="ctl-gradient-custom-card${selectedStop.source === "custom" ? " is-active" : ""}">
      <div class="ctl-gradient-custom-head">
        <span class="ctl-gradient-custom-swatch" style="background:${escapeHtml(customColor)};"></span>
        <div>
          <strong>Custom Color</strong>
          <span>Pick any color and it applies immediately.</span>
        </div>
      </div>
      ${buildInlineColorEditorMarkup({
        color: customColor,
        scope: "gradient-stop",
        areaKey,
        stopIndex,
      })}
    </div>
  `;
}

function buildGradientStripMarkup(areaKey, area, areaConfig, selectedIndex) {
  return `
    <div class="ctl-gradient-strip" data-gradient-strip data-area-key="${areaKey}" title="Click to add a stop, and right-click to remove a stop">
      ${area.stops.map((stop, index) => {
        const swatchColor = getGradientStopColor(stop, areaConfig.previewLinkedColor, "preview");
        const isTransparent = stop.source === "transparent";
        const style = isTransparent
          ? `left: calc(${stop.position}% - 9px);`
          : `left: calc(${stop.position}% - 9px); --ctl-stop-swatch:${swatchColor};`;
        const label = stop.source === "linked"
          ? areaConfig.linkedLabel
          : stop.source === "preset"
            ? "Preset Color"
            : stop.source === "custom"
              ? "Custom Color"
              : "Transparent";

        return `
          <button
            class="ctl-gradient-handle${index === selectedIndex ? " is-active" : ""}${isTransparent ? " is-transparent" : ""}"
            type="button"
            style="${style}"
            data-action="select-gradient-stop"
            data-gradient-handle
            data-area-key="${areaKey}"
            data-stop-index="${index}"
            title="${label} at ${Math.round(stop.position)}%. Click to add a stop, and right-click to remove a stop."
          ></button>
        `;
      }).join("")}
    </div>
  `;
}

function buildGradientEditorMarkup(areaKey, previewMarkup, controlKeys = []) {
  const area = getGradientArea(areaKey);
  const areaConfig = GRADIENT_AREAS[areaKey];
  const selectedIndex = getSelectedGradientStopIndex(areaKey);
  const selectedStop = area.stops[selectedIndex];
  const selectedLabel = selectedStop.source === "linked"
    ? areaConfig.linkedLabel
    : selectedStop.source === "preset"
      ? "Preset Color"
      : selectedStop.source === "custom"
        ? "Custom Color"
        : "Transparent";

  return `
    <section class="ctl-section ctl-section-inline ctl-gradient-editor">
      <div class="ctl-gradient-column ctl-gradient-column-main">
        ${previewMarkup}
        <div class="ctl-gradient-toolbar">
          <label class="ctl-control ctl-control-tight ctl-gradient-angle" for="gradient-angle-${areaKey}">
            <div class="ctl-control-header">
              <span class="ctl-control-label">Angle</span>
              <strong class="ctl-control-value" data-gradient-angle-value="${areaKey}">${Math.round(area.angle)}deg</strong>
            </div>
            <input class="ctl-range" id="gradient-angle-${areaKey}" type="range" min="0" max="360" step="1" value="${area.angle}" data-gradient-angle="${areaKey}">
          </label>
        </div>
        ${controlKeys.length ? `<div class="ctl-gradient-extra">${buildNumericControlsMarkup(controlKeys)}</div>` : ""}
      </div>
      <aside class="ctl-gradient-inspector ctl-gradient-column ctl-gradient-column-side">
        <div class="ctl-gradient-inspector-head">
          <strong data-gradient-selected-index="${areaKey}">Stop ${selectedIndex + 1}</strong>
          <span data-gradient-selected-label="${areaKey}">${selectedLabel} · ${Math.round(selectedStop.position)}%</span>
        </div>
        <section class="ctl-gradient-group">
          <span class="ctl-gradient-group-label">Quick Modes</span>
          <div class="ctl-mode-grid">
            ${buildGradientModeOptionsMarkup(areaKey, selectedIndex, selectedStop, areaConfig)}
          </div>
        </section>
        <section class="ctl-gradient-group">
          <span class="ctl-gradient-group-label">Preset Colors</span>
          <div class="ctl-preset-grid">
            ${buildGradientPresetPaletteMarkup(areaKey, selectedIndex, selectedStop)}
          </div>
        </section>
        <details class="ctl-gradient-group ctl-gradient-custom-toggle"${selectedStop.source === "custom" ? " open" : ""}>
          <summary class="ctl-gradient-custom-summary">
            <span class="ctl-gradient-group-label">Custom Color</span>
            <span class="ctl-gradient-custom-summary-text">Show / Hide</span>
          </summary>
          <div class="ctl-gradient-custom-toggle-body">
            ${buildGradientCustomColorMarkup(areaKey, selectedIndex, selectedStop)}
          </div>
        </details>
      </aside>
    </section>
  `;
}

async function refreshTags(showToastOrOptions = false) {
  try {
    const { showToast, fallbackToPrevious } = normalizeRefreshTagsOptions(showToastOrOptions);
    const previousSelectedKey = panelState.selectedTag.toLowerCase();
    const previousTags = panelState.tags.slice();
    const previousTagSourceMap = { ...panelState.tagSourceMap };
    let tagCatalog = await collectTagCatalog();
    let normalizedTags = tagCatalog.tags;

    for (let attempt = 0; attempt < 2 && !normalizedTags.length; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)));
      tagCatalog = await collectTagCatalog();
      normalizedTags = tagCatalog.tags;
    }

    if (!normalizedTags.length && fallbackToPrevious && previousTags.length) {
      normalizedTags = previousTags;
      tagCatalog.tagSourceMap = previousTagSourceMap;
    }

    normalizedTags = dedupeTagNames([
      ...normalizedTags,
      ...getKnownTagNames(),
    ]);

    panelState.tags = normalizedTags;
    panelState.tagEntityMap = {
      ...panelState.tagEntityMap,
      ...(tagCatalog.tagEntityMap || {}),
    };
    panelState.tagSourceMap = {
      ...panelState.tagSourceMap,
      ...(tagCatalog.tagSourceMap || {}),
    };

    const matchingSelectedTag = normalizedTags.find((tagName) => tagName.toLowerCase() === previousSelectedKey);

    if (matchingSelectedTag) {
      panelState.selectedTag = matchingSelectedTag;
    } else {
      panelState.selectedTag = normalizedTags[0] || "";
    }

    renderPanel(showToast ? "Refreshed tags from Logseq" : undefined);

    if (showToast) {
      await logseq.UI.showMsg("Refreshed tags from Logseq.", "success");
    }
  } catch (error) {
    console.error("[Local Custom Theme Loader] Failed to refresh tags", error);

    if (showToast) {
      await logseq.UI.showMsg("Unable to load tags from Logseq.", "warning");
    }
  }
}

async function ensureTagsForCurrentGraph(options = {}) {
  const { changed } = await syncCurrentGraphInfo();
  const force = Boolean(options.force);

  if (changed) {
    clearGraphTagState();
  }

  if (!force && !changed && panelState.tags.length) {
    return false;
  }

  await refreshTags({
    showToast: Boolean(options.showToast),
    fallbackToPrevious: changed ? false : options.fallbackToPrevious ?? true,
  });

  return true;
}

async function handleCurrentGraphChanged() {
  const { changed, graphInfo } = await syncCurrentGraphInfo();

  if (!changed) {
    return;
  }

  clearGraphTagState();
  panelState.controlState = { ...DEFAULT_CONTROL_STATE };
  panelState.gradientState = createDefaultGradientState();
  panelState.gradientSelections = Object.fromEntries(Object.keys(GRADIENT_AREAS).map((areaKey) => [areaKey, 0]));
  renderPanel(`Graph changed to ${graphInfo?.name || "current graph"}. Refreshing synced tags...`);
  await loadStoredControls();
  await loadStoredGradients();
  await refreshTags({ showToast: false, fallbackToPrevious: false });
  await loadStoredTagColors();
  await loadGraphSyncRevisionState();
  await applyManagedOverrides(false, `Loaded synced tag colors for ${graphInfo?.name || "current graph"}`, "soft");
}

function doesTxDataTouchDegrandeState(txData = []) {
  const relevantAttributes = new Set([
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_CONTROL_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_GRADIENT_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_TAG_COLOR_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_REVISION_PROPERTY),
    ":block/title",
    ":block/name",
    ":block/original-name",
    ":block/type",
    ":block/tags",
    ":block/refs",
  ].filter(Boolean));

  return (txData || []).some((datom) => {
    if (!Array.isArray(datom)) {
      return false;
    }

    const attribute = String(datom[1] ?? "");
    const value = String(datom[2] ?? "");

    return relevantAttributes.has(attribute)
      || value === GRAPH_SYNC_STORAGE_PAGE_NAME
      || value === GRAPH_SYNC_CONTROL_PROPERTY
      || value === GRAPH_SYNC_GRADIENT_PROPERTY
      || value === GRAPH_SYNC_TAG_COLOR_PROPERTY
      || value === GRAPH_SYNC_REVISION_PROPERTY;
  });
}

function buildPersistedAppearanceSnapshot() {
  return JSON.stringify({
    controls: panelState.controlState,
    gradients: panelState.gradientState,
    tagColors: mergeStoredTagColors(panelState.tagColorAssignments),
    tags: panelState.tags.map((tagName) => String(tagName || "").toLowerCase()),
    revision: panelState.syncRevision,
  });
}

async function syncPersistedAppearance(options = {}) {
  const {
    reason = "Reloaded synced Degrande appearance",
    showToast = false,
    forceRender = false,
    fallbackToPrevious = true,
    renderMode = "soft",
  } = options;
  const previousRevision = panelState.syncRevision;
  const previousSnapshot = buildPersistedAppearanceSnapshot();
  const previousSelectedTag = String(panelState.selectedTag || "").toLowerCase();

  setSyncState("pending");

  await syncCurrentGraphInfo();
  await loadGraphSyncRevisionState();
  await loadStoredControls();
  await loadStoredGradients();
  await loadStoredTagColors({ allowEntityFallback: false });
  await refreshTags({ showToast: false, fallbackToPrevious });

  const nextSnapshot = buildPersistedAppearanceSnapshot();
  const changed = previousSnapshot !== nextSnapshot
    || previousSelectedTag !== String(panelState.selectedTag || "").toLowerCase();

  if (!changed && !forceRender && !showToast) {
    setSyncState("synced");
    return false;
  }

  await applyManagedOverrides(
    showToast,
    changed ? reason : "Synced graph state is already current",
    renderMode
  );

  await handleObservedSyncRevisionChange(previousRevision, panelState.syncRevision);
  setSyncState("synced");

  return changed;
}

function clearStartupSyncRefreshes() {
  panelState.startupSyncTimerIds.forEach((timerId) => clearTimeout(timerId));
  panelState.startupSyncTimerIds = [];
}

function scheduleStartupSyncRefreshes() {
  clearStartupSyncRefreshes();

  panelState.startupSyncTimerIds = STARTUP_SYNC_RETRY_DELAYS_MS.map((delayMs) => setTimeout(() => {
    if (panelState.persistTimer || panelState.gradientPersistTimer || panelState.tagPersistTimer) {
      return;
    }

    scheduleReloadPersistedAppearance("Checked synced Degrande appearance after startup", {
      delayMs: 0,
      fallbackToPrevious: false,
    });
  }, delayMs));
}

function scheduleReloadPersistedAppearance(reason = "Reloaded synced Degrande appearance", options = {}) {
  const { delayMs = 180, ...syncOptions } = options;

  setSyncState("pending");

  if (panelState.dbStateRefreshTimer) {
    clearTimeout(panelState.dbStateRefreshTimer);
  }

  panelState.dbStateRefreshTimer = setTimeout(async () => {
    try {
      await syncPersistedAppearance({
        reason,
        fallbackToPrevious: syncOptions.fallbackToPrevious ?? true,
        showToast: Boolean(syncOptions.showToast),
        forceRender: Boolean(syncOptions.forceRender),
        renderMode: syncOptions.renderMode || "soft",
      });
    } catch (error) {
      console.error("[Degrande Colors] Failed to reload persisted appearance", error);
    } finally {
      panelState.dbStateRefreshTimer = null;
    }
  }, delayMs);
}

function buildControlsMarkup() {
  return CONTROL_SECTIONS.map((section) => `
    <section class="ctl-section">
      <div class="ctl-section-head">
        <div>
          <h2>${section.title}</h2>
          <p>${section.description}</p>
        </div>
      </div>
      ${section.controls.map((control) => `
        <label class="ctl-control" for="ctl-${control.key}">
          <div class="ctl-control-header">
            <span class="ctl-control-label">${control.label}</span>
            <strong class="ctl-control-value" data-control-value-for="${control.key}">${formatControlValue(control, panelState.controlState[control.key])}</strong>
          </div>
          <input
            class="ctl-range"
            id="ctl-${control.key}"
            type="range"
            data-control-key="${control.key}"
            min="${control.min}"
            max="${control.max}"
            step="${control.step}"
            value="${panelState.controlState[control.key]}"
          >
        </label>
      `).join("")}
    </section>
  `).join("");
}

function buildControlGroupMarkup(sectionTitle, cardClass = "") {
  const section = CONTROL_SECTIONS.find((entry) => entry.title === sectionTitle);

  if (!section) {
    return "";
  }

  return `
    <section class="ctl-section ctl-section-inline${cardClass ? ` ${cardClass}` : ""}">
      <div class="ctl-section-head">
        <div>
          <h2>${section.title}</h2>
          <p>${section.description}</p>
        </div>
      </div>
      ${section.controls.map((control) => `
        <label class="ctl-control" for="ctl-${control.key}">
          <div class="ctl-control-header">
            <span class="ctl-control-label">${control.label}</span>
            <strong class="ctl-control-value" data-control-value-for="${control.key}">${formatControlValue(control, panelState.controlState[control.key])}</strong>
          </div>
          <input
            class="ctl-range"
            id="ctl-${control.key}"
            type="range"
            data-control-key="${control.key}"
            min="${control.min}"
            max="${control.max}"
            step="${control.step}"
            value="${panelState.controlState[control.key]}"
          >
        </label>
      `).join("")}
    </section>
  `;
}

function syncControlInputs() {
  for (const control of ALL_CONTROLS) {
    const input = document.querySelector(`[data-control-key="${control.key}"]`);
    const value = document.querySelector(`[data-control-value-for="${control.key}"]`);

    if (input) {
      input.value = panelState.controlState[control.key];
    }

    if (value) {
      value.textContent = formatControlValue(control, panelState.controlState[control.key]);
    }
  }
}

function buildEffectiveCssText(managedOverrides) {
  return `${panelState.baseCssText.trim()}\n\n${managedOverrides.trim()}\n`;
}

function buildSweepGradient(angle, edgeColor, clearStart, clearEnd) {
  return `linear-gradient(${angle}deg, ${edgeColor} 0%, transparent ${clearStart}%, transparent ${clearEnd}%, ${edgeColor} 100%)`;
}

function buildFocusGradient(angle, focusAt, fadeEnd, focusColor = "var(--node-color)") {
  return `linear-gradient(${angle}deg, transparent 0%, ${focusColor} ${focusAt}%, transparent ${fadeEnd}%)`;
}

function setPreviewElementStyle(element, styleMap) {
  if (!element) {
    return;
  }

  Object.assign(element.style, styleMap);
}

function renderPreviewPane() {
  const container = document.querySelector('[data-pane="preview"]');

  if (!container) {
    return;
  }

  container.innerHTML = buildPreviewMarkup();
}

function buildPreviewMarkup() {
  const nodePreview = buildGradientEditorMarkup(
    "node",
    `
      <div class="ctl-preview-block ctl-gradient-preview-surface" data-role="preview-block" data-gradient-preview="node">
        <div class="ctl-preview-meta">#Project</div>
        <div class="ctl-preview-heading">Tune the block gradient</div>
        <p>Use this area to preview the spread and fade for tag-driven block highlights.</p>
        ${buildGradientStripMarkup("node", getGradientArea("node"), GRADIENT_AREAS.node, getSelectedGradientStopIndex("node"))}
      </div>
    `
  );
  const titlePreview = buildGradientEditorMarkup(
    "title",
    `
      <div class="ctl-preview-title-card ctl-gradient-preview-surface" data-role="preview-title-card" data-gradient-preview="title">
        <div class="ctl-preview-meta">Journal</div>
        <h3 class="ctl-preview-title">Project Compass</h3>
        ${buildGradientStripMarkup("title", getGradientArea("title"), GRADIENT_AREAS.title, getSelectedGradientStopIndex("title"))}
      </div>
    `
  );
  const quotePreview = buildGradientEditorMarkup(
    "quote",
    `
      <blockquote class="ctl-preview-quote ctl-gradient-preview-surface" data-role="preview-quote" data-gradient-preview="quote">
        <div>A gradient should support the content, not swallow it.</div>
        ${buildGradientStripMarkup("quote", getGradientArea("quote"), GRADIENT_AREAS.quote, getSelectedGradientStopIndex("quote"))}
      </blockquote>
    `,
    ["quoteBorderWidth", "quoteRadius", "quotePaddingY", "quotePaddingX"]
  );
  const backgroundPreview = buildGradientEditorMarkup(
    "background",
    `
      <div class="ctl-preview-background ctl-gradient-preview-surface" data-role="preview-background" data-gradient-preview="background">
        <div>Standalone background blocks keep their color banding, but you can tune the angle, fade, radius, and padding here.</div>
        ${buildGradientStripMarkup("background", getGradientArea("background"), GRADIENT_AREAS.background, getSelectedGradientStopIndex("background"))}
      </div>
    `,
    ["bgRadius", "bgPaddingY", "bgPaddingX"]
  );

  return `
    ${buildPaneIntroMarkup(
      "Appearance",
      "Use this page to tune chip sizing and gradients. Click a gradient strip to add a stop, and right-click a stop handle to remove it."
    )}
    <div class="ctl-preview-scroll" data-role="preview-scroll">
      <div class="ctl-preview-grid">
        <article class="ctl-preview-card">
          <div class="ctl-preview-card-head">
            <strong>Tags</strong>
            <span>Inline chips</span>
          </div>
          <div class="ctl-preview-card-body">
            <div class="ctl-preview-stage ctl-preview-stage-tags">
              <span class="ctl-preview-tag" data-role="preview-tag-primary">#Gradient</span>
              <span class="ctl-preview-tag ctl-preview-tag-hover" data-role="preview-tag-hover">#Hover</span>
            </div>
            <section class="ctl-section ctl-section-inline">
              <div class="ctl-section-head">
                <div>
                  <h2>Chip Controls</h2>
                  <p>Shape, spacing, and hover.</p>
                </div>
              </div>
              ${buildNumericControlsMarkup(["tagRadius", "tagFontSize", "tagHeight", "tagPaddingX", "tagBorderWidth", "tagHoverLift"])}
            </section>
          </div>
        </article>
        <article class="ctl-preview-card">
          <div class="ctl-preview-card-head">
            <strong>Linked Blocks</strong>
            <span>Tag-based fill</span>
          </div>
          <div class="ctl-preview-card-body">
            ${nodePreview}
          </div>
        </article>
        <article class="ctl-preview-card">
          <div class="ctl-preview-card-head">
            <strong>Page Titles</strong>
            <span>Title accent</span>
          </div>
          <div class="ctl-preview-card-body">
            ${titlePreview}
          </div>
        </article>
        <article class="ctl-preview-card">
          <div class="ctl-preview-card-head">
            <strong>Quotes</strong>
            <span>Edge glow</span>
          </div>
          <div class="ctl-preview-card-body">
            ${quotePreview}
          </div>
        </article>
        <article class="ctl-preview-card">
          <div class="ctl-preview-card-head">
            <strong>Background Block</strong>
            <span>Standalone fill</span>
          </div>
          <div class="ctl-preview-card-body">
            ${backgroundPreview}
          </div>
        </article>
      </div>
    </div>
  `;
}

function syncTabState() {
  const tabButtons = document.querySelectorAll("[data-tab]");
  const panes = document.querySelectorAll("[data-pane]");

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === panelState.activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  panes.forEach((pane) => {
    const isActive = pane.dataset.pane === panelState.activeTab;
    pane.hidden = !isActive;
    pane.classList.toggle("is-active", isActive);
  });
}

function syncPreviewStyles() {
  const controls = panelState.controlState;
  const isDark = panelState.themeMode === "dark";

  const tagBase = {
    borderRadius: `${controls.tagRadius}px`,
    fontSize: `${controls.tagFontSize}px`,
    height: `${controls.tagHeight}px`,
    padding: `0 ${controls.tagPaddingX}px`,
    borderWidth: `${controls.tagBorderWidth}px`,
    borderStyle: "solid",
    borderColor: isDark ? "rgba(96, 165, 250, 0.48)" : "rgba(37, 99, 235, 0.22)",
    background: isDark ? "rgba(37, 99, 235, 0.18)" : "rgba(59, 130, 246, 0.12)",
    color: isDark ? "#dbeafe" : "#1d4ed8",
  };

  setPreviewElementStyle(document.querySelector('[data-role="preview-tag-primary"]'), {
    ...tagBase,
    transform: "translateY(0px)",
    boxShadow: "none",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-tag-hover"]'), {
    ...tagBase,
    transform: `translateY(-${controls.tagHoverLift}px)`,
    boxShadow: isDark ? "0 12px 28px rgba(2, 6, 23, 0.44)" : "0 10px 20px rgba(15, 23, 42, 0.12)",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-block"]'), {
    backgroundImage: buildGradientCss("node", isDark ? "rgba(52, 211, 153, 0.28)" : "rgba(16, 185, 129, 0.2)", "preview"),
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.68)" : "rgba(255, 255, 255, 0.82)",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-title-card"]'), {
    backgroundImage: buildGradientCss("title", isDark ? "rgba(251, 191, 36, 0.28)" : "rgba(245, 158, 11, 0.2)", "preview"),
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.84)",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-quote"]'), {
    borderLeftWidth: `${controls.quoteBorderWidth}px`,
    borderLeftStyle: "solid",
    borderLeftColor: isDark ? "rgba(129, 140, 248, 0.8)" : "rgba(99, 102, 241, 0.58)",
    borderRadius: `0 ${controls.quoteRadius}px ${controls.quoteRadius}px 0`,
    padding: `${controls.quotePaddingY}px ${controls.quotePaddingX}px`,
    backgroundImage: buildGradientCss("quote", isDark ? `rgba(99, 102, 241, ${controls.quoteDarkOpacity})` : `rgba(99, 102, 241, ${controls.quoteLightOpacity})`, "preview"),
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.82)",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-background"]'), {
    borderRadius: `${controls.bgRadius}px`,
    padding: `${controls.bgPaddingY}px ${controls.bgPaddingX}px`,
    backgroundImage: buildGradientCss("background", isDark ? "rgba(244, 114, 182, 0.24)" : "rgba(244, 114, 182, 0.16)", "preview"),
    backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.85)",
  });
}

function syncGradientEditorState() {
  for (const [areaKey, areaConfig] of Object.entries(GRADIENT_AREAS)) {
    const area = getGradientArea(areaKey);

    if (!area) {
      continue;
    }

    const preview = document.querySelector(`[data-gradient-preview="${areaKey}"]`);

    if (preview) {
      preview.style.backgroundImage = buildGradientCss(areaKey, areaConfig.previewLinkedColor, "preview");
    }

    const angleValue = document.querySelector(`[data-gradient-angle-value="${areaKey}"]`);

    if (angleValue) {
      angleValue.textContent = `${Math.round(area.angle)}deg`;
    }

    const selectedIndex = getSelectedGradientStopIndex(areaKey);
    const selectedStop = area.stops[selectedIndex];

    if (!selectedStop) {
      continue;
    }

    const selectedLabel = selectedStop.source === "linked"
      ? areaConfig.linkedLabel
      : selectedStop.source === "preset"
        ? "Preset Color"
        : selectedStop.source === "custom"
          ? "Custom Color"
          : "Transparent";

    const selectedIndexLabel = document.querySelector(`[data-gradient-selected-index="${areaKey}"]`);

    if (selectedIndexLabel) {
      selectedIndexLabel.textContent = `Stop ${selectedIndex + 1}`;
    }

    const selectedTextLabel = document.querySelector(`[data-gradient-selected-label="${areaKey}"]`);

    if (selectedTextLabel) {
      selectedTextLabel.textContent = `${selectedLabel} · ${Math.round(selectedStop.position)}%`;
    }

    const handles = document.querySelectorAll(`[data-action="select-gradient-stop"][data-area-key="${areaKey}"]`);

    handles.forEach((handle, index) => {
      const stop = area.stops[index];

      if (!stop) {
        return;
      }

      const swatchColor = getGradientStopColor(stop, areaConfig.previewLinkedColor, "preview");
      handle.style.left = `calc(${stop.position}% - 9px)`;

      if (stop.source === "transparent") {
        handle.style.removeProperty("--ctl-stop-swatch");
      } else {
        handle.style.setProperty("--ctl-stop-swatch", swatchColor);
      }

      handle.classList.toggle("is-active", index === selectedIndex);
      handle.classList.toggle("is-transparent", stop.source === "transparent");

      const label = stop.source === "linked"
        ? areaConfig.linkedLabel
        : stop.source === "preset"
          ? "Preset Color"
          : stop.source === "custom"
            ? "Custom Color"
            : "Transparent";

      handle.title = `${label} at ${Math.round(stop.position)}%`;
    });
  }
}

function syncInlineColorEditor(editor, hexColor) {
  if (!editor) {
    return;
  }

  const normalized = normalizeHexColor(hexColor);
  const rgb = normalized ? hexToRgb(normalized) : null;
  const hsv = rgb ? rgbToHsv(rgb) : null;

  if (!normalized || !rgb || !hsv) {
    return;
  }

  editor.dataset.colorValue = normalized;

  const swatch = editor.querySelector("[data-inline-color-swatch]");

  if (swatch) {
    swatch.style.backgroundColor = normalized;
  }

  const hexInput = editor.querySelector("[data-inline-color-hex]");

  if (hexInput && hexInput !== document.activeElement) {
    hexInput.value = normalized;
  }

  const spectrum = editor.querySelector("[data-inline-color-spectrum]");
  const spectrumThumb = editor.querySelector("[data-inline-color-spectrum-thumb]");
  const hueInput = editor.querySelector("[data-inline-color-hue]");
  const hueValue = editor.querySelector("[data-inline-color-hue-value]");
  const alphaInput = editor.querySelector("[data-inline-color-alpha]");
  const alphaValue = editor.querySelector("[data-inline-color-alpha-value]");
  const hueColor = rgbToCss(hsvToRgb({ h: hsv.h, s: 1, v: 1, a: 1 }));
  const alphaBase = rgbToCss({ r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });

  if (spectrum) {
    spectrum.style.setProperty("--ctl-picker-hue", hueColor);
  }

  if (spectrumThumb) {
    spectrumThumb.style.left = `${hsv.s * 100}%`;
    spectrumThumb.style.top = `${(1 - hsv.v) * 100}%`;
  }

  if (hueInput) {
    hueInput.value = String(Math.round(hsv.h));
  }

  if (hueValue) {
    hueValue.textContent = `${Math.round(hsv.h)}deg`;
  }

  if (alphaInput) {
    alphaInput.value = String(Math.round(hsv.a * 100));
    alphaInput.style.setProperty("--ctl-alpha-base", alphaBase);
  }

  if (alphaValue) {
    alphaValue.textContent = `${Math.round(hsv.a * 100)}%`;
  }
}

function getInlineColorEditorColor(editor) {
  const stored = normalizeHexColor(editor?.dataset.colorValue);

  if (stored) {
    return stored;
  }

  const hue = Number(editor?.querySelector("[data-inline-color-hue]")?.value ?? 170);
  const alpha = Number(editor?.querySelector("[data-inline-color-alpha]")?.value ?? 100) / 100;
  const thumb = editor?.querySelector("[data-inline-color-spectrum-thumb]");
  const saturation = clamp(Number.parseFloat(thumb?.style.left ?? "100") / 100, 0, 1);
  const value = clamp(1 - (Number.parseFloat(thumb?.style.top ?? "0") / 100), 0, 1);
  return rgbToHex(hsvToRgb({ h: hue, s: saturation, v: value, a: alpha }));
}

function syncTagsPaneState() {
  const selectedTag = panelState.selectedTag;
  const preview = document.querySelector('[data-role="selected-tag-preview"]');
  const colorLabel = document.querySelector('[data-role="selected-tag-color-label"]');

  if (preview && selectedTag) {
    preview.setAttribute("style", buildTagChipStyleAttribute(selectedTag));
  }

  if (colorLabel) {
    colorLabel.textContent = selectedTag
      ? `Current color: ${getTagColorToken(selectedTag) || "custom"}`
      : "Choose a tag to edit its color";
  }

  document.querySelectorAll("[data-tag-chip-name]").forEach((chip) => {
    chip.setAttribute("style", buildTagChipStyleAttribute(chip.dataset.tagChipName || ""));
  });

  document.querySelectorAll("[data-set-tag-color]").forEach((button) => {
    const isActive = selectedTag && getTagColorToken(selectedTag) === button.dataset.setTagColor;
    button.classList.toggle("is-active", Boolean(isActive));
  });

  const selectedAssignment = selectedTag ? getTagColorAssignment(selectedTag) : null;
  const { backgroundColor, foregroundColor } = getTagCustomColors(selectedAssignment, panelState.themeMode);
  syncInlineColorEditor(document.querySelector('[data-inline-color-editor][data-color-scope="tag-custom-background"]'), backgroundColor);
  syncInlineColorEditor(document.querySelector('[data-inline-color-editor][data-color-scope="tag-custom-foreground"]'), foregroundColor);
}

function syncTagBrowserState() {
  const visibleTags = getVisibleTags();
  const bulkColorableTags = getBulkColorableTags();
  const summary = document.querySelector('[data-role="tags-summary"]');
  const grid = document.querySelector('[data-role="tag-grid"]');
  const addColorsButton = document.querySelector('[data-role="add-random-tag-colors-button"]');
  const resetColorsButton = document.querySelector('[data-role="reset-tag-colors-button"]');
  const sourceButtons = {
    tags: document.querySelector('[data-role="tag-source-filter-tags"]'),
    pages: document.querySelector('[data-role="tag-source-filter-pages"]'),
  };

  if (summary) {
    summary.textContent = `${visibleTags.length} visible entries · ${getVisibleAssignedTagCount()} custom assignments`;
  }

  if (grid) {
    grid.innerHTML = buildTagListMarkup();
  }

  if (addColorsButton) {
    addColorsButton.disabled = !bulkColorableTags.some((tagName) => !getTagColorToken(tagName));
  }

  if (resetColorsButton) {
    resetColorsButton.disabled = !getVisibleAssignedTagCount();
    resetColorsButton.textContent = "Reset Filtered Tag Colors";
  }

  Object.entries(sourceButtons).forEach(([sourceKey, button]) => {
    if (!button) {
      return;
    }

    button.classList.toggle("is-active", Boolean(panelState.tagSourceFilters[sourceKey]));
    button.setAttribute("aria-pressed", panelState.tagSourceFilters[sourceKey] ? "true" : "false");
    button.querySelector('.ctl-filter-toggle-count')?.replaceChildren(String(getSourceCount(sourceKey)));
  });
}

function applyInlineEditorColor(editor, color, renderMode = "soft") {
  const normalized = normalizeHexColor(color);

  if (!editor || !normalized) {
    return;
  }

  syncInlineColorEditor(editor, normalized);

  if (editor.dataset.colorScope === "gradient-stop") {
    updateGradientStop(
      editor.dataset.areaKey,
      Number(editor.dataset.stopIndex),
      { color: normalized, source: "custom" }
    );
    void applyManagedOverrides(false, "Updated custom gradient color", renderMode);
    schedulePersistGradients();
    return;
  }

  const selectedAssignment = panelState.selectedTag ? getTagColorAssignment(panelState.selectedTag) : null;
  const currentMode = panelState.themeMode === "dark" ? "dark" : "light";
  const otherMode = currentMode === "dark" ? "light" : "dark";
  const currentColors = getTagCustomColors(selectedAssignment, currentMode);
  const otherModeColors = getTagCustomColors(selectedAssignment, otherMode);
  const isForegroundEditor = editor.dataset.colorScope === "tag-custom-foreground";

  getTagModeDraft(currentMode)[isForegroundEditor ? "foregroundColor" : "backgroundColor"] = normalized;

  if (isForegroundEditor) {
    panelState.tagCustomForegroundDraft = normalized;
  } else {
    panelState.tagCustomColorDraft = normalized;
  }

  if (!panelState.selectedTag) {
    syncTagsPaneState();
    return;
  }

  panelState.tagColorAssignments[panelState.selectedTag.toLowerCase()] = {
    type: "custom",
    lightBackgroundColor: currentMode === "light" ? (isForegroundEditor ? currentColors.backgroundColor : normalized) : otherModeColors.backgroundColor,
    lightForegroundColor: currentMode === "light" ? (isForegroundEditor ? normalized : currentColors.foregroundColor) : otherModeColors.foregroundColor,
    darkBackgroundColor: currentMode === "dark" ? (isForegroundEditor ? currentColors.backgroundColor : normalized) : otherModeColors.backgroundColor,
    darkForegroundColor: currentMode === "dark" ? (isForegroundEditor ? normalized : currentColors.foregroundColor) : otherModeColors.foregroundColor,
  };
  void applyManagedOverrides(false, `Updated ${panelState.selectedTag} custom color`, renderMode);
  schedulePersistTagColors([panelState.selectedTag]);
}

function beginInlineColorDrag(editor, pointerId) {
  if (!editor) {
    return;
  }

  panelState.colorDrag = {
    pointerId,
    editor,
  };
}

function updateInlineColorSpectrum(editor, clientX, clientY, renderMode = "soft") {
  const spectrum = editor?.querySelector("[data-inline-color-spectrum]");

  if (!spectrum) {
    return;
  }

  const rect = spectrum.getBoundingClientRect();
  const saturation = clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
  const value = clamp(1 - ((clientY - rect.top) / Math.max(rect.height, 1)), 0, 1);
  const current = hexToRgb(getInlineColorEditorColor(editor)) || { r: 20, g: 184, b: 166, a: 1 };
  const hsv = rgbToHsv(current);
  applyInlineEditorColor(editor, rgbToHex(hsvToRgb({ h: hsv.h, s: saturation, v: value, a: hsv.a })), renderMode);
}

function endInlineColorDrag() {
  panelState.colorDrag = null;
}

function beginGradientHandleDrag(areaKey, stopIndex, pointerId) {
  setSelectedGradientStop(areaKey, stopIndex);
  panelState.gradientDrag = {
    areaKey,
    stopIndex,
    pointerId,
    moved: false,
  };
  syncGradientEditorState();
}

function updateGradientHandleDrag(clientX) {
  const drag = panelState.gradientDrag;

  if (!drag) {
    return;
  }

  const nextPosition = getGradientPositionFromClientX(drag.areaKey, clientX);

  if (nextPosition === null) {
    return;
  }

  drag.moved = true;
  updateGradientStop(drag.areaKey, drag.stopIndex, { position: nextPosition });
  void applyManagedOverrides(false, "Adjusted gradient stop", "soft");
  schedulePersistGradients();
}

function endGradientHandleDrag() {
  const drag = panelState.gradientDrag;

  if (!drag) {
    return;
  }

  panelState.gradientDrag = null;

  if (drag.moved) {
    panelState.suppressGradientClick = true;
    rerenderPreviewPanePreservingScroll("Adjusted gradient stop");
  }
}

function syncPanelMeta(statusMessage) {
  const status = document.querySelector('[data-role="status-text"]');
  const themeToggleButton = document.querySelector('[data-action="toggle-logseq-theme"]');

  if (!status) {
    return;
  }

  status.textContent = statusMessage ?? `Theme mode: ${panelState.themeMode} | Tag colors sync with this graph | Appearance controls sync with this graph`;
  syncSyncIndicator();

  if (themeToggleButton) {
    themeToggleButton.textContent = getThemeToggleLabel();
    themeToggleButton.setAttribute("title", `Toggle Logseq to ${panelState.themeMode === "dark" ? "light" : "dark"} mode`);
  }
}

function refreshPanel(statusMessage, { rerenderPreview = false, rerenderTags = false } = {}) {
  if (rerenderPreview) {
    renderPreviewPane();
  }

  if (rerenderTags) {
    renderTagsPane();
  }

  syncPanelMeta(statusMessage);
  syncControlInputs();
  syncPreviewStyles();
  syncGradientEditorState();
  syncTagsPaneState();
  syncTabState();
}

function rerenderPreviewPanePreservingScroll(statusMessage) {
  const previewScroll = document.querySelector('[data-role="preview-scroll"]');
  const scrollTop = previewScroll?.scrollTop ?? 0;
  const scrollLeft = previewScroll?.scrollLeft ?? 0;

  refreshPanel(statusMessage, { rerenderPreview: true });

  const nextPreviewScroll = document.querySelector('[data-role="preview-scroll"]');

  if (nextPreviewScroll) {
    nextPreviewScroll.scrollTop = scrollTop;
    nextPreviewScroll.scrollLeft = scrollLeft;
  }
}

function rerenderTagsPanePreservingFocus(statusMessage) {
  const activeElement = document.activeElement;
  const shouldRestoreFilter = activeElement?.matches?.("[data-tag-filter]");
  const shouldRestoreSort = activeElement?.matches?.("[data-tag-sort]");
  const restoreSourceFilter = activeElement?.matches?.("[data-source-filter]")
    ? activeElement.getAttribute("data-source-filter")
    : "";
  const selectionStart = shouldRestoreFilter && typeof activeElement.selectionStart === "number"
    ? activeElement.selectionStart
    : null;
  const selectionEnd = shouldRestoreFilter && typeof activeElement.selectionEnd === "number"
    ? activeElement.selectionEnd
    : null;

  refreshPanel(statusMessage, { rerenderTags: true });

  if (shouldRestoreFilter) {
    const filterInput = document.querySelector("[data-tag-filter]");

    if (filterInput) {
      filterInput.focus();

      if (selectionStart !== null && selectionEnd !== null && typeof filterInput.setSelectionRange === "function") {
        filterInput.setSelectionRange(selectionStart, selectionEnd);
      }
    }

    return;
  }

  if (shouldRestoreSort) {
    document.querySelector("[data-tag-sort]")?.focus();
    return;
  }

  if (restoreSourceFilter) {
    document.querySelector(`[data-source-filter="${escapeAttributeValue(restoreSourceFilter)}"]`)?.focus();
  }
}

function setActiveTab(tab) {
  panelState.activeTab = ["preview", "tags"].includes(tab) ? tab : "tags";
  syncTabState();

  if (panelState.activeTab === "tags" && !panelState.tags.length) {
    void refreshTags(false);
  }
}

function buildManagedOverrides() {
  const controls = panelState.controlState;
  const emitResetRules = shouldUseProvideStyleFallback();
  const managedTagNames = getManagedOverrideTagNames();
  const nodeGradient = buildGradientCss("node", "var(--node-color)");
  const titleGradient = buildGradientCss("title", "var(--node-color)");
  const backgroundGradient = buildGradientCss("background", "var(--ctl-bg-sweep-color)");

  const quoteColorRules = QUOTE_COLOR_RULES.map(({ selector, token }) => `
${selector} {
  --ctl-quote-color: var(--grad-${token});
  background-image: ${buildGradientCss("quote", "var(--ctl-quote-color)")} !important;
}
`).join("");

  const backgroundRules = BACKGROUND_BLOCK_RULES.map(({ selector, token }) => `
${selector} {
  --ctl-bg-sweep-color: var(--grad-${token});
  background-image: ${backgroundGradient} !important;
}
`).join("");

  const presetGroups = new Map();
  const resetTagNames = [];
  const customTagRules = [];

  managedTagNames.forEach((tagName) => {
    const assignment = getTagColorAssignment(tagName);

    if (!assignment) {
      if (emitResetRules) {
        resetTagNames.push(tagName);
      }

      return;
    }

    if (assignment.type === "custom") {
      const escapedTagName = escapeAttributeValue(tagName);
      const lightTheme = getResolvedCustomTagTheme(assignment, "light");
      const darkTheme = getResolvedCustomTagTheme(assignment, "dark");
      const lightGradient = getCustomTagGradientColor(assignment, "light");
      const darkGradient = getCustomTagGradientColor(assignment, "dark") || lightGradient;

      if (!lightTheme || !darkTheme || !lightGradient) {
        return;
      }

      customTagRules.push(`
a.tag[data-ref="${escapedTagName}" i],
a.tag[data-ref="${escapedTagName}" i]:hover {
  background: ${lightTheme.background} !important;
  background-color: ${lightTheme.background} !important;
  background-image: none !important;
  border-color: ${lightTheme.borderColor} !important;
  color: ${lightTheme.color} !important;
  box-shadow: none !important;
  opacity: 1 !important;
}

.dark-theme a.tag[data-ref="${escapedTagName}" i],
.dark-theme a.tag[data-ref="${escapedTagName}" i]:hover {
  background: ${darkTheme.background} !important;
  background-color: ${darkTheme.background} !important;
  background-image: none !important;
  border-color: ${darkTheme.borderColor} !important;
  color: ${darkTheme.color} !important;
  box-shadow: none !important;
  opacity: 1 !important;
}

:is(.ls-block > div:first-child, h1.title, .journal-title):has(a.tag[data-ref="${escapedTagName}" i]) {
  --node-color: ${lightGradient};
}

.ls-block > div:first-child:has(.block-content-or-editor-wrap.ls-page-title-container):has(.ls-block-right a.tag[data-ref="${escapedTagName}" i]) {
  --node-color: ${lightGradient};
}

.dark-theme :is(.ls-block > div:first-child, h1.title, .journal-title):has(a.tag[data-ref="${escapedTagName}" i]) {
  --node-color: ${darkGradient};
}

.dark-theme .ls-block > div:first-child:has(.block-content-or-editor-wrap.ls-page-title-container):has(.ls-block-right a.tag[data-ref="${escapedTagName}" i]) {
  --node-color: ${darkGradient};
}

:is(
  .ls-block > div:first-child:has(> h1.title):has(> a.tag[data-ref="${escapedTagName}" i]),
  .ls-block > div:first-child:has(> h1.title):has(> * a.tag[data-ref="${escapedTagName}" i]),
  .ls-block > div:first-child:has(> .journal-title):has(> a.tag[data-ref="${escapedTagName}" i]),
  .ls-block > div:first-child:has(> .journal-title):has(> * a.tag[data-ref="${escapedTagName}" i])
) {
  --node-color: ${lightGradient};
}

.dark-theme :is(
  .ls-block > div:first-child:has(> h1.title):has(> a.tag[data-ref="${escapedTagName}" i]),
  .ls-block > div:first-child:has(> h1.title):has(> * a.tag[data-ref="${escapedTagName}" i]),
  .ls-block > div:first-child:has(> .journal-title):has(> a.tag[data-ref="${escapedTagName}" i]),
  .ls-block > div:first-child:has(> .journal-title):has(> * a.tag[data-ref="${escapedTagName}" i])
) {
  --node-color: ${darkGradient};
}
`);
      return;
    }

    if (assignment.type === "preset" && COLOR_PRESET_MAP[assignment.token]) {
      const group = presetGroups.get(assignment.token) || [];
      group.push(tagName);
      presetGroups.set(assignment.token, group);
    }
  });

  const resetTagRules = resetTagNames.length
    ? buildGroupedTagRule(resetTagNames, {
      lightChipDeclarations: `background: var(--bg-grey) !important;\n  background-color: var(--bg-grey) !important;\n  background-image: none !important;\n  border-color: var(--bd-grey) !important;\n  color: #111 !important;\n  box-shadow: none !important;\n  opacity: 1 !important;`,
      darkChipDeclarations: `background: #374151 !important;\n  background-color: #374151 !important;\n  background-image: none !important;\n  border-color: #4b5563 !important;\n  color: #f3f4f6 !important;\n  box-shadow: none !important;\n  opacity: 1 !important;`,
      lightNodeColor: "transparent",
      darkNodeColor: "transparent",
    })
    : "";

  const presetTagRules = Array.from(presetGroups.entries()).map(([token, tagNames]) => {
    const preset = getPresetMeta(token);

    if (!preset) {
      return "";
    }

    return buildGroupedTagRule(tagNames, {
      lightChipDeclarations: `background-color: var(--bg-${token}) !important;\n  border-color: var(--bd-${token}) !important;\n  color: ${preset.lightText} !important;`,
      darkChipDeclarations: `background-color: var(--bg-${token}) !important;\n  border-color: var(--bd-${token}) !important;\n  color: ${preset.darkText} !important;`,
      lightNodeColor: `var(--grad-${token})`,
      darkNodeColor: `var(--grad-${token})`,
    });
  }).join("");

  const tagColorRules = `${resetTagRules}${presetTagRules}${customTagRules.join("")}`;

  return `
/* =============================================== */
/* === CUSTOM THEME LOADER MANAGED OVERRIDES ===== */
/* =============================================== */

${tagColorRules}

a.tag, a.tag:hover, h1 a.tag, h2 a.tag, h3 a.tag, h4 a.tag {
  border-radius: ${controls.tagRadius}px !important;
  font-size: ${controls.tagFontSize}px !important;
  height: ${controls.tagHeight}px !important;
  padding: 0 ${controls.tagPaddingX}px !important;
  border-width: ${controls.tagBorderWidth}px !important;
}

a.tag:hover {
  transform: translateY(-${controls.tagHoverLift}px) !important;
}

.ls-block > div:first-child:not(.selected):not(.selected-block):not(:has(.block-content-or-editor-wrap.ls-page-title-container)):has(a.tag[data-ref]) {
  background-image: ${nodeGradient} !important;
  background-color: transparent !important;
}

.dark-theme .ls-block > div:first-child:not(.selected):not(.selected-block):not(:has(.block-content-or-editor-wrap.ls-page-title-container)):has(a.tag[data-ref]) {
  background-image: ${nodeGradient} !important;
  background-color: transparent !important;
}

.ls-block > div:first-child .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container):has(a.tag[data-ref]) {
  --node-color: inherit;
}

:is(
  h1.title,
  .journal-title,
  .ls-block > div:first-child .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container):has(a.tag[data-ref])
):has(a.tag[data-ref]),
.ls-block > div:first-child .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container):has(a.tag[data-ref]),
.ls-block > div:first-child:has(.block-content-or-editor-wrap.ls-page-title-container):has(.ls-block-right a.tag[data-ref]) .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container) {
  background-image: ${titleGradient} !important;
  background-color: transparent !important;
}

.dark-theme .ls-block > div:first-child .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container):has(a.tag[data-ref]) {
  --node-color: inherit;
}

.dark-theme :is(
  h1.title,
  .journal-title,
  .ls-block > div:first-child .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container):has(a.tag[data-ref])
):has(a.tag[data-ref]),
.dark-theme .ls-block > div:first-child .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container):has(a.tag[data-ref]),
.dark-theme .ls-block > div:first-child:has(.block-content-or-editor-wrap.ls-page-title-container):has(.ls-block-right a.tag[data-ref]) .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container) {
  background-image: ${titleGradient} !important;
  background-color: transparent !important;
}

:is(
  .ls-block > div:first-child:has(> h1.title):has(> a.tag[data-ref]),
  .ls-block > div:first-child:has(> h1.title):has(> * a.tag[data-ref]),
  .ls-block > div:first-child:has(> .journal-title):has(> a.tag[data-ref]),
  .ls-block > div:first-child:has(> .journal-title):has(> * a.tag[data-ref])
) {
  background-image: ${titleGradient} !important;
  background-color: transparent !important;
}

.dark-theme :is(
  .ls-block > div:first-child:has(> h1.title):has(> a.tag[data-ref]),
  .ls-block > div:first-child:has(> h1.title):has(> * a.tag[data-ref]),
  .ls-block > div:first-child:has(> .journal-title):has(> a.tag[data-ref]),
  .ls-block > div:first-child:has(> .journal-title):has(> * a.tag[data-ref])
) {
  background-image: ${titleGradient} !important;
  background-color: transparent !important;
}

div[data-node-type="quote"] {
  --ctl-quote-color: rgba(99, 102, 241, ${controls.quoteLightOpacity});
  border-left-width: ${controls.quoteBorderWidth}px !important;
  border-radius: 0 ${controls.quoteRadius}px ${controls.quoteRadius}px 0 !important;
  padding: ${controls.quotePaddingY}px ${controls.quotePaddingX}px !important;
  background-image: ${buildGradientCss("quote", "var(--ctl-quote-color)")} !important;
}

.dark-theme div[data-node-type="quote"] {
  --ctl-quote-color: rgba(99, 102, 241, ${controls.quoteDarkOpacity});
  background-image: ${buildGradientCss("quote", "var(--ctl-quote-color)")} !important;
}

${quoteColorRules}

.with-bg-color:not([data-node-type="quote"]) {
  --ctl-bg-sweep-color: rgba(244, 114, 182, 0.16);
  background-image: ${backgroundGradient} !important;
  background-color: transparent !important;
  border-radius: ${controls.bgRadius}px !important;
  padding: ${controls.bgPaddingY}px ${controls.bgPaddingX}px !important;
}

${backgroundRules}
`;
}

function renderPanel(statusMessage) {
  if (!panelState.mounted) {
    return;
  }

  refreshPanel(statusMessage, { rerenderPreview: true, rerenderTags: true });
}

function setPanelRootVisibility(isVisible) {
  document.body?.classList.toggle(PANEL_HOST_CLASS, isVisible);

  const app = document.getElementById("app");

  if (!app) {
    return;
  }

  app.style.display = isVisible ? "block" : "none";
}

function bindHostTagContextMenu() {
  if (panelState.hostTagContextMenuBound) {
    return;
  }

  const hostDocument = getHostDocument();

  hostDocument.addEventListener("contextmenu", (event) => {
    const target = event.target;

    if (!(target instanceof hostDocument.defaultView.Element)) {
      return;
    }

    const tagChip = target.closest('a.tag[data-ref]');

    if (!tagChip || document.getElementById("app")?.contains(tagChip)) {
      return;
    }

    const tagName = tagChip.getAttribute("data-ref") || "";

    if (!tagName) {
      return;
    }

    event.preventDefault();
    clearPendingTagSelection();
    clearTagColorAssignment(tagName, `Reset ${tagName} to the default color`);
  });

  panelState.hostTagContextMenuBound = true;
}

function mountPanel() {
  if (panelState.mounted) {
    return;
  }

  const app = document.getElementById("app");

  if (!app) {
    throw new Error("Missing #app root for Degrande Colors panel");
  }

  app.innerHTML = `
    <div class="ctl-shell">
      <div class="ctl-backdrop" data-action="close"></div>
      <section class="ctl-window" aria-label="Degrande Colors panel">
        <header class="ctl-header">
          <div>
            <p class="ctl-eyebrow">Logseq DB Styling</p>
            <div class="ctl-title-row">
              <h1>Degrande Colors</h1>
              <span class="ctl-version-badge">v${escapeHtml(PLUGIN_VERSION)}</span>
            </div>
            <p class="ctl-subtitle">Assign tag colors and tune gradients for blocks, page titles, quotes, and backgrounds. Built for Logseq DB graphs.</p>
          </div>
        </header>
        <div class="ctl-toolbar">
          <div class="ctl-toolbar-actions">
            <button class="ctl-button ctl-button-primary" data-action="reload-file">Reload Styles</button>
            <button class="ctl-button ctl-button-secondary" data-action="toggle-logseq-theme">${getThemeToggleLabel()}</button>
            <button class="ctl-button ctl-button-secondary" data-action="reset-controls">Reset Controls</button>
            <button class="ctl-button ctl-button-secondary" data-action="close">Close</button>
          </div>
          <div class="ctl-status">
            <span class="ctl-status-text" data-role="status-text"></span>
            <span class="ctl-sync-revision" data-role="sync-revision"></span>
            <button class="ctl-sync-indicator" type="button" data-action="sync-graph-state" data-role="sync-indicator"></button>
          </div>
        </div>
        <div class="ctl-tabbar" role="tablist" aria-label="Theme panel views">
          <button class="ctl-tab" type="button" data-tab="tags" role="tab" aria-selected="true">Tags</button>
          <button class="ctl-tab" type="button" data-tab="preview" role="tab" aria-selected="false">Appearance</button>
        </div>
        <div class="ctl-main">
          <section class="ctl-viewer">
            <div class="ctl-pane ctl-pane-tags" data-pane="tags">
              <div class="ctl-pane-stack" data-role="tags-pane"></div>
            </div>
            <div class="ctl-pane ctl-pane-preview" data-pane="preview" hidden>
              ${buildPreviewMarkup()}
            </div>
          </section>
        </div>
      </section>
    </div>
  `;

  app.addEventListener("click", async (event) => {
    const tabButton = event.target.closest("[data-tab]");

    if (tabButton) {
      setActiveTab(tabButton.dataset.tab);
      return;
    }

    const tagSelectButton = event.target.closest("[data-select-tag]");

    if (tagSelectButton) {
      const tagName = tagSelectButton.dataset.selectTag || "";

      if (!tagName) {
        return;
      }

      if (event.detail > 1) {
        clearPendingTagSelection();
        const randomToken = getRandomPresetToken(getTagColorToken(tagName));

        if (randomToken) {
          setTagPresetColor(tagName, randomToken, `Set ${tagName} to random preset ${randomToken}`);
        }

        return;
      }

      scheduleTagSelection(tagName);
      return;
    }

    const colorButton = event.target.closest("[data-set-tag-color]");

    if (colorButton && panelState.selectedTag) {
      setTagPresetColor(panelState.selectedTag, colorButton.dataset.setTagColor);
      return;
    }

    const gradientStrip = event.target.closest("[data-gradient-strip]");

    if (gradientStrip && !event.target.closest('[data-action="select-gradient-stop"]')) {
      const rect = gradientStrip.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const position = Math.round((relativeX / Math.max(rect.width, 1)) * 100);
      addGradientStop(gradientStrip.dataset.areaKey, position);
      void applyManagedOverrides(false, "Added gradient stop", "preview");
      schedulePersistGradients();
      return;
    }

    const target = event.target.closest("[data-action]");

    if (!target) {
      return;
    }

    const { action } = target.dataset;

    if (action === "select-gradient-stop") {
      if (panelState.suppressGradientClick) {
        panelState.suppressGradientClick = false;
        return;
      }

      setSelectedGradientStop(target.dataset.areaKey, Number(target.dataset.stopIndex));
      rerenderPreviewPanePreservingScroll();
      return;
    }

    if (action === "close") {
      closeThemeLoader();
      return;
    }

    if (action === "reload-file") {
      await reloadThemeCss(true);
      return;
    }

    if (action === "sync-graph-state") {
      await syncPersistedAppearance({
        reason: "Synced Degrande appearance from this graph",
        showToast: true,
        forceRender: true,
        fallbackToPrevious: false,
      });
      return;
    }

    if (action === "toggle-logseq-theme") {
      await toggleLogseqTheme();
      return;
    }

    if (action === "refresh-tags") {
      await refreshTags(true);
      return;
    }

    if (action === "add-random-tag-colors") {
      addRandomColorsToUncoloredTags();
      return;
    }

    if (action === "toggle-tag-source-filter") {
      const sourceKey = target.dataset.sourceFilter;

      if (sourceKey === "tags" || sourceKey === "pages") {
        panelState.tagSourceFilters[sourceKey] = !panelState.tagSourceFilters[sourceKey];
        syncTagBrowserState();
        syncTagsPaneState();
      }

      return;
    }

    if (action === "reset-controls") {
      await resetControls();
      return;
    }

    if (action === "clear-tag-color") {
      if (!panelState.selectedTag) {
        return;
      }

      clearTagColorAssignment(panelState.selectedTag, `Cleared custom color for ${panelState.selectedTag}`);
      return;
    }

    if (action === "reset-tag-colors") {
      await resetTagColors();
      return;
    }

    if (action === "copy-tag-colors-from-other-mode") {
      if (!copyTagColorsFromOtherMode()) {
        return;
      }

      renderPanel(`Copied ${getOppositeThemeMode()} mode colors to ${panelState.themeMode} for ${panelState.selectedTag}`);
      void applyManagedOverrides(false, `Copied ${panelState.selectedTag} colors from ${getOppositeThemeMode()}`);
      return;
    }

    if (action === "set-gradient-stop-mode") {
      updateGradientStop(
        target.dataset.areaKey,
        Number(target.dataset.stopIndex),
        { source: target.dataset.stopMode, token: COLOR_PRESETS[0].token, color: panelState.tagCustomColorDraft }
      );
      void applyManagedOverrides(false, "Updated gradient stop type", "preview");
      schedulePersistGradients();
      return;
    }

    if (action === "set-gradient-stop-preset") {
      updateGradientStop(
        target.dataset.areaKey,
        Number(target.dataset.stopIndex),
        { source: "preset", token: target.dataset.stopToken }
      );
      void applyManagedOverrides(false, "Updated preset gradient color", "preview");
      schedulePersistGradients();
      return;
    }

    if (action === "remove-gradient-stop") {
      removeGradientStop(target.dataset.areaKey, Number(target.dataset.stopIndex));
      void applyManagedOverrides(false, "Removed gradient stop", "preview");
      schedulePersistGradients();
      return;
    }
  });

  app.addEventListener("pointerdown", (event) => {
    const gradientHandle = event.target.closest("[data-gradient-handle]");

    if (!gradientHandle) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    beginGradientHandleDrag(
      gradientHandle.dataset.areaKey,
      Number(gradientHandle.dataset.stopIndex),
      event.pointerId
    );
  });

  app.addEventListener("contextmenu", (event) => {
    const tagChip = event.target.closest("[data-tag-chip-name]");

    if (tagChip) {
      event.preventDefault();
      clearPendingTagSelection();
      clearTagColorAssignment(tagChip.dataset.tagChipName || "");
      return;
    }

    const gradientHandle = event.target.closest("[data-gradient-handle]");

    if (!gradientHandle) {
      return;
    }

    event.preventDefault();
    setSelectedGradientStop(gradientHandle.dataset.areaKey, Number(gradientHandle.dataset.stopIndex));
    removeGradientStop(gradientHandle.dataset.areaKey, Number(gradientHandle.dataset.stopIndex));
    void applyManagedOverrides(false, "Removed gradient stop", "preview");
    schedulePersistGradients();
  });

  document.addEventListener("pointermove", (event) => {
    if (!panelState.gradientDrag || event.pointerId !== panelState.gradientDrag.pointerId) {
      return;
    }

    event.preventDefault();
    updateGradientHandleDrag(event.clientX);
  });

  document.addEventListener("pointerup", (event) => {
    if (!panelState.gradientDrag || event.pointerId !== panelState.gradientDrag.pointerId) {
      return;
    }

    endGradientHandleDrag();
  });

  document.addEventListener("pointercancel", (event) => {
    if (!panelState.gradientDrag || event.pointerId !== panelState.gradientDrag.pointerId) {
      return;
    }

    endGradientHandleDrag();
  });

  app.addEventListener("pointerdown", (event) => {
    const spectrum = event.target.closest("[data-inline-color-spectrum]");

    if (!spectrum) {
      return;
    }

    const editor = spectrum.closest("[data-inline-color-editor]");

    if (!editor || editor.dataset.inlineColorDisabled === "true") {
      return;
    }

    event.preventDefault();
    beginInlineColorDrag(editor, event.pointerId);
    updateInlineColorSpectrum(editor, event.clientX, event.clientY);
  });

  document.addEventListener("pointermove", (event) => {
    if (!panelState.colorDrag || event.pointerId !== panelState.colorDrag.pointerId) {
      return;
    }

    event.preventDefault();
    updateInlineColorSpectrum(panelState.colorDrag.editor, event.clientX, event.clientY);
  });

  document.addEventListener("pointerup", (event) => {
    if (!panelState.colorDrag || event.pointerId !== panelState.colorDrag.pointerId) {
      return;
    }

    endInlineColorDrag();
  });

  document.addEventListener("pointercancel", (event) => {
    if (!panelState.colorDrag || event.pointerId !== panelState.colorDrag.pointerId) {
      return;
    }

    endInlineColorDrag();
  });

  app.addEventListener("input", (event) => {
    const gradientAngleInput = event.target.closest("[data-gradient-angle]");

    if (gradientAngleInput) {
      const area = getGradientArea(gradientAngleInput.dataset.gradientAngle);

      if (area) {
        area.angle = Number(gradientAngleInput.value);
        void applyManagedOverrides(false, `Adjusted ${GRADIENT_AREAS[gradientAngleInput.dataset.gradientAngle].label}`, "soft");
        schedulePersistGradients();
      }

      return;
    }

    const inlineColorHexInput = event.target.closest("[data-inline-color-hex]");

    if (inlineColorHexInput) {
      const editor = inlineColorHexInput.closest("[data-inline-color-editor]");
      const normalized = normalizeHexColor(inlineColorHexInput.value);

      if (!editor || !normalized) {
        return;
      }

      applyInlineEditorColor(editor, normalized, "soft");
      return;
    }

    const inlineColorHue = event.target.closest("[data-inline-color-hue]");

    if (inlineColorHue) {
      const editor = inlineColorHue.closest("[data-inline-color-editor]");

      if (!editor) {
        return;
      }

      const current = hexToRgb(getInlineColorEditorColor(editor)) || { r: 20, g: 184, b: 166, a: 1 };
      const hsv = rgbToHsv(current);
      applyInlineEditorColor(editor, rgbToHex(hsvToRgb({ h: Number(inlineColorHue.value), s: hsv.s, v: hsv.v, a: hsv.a })), "soft");
      return;
    }

    const inlineColorAlpha = event.target.closest("[data-inline-color-alpha]");

    if (inlineColorAlpha) {
      const editor = inlineColorAlpha.closest("[data-inline-color-editor]");

      if (!editor) {
        return;
      }

      const current = hexToRgb(getInlineColorEditorColor(editor)) || { r: 20, g: 184, b: 166, a: 1 };
      const hsv = rgbToHsv(current);
      applyInlineEditorColor(editor, rgbToHex(hsvToRgb({ h: hsv.h, s: hsv.s, v: hsv.v, a: Number(inlineColorAlpha.value) / 100 })), "soft");
      return;
    }

    const tagFilterInput = event.target.closest("[data-tag-filter]");

    if (tagFilterInput) {
      panelState.tagFilter = tagFilterInput.value || "";
      syncTagBrowserState();
      syncTagsPaneState();
      return;
    }

    const input = event.target.closest("[data-control-key]");

    if (!input) {
      return;
    }

    const { controlKey } = input.dataset;
    const control = CONTROL_MAP[controlKey];

    if (!control) {
      return;
    }

    panelState.controlState[controlKey] = Number(input.value);
    void applyManagedOverrides(false, `Adjusted ${control.label}`, "soft");
    schedulePersistControls();
  });

  app.addEventListener("change", (event) => {
    const inlineColorHexInput = event.target.closest("[data-inline-color-hex]");

    if (inlineColorHexInput) {
      const editor = inlineColorHexInput.closest("[data-inline-color-editor]");
      const nextColor = getInlineColorEditorColor(editor);
      syncInlineColorEditor(editor, nextColor);
      return;
    }

    const sortSelect = event.target.closest("[data-tag-sort]");

    if (!sortSelect) {
      return;
    }

    panelState.tagSortMode = sortSelect.value || "name";
    syncTagBrowserState();
    syncTagsPaneState();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeThemeLoader();
    }
  });

  panelState.mounted = true;
  setPanelRootVisibility(false);
  syncControlInputs();
  syncPreviewStyles();
  syncTabState();
}

async function applyManagedOverrides(showToast = false, statusMessage = "Updated live overrides", renderMode = "full") {
  const managedOverrides = buildManagedOverrides();

  panelState.cssText = buildEffectiveCssText(managedOverrides);
  panelState.lastAppliedAt = new Date();
  cleanupLegacyManagedStyles();
  setHostStyleText(MANAGED_STYLE_ELEMENT_ID, managedOverrides);

  if (shouldUseProvideStyleFallback()) {
    applyPluginStyleText(panelState.cssText);
  }

  syncHostColorVariables();

  if (panelState.mounted) {
    if (renderMode === "soft") {
      refreshPanel(statusMessage);
    } else if (renderMode === "preview") {
      rerenderPreviewPanePreservingScroll(statusMessage);
    } else {
      renderPanel(statusMessage);
    }
  }

  if (showToast) {
    await logseq.UI.showMsg(statusMessage, "success");
  }
}

async function openThemeLoader() {
  if (!panelState.mounted) {
    mountPanel();
  }

  setPanelRootVisibility(true);
  logseq.setMainUIInlineStyle(MAIN_UI_INLINE_STYLE);
  renderPanel("Loading latest synced graph state...");
  logseq.showMainUI({ autoFocus: true });

  try {
    await syncPersistedAppearance({
      reason: "Loaded latest synced graph state",
      forceRender: true,
      fallbackToPrevious: false,
      renderMode: "soft",
    });
  } catch (error) {
    console.error("[Degrande Colors] Failed to refresh synced graph state when opening panel", error);

    await ensureTagsForCurrentGraph({ force: true, fallbackToPrevious: true });
    await applyManagedOverrides(false, "Reapplied saved theme controls");
    renderPanel("Unable to refresh synced graph state. Showing current values.");
  }
}

function closeThemeLoader() {
  setPanelRootVisibility(false);
  logseq.hideMainUI({ restoreEditingCursor: true });
}

function toggleThemeLoader() {
  if (logseq.isMainUIVisible) {
    closeThemeLoader();
  } else {
    void openThemeLoader();
  }
}

async function reloadThemeCss(showToast = false, reopenUI = !!logseq.isMainUIVisible) {
  panelState.baseCssText = await loadWorkspaceCss();
  panelState.baseTagColorMap = parseBaseTagColorMap(panelState.baseCssText);
  setHostStyleText(BASE_STYLE_ELEMENT_ID, panelState.baseCssText);

  if (shouldUseProvideStyleFallback()) {
    applyPluginStyleText(panelState.baseCssText);
  }

  await applyManagedOverrides(showToast, "Reloaded base styles and re-applied controls");

  if (reopenUI) {
    openThemeLoader();
  }
}

async function resetControls() {
  const confirmed = typeof window?.confirm === "function"
    ? window.confirm("Reset all live controls and gradients back to the base defaults?")
    : true;

  if (!confirmed) {
    renderPanel("Reset controls cancelled");
    return;
  }

  panelState.controlState = { ...DEFAULT_CONTROL_STATE };
  panelState.gradientState = createDefaultGradientState();
  panelState.gradientSelections = Object.fromEntries(Object.keys(GRADIENT_AREAS).map((areaKey) => [areaKey, 0]));

  if (panelState.persistTimer) {
    clearTimeout(panelState.persistTimer);
    panelState.persistTimer = null;
  }

  if (panelState.gradientPersistTimer) {
    clearTimeout(panelState.gradientPersistTimer);
    panelState.gradientPersistTimer = null;
  }

  await saveGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, panelState.controlState);
  await saveGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, panelState.gradientState);
  await bumpGraphSyncRevision("reset-controls");
  removeLocalPersistedItem(CONTROL_STORAGE_KEY);
  removeLocalPersistedItem(GRADIENT_STORAGE_KEY);
  await applyManagedOverrides(true, "Reset live controls to the base defaults");
}

async function resetTagColors() {
  const visibleAssignedTags = getVisibleAssignedTags();

  if (!visibleAssignedTags.length) {
    renderPanel("No filtered tag colors to reset");
    return;
  }

  const confirmed = typeof window?.confirm === "function"
    ? window.confirm(`Reset ${visibleAssignedTags.length} filtered tag color${visibleAssignedTags.length === 1 ? "" : "s"} back to their defaults?`)
    : true;

  if (!confirmed) {
    renderPanel("Reset tag colors cancelled");
    return;
  }

  visibleAssignedTags.forEach((tagName) => {
    delete panelState.tagColorAssignments[tagName.toLowerCase()];
  });

  clearPendingTagSelection();

  if (panelState.tagPersistTimer) {
    clearTimeout(panelState.tagPersistTimer);
    panelState.tagPersistTimer = null;
  }

  await saveGraphSyncedTagColors(visibleAssignedTags);

  renderPanel(`Reset ${visibleAssignedTags.length} filtered tag color${visibleAssignedTags.length === 1 ? "" : "s"} to defaults`);
  void applyManagedOverrides(false, `Reset ${visibleAssignedTags.length} filtered tag color${visibleAssignedTags.length === 1 ? "" : "s"} to defaults`);
}

async function main() {
  const pluginId = logseq.baseInfo.id;
  const commandKey = (suffix) => `${pluginId}/${suffix}`;
  const activationMessage = `Degrande Colors v${PLUGIN_VERSION} is active for this Logseq DB graph.`;

  registerDegrandeSettingsSchema();
  await loadStoredControls();
  await loadStoredTagColors();
  await loadStoredGradients();
  await loadGraphSyncRevisionState();
  bindHostTagContextMenu();

  const userConfigs = await logseq.App.getUserConfigs();
  await syncCurrentGraphInfo();
  setThemeMode(userConfigs?.preferredThemeMode);
  logseq.App.onThemeModeChanged(({ mode }) => {
    setThemeMode(mode);
    renderPanel(`Logseq theme: ${mode}`);
  });

  if (typeof logseq.onSettingsChanged === "function") {
    logseq.onSettingsChanged((nextSettings, previousSettings) => {
      const nextControls = nextSettings?.[SETTINGS_CONTROL_STATE_KEY];
      const prevControls = previousSettings?.[SETTINGS_CONTROL_STATE_KEY];
      const nextGradients = nextSettings?.[SETTINGS_GRADIENT_STATE_KEY];
      const prevGradients = previousSettings?.[SETTINGS_GRADIENT_STATE_KEY];

      if (JSON.stringify(nextControls) !== JSON.stringify(prevControls) && nextControls != null) {
        panelState.controlState = mergeStoredControls(nextControls);
      }

      if (JSON.stringify(nextGradients) !== JSON.stringify(prevGradients) && nextGradients != null) {
        panelState.gradientState = mergeStoredGradients(nextGradients);
      }
    });
  }

  if (typeof logseq.App.onCurrentGraphChanged === "function") {
    logseq.App.onCurrentGraphChanged(() => {
      void handleCurrentGraphChanged();
    });
  }

  if (typeof logseq.App.onGraphAfterIndexed === "function") {
    logseq.App.onGraphAfterIndexed(({ repo }) => {
      if (!doesRepoMatchGraph(repo)) {
        return;
      }

      panelState.graphIndexed = true;

      void flushDeferredGraphSyncWrites();

      scheduleReloadPersistedAppearance("Reloaded saved graph appearance", {
        fallbackToPrevious: false,
      });
    });
  }

  if (typeof logseq.DB?.onChanged === "function") {
    logseq.DB.onChanged(({ txData }) => {
      if (!Array.isArray(txData) || !txData.length) {
        scheduleReloadPersistedAppearance("Checked synced Degrande appearance", {
          delayMs: 0,
          fallbackToPrevious: false,
        });
        return;
      }

      if (!doesTxDataTouchDegrandeState(txData)) {
        return;
      }

      scheduleReloadPersistedAppearance("Updated synced Degrande appearance", {
        fallbackToPrevious: false,
      });
    });
  }

  scheduleStartupSyncRefreshes();

  await reloadThemeCss(false, false);
  setTimeout(() => {
    void applyManagedOverrides(false, "Reapplied saved theme controls");
  }, 900);
  observeHostColorTargets();

  logseq.provideModel({
    openThemeLoader,
    closeThemeLoader,
    toggleThemeLoader,
  });

  logseq.provideStyle(getToolbarStyle());

  registerToolbarItemSafely({
    key: "custom-theme-loader-open",
    template: `
      <a class="button" data-on-click="toggleThemeLoader" title="Open Degrande Colors" aria-label="Open Degrande Colors">
        <i class="ti ti-palette" aria-hidden="true"></i>
      </a>
    `,
  });

  await logseq.UI.showMsg(
    activationMessage,
    "success",
    { timeout: 2500 }
  );

  registerCommandPaletteSafely(
    {
      key: commandKey("open-panel"),
      label: "Degrande Colors: open panel",
    },
    openThemeLoader
  );

  registerCommandPaletteSafely(
    {
      key: commandKey("status"),
      label: "Degrande Colors: show status",
    },
    async () => {
      await logseq.UI.showMsg(
        activationMessage,
        "success"
      );
      openThemeLoader();
    }
  );

  registerCommandPaletteSafely(
    {
      key: commandKey("reload-css"),
      label: "Degrande Colors: reload styles",
    },
    () => reloadThemeCss(true)
  );

  registerCommandPaletteSafely(
    {
      key: commandKey("sync-graph-state"),
      label: "Degrande Colors: sync graph state",
    },
    () => syncPersistedAppearance({
      reason: "Synced Degrande appearance from this graph",
      showToast: true,
      forceRender: true,
      fallbackToPrevious: false,
    })
  );

  registerCommandPaletteSafely(
    {
      key: commandKey("refresh-tags"),
      label: "Degrande Colors: refresh tags",
    },
    () => ensureTagsForCurrentGraph({ force: true, showToast: true, fallbackToPrevious: false })
  );

  registerCommandPaletteSafely(
    {
      key: commandKey("toggle-logseq-theme"),
      label: "Degrande Colors: toggle Logseq theme",
    },
    toggleLogseqTheme
  );

  console.info(`[Degrande Colors] Loaded base styles and controls (v${PLUGIN_VERSION})`);
}

window.__degrandeColorsMain = main;
})();

