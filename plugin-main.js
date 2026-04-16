(() => {
const CONTROL_STORAGE_KEY = "custom-theme-loader-controls.json";
const FALLBACK_PLUGIN_VERSION = "0.4.12";
const TAG_COLOR_STORAGE_KEY = "custom-theme-loader-tag-colors.json";
const GRADIENT_STORAGE_KEY = "custom-theme-loader-gradients.json";
const APPEARANCE_STATE_STORAGE_KEY = "custom-theme-loader-appearance-state.json";
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
const TAG_NODE_STYLE_OBSERVER_KEY = "__degrandeColorsTagNodeStyleObserver";
const CMDK_STYLE_OBSERVER_KEY = "__degrandeColorsCmdkStyleObserver";
const CMDK_STYLE_TIMER_KEY = "__degrandeColorsCmdkStyleTimer";
const SIDEBAR_STYLE_OBSERVER_KEY = "__degrandeColorsSidebarStyleObserver";
const SIDEBAR_STYLE_TIMER_KEY = "__degrandeColorsSidebarStyleTimer";
const COMMAND_REGISTRY_KEY = "__degrandeColorsRegisteredCommands";
const TOOLBAR_REGISTRY_KEY = "__degrandeColorsRegisteredToolbarItems";
const HOST_SESSION_KEY = "__degrandeColorsHostSession";
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
  { token: "acc-app-accent", label: "Logseq Accent", lightBg: "color-mix(in srgb, var(--ls-active-primary-color, var(--ls-link-text-color, #10b981)) 15%, transparent)", lightBorder: "color-mix(in srgb, var(--ls-active-primary-color, var(--ls-link-text-color, #10b981)) 60%, transparent)", darkBg: "color-mix(in srgb, var(--ls-active-primary-color, var(--ls-link-text-color, #10b981)) 25%, transparent)", darkBorder: "color-mix(in srgb, var(--ls-active-primary-color, var(--ls-link-text-color, #10b981)) 60%, transparent)", lightText: "color-mix(in srgb, var(--ls-active-primary-color, var(--ls-link-text-color, #10b981)) 90%, black)", darkText: "color-mix(in srgb, var(--ls-active-primary-color, var(--ls-link-text-color, #10b981)) 20%, white)" },
  { token: "acc-lt-blue", label: "Accent Lt Blue", lightBg: "#ebf2fb", lightBorder: "#b0c7ea", darkBg: "#1a2638", darkBorder: "#8aa6d3", lightText: "#4d6890", darkText: "#ebf2fb" },
  { token: "acc-coral", label: "Accent Coral", lightBg: "#feece8", lightBorder: "#f49e8c", darkBg: "#3e1d17", darkBorder: "#de7c68", lightText: "#9f4330", darkText: "#feece8" },
  { token: "acc-salmon", label: "Accent Salmon", lightBg: "#feeeee", lightBorder: "#f49898", darkBg: "#3e1d1d", darkBorder: "#de7a7a", lightText: "#9f4343", darkText: "#feeeee" },
  { token: "acc-rose", label: "Accent Rose", lightBg: "#fef0f5", lightBorder: "#f68fbb", darkBg: "#4a182d", darkBorder: "#d96798", lightText: "#a83060", darkText: "#fef0f5" },
  { token: "acc-blush", label: "Accent Blush", lightBg: "#fdf0f8", lightBorder: "#e992cc", darkBg: "#3c1830", darkBorder: "#d16ead", lightText: "#9e2a73", darkText: "#fdf0f8" },
  { token: "acc-lilac", label: "Accent Lilac", lightBg: "#fdf3fc", lightBorder: "#e09bec", darkBg: "#34173e", darkBorder: "#c372d3", lightText: "#8a2c9b", darkText: "#fdf3fc" },
  { token: "acc-lavender", label: "Accent Lavender", lightBg: "#faf3fc", lightBorder: "#c69ee4", darkBg: "#2b1d3d", darkBorder: "#aa7cd1", lightText: "#7844a4", darkText: "#faf3fc" },
  { token: "acc-indigo", label: "Accent Indigo", lightBg: "#f0ecfe", lightBorder: "#866cee", darkBg: "#23184b", darkBorder: "#6d51d9", lightText: "#4831b0", darkText: "#f0ecfe" },
  { token: "acc-periwinkle", label: "Accent Periwinkle", lightBg: "#eff2fe", lightBorder: "#93a2f7", darkBg: "#1a2046", darkBorder: "#7889e4", lightText: "#4859bc", darkText: "#eff2fe" },
  { token: "acc-sky", label: "Accent Sky", lightBg: "#ebf5fe", lightBorder: "#71b2f7", darkBg: "#132642", darkBorder: "#4a90de", lightText: "#215ea8", darkText: "#ebf5fe" },
  { token: "acc-cyan", label: "Accent Cyan", lightBg: "#ebfafa", lightBorder: "#7acee1", darkBg: "#12333b", darkBorder: "#4caec5", lightText: "#1c7288", darkText: "#ebfafa" },
  { token: "acc-teal", label: "Accent Teal", lightBg: "#eef9f7", lightBorder: "#7ecdbe", darkBg: "#14352e", darkBorder: "#59af9c", lightText: "#267261", darkText: "#eef9f7" },
  { token: "acc-sage", label: "Accent Sage", lightBg: "#f2f9f4", lightBorder: "#9fd2af", darkBg: "#1e3828", darkBorder: "#7eb390", lightText: "#36774e", darkText: "#f2f9f4" },
  { token: "acc-apricot", label: "Accent Apricot", lightBg: "#fff5ee", lightBorder: "#fca877", darkBg: "#442413", darkBorder: "#df8a57", lightText: "#ae4b16", darkText: "#fff5ee" },
];

const COLOR_PRESET_MAP = Object.fromEntries(COLOR_PRESETS.map((preset) => [preset.token, preset]));
const TAGS_DATASCRIPT_QUERY = '[:find ?name :where [_ :block/tags ?t] [?t :block/name ?name]]';
const REFS_DATASCRIPT_QUERY = '[:find ?name :where [_ :block/refs ?p] [?p :block/name ?name]]';
const GRADIENT_AREAS = {
  node: {
    label: "Tagged Block Gradient",
    linkedLabel: "Linked Tag Color",
    previewTagName: "Project",
    previewLinkedColor: "rgba(16, 185, 129, 0.24)",
  },
  title: {
    label: "Page Title Gradient",
    linkedLabel: "Linked Tag Color",
    previewTagName: "Journal",
    previewLinkedColor: "rgba(245, 158, 11, 0.24)",
  },
  highlight: {
    label: "Highlight Gradient",
    linkedLabel: "Default Highlight",
    linkedCaption: "Uses the default mark highlight tone.",
    previewLinkedColor: "rgba(250, 204, 21, 0.32)",
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
      angle: 45,
      stops: [
        { source: "transparent", position: 0 },
        { source: "linked", position: 50 },
        { source: "transparent", position: 80 },
      ],
    },
    title: {
      angle: 45,
      stops: [
        { source: "transparent", position: 0 },
        { source: "linked", position: 30 },
        { source: "transparent", position: 60 },
      ],
    },
    highlight: {
      angle: 45,
      stops: [
        { source: "linked", position: 0 },
        { source: "linked", position: 100 },
      ],
    },
    quote: {
      angle: 45,
      stops: [
        { source: "linked", position: 0 },
        { source: "transparent", position: 40 },
        { source: "transparent", position: 70 },
        { source: "linked", position: 100 },
      ],
    },
    background: {
      angle: 45,
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
    title: "Highlights",
    description: "Shape the highlight mark and adjust the visible color band.",
    controls: [
      { key: "highlightStartPercent", label: "Start", min: 0, max: 100, step: 1, unit: "%", defaultValue: 0 },
      { key: "highlightEndPercent", label: "Stop", min: 0, max: 100, step: 1, unit: "%", defaultValue: 100 },
      { key: "highlightRadius", label: "Radius", min: 0, max: 12, step: 1, unit: "px", defaultValue: 4 },
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
const APPEARANCE_SECTIONS = [
  { key: "tagColors", label: "Tag Colors", description: "Tag-specific chip and color-variable overrides." },
  { key: "tagChips", label: "Tag Chips", description: "Inline chip sizing, borders, and hover lift." },
  { key: "linkedBlocks", label: "Linked Blocks", description: "Tag-driven gradients on ordinary linked blocks." },
  { key: "pageTitles", label: "Page Titles", description: "Gradient accents on page and journal title rows." },
  { key: "highlights", label: "Highlights", description: "Gradient color treatment for inline mark highlights." },
  { key: "quotes", label: "Quotes", description: "Quote edge glow, padding, and gradient fills." },
  { key: "backgroundBlocks", label: "Background Blocks", description: "Gradient sweeps on non-quote colored blocks." },
];
const APPEARANCE_SECTION_MAP = Object.fromEntries(APPEARANCE_SECTIONS.map((section) => [section.key, section]));
const DEFAULT_APPEARANCE_STATE = Object.fromEntries(APPEARANCE_SECTIONS.map((section) => [section.key, true]));
const HOST_COLOR_BACKGROUND_SELECTOR = '.with-bg-color:not([data-node-type="quote"])';
const HOST_COLOR_QUOTE_SELECTOR = 'div[data-node-type="quote"]';
const HOST_COLOR_TARGET_SELECTOR = `${HOST_COLOR_BACKGROUND_SELECTOR}, ${HOST_COLOR_QUOTE_SELECTOR}`;
const HOST_HIGHLIGHT_MARK_SELECTORS = [
  '.ls-block mark',
  '.ls-block .editor-inner mark',
  '.ls-block .block-content mark',
  '.ls-block .block-title-wrap mark',
  '.ls-block .block-content-inner mark',
  '.ls-block h1.title mark',
  '.ls-block .journal-title mark',
];
const CMDK_SCOPE_SELECTOR = '.cp__cmdk, .cp__select-main, .cp__palette-main';
const CMDK_ROW_SELECTOR = `${CMDK_SCOPE_SELECTOR} [data-cmdk-item]`;
const SIDEBAR_ROOT_SELECTOR = '.left-sidebar-inner';
const SIDEBAR_TITLE_SELECTOR = `${SIDEBAR_ROOT_SELECTOR} .page-title`;
const CSS_SECTION_MARKER_1 = '/* --- 1. THE PAINTBOX (COLOR VARIABLES) --- */';
const CSS_SECTION_MARKER_2 = '/* --- 2. THE ENGINE (SET ONCE & FORGET) --- */';
const CSS_SECTION_MARKER_6 = '/* --- 6. PAGE REFERENCE STYLING ([[ ]]) --- */';
const CSS_SECTION_MARKER_7 = '/* --- 7. MODERN QUOTES & CALLOUTS       --- */';
const CSS_ACCENT_MARKER = '/* Accent Colors CSS Setup */';

const QUOTE_COLOR_RULES = [
  { selector: 'div[data-node-type="quote"][style*="red"]', token: 'red' },
  { selector: 'div[data-node-type="quote"][style*="yellow"]', token: 'yellow' },
  { selector: 'div[data-node-type="quote"][style*="green"]', token: 'green' },
  { selector: 'div[data-node-type="quote"][style*="blue"]', token: 'blue' },
  { selector: 'div[data-node-type="quote"][style*="purple"]', token: 'purple' },
  { selector: 'div[data-node-type="quote"][style*="pink"]', token: 'pink' },
  { selector: 'div[data-node-type="quote"][style*="gray"], div[data-node-type="quote"][style*="grey"]', token: 'grey' },
  { selector: 'div[data-node-type="quote"][style*="acc-app-accent"]', token: 'acc-app-accent' },
  { selector: 'div[data-node-type="quote"][style*="acc-lt-blue"]', token: 'acc-lt-blue' },
  { selector: 'div[data-node-type="quote"][style*="acc-coral"]', token: 'acc-coral' },
  { selector: 'div[data-node-type="quote"][style*="acc-salmon"]', token: 'acc-salmon' },
  { selector: 'div[data-node-type="quote"][style*="acc-rose"]', token: 'acc-rose' },
  { selector: 'div[data-node-type="quote"][style*="acc-blush"]', token: 'acc-blush' },
  { selector: 'div[data-node-type="quote"][style*="acc-lilac"]', token: 'acc-lilac' },
  { selector: 'div[data-node-type="quote"][style*="acc-lavender"]', token: 'acc-lavender' },
  { selector: 'div[data-node-type="quote"][style*="acc-indigo"]', token: 'acc-indigo' },
  { selector: 'div[data-node-type="quote"][style*="acc-periwinkle"]', token: 'acc-periwinkle' },
  { selector: 'div[data-node-type="quote"][style*="acc-sky"]', token: 'acc-sky' },
  { selector: 'div[data-node-type="quote"][style*="acc-cyan"]', token: 'acc-cyan' },
  { selector: 'div[data-node-type="quote"][style*="acc-teal"]', token: 'acc-teal' },
  { selector: 'div[data-node-type="quote"][style*="acc-sage"]', token: 'acc-sage' },
  { selector: 'div[data-node-type="quote"][style*="acc-apricot"]', token: 'acc-apricot' },
];

const BACKGROUND_BLOCK_RULES = [
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="red"]', token: 'red' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="yellow"]', token: 'yellow' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="green"]', token: 'green' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="blue"]', token: 'blue' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="purple"]', token: 'purple' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="pink"]', token: 'pink' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="gray"], .with-bg-color:not([data-node-type="quote"])[style*="grey"]', token: 'grey' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-app-accent"]', token: 'acc-app-accent' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-lt-blue"]', token: 'acc-lt-blue' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-coral"]', token: 'acc-coral' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-salmon"]', token: 'acc-salmon' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-rose"]', token: 'acc-rose' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-blush"]', token: 'acc-blush' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-lilac"]', token: 'acc-lilac' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-lavender"]', token: 'acc-lavender' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-indigo"]', token: 'acc-indigo' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-periwinkle"]', token: 'acc-periwinkle' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-sky"]', token: 'acc-sky' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-cyan"]', token: 'acc-cyan' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-teal"]', token: 'acc-teal' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-sage"]', token: 'acc-sage' },
  { selector: '.with-bg-color:not([data-node-type="quote"])[style*="acc-apricot"]', token: 'acc-apricot' },
];

const panelState = {
  baseCssText: "",
  cssText: "",
  themeMode: "light",
  controlState: { ...DEFAULT_CONTROL_STATE },
  appearanceState: { ...DEFAULT_APPEARANCE_STATE },
  cssStats: {
    base: { lines: 0, chars: 0 },
    managed: { lines: 0, chars: 0 },
    total: { lines: 0, chars: 0 },
    sections: Object.fromEntries(APPEARANCE_SECTIONS.map((section) => [section.key, { lines: 0, chars: 0 }])),
  },
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
  lastTagCatalogLoadedAt: 0,
  propertyIdentMap: {},
  propertyAttrMap: {},
  propertySchemaEnsureMap: {},
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
  fallbackStyleFlushTimer: null,
  pendingFallbackCssText: "",
  dbStateRefreshTimer: null,
  tagCatalogRefreshTimer: null,
  tagNodeStyleSyncTimer: null,
  pendingTagNodeRoots: new Set(),
  startupSyncTimerIds: [],
  pendingTagPersistKeys: [],
  tagClickTimer: null,
  hostTagContextMenuBound: false,
  legacyManagedStylesCleaned: false,
  tagNodeColorMap: {},
  tagNodePriorityMap: {},
};

function getHostDocument() {
  try {
    if (typeof logseq?.Experiments?.ensureHostScope === 'function') {
      const hostScope = logseq.Experiments.ensureHostScope();

      if (hostScope?.document) {
        return hostScope.document;
      }
    }
  } catch (error) {
    // Ignore host-scope bridge issues and fall back to direct document access.
  }

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

function getHostWindow() {
  try {
    if (typeof logseq?.Experiments?.ensureHostScope === 'function') {
      const hostScope = logseq.Experiments.ensureHostScope();

      if (hostScope?.document) {
        return hostScope;
      }
    }
  } catch (error) {
    // Ignore host-scope bridge issues and fall back to direct window access.
  }

  try {
    if (window.top?.document) {
      return window.top;
    }
  } catch (error) {
    // Ignore cross-frame access issues and fall back to the current window.
  }

  try {
    if (window.parent?.document) {
      return window.parent;
    }
  } catch (error) {
    // Ignore cross-frame access issues and fall back to the current window.
  }

  return window;
}

function getAccessibleDocumentCandidates() {
  const candidates = [];
  const seen = new Set();

  const pushDocument = (candidate) => {
    if (!candidate || seen.has(candidate)) {
      return;
    }

    seen.add(candidate);
    candidates.push(candidate);
  };

  try {
    if (typeof logseq?.Experiments?.ensureHostScope === 'function') {
      pushDocument(logseq.Experiments.ensureHostScope()?.document);
    }
  } catch (error) {
    // Ignore host-scope bridge issues.
  }

  try {
    pushDocument(window.top?.document);
  } catch (error) {
    // Ignore cross-frame access issues.
  }

  try {
    pushDocument(window.parent?.document);
  } catch (error) {
    // Ignore cross-frame access issues.
  }

  pushDocument(document);

  return candidates.filter((candidate) => candidate?.documentElement);
}

function getObservableHostDocuments() {
  const hostLikeDocuments = getAccessibleDocumentCandidates().filter((candidate) => {
    try {
      return Boolean(
        candidate.querySelector('#app-container, #root, .cp__header, .left-sidebar-inner, .cp__sidebar-main-content')
      );
    } catch (error) {
      return false;
    }
  });

  return hostLikeDocuments.length ? hostLikeDocuments : [getHostDocument()];
}

function disconnectObserverGroup(registry) {
  if (!Array.isArray(registry)) {
    registry?.disconnect?.();
    return;
  }

  registry.forEach((entry) => {
    entry?.disconnect?.();
  });
}

function canAccessExternalHostDocument() {
  try {
    if (typeof logseq?.Experiments?.ensureHostScope === 'function') {
      const hostScope = logseq.Experiments.ensureHostScope();

      if (hostScope?.document && hostScope.document !== document) {
        return true;
      }
    }
  } catch (error) {
    // Ignore host-scope bridge issues and continue with direct checks.
  }

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

function flushPendingFallbackStyleText() {
  if (panelState.fallbackStyleFlushTimer) {
    clearTimeout(panelState.fallbackStyleFlushTimer);
    panelState.fallbackStyleFlushTimer = null;
  }

  const cssText = panelState.pendingFallbackCssText;
  panelState.pendingFallbackCssText = "";

  if (cssText) {
    applyPluginStyleText(cssText);
  }
}

function queueFallbackStyleText(cssText, delay = 180) {
  panelState.pendingFallbackCssText = cssText;

  if (panelState.fallbackStyleFlushTimer) {
    clearTimeout(panelState.fallbackStyleFlushTimer);
  }

  panelState.fallbackStyleFlushTimer = setTimeout(() => {
    panelState.fallbackStyleFlushTimer = null;
    const nextCssText = panelState.pendingFallbackCssText;
    panelState.pendingFallbackCssText = "";

    if (nextCssText) {
      applyPluginStyleText(nextCssText);
    }
  }, delay);
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

function getSyncRevisionLabel() {
  return panelState.currentGraphInfo?.name
    ? "Graph sync"
    : "Graph";
}

function getSyncRevisionTooltip() {
  const graphName = String(panelState.currentGraphInfo?.name || "").trim();
  return graphName
    ? `Graph-backed Degrande state for ${graphName}.`
    : "Graph-backed Degrande state.";
}

function getSyncIndicatorTooltip() {
  const stateText = panelState.syncState === "synced"
    ? "Graph-backed state is current. Click to reload synced state from the graph."
    : "Saving graph-backed state for this graph.";

  return `${stateText} Storage mode: ${getSyncRevisionLabel()}.`;
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
.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] a.button,
.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] button {
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
.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] a.button:hover,
.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] button:hover {
  opacity: 1;
}

.ui-items-container[data-type="toolbar"] [data-injected-ui="custom-theme-loader-open"] :is(a, a.button, button)[aria-pressed="true"] {
  opacity: 1;
  color: var(--ls-link-text-color, var(--ls-active-primary-color, var(--ls-primary-text-color, currentColor)));
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

function syncThemeLoaderToggleState() {
  const hostDocument = getHostDocument();
  const isOpen = Boolean(logseq.isMainUIVisible);
  const buttonLabel = isOpen ? "Close Degrande Colors" : "Open Degrande Colors";
  const buttonState = isOpen ? "true" : "false";
  const selectors = [
    `#${TOOLBAR_BUTTON_ID}`,
    '[data-injected-ui="custom-theme-loader-open"] a',
    '[data-injected-ui="custom-theme-loader-open"] a.button',
    '[data-injected-ui="custom-theme-loader-open"] button',
  ];

  for (const selector of selectors) {
    hostDocument.querySelectorAll(selector).forEach((element) => {
      element.setAttribute("aria-label", buttonLabel);
      element.setAttribute("title", buttonLabel);
      element.setAttribute("aria-pressed", buttonState);
      element.dataset.panelOpen = buttonState;
    });
  }
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

  syncThemeLoaderToggleState();
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

    syncThemeLoaderToggleState();

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

  syncThemeLoaderToggleState();

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

function normalizeObservedNode(node) {
  if (!node) {
    return null;
  }

  if (node.nodeType === 3) {
    return node.parentElement || null;
  }

  return node;
}

function getClosestMatchingElement(node, selector, hostWindow) {
  const candidate = normalizeObservedNode(node);

  if (!(candidate instanceof hostWindow.Element)) {
    return null;
  }

  if (candidate.matches(selector)) {
    return candidate;
  }

  return candidate.closest(selector);
}

function collectMatchingElements(root, selector, hostWindow) {
  const candidate = normalizeObservedNode(root) || root;
  const matches = [];
  const closestMatch = getClosestMatchingElement(candidate, selector, hostWindow);

  if (closestMatch) {
    matches.push(closestMatch);
  }

  if (candidate && typeof candidate.querySelectorAll === 'function') {
    candidate.querySelectorAll(selector).forEach((element) => {
      if (element instanceof hostWindow.Element) {
        matches.push(element);
      }
    });
  }

  return Array.from(new Set(matches));
}

function nodeTouchesSelector(node, selector, hostWindow) {
  const candidate = normalizeObservedNode(node);

  if (!(candidate instanceof hostWindow.Element)) {
    return false;
  }

  if (candidate.matches(selector) || candidate.closest(selector)) {
    return true;
  }

  return typeof candidate.querySelector === 'function' && Boolean(candidate.querySelector(selector));
}

function syncHostColorVariableElement(element, hostWindow) {
  if (!(element instanceof hostWindow.Element)) {
    return;
  }

  if (element.matches(HOST_COLOR_BACKGROUND_SELECTOR)) {
    const gradientColor = getDerivedGradientColor(
      element.style.backgroundColor || element.style.background,
      0.72,
      0.16,
      0.34
    );

    syncInlineCssVariable(element, '--ctl-bg-sweep-color', gradientColor);
    syncInlineCssVariable(element, '--ctl-quote-color', null);
    return;
  }

  if (element.matches(HOST_COLOR_QUOTE_SELECTOR)) {
    const gradientColor = getDerivedGradientColor(
      element.style.borderLeftColor || element.style.backgroundColor || element.style.background,
      0.85,
      0.14,
      0.42
    );

    syncInlineCssVariable(element, '--ctl-quote-color', gradientColor);
    syncInlineCssVariable(element, '--ctl-bg-sweep-color', null);
    return;
  }

  syncInlineCssVariable(element, '--ctl-bg-sweep-color', null);
  syncInlineCssVariable(element, '--ctl-quote-color', null);
}

function syncHostColorVariablesInSubtree(root, hostDocument = getHostDocument()) {
  const hostWindow = hostDocument.defaultView || window;
  const candidate = normalizeObservedNode(root);

  if (candidate instanceof hostWindow.Element) {
    syncHostColorVariableElement(candidate, hostWindow);
  }

  collectMatchingElements(root, HOST_COLOR_TARGET_SELECTOR, hostWindow).forEach((element) => {
    syncHostColorVariableElement(element, hostWindow);
  });
}

function observeHostColorTargets() {
  const hostDocument = getHostDocument();
  const hostWindow = hostDocument.defaultView || window;
  const HostMutationObserver = hostWindow.MutationObserver || MutationObserver;

  hostWindow[HOST_COLOR_SYNC_OBSERVER_KEY]?.disconnect?.();

  const observer = new HostMutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && nodeTouchesSelector(mutation.target, HOST_COLOR_TARGET_SELECTOR, hostWindow)) {
        syncHostColorVariablesInSubtree(mutation.target, hostDocument);
      }

      Array.from(mutation.addedNodes || []).forEach((node) => {
        if (nodeTouchesSelector(node, HOST_COLOR_TARGET_SELECTOR, hostWindow)) {
          syncHostColorVariablesInSubtree(node, hostDocument);
        }
      });
    });
  });

  observer.observe(hostDocument.body || hostDocument.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style"],
  });

  hostWindow[HOST_COLOR_SYNC_OBSERVER_KEY] = observer;
  syncHostColorVariables();
}

function scheduleCmdkTagStyleSync() {
  const hostWindow = getHostWindow();

  if (hostWindow[CMDK_STYLE_TIMER_KEY]) {
    return;
  }

  hostWindow[CMDK_STYLE_TIMER_KEY] = hostWindow.setTimeout(() => {
    hostWindow[CMDK_STYLE_TIMER_KEY] = null;
    syncCmdkTagStyles();
  }, 40);
}

function scheduleSidebarTagStyleSync() {
  const hostWindow = getHostWindow();

  if (hostWindow[SIDEBAR_STYLE_TIMER_KEY]) {
    return;
  }

  hostWindow[SIDEBAR_STYLE_TIMER_KEY] = hostWindow.setTimeout(() => {
    hostWindow[SIDEBAR_STYLE_TIMER_KEY] = null;
    syncSidebarTagStyles();
  }, 40);
}

function getAssignedNodeColorForTag(tagName) {
  const assignment = getTagColorAssignment(tagName);

  if (!assignment) {
    return "";
  }

  if (assignment.type === "preset" && COLOR_PRESET_MAP[assignment.token]) {
    return `var(--grad-${assignment.token})`;
  }

  if (assignment.type === "custom") {
    return getCustomTagGradientColor(assignment, panelState.themeMode) || "";
  }

  return "";
}

function rebuildTagDrivenNodeStyleState() {
  const tagNodeColorMap = {};
  const tagNodePriorityMap = {};
  let priority = 0;

  getManagedOverrideTagNames().forEach((tagName) => {
    const nodeColor = getAssignedNodeColorForTag(tagName);

    if (!nodeColor) {
      return;
    }

    const normalized = String(tagName || "").toLowerCase();
    tagNodeColorMap[normalized] = nodeColor;
    tagNodePriorityMap[normalized] = priority;
    priority += 1;
  });

  panelState.tagNodeColorMap = tagNodeColorMap;
  panelState.tagNodePriorityMap = tagNodePriorityMap;
}

function resolveTagDrivenNodeColor(tagNames = []) {
  let bestTagName = "";
  let bestPriority = -1;

  tagNames.forEach((tagName) => {
    const normalized = String(tagName || "").toLowerCase();
    const priority = panelState.tagNodePriorityMap[normalized];

    if (priority == null || priority < bestPriority) {
      return;
    }

    bestPriority = priority;
    bestTagName = normalized;
  });

  return bestTagName ? panelState.tagNodeColorMap[bestTagName] || "" : "";
}

function getTagNamesFromElements(elements) {
  return elements
    .map((element) => element?.getAttribute?.("data-ref") || "")
    .map((tagName) => getCanonicalTagName(tagName))
    .filter(Boolean);
}

function clearTagDrivenNodeTarget(target, attributeName) {
  if (!target) {
    return;
  }

  target.removeAttribute(attributeName);
  target.style.removeProperty("--node-color");
}

function syncTagDrivenStylesForWrapper(wrapper, hostDocument) {
  const hostWindow = hostDocument.defaultView || window;

  if (!(wrapper instanceof hostWindow.Element)) {
    return;
  }

  const isPageTitle = Boolean(wrapper.querySelector(".block-content-or-editor-wrap.ls-page-title-container"));
  const pageTitleTarget = wrapper.querySelector(".block-main-content");

  if (isPageTitle) {
    const pageTitleTags = getTagNamesFromElements(Array.from(wrapper.querySelectorAll(".ls-block-right a.tag[data-ref]")));
    const nodeColor = resolveTagDrivenNodeColor(pageTitleTags);

    clearTagDrivenNodeTarget(wrapper, "data-degrande-linked-node");

    if (!pageTitleTarget) {
      return;
    }

    if (nodeColor) {
      pageTitleTarget.setAttribute("data-degrande-page-title-node", "true");
      pageTitleTarget.style.setProperty("--node-color", nodeColor);
    } else {
      clearTagDrivenNodeTarget(pageTitleTarget, "data-degrande-page-title-node");
    }

    return;
  }

  if (pageTitleTarget) {
    clearTagDrivenNodeTarget(pageTitleTarget, "data-degrande-page-title-node");
  }

  const linkedBlockTags = getTagNamesFromElements(Array.from(wrapper.querySelectorAll("a.tag[data-ref]")));
  const nodeColor = resolveTagDrivenNodeColor(linkedBlockTags);

  if (nodeColor) {
    wrapper.setAttribute("data-degrande-linked-node", "true");
    wrapper.style.setProperty("--node-color", nodeColor);
  } else {
    clearTagDrivenNodeTarget(wrapper, "data-degrande-linked-node");
  }
}

function syncTagDrivenNodeStylesInSubtree(root, hostDocument = getHostDocument()) {
  const hostWindow = hostDocument.defaultView || window;
  const wrappers = collectMatchingElements(root, ".ls-block > div:first-child", hostWindow);

  wrappers.forEach((wrapper) => {
    syncTagDrivenStylesForWrapper(wrapper, hostDocument);
  });
}

function syncAllTagDrivenNodeStyles() {
  getObservableHostDocuments().forEach((hostDocument) => {
    syncTagDrivenNodeStylesInSubtree(hostDocument, hostDocument);
  });
}

function queueTagDrivenNodeStyleSync(root, hostDocument = getHostDocument()) {
  panelState.pendingTagNodeRoots.add(normalizeObservedNode(root) || hostDocument);

  if (panelState.tagNodeStyleSyncTimer) {
    return;
  }

  panelState.tagNodeStyleSyncTimer = window.setTimeout(() => {
    const pendingRoots = Array.from(panelState.pendingTagNodeRoots);
    panelState.pendingTagNodeRoots.clear();
    panelState.tagNodeStyleSyncTimer = null;

    pendingRoots.forEach((pendingRoot) => {
      syncTagDrivenNodeStylesInSubtree(pendingRoot, hostDocument);
    });
  }, 40);
}

function observeTagDrivenNodeStyles() {
  const hostWindow = getHostWindow();
  const documents = getObservableHostDocuments();

  disconnectObserverGroup(hostWindow[TAG_NODE_STYLE_OBSERVER_KEY]);

  hostWindow[TAG_NODE_STYLE_OBSERVER_KEY] = documents.map((hostDocument) => {
    const documentWindow = hostDocument.defaultView || hostWindow;
    const HostMutationObserver = documentWindow.MutationObserver || MutationObserver;
    const observer = new HostMutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (nodeTouchesSelector(mutation.target, ".ls-block, .ls-block-right, a.tag[data-ref], .block-main-content", documentWindow)) {
          queueTagDrivenNodeStyleSync(mutation.target, hostDocument);
        }

        Array.from(mutation.addedNodes || []).forEach((node) => {
          if (nodeTouchesSelector(node, ".ls-block, .ls-block-right, a.tag[data-ref], .block-main-content", documentWindow)) {
            queueTagDrivenNodeStyleSync(node, hostDocument);
          }
        });
      });
    });

    observer.observe(hostDocument.body || hostDocument.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return observer;
  });

  syncAllTagDrivenNodeStyles();
}

function getCmdkPrimaryLine(row) {
  const textColumn = row.querySelector('.flex.flex-1.flex-col');

  if (!textColumn) {
    return null;
  }

  return Array.from(textColumn.children).find((child) => child.textContent?.trim()) || textColumn;
}

function getCmdkTagLabelElement(row) {
  const primaryLine = getCmdkPrimaryLine(row);

  if (!primaryLine) {
    return null;
  }

  return primaryLine.querySelector('.flex.flex-row.items-center.gap-1')
    || primaryLine.querySelector('[data-testid]')
    || primaryLine.querySelector('span')
    || primaryLine;
}

function getCmdkTagIconElement(row) {
  return row.querySelector('.ls-icon-hash')?.closest('div');
}

function clearCmdkTagElementStyles(element, attributeName, propertyNames) {
  if (!element) {
    return;
  }

  element.removeAttribute(attributeName);
  propertyNames.forEach((propertyName) => {
    element.style.removeProperty(propertyName);
  });
}

function getCmdkTagName(row) {
  if (!row.querySelector('.ls-icon-hash')) {
    return "";
  }

  const candidates = [];
  row.querySelectorAll('[data-testid]').forEach((element) => {
    const text = element.textContent?.trim();

    if (text) {
      candidates.push(text);
    }
  });

  const primaryText = getCmdkPrimaryLine(row)?.textContent?.trim();

  if (primaryText) {
    candidates.push(primaryText);
  }

  for (const candidate of candidates) {
    const normalized = normalizeTagName(candidate);

    if (normalized) {
      return getCanonicalTagName(normalized);
    }
  }

  return "";
}

function getSearchTagGradientColor(tagName) {
  const assignment = getTagColorAssignment(tagName);

  if (assignment?.type === 'preset' && COLOR_PRESET_MAP[assignment.token]) {
    return `var(--grad-${assignment.token})`;
  }

  if (assignment?.type === 'custom') {
    return getCustomTagGradientColor(assignment, panelState.themeMode) || 'var(--grad-grey)';
  }

  return 'var(--grad-grey)';
}

function getCmdkTagThemeState(tagName) {
  const assignment = getTagColorAssignment(tagName);
  const theme = getTagChipThemeStyle(assignment);
  const isDark = panelState.themeMode === 'dark';

  return {
    theme,
    gradientColor: getSearchTagGradientColor(tagName),
    baseShadow: isDark
      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 1px 2px rgba(2, 6, 23, 0.28)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 1px 2px rgba(15, 23, 42, 0.08)',
    hoverShadow: isDark
      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 2px 4px rgba(2, 6, 23, 0.34)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 2px 4px rgba(15, 23, 42, 0.12)',
  };
}

function isKnownCmdkInlineTag(tagName) {
  const normalized = String(tagName || '').trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  return panelState.tags.some((entry) => entry.toLowerCase() === normalized)
    || Boolean(panelState.tagColorAssignments[normalized])
    || Boolean(panelState.baseTagColorMap[normalized]);
}

function createCmdkInlineTagChip(hostDocument, displayTagName, tagName) {
  const chip = hostDocument.createElement('span');
  const chipTheme = getCmdkTagThemeState(tagName);

  chip.setAttribute('data-degrande-inline-tag', tagName);
  chip.textContent = `#${displayTagName}`;
  chip.style.setProperty('--degrande-search-chip-bg', chipTheme.theme.background);
  chip.style.setProperty('--degrande-search-chip-border', chipTheme.theme.borderColor);
  chip.style.setProperty('--degrande-search-chip-color', chipTheme.theme.color);
  chip.style.setProperty('--degrande-search-chip-shadow', chipTheme.baseShadow);
  chip.style.setProperty('--degrande-search-chip-hover-shadow', chipTheme.hoverShadow);
  chip.style.setProperty('--degrande-search-chip-gradient', chipTheme.gradientColor);

  return chip;
}

function syncCmdkInlineTagChip(chip) {
  const tagName = chip.getAttribute('data-degrande-inline-tag') || '';

  if (!tagName) {
    return;
  }

  const chipTheme = getCmdkTagThemeState(tagName);
  chip.style.setProperty('--degrande-search-chip-bg', chipTheme.theme.background);
  chip.style.setProperty('--degrande-search-chip-border', chipTheme.theme.borderColor);
  chip.style.setProperty('--degrande-search-chip-color', chipTheme.theme.color);
  chip.style.setProperty('--degrande-search-chip-shadow', chipTheme.baseShadow);
  chip.style.setProperty('--degrande-search-chip-hover-shadow', chipTheme.hoverShadow);
  chip.style.setProperty('--degrande-search-chip-gradient', chipTheme.gradientColor);
}

function syncInlineTagTextNodes(container) {
  if (!container) {
    return;
  }

  const hostDocument = container.ownerDocument;
  const hostWindow = hostDocument.defaultView || window;
  const textNodes = [];

  container.querySelectorAll('[data-degrande-inline-tag]').forEach((chip) => {
    syncCmdkInlineTagChip(chip);
  });

  const walker = hostDocument.createTreeWalker(
    container,
    hostWindow.NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parentElement = node.parentElement;

        if (!node.nodeValue?.includes('#') || !parentElement) {
          return hostWindow.NodeFilter.FILTER_REJECT;
        }

        if (parentElement.closest('[data-degrande-inline-tag], [data-degrande-search-tag-label], mark')) {
          return hostWindow.NodeFilter.FILTER_REJECT;
        }

        return hostWindow.NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  const inlineTagPattern = /(^|[\s([{"'])#([^\s#.,;:!?()[\]{}"']+)/gu;

  textNodes.forEach((node) => {
    const text = node.nodeValue || '';
    let lastIndex = 0;
    let match = null;
    let hasReplacement = false;
    const fragment = hostDocument.createDocumentFragment();

    while ((match = inlineTagPattern.exec(text))) {
      const prefix = match[1] || '';
      const displayTagName = match[2] || '';
      const tagStart = match.index + prefix.length;
      const tagEnd = match.index + match[0].length;
      const canonicalTagName = getCanonicalTagName(displayTagName);

      if (!isKnownCmdkInlineTag(canonicalTagName)) {
        continue;
      }

      if (tagStart > lastIndex) {
        fragment.appendChild(hostDocument.createTextNode(text.slice(lastIndex, tagStart)));
      }

      fragment.appendChild(createCmdkInlineTagChip(hostDocument, displayTagName, canonicalTagName));
      lastIndex = tagEnd;
      hasReplacement = true;
    }

    if (!hasReplacement) {
      return;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(hostDocument.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode?.replaceChild(fragment, node);
  });
}

function syncCmdkInlineTags(row) {
  const primaryLine = getCmdkPrimaryLine(row);

  if (!primaryLine) {
    return;
  }

  if (row.querySelector('.ls-icon-hash')) {
    primaryLine.querySelectorAll('[data-degrande-inline-tag]').forEach((chip) => {
      syncCmdkInlineTagChip(chip);
    });
    return;
  }

  syncInlineTagTextNodes(primaryLine);
}

function syncCmdkTagRow(row) {
  clearCmdkTagElementStyles(row, 'data-degrande-search-tag', [
    '--degrande-search-chip-gradient',
  ]);

  const labelElement = getCmdkTagLabelElement(row);
  const iconElement = getCmdkTagIconElement(row);

  clearCmdkTagElementStyles(labelElement, 'data-degrande-search-tag-label', [
    '--degrande-search-chip-bg',
    '--degrande-search-chip-border',
    '--degrande-search-chip-color',
    '--degrande-search-chip-shadow',
    '--degrande-search-chip-hover-shadow',
  ]);
  clearCmdkTagElementStyles(iconElement, 'data-degrande-search-tag-icon', [
    '--degrande-search-chip-bg',
    '--degrande-search-chip-border',
    '--degrande-search-chip-color',
    '--degrande-search-chip-shadow',
  ]);

  const tagName = getCmdkTagName(row);

  if (!tagName || !labelElement) {
    return;
  }

  const assignment = getTagColorAssignment(tagName);
  const chipTheme = getCmdkTagThemeState(tagName);

  row.setAttribute('data-degrande-search-tag', tagName);
  row.style.setProperty('--degrande-search-chip-gradient', chipTheme.gradientColor);
  labelElement.setAttribute('data-degrande-search-tag-label', tagName);
  labelElement.style.setProperty('--degrande-search-chip-bg', chipTheme.theme.background);
  labelElement.style.setProperty('--degrande-search-chip-border', chipTheme.theme.borderColor);
  labelElement.style.setProperty('--degrande-search-chip-color', chipTheme.theme.color);
  labelElement.style.setProperty('--degrande-search-chip-shadow', chipTheme.baseShadow);
  labelElement.style.setProperty('--degrande-search-chip-hover-shadow', chipTheme.hoverShadow);

  if (iconElement) {
    iconElement.setAttribute('data-degrande-search-tag-icon', tagName);
    iconElement.style.setProperty('--degrande-search-chip-bg', chipTheme.theme.background);
    iconElement.style.setProperty('--degrande-search-chip-border', chipTheme.theme.borderColor);
    iconElement.style.setProperty('--degrande-search-chip-color', chipTheme.theme.color);
    iconElement.style.setProperty('--degrande-search-chip-shadow', chipTheme.baseShadow);
  }

  return assignment;
}

function syncCmdkTagStyles() {
  getObservableHostDocuments().forEach((hostDocument) => {
    const hostWindow = hostDocument.defaultView || window;

    if (!hostDocument.querySelector(CMDK_SCOPE_SELECTOR)) {
      return;
    }

    collectMatchingElements(hostDocument, CMDK_ROW_SELECTOR, hostWindow).forEach((row) => {
      if (!(row instanceof hostWindow.Element)) {
        return;
      }

      syncCmdkTagRow(row);
      syncCmdkInlineTags(row);
    });
  });
}

function syncCmdkTagStylesInSubtree(root, hostDocument) {
  const targetDocument = hostDocument || root?.ownerDocument || getHostDocument();
  const hostWindow = targetDocument.defaultView || window;

  collectMatchingElements(root, CMDK_ROW_SELECTOR, hostWindow).forEach((row) => {
    if (!(row instanceof hostWindow.Element)) {
      return;
    }

    syncCmdkTagRow(row);
    syncCmdkInlineTags(row);
  });
}

function nodeTouchesCmdk(node, hostWindow) {
  const candidate = node instanceof hostWindow.Text ? node.parentElement : node;

  if (!(candidate instanceof hostWindow.Element)) {
    return false;
  }

  if (candidate.matches('.cp__cmdk, .cp__select-main, .cp__palette-main')) {
    return true;
  }

  if (candidate.closest('.cp__cmdk, .cp__select-main, .cp__palette-main')) {
    return true;
  }

  return Boolean(candidate.querySelector('.cp__cmdk, .cp__select-main, .cp__palette-main'));
}

function syncSidebarTagStyles() {
  getObservableHostDocuments().forEach((hostDocument) => {
    const hostWindow = hostDocument.defaultView || window;

    if (!hostDocument.querySelector(SIDEBAR_ROOT_SELECTOR)) {
      return;
    }

    collectMatchingElements(hostDocument, SIDEBAR_TITLE_SELECTOR, hostWindow).forEach((title) => {
      if (!(title instanceof hostWindow.Element)) {
        return;
      }

      syncInlineTagTextNodes(title);
    });
  });
}

function syncSidebarTagStylesInSubtree(root, hostDocument) {
  const targetDocument = hostDocument || root?.ownerDocument || getHostDocument();
  const hostWindow = targetDocument.defaultView || window;

  collectMatchingElements(root, SIDEBAR_TITLE_SELECTOR, hostWindow).forEach((title) => {
    if (!(title instanceof hostWindow.Element)) {
      return;
    }

    syncInlineTagTextNodes(title);
  });
}

function nodeTouchesSidebar(node, hostWindow) {
  const candidate = node instanceof hostWindow.Text ? node.parentElement : node;

  if (!(candidate instanceof hostWindow.Element)) {
    return false;
  }

  if (candidate.matches('.left-sidebar-inner')) {
    return true;
  }

  if (candidate.closest('.left-sidebar-inner')) {
    return true;
  }

  return Boolean(candidate.querySelector('.left-sidebar-inner'));
}

function observeSidebarTagStyles() {
  const hostWindow = getHostWindow();
  const documents = getObservableHostDocuments();

  disconnectObserverGroup(hostWindow[SIDEBAR_STYLE_OBSERVER_KEY]);

  hostWindow[SIDEBAR_STYLE_OBSERVER_KEY] = documents.map((hostDocument) => {
    const documentWindow = hostDocument.defaultView || hostWindow;
    const HostMutationObserver = documentWindow.MutationObserver || MutationObserver;
    const observer = new HostMutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        syncSidebarTagStylesInSubtree(mutation.target, hostDocument);

        Array.from(mutation.addedNodes || []).forEach((node) => {
          syncSidebarTagStylesInSubtree(node, hostDocument);
        });
      });
    });

    observer.observe(hostDocument.body || hostDocument.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return observer;
  });

  syncSidebarTagStyles();
}

function observeCmdkSearchResults() {
  const hostWindow = getHostWindow();
  const documents = getObservableHostDocuments();

  disconnectObserverGroup(hostWindow[CMDK_STYLE_OBSERVER_KEY]);

  hostWindow[CMDK_STYLE_OBSERVER_KEY] = documents.map((hostDocument) => {
    const documentWindow = hostDocument.defaultView || hostWindow;
    const HostMutationObserver = documentWindow.MutationObserver || MutationObserver;
    const observer = new HostMutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        syncCmdkTagStylesInSubtree(mutation.target, hostDocument);

        Array.from(mutation.addedNodes || []).forEach((node) => {
          syncCmdkTagStylesInSubtree(node, hostDocument);
        });
      });
    });

    observer.observe(hostDocument.body || hostDocument.documentElement, {
      childList: true,
      subtree: true,
    });

    return observer;
  });

  syncCmdkTagStyles();
}

function isDuplicateRegistrationError(error) {
  return /already exist/i.test(String(error?.message || error || ""));
}

function registerCommandPaletteSafely(config, handler) {
  const hostWindow = getHostWindow();
  const registeredCommands = hostWindow[COMMAND_REGISTRY_KEY] || (hostWindow[COMMAND_REGISTRY_KEY] = new Set());

  if (registeredCommands.has(config.key)) {
    return false;
  }

  try {
    logseq.App.registerCommandPalette(config, handler);
  } catch (error) {
    if (isDuplicateRegistrationError(error)) {
      registeredCommands.add(config.key);
      return false;
    }

    throw error;
  }

  registeredCommands.add(config.key);

  return true;
}

function registerToolbarItemSafely(config) {
  const hostWindow = getHostWindow();
  const registeredToolbarItems = hostWindow[TOOLBAR_REGISTRY_KEY] || (hostWindow[TOOLBAR_REGISTRY_KEY] = new Set());

  if (registeredToolbarItems.has(config.key)) {
    return false;
  }

  try {
    logseq.App.registerUIItem("toolbar", config);
  } catch (error) {
    if (isDuplicateRegistrationError(error)) {
      registeredToolbarItems.add(config.key);
      return false;
    }

    throw error;
  }

  registeredToolbarItems.add(config.key);

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

function extractCssSection(cssText, startMarker, endMarker = "") {
  const startIndex = cssText.indexOf(startMarker);

  if (startIndex === -1) {
    return "";
  }

  const sliceStart = startIndex;
  const endIndex = endMarker ? cssText.indexOf(endMarker, sliceStart + startMarker.length) : -1;
  return cssText.slice(sliceStart, endIndex === -1 ? cssText.length : endIndex).trim();
}

function buildStaticBaseCssText(rawCssText) {
  const variablesSection = extractCssSection(rawCssText, CSS_SECTION_MARKER_1, CSS_SECTION_MARKER_2);
  const pageReferenceSection = extractCssSection(rawCssText, CSS_SECTION_MARKER_6, CSS_SECTION_MARKER_7);
  const accentSection = extractCssSection(rawCssText, CSS_ACCENT_MARKER);

  return [
    variablesSection,
    `
.ls-block.selected, .ls-block.selected-block { background-image: none !important; background-color: rgba(59, 130, 246, 0.15) !important; }
.dark-theme .ls-block.selected, .dark-theme .ls-block.selected-block { background-color: rgba(59, 130, 246, 0.3) !important; }
`.trim(),
    pageReferenceSection,
    accentSection,
  ].filter(Boolean).join("\n\n");
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

  console.debug("[Local Custom Theme Loader] Loaded tag candidates", sourceCounts);

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
  panelState.lastTagCatalogLoadedAt = 0;
  panelState.selectedTag = "";
  setSyncState("synced");
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

function syncInlineCssVariable(element, propertyName, nextValue) {
  const currentValue = element.style.getPropertyValue(propertyName);

  if (nextValue) {
    if (currentValue !== nextValue) {
      element.style.setProperty(propertyName, nextValue);
    }

    return;
  }

  if (currentValue) {
    element.style.removeProperty(propertyName);
  }
}

function syncHostColorVariables() {
  syncHostColorVariablesInSubtree(getHostDocument(), getHostDocument());
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

function buildSearchTagChipSelector(themePrefix = "") {
  return `${themePrefix}:where(.cp__cmdk, .cp__select-main, .cp__palette-main) a.tag[data-ref]`;
}

function buildGroupedTagChipSelectors(tagNames, themePrefix = "") {
  return tagNames.flatMap((tagName) => {
    const escapedTagName = escapeAttributeValue(tagName);

    return [
      `${themePrefix}a.tag[data-ref="${escapedTagName}" i]`,
      `${themePrefix}a.tag[data-ref="${escapedTagName}" i]:hover`,
      `${themePrefix}:where(.cp__cmdk, .cp__select-main, .cp__palette-main) a.tag[data-ref="${escapedTagName}" i]`,
      `${themePrefix}:where(.cp__cmdk, .cp__select-main, .cp__palette-main) a.tag[data-ref="${escapedTagName}" i]:hover`,
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

function buildGroupedTagChipRule(tagNames, config) {
  if (!tagNames.length) {
    return "";
  }

  const sameChipDeclarations = config.lightChipDeclarations === config.darkChipDeclarations;

  return `
${buildGroupedTagChipSelectors(tagNames)} {
  ${config.lightChipDeclarations}
}

${sameChipDeclarations ? "" : `${buildGroupedTagChipSelectors(tagNames, ".dark-theme ")} {
  ${config.darkChipDeclarations}
}`}
`;
}

function buildGroupedLinkedBlockColorRule(tagNames, lightNodeColor, darkNodeColor) {
  if (!tagNames.length) {
    return "";
  }

  const innerSelector = buildGroupedTagInnerSelector(tagNames);
  const sameNodeColor = lightNodeColor === darkNodeColor;

  return `
:is(.ls-block > div:first-child):not(:has(.block-content-or-editor-wrap.ls-page-title-container)):has(:is(${innerSelector})) {
  --node-color: ${lightNodeColor};
}

${sameNodeColor ? "" : `.dark-theme :is(.ls-block > div:first-child):not(:has(.block-content-or-editor-wrap.ls-page-title-container)):has(:is(${innerSelector})) {
  --node-color: ${darkNodeColor};
}`}
`;
}

function buildGroupedPageTitleColorRule(tagNames, lightNodeColor, darkNodeColor) {
  if (!tagNames.length) {
    return "";
  }

  const innerSelector = buildGroupedTagInnerSelector(tagNames);
  const sameNodeColor = lightNodeColor === darkNodeColor;

  return `
.ls-block > div:first-child:has(.block-content-or-editor-wrap.ls-page-title-container):has(.ls-block-right :is(${innerSelector})) .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container) {
  --node-color: ${lightNodeColor};
}

${sameNodeColor ? "" : `.dark-theme .ls-block > div:first-child:has(.block-content-or-editor-wrap.ls-page-title-container):has(.ls-block-right :is(${innerSelector})) .block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container) {
  --node-color: ${darkNodeColor};
}`}
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

function mergeStoredAppearanceState(saved) {
  const merged = { ...DEFAULT_APPEARANCE_STATE };

  for (const section of APPEARANCE_SECTIONS) {
    if (typeof saved?.[section.key] === "boolean") {
      merged[section.key] = saved[section.key];
    }
  }

  return merged;
}

function getCssTextStats(cssText) {
  const normalized = String(cssText || "").trim();

  if (!normalized) {
    return { lines: 0, chars: 0 };
  }

  return {
    lines: normalized.split(/\r?\n/).length,
    chars: normalized.length,
  };
}

function formatCssTextStats(stats) {
  return `${stats.lines} lines / ${stats.chars.toLocaleString()} chars`;
}

function hasEnabledAppearanceSections() {
  return APPEARANCE_SECTIONS.some((section) => isAppearanceSectionEnabled(section.key));
}

function buildCssStats(baseCssText, managedCssText, sections = {}) {
  const shouldApplyCss = hasEnabledAppearanceSections();
  const appliedBaseCssText = shouldApplyCss ? baseCssText : "";
  const appliedManagedCssText = shouldApplyCss ? managedCssText : "";
  const base = getCssTextStats(appliedBaseCssText);
  const managed = getCssTextStats(appliedManagedCssText);
  const total = getCssTextStats(`${String(appliedBaseCssText || "").trim()}\n\n${String(appliedManagedCssText || "").trim()}`);
  const sectionStats = Object.fromEntries(APPEARANCE_SECTIONS.map((section) => [
    section.key,
    getCssTextStats(sections[section.key] || ""),
  ]));

  return { base, managed, total, sections: sectionStats };
}

function isAppearanceSectionEnabled(sectionKey) {
  return panelState.appearanceState[sectionKey] !== false;
}

async function loadStoredAppearanceState() {
  try {
    const saved = await loadStoredItemWithLegacyFallback(APPEARANCE_STATE_STORAGE_KEY);

    if (!saved) {
      panelState.appearanceState = { ...DEFAULT_APPEARANCE_STATE };
      return;
    }

    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
    panelState.appearanceState = mergeStoredAppearanceState(parsed);
  } catch (error) {
    if (isMissingStorageError(error)) {
      panelState.appearanceState = { ...DEFAULT_APPEARANCE_STATE };
      return;
    }

    console.error("[Degrande Colors] Failed to load stored appearance toggles", error);
  }
}

function persistAppearanceState() {
  try {
    writeLocalPersistedItem(APPEARANCE_STATE_STORAGE_KEY, JSON.stringify(panelState.appearanceState));
    return true;
  } catch (error) {
    console.error("[Degrande Colors] Failed to persist appearance toggles", error);
    return false;
  }
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
  const graphKey = normalizeGraphIdentityPart(panelState.currentGraphKey || panelState.currentGraphInfo?.path || panelState.currentGraphInfo?.url || panelState.currentGraphInfo?.name);
  return graphKey
    ? `${pluginId}/${graphKey}/${storageKey}`
    : `${pluginId}/${storageKey}`;
}

function getLegacyLocalPersistenceKey(storageKey) {
  const pluginId = normalizeGraphIdentityPart(logseq?.baseInfo?.id || "degrande-colors") || "degrande-colors";
  return `${pluginId}/${storageKey}`;
}

function readLocalPersistedItem(storageKey) {
  const storage = getLocalPersistenceBackend();

  if (!storage) {
    return null;
  }

  try {
    const nextKey = getLocalPersistenceKey(storageKey);
    const nextValue = storage.getItem(nextKey);

    if (nextValue != null) {
      return nextValue;
    }

    const legacyKey = getLegacyLocalPersistenceKey(storageKey);

    if (legacyKey === nextKey) {
      return null;
    }

    return storage.getItem(legacyKey);
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
    const nextKey = getLocalPersistenceKey(storageKey);
    storage.setItem(nextKey, value);

    const legacyKey = getLegacyLocalPersistenceKey(storageKey);

    if (legacyKey !== nextKey) {
      storage.removeItem(legacyKey);
    }
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
    const nextKey = getLocalPersistenceKey(storageKey);
    storage.removeItem(nextKey);

    const legacyKey = getLegacyLocalPersistenceKey(storageKey);

    if (legacyKey !== nextKey) {
      storage.removeItem(legacyKey);
    }
  } catch (error) {
    console.warn(`[Degrande Colors] Failed to remove local persisted item: ${storageKey}`, error);
  }
}

function buildLocalMirrorPayload(value, revision = panelState.lastLocalSyncRevision || panelState.syncRevision) {
  return JSON.stringify({
    revision: normalizeGraphSyncRevision(revision),
    value,
  });
}

function parseLocalMirrorValue(saved, mergeValue) {
  if (saved == null) {
    return { exists: false, value: null, revision: 0 };
  }

  const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
  const wrapped = parsed && typeof parsed === "object" && Object.prototype.hasOwnProperty.call(parsed, "value");
  const rawValue = wrapped ? parsed.value : parsed;
  const revision = wrapped ? normalizeGraphSyncRevision(parsed.revision ?? parsed.syncRevision) : 0;

  return {
    exists: true,
    value: typeof mergeValue === "function" ? mergeValue(rawValue) : rawValue,
    revision,
  };
}

function shouldPromoteLocalMirrorRevision(localRevision) {
  return normalizeGraphSyncRevision(localRevision) > normalizeGraphSyncRevision(panelState.syncRevision);
}

function syncLocalTagColorMirror(revision = panelState.lastLocalSyncRevision || panelState.syncRevision) {
  const normalizedTagColors = mergeStoredTagColors(panelState.tagColorAssignments);

  if (Object.keys(normalizedTagColors).length) {
    writeLocalPersistedItem(TAG_COLOR_STORAGE_KEY, buildLocalMirrorPayload(normalizedTagColors, revision));
  } else {
    removeLocalPersistedItem(TAG_COLOR_STORAGE_KEY);
  }
}

function syncLocalControlMirror(revision = panelState.lastLocalSyncRevision || panelState.syncRevision) {
  writeLocalPersistedItem(CONTROL_STORAGE_KEY, buildLocalMirrorPayload(panelState.controlState, revision));
}

function syncLocalGradientMirror(revision = panelState.lastLocalSyncRevision || panelState.syncRevision) {
  writeLocalPersistedItem(GRADIENT_STORAGE_KEY, buildLocalMirrorPayload(panelState.gradientState, revision));
}

function hasPendingTagColorSync() {
  return Boolean(
    panelState.tagPersistTimer
    || panelState.pendingTagPersistKeys.length
    || panelState.pendingTagColorMigration
    || Object.prototype.hasOwnProperty.call(panelState.pendingGraphPageState, GRAPH_SYNC_TAG_COLOR_PROPERTY)
  );
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

function hasMeaningfulStoredControls(saved) {
  return JSON.stringify(mergeStoredControls(saved)) !== JSON.stringify(DEFAULT_CONTROL_STATE);
}

function hasMeaningfulStoredGradients(saved) {
  return JSON.stringify(mergeStoredGradients(saved)) !== JSON.stringify(createDefaultGradientState());
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

function preferDatascriptGraphReads() {
  return typeof logseq.DB?.datascriptQuery === "function";
}

async function primeGraphIndexedState() {
  if (panelState.graphIndexed || !preferDatascriptGraphReads()) {
    return panelState.graphIndexed;
  }

  try {
    await logseq.DB.datascriptQuery(`
      [:find ?p .
       :where
       [?p :block/name "${GRAPH_SYNC_STORAGE_PAGE_NAME}"]]
    `);
    panelState.graphIndexed = true;
    return true;
  } catch (error) {
    return false;
  }
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
    return false;
  }

  const currentState = panelState.propertySchemaEnsureMap[propertyKey];

  if (currentState === true) {
    return true;
  }

  if (currentState && typeof currentState.then === "function") {
    return currentState;
  }

  const ensurePromise = (async () => {
    try {
      await logseq.Editor.upsertProperty(
        propertyKey,
        { type: "json", hide: true, public: false },
        { name: getGraphSyncPropertyDisplayName(propertyKey) }
      );
      void resolveGraphSyncPropertyIdent(propertyKey);
      panelState.propertySchemaEnsureMap[propertyKey] = true;
      return true;
    } catch (error) {
      delete panelState.propertySchemaEnsureMap[propertyKey];
      console.warn(`[Degrande Colors] Failed to ensure graph sync property schema: ${propertyKey}`, error);
      return false;
    }
  })();

  panelState.propertySchemaEnsureMap[propertyKey] = ensurePromise;

  return ensurePromise;
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

async function bumpGraphSyncRevision(reason = "update", plannedRevision = null) {
  const nextRevision = normalizeGraphSyncRevision(plannedRevision) || getNextGraphSyncRevision();
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

      panelState.graphIndexed = true;

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

  await primeGraphIndexedState();

  try {
    const ensured = await ensureGraphSyncProperty(propertyKey);

    if (!ensured) {
      return false;
    }

    const page = await getGraphSyncStoragePage(true);

    if (!page) {
      return false;
    }

    await logseq.Editor.upsertBlockProperty(page.uuid, propertyKey, value, { reset: true });
    panelState.graphIndexed = true;
    await resolveGraphSyncPropertyIdent(propertyKey);
    return true;
  } catch (error) {
    if (options.deferUntilIndexed && isRecoverableGraphSyncWriteError(error)) {
      queueDeferredGraphPageState(propertyKey, value);
      return false;
    }

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

      panelState.graphIndexed = true;

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
    panelState.graphIndexed = true;
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

  syncLocalTagColorMirror(options.localRevision);

  if (typeof logseq.Editor?.upsertBlockProperty !== "function") {
    return false;
  }

  const namesToCleanup = Array.from(new Set([
    ...((Array.isArray(options.cleanupTagNames) ? options.cleanupTagNames : []).map(getCanonicalTagName)),
    ...((Array.isArray(tagNames) && tagNames.length ? tagNames : Object.keys(normalizedTagColors)).map(getCanonicalTagName)),
  ].filter(Boolean)));

  await primeGraphIndexedState();

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
    const localMirror = parseLocalMirrorValue(await loadStoredItemWithLegacyFallback(CONTROL_STORAGE_KEY), mergeStoredControls);
    const graphBackedState = await loadGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, mergeStoredControls);

    if (localMirror.exists && shouldPromoteLocalMirrorRevision(localMirror.revision)) {
      panelState.controlState = localMirror.value;
      syncLocalControlMirror(localMirror.revision);
      await saveGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, panelState.controlState, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });
      return;
    }

    if (graphBackedState.exists) {
      panelState.controlState = graphBackedState.value;
      syncLocalControlMirror(panelState.syncRevision);
      return;
    }

    const settingsValue = readPluginSettingValue(SETTINGS_CONTROL_STATE_KEY);

    if (settingsValue != null && hasMeaningfulStoredControls(settingsValue)) {
      panelState.controlState = mergeStoredControls(settingsValue);
      syncLocalControlMirror(localMirror.exists ? localMirror.revision : 0);
      return;
    }

    if (!localMirror.exists) {
      return;
    }

    panelState.controlState = localMirror.value;
    syncLocalControlMirror(localMirror.revision);

    if (shouldPromoteLocalMirrorRevision(localMirror.revision)) {
      await saveGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, panelState.controlState, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });
    }
  } catch (error) {
    if (isMissingStorageError(error)) {
      return;
    }

    console.error("[Local Custom Theme Loader] Failed to load stored controls", error);
  }
}

async function loadStoredTagColors(options = {}) {
  const allowEntityFallback = options.allowEntityFallback ?? typeof logseq.DB?.datascriptQuery !== "function";
  const fallbackToCurrent = options.fallbackToCurrent ?? false;
  const hasCurrentTagColors = Object.keys(mergeStoredTagColors(panelState.tagColorAssignments)).length > 0;

  if (fallbackToCurrent && hasCurrentTagColors && hasPendingTagColorSync()) {
    return;
  }

  try {
    const pageBackedState = await loadPageBackedTagColorState();

    if (pageBackedState.exists) {
      if (fallbackToCurrent && !Object.keys(pageBackedState.tagColors || {}).length && hasCurrentTagColors) {
        return;
      }

      panelState.tagColorAssignments = pageBackedState.tagColors;
      syncLocalTagColorMirror(panelState.syncRevision);

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
      syncLocalTagColorMirror(panelState.syncRevision);
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
        localRevision: panelState.syncRevision,
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
        syncLocalTagColorMirror(panelState.syncRevision);
        await saveGraphSyncedTagColors(Object.keys(panelState.tagColorAssignments), {
          suppressReadyErrors: true,
          entityMap: tagCatalog.tagEntityMap,
          cleanupTagNames: Object.keys(entityBackedState.tagColors),
          localRevision: panelState.syncRevision,
        });
        panelState.tagColorCleanupChecked = false;
        return;
      }
    }

    const legacyGraphConfigState = await loadLegacyGraphConfigTagColorState();

    if (legacyGraphConfigState.exists) {
      if (fallbackToCurrent && !Object.keys(legacyGraphConfigState.tagColors || {}).length && hasCurrentTagColors) {
        return;
      }

      panelState.tagColorAssignments = legacyGraphConfigState.tagColors;
      syncLocalTagColorMirror(panelState.syncRevision);

      if (Object.keys(panelState.tagColorAssignments).length) {
        await saveGraphSyncedTagColors(Object.keys(panelState.tagColorAssignments), {
          suppressReadyErrors: true,
          localRevision: panelState.syncRevision,
        });
      }

      panelState.tagColorCleanupChecked = true;

      return;
    }

    const localMirror = parseLocalMirrorValue(await loadStoredItemWithLegacyFallback(TAG_COLOR_STORAGE_KEY), mergeStoredTagColors);

    if (!localMirror.exists) {
      if (fallbackToCurrent && Object.keys(panelState.tagColorAssignments).length) {
        return;
      }

      panelState.tagColorAssignments = {};
      return;
    }

    if (fallbackToCurrent && !Object.keys(localMirror.value).length && hasCurrentTagColors) {
      return;
    }

    panelState.tagColorAssignments = localMirror.value;
    syncLocalTagColorMirror(localMirror.revision);

    if (Object.keys(panelState.tagColorAssignments).length && shouldPromoteLocalMirrorRevision(localMirror.revision)) {
      await saveGraphSyncedTagColors(Object.keys(panelState.tagColorAssignments), {
        suppressReadyErrors: true,
        localRevision: localMirror.revision,
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
    const localMirror = parseLocalMirrorValue(await loadStoredItemWithLegacyFallback(GRADIENT_STORAGE_KEY), mergeStoredGradients);
    const graphBackedState = await loadGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, mergeStoredGradients);

    if (localMirror.exists && shouldPromoteLocalMirrorRevision(localMirror.revision)) {
      panelState.gradientState = localMirror.value;
      syncLocalGradientMirror(localMirror.revision);
      await saveGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, panelState.gradientState, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });
      return;
    }

    if (graphBackedState.exists) {
      panelState.gradientState = graphBackedState.value;
      syncLocalGradientMirror(panelState.syncRevision);
      return;
    }

    const settingsValue = readPluginSettingValue(SETTINGS_GRADIENT_STATE_KEY);

    if (settingsValue != null && hasMeaningfulStoredGradients(settingsValue)) {
      panelState.gradientState = mergeStoredGradients(settingsValue);
      syncLocalGradientMirror(localMirror.exists ? localMirror.revision : 0);
      return;
    }

    if (!localMirror.exists) {
      return;
    }

    panelState.gradientState = localMirror.value;
    syncLocalGradientMirror(localMirror.revision);

    if (shouldPromoteLocalMirrorRevision(localMirror.revision)) {
      await saveGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, panelState.gradientState, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });
    }
  } catch (error) {
    if (isMissingStorageError(error)) {
      return;
    }

    console.error("[Local Custom Theme Loader] Failed to load stored gradients", error);
  }
}

function schedulePersistControls() {
  setSyncState("pending");
  const localRevision = getNextGraphSyncRevision();
  syncLocalControlMirror(localRevision);

  void (async () => {
    try {
      const saved = await saveGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, panelState.controlState, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });

      if (saved) {
        await bumpGraphSyncRevision("controls", localRevision);
        setSyncState("synced");
      } else {
        setSyncState("pending");
      }
    } catch (error) {
      console.error("[Degrande Colors] Failed to persist controls", error);
      setSyncState("pending");
    } finally {
      syncSyncIndicator();
    }
  })();
}

function schedulePersistTagColors(tagNames = []) {
  const names = (Array.isArray(tagNames) ? tagNames : [tagNames])
    .map((tagName) => getCanonicalTagName(tagName))
    .filter(Boolean);

  const localRevision = getNextGraphSyncRevision();
  syncLocalTagColorMirror(localRevision);

  if (names.length) {
    panelState.pendingTagPersistKeys = Array.from(new Set([
      ...panelState.pendingTagPersistKeys,
      ...names,
    ]));
  }

  setSyncState("pending");

  const pendingTagNames = panelState.pendingTagPersistKeys.slice();
  panelState.pendingTagPersistKeys = [];

  void (async () => {
    try {
      const saved = await saveGraphSyncedTagColors(pendingTagNames, {
        suppressReadyErrors: true,
        localRevision,
      });
      setSyncState(saved ? "synced" : "pending");
    } catch (error) {
      console.error("[Degrande Colors] Failed to persist tag colors", error);
      setSyncState("pending");
    } finally {
      syncSyncIndicator();
    }
  })();
}

function schedulePersistGradients() {
  setSyncState("pending");
  const localRevision = getNextGraphSyncRevision();
  syncLocalGradientMirror(localRevision);

  void (async () => {
    try {
      const saved = await saveGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, panelState.gradientState, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });

      if (saved) {
        await bumpGraphSyncRevision("gradients", localRevision);
        setSyncState("synced");
      } else {
        setSyncState("pending");
      }
    } catch (error) {
      console.error("[Degrande Colors] Failed to persist gradients", error);
      setSyncState("pending");
    } finally {
      syncSyncIndicator();
    }
  })();
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

function getPreviewGradientFallbackColor(token) {
  const preset = getPresetMeta(token);

  if (!preset) {
    return "transparent";
  }

  if (panelState.themeMode === "dark") {
    return preset.darkBorder;
  }

  return preset.lightBorder;
}

function resolvePreviewGradientColor(colorValue, fallback = "") {
  const trimmed = String(colorValue || "").trim();

  if (!trimmed) {
    return fallback || "transparent";
  }

  const variableMatch = trimmed.match(/^var\((--[^),\s]+).*\)$/);

  if (!variableMatch) {
    return trimmed;
  }

  try {
    const hostDocument = getHostDocument();
    const resolved = hostDocument?.documentElement
      ? hostDocument.defaultView?.getComputedStyle(hostDocument.documentElement).getPropertyValue(variableMatch[1]).trim()
      : "";

    return resolved || fallback || trimmed;
  } catch (error) {
    return fallback || trimmed;
  }
}

function getActivePageTitleLinkedPreviewColor() {
  try {
    const hostDocument = getHostDocument();
    const pageTitleNode = hostDocument.querySelector('.block-main-content[data-degrande-page-title-node="true"]');
    return String(pageTitleNode?.style?.getPropertyValue("--node-color") || "").trim();
  } catch (error) {
    return "";
  }
}

function getGradientPreviewLinkedColor(areaKey) {
  const areaConfig = GRADIENT_AREAS[areaKey] || {};
  const previewFallback = areaConfig.previewLinkedColor || "transparent";

  if (areaKey === "title") {
    const activePageTitleColor = getActivePageTitleLinkedPreviewColor();

    if (activePageTitleColor) {
      return resolvePreviewGradientColor(activePageTitleColor, previewFallback);
    }
  }

  if (areaConfig.previewTagName) {
    const assignedPreviewColor = getAssignedNodeColorForTag(areaConfig.previewTagName);

    if (assignedPreviewColor) {
      return resolvePreviewGradientColor(assignedPreviewColor, previewFallback);
    }
  }

  return previewFallback;
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

    return resolvePreviewGradientColor(`var(--grad-${stop.token})`, getPreviewGradientFallbackColor(stop.token));
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

function buildHighlightBandBackgroundSizeCss(rangeStart, rangeEnd) {
  const start = clamp(Number(rangeStart) || 0, 0, 100);
  const end = clamp(Number(rangeEnd) || 0, start, 100);
  const height = clamp(end - start, 0, 100);

  return `100% ${height}%`;
}

function buildHighlightBandBackgroundPositionCss(rangeStart, rangeEnd) {
  const start = clamp(Number(rangeStart) || 0, 0, 100);
  const end = clamp(Number(rangeEnd) || 0, start, 100);
  const height = clamp(end - start, 0, 100);

  if (height === 100 || height === 0) {
    return "0% 0%";
  }

  const yPos = (start / (100 - height)) * 100;
  return `0% ${yPos}%`;
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

  const renderButtons = (presets) => presets.map((preset) => {
    const isActive = getTagColorToken(panelState.selectedTag) === preset.token;
    const style = getTagChipThemeStyle(preset.token);
    const isSpecialAccent = preset.token === "acc-app-accent";

    return `
      <button
        class="ctl-color-option${isActive ? " is-active" : ""}${isSpecialAccent ? " ctl-color-option-special" : ""}"
        type="button"
        data-set-tag-color="${preset.token}"
        aria-label="Set ${escapeHtml(panelState.selectedTag)} to ${preset.label}"
        title="Set ${escapeHtml(panelState.selectedTag)} to ${preset.label}"
        style="background:${style.background};border-color:${style.borderColor};color:${style.color};"
      >${isSpecialAccent ? "A" : ""}</button>
    `;
  }).join("");

  const standardPresets = COLOR_PRESETS.filter((p) => !p.token.startsWith("acc-"));
  const accentPresets = COLOR_PRESETS.filter((p) => p.token.startsWith("acc-"));

  return `
    <span class="ctl-gradient-group-label" style="display: block; margin-bottom: 6px;">Preset Colors</span>
    <div class="ctl-color-grid" style="margin-bottom: 12px;">
      ${renderButtons(standardPresets)}
    </div>
    <span class="ctl-gradient-group-label" style="display: block; margin-bottom: 6px;">Accent Colors</span>
    <div class="ctl-color-grid">
      ${renderButtons(accentPresets)}
    </div>
  `;
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

function buildAppearanceToggleButtonMarkup(sectionKey) {
  const section = APPEARANCE_SECTION_MAP[sectionKey];
  const enabled = isAppearanceSectionEnabled(sectionKey);

  if (!section) {
    return "";
  }

  return `
    <button
      class="ctl-button ctl-button-secondary ctl-button-small ctl-appearance-toggle${enabled ? " is-active" : " is-disabled"}"
      type="button"
      data-action="toggle-appearance-section"
      data-appearance-section="${section.key}"
      aria-pressed="${enabled ? "true" : "false"}"
      title="${enabled ? "Turn off" : "Turn on"} ${escapeHtml(section.label)}"
    >
      ${escapeHtml(section.label)}: ${enabled ? "On" : "Off"}
    </button>
  `;
}

function buildAppearanceDiagnosticsMarkup() {
  return `
    <section class="ctl-section ctl-section-inline ctl-css-diagnostics">
      <div class="ctl-section-head">
        <div>
          <h2>CSS Diagnostics</h2>
          <p>The appearance layer is generated CSS. Use these toggles to remove sections from the live output and compare the applied size.</p>
        </div>
      </div>
      <div class="ctl-css-diagnostics-grid">
        <div class="ctl-css-stat-card">
          <strong>Total Applied CSS</strong>
          <span>${formatCssTextStats(panelState.cssStats.total)}</span>
        </div>
        <div class="ctl-css-stat-card">
          <strong>Base CSS</strong>
          <span>${formatCssTextStats(panelState.cssStats.base)}</span>
        </div>
        <div class="ctl-css-stat-card">
          <strong>Managed CSS</strong>
          <span>${formatCssTextStats(panelState.cssStats.managed)}</span>
        </div>
      </div>
      <div class="ctl-appearance-toggle-grid">
        ${APPEARANCE_SECTIONS.map((section) => `
          <div class="ctl-appearance-toggle-card">
            ${buildAppearanceToggleButtonMarkup(section.key)}
            <span>${escapeHtml(section.description)}</span>
            <strong>${formatCssTextStats(panelState.cssStats.sections[section.key] || { lines: 0, chars: 0 })}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function buildPreviewCardHeadMarkup(sectionKey, title, subtitle) {
  const sectionStats = panelState.cssStats.sections[sectionKey] || { lines: 0, chars: 0 };
  const enabled = isAppearanceSectionEnabled(sectionKey);

  return `
    <div class="ctl-preview-card-head${enabled ? "" : " is-disabled"}">
      <div class="ctl-preview-card-head-copy">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(subtitle)} · ${enabled ? "On" : "Off"} · ${formatCssTextStats(sectionStats)}</span>
      </div>
    </div>
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
          ${buildColorPaletteMarkup()}
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
  const renderedKeys = new Set();

  return controlKeys.map((key) => {
    if (renderedKeys.has(key)) {
      return "";
    }

    if (key === "highlightStartPercent" && controlKeys.includes("highlightEndPercent")) {
      renderedKeys.add("highlightStartPercent");
      renderedKeys.add("highlightEndPercent");

      const startControl = CONTROL_MAP.highlightStartPercent;
      const endControl = CONTROL_MAP.highlightEndPercent;
      const startValue = panelState.controlState.highlightStartPercent;
      const endValue = panelState.controlState.highlightEndPercent;

      return `
        <div class="ctl-control ctl-control-highlight-range">
          <div class="ctl-control-header">
            <span class="ctl-control-label">Highlight Band</span>
            <strong class="ctl-control-value" data-role="highlight-range-summary">${formatControlValue(startControl, startValue)} -> ${formatControlValue(endControl, endValue)}</strong>
          </div>
          <label class="ctl-control ctl-control-highlight-boundary" for="ctl-${startControl.key}">
            <div class="ctl-control-header">
              <span class="ctl-control-label">Start</span>
              <strong class="ctl-control-value" data-control-value-for="${startControl.key}">${formatControlValue(startControl, startValue)}</strong>
            </div>
            <input
              class="ctl-range"
              id="ctl-${startControl.key}"
              type="range"
              data-control-key="${startControl.key}"
              min="${startControl.min}"
              max="${startControl.max}"
              step="${startControl.step}"
              value="${startValue}"
            >
          </label>
          <label class="ctl-control ctl-control-highlight-boundary" for="ctl-${endControl.key}">
            <div class="ctl-control-header">
              <span class="ctl-control-label">Stop</span>
              <strong class="ctl-control-value" data-control-value-for="${endControl.key}">${formatControlValue(endControl, endValue)}</strong>
            </div>
            <input
              class="ctl-range"
              id="ctl-${endControl.key}"
              type="range"
              data-control-key="${endControl.key}"
              min="${endControl.min}"
              max="${endControl.max}"
              step="${endControl.step}"
              value="${endValue}"
            >
          </label>
        </div>
      `;
    }

    const control = CONTROL_MAP[key];

    if (!control) {
      return "";
    }

    renderedKeys.add(key);

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
    { mode: "linked", title: areaConfig.linkedLabel, caption: areaConfig.linkedCaption || "Follows the live graph color" },
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
  const renderButtons = (presets) => presets.map((preset) => {
    const style = getTagChipThemeStyle(preset.token);
    const isActive = selectedStop.source === "preset" && selectedStop.token === preset.token;
    const isSpecialAccent = preset.token === "acc-app-accent";

    return `
      <button
        class="ctl-preset-option${isActive ? " is-active" : ""}${isSpecialAccent ? " ctl-preset-option-special" : ""}"
        type="button"
        data-action="set-gradient-stop-preset"
        data-area-key="${areaKey}"
        data-stop-index="${stopIndex}"
        data-stop-token="${preset.token}"
        aria-label="Use ${preset.label} for this stop"
        style="background:${style.background};border-color:${style.borderColor};color:${style.color};"
        title="Use ${preset.label} for this stop"
      >${isSpecialAccent ? "A" : ""}</button>
    `;
  }).join("");

  const standardPresets = COLOR_PRESETS.filter((p) => !p.token.startsWith("acc-"));
  const accentPresets = COLOR_PRESETS.filter((p) => p.token.startsWith("acc-"));

  return `
    <span class="ctl-gradient-group-label" style="display: block; margin-bottom: 6px;">Preset Colors</span>
    <div class="ctl-preset-grid" style="margin-bottom: 12px;">
      ${renderButtons(standardPresets)}
    </div>
    <span class="ctl-gradient-group-label" style="display: block; margin-bottom: 6px;">Accent Colors</span>
    <div class="ctl-preset-grid">
      ${renderButtons(accentPresets)}
    </div>
  `;
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
  const previewLinkedColor = getGradientPreviewLinkedColor(areaKey);

  return `
    <div class="ctl-gradient-strip" data-gradient-strip data-area-key="${areaKey}" title="Click to add a stop, and right-click to remove a stop">
      ${area.stops.map((stop, index) => {
        const swatchColor = getGradientStopColor(stop, previewLinkedColor, "preview");
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
          ${buildGradientPresetPaletteMarkup(areaKey, selectedIndex, selectedStop)}
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
    const { showToast, fallbackToPrevious, force = false } = normalizeRefreshTagsOptions(showToastOrOptions);
    const previousSelectedKey = panelState.selectedTag.toLowerCase();
    const previousTags = panelState.tags.slice();
    const previousTagSourceMap = { ...panelState.tagSourceMap };

    if (!force && previousTags.length && Date.now() - panelState.lastTagCatalogLoadedAt < 3000) {
      renderPanel(showToast ? "Refreshed tags from Logseq" : undefined);

      if (showToast) {
        await logseq.UI.showMsg("Refreshed tags from Logseq.", "success");
      }

      return;
    }

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

    panelState.lastTagCatalogLoadedAt = Date.now();

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
  panelState.appearanceState = { ...DEFAULT_APPEARANCE_STATE };
  panelState.gradientState = createDefaultGradientState();
  panelState.gradientSelections = Object.fromEntries(Object.keys(GRADIENT_AREAS).map((areaKey) => [areaKey, 0]));
  renderPanel(`Graph changed to ${graphInfo?.name || "current graph"}. Refreshing local tags...`);
  await loadStoredAppearanceState();
  await loadGraphSyncRevisionState();
  await loadStoredControls();
  await loadStoredGradients();
  await refreshTags({ showToast: false, fallbackToPrevious: false });
  await loadStoredTagColors();
  await applyManagedOverrides(false, `Loaded synced graph state for ${graphInfo?.name || "current graph"}`, "soft");
}

function doesTxDataTouchDegrandeState(txData = []) {
  const syncAttributes = new Set([
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_CONTROL_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_GRADIENT_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_TAG_COLOR_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_REVISION_PROPERTY),
  ].filter(Boolean));
  const tagCatalogAttributes = new Set([
    ":block/title",
    ":block/name",
    ":block/original-name",
    ":block/type",
    ":block/tags",
    ":block/refs",
  ].filter(Boolean));

  let syncStateChanged = false;
  let tagCatalogChanged = false;

  (txData || []).forEach((datom) => {
    if (!Array.isArray(datom)) {
      return;
    }

    const attribute = String(datom[1] ?? "");
    const value = String(datom[2] ?? "");

    if (
      syncAttributes.has(attribute)
      || value === GRAPH_SYNC_STORAGE_PAGE_NAME
      || value === GRAPH_SYNC_CONTROL_PROPERTY
      || value === GRAPH_SYNC_GRADIENT_PROPERTY
      || value === GRAPH_SYNC_TAG_COLOR_PROPERTY
      || value === GRAPH_SYNC_REVISION_PROPERTY
    ) {
      syncStateChanged = true;
    }

    if (tagCatalogAttributes.has(attribute)) {
      tagCatalogChanged = true;
    }
  });

  return {
    syncStateChanged,
    tagCatalogChanged,
    touched: syncStateChanged || tagCatalogChanged,
  };
}

function schedulePersistedAppearanceSync(options = {}) {
  if (panelState.dbStateRefreshTimer) {
    clearTimeout(panelState.dbStateRefreshTimer);
  }

  panelState.dbStateRefreshTimer = window.setTimeout(() => {
    panelState.dbStateRefreshTimer = null;
    void syncPersistedAppearance(options);
  }, 140);
}

function scheduleTagCatalogRefresh(options = {}) {
  if (!logseq.isMainUIVisible || panelState.activeTab !== "tags") {
    return;
  }

  if (panelState.tagCatalogRefreshTimer) {
    clearTimeout(panelState.tagCatalogRefreshTimer);
  }

  panelState.tagCatalogRefreshTimer = window.setTimeout(() => {
    panelState.tagCatalogRefreshTimer = null;
    void refreshTags({
      showToast: false,
      fallbackToPrevious: true,
      force: true,
      ...options,
    });
  }, 220);
}

function buildPersistedAppearanceSnapshot() {
  return JSON.stringify({
    controls: panelState.controlState,
    gradients: panelState.gradientState,
    tagColors: mergeStoredTagColors(panelState.tagColorAssignments),
    tags: panelState.tags.map((tagName) => String(tagName || "").toLowerCase()),
  });
}

async function syncPersistedAppearance(options = {}) {
  const {
    reason = "Reloaded synced Degrande appearance",
    showToast = false,
    forceRender = false,
    fallbackToPrevious = true,
    renderMode = "soft",
    refreshTagCatalog = false,
  } = options;
  const previousRevision = panelState.syncRevision;
  const previousSnapshot = buildPersistedAppearanceSnapshot();
  const previousSelectedTag = String(panelState.selectedTag || "").toLowerCase();

  setSyncState("pending");

  await syncCurrentGraphInfo();
  await loadGraphSyncRevisionState();
  await loadStoredControls();
  await loadStoredGradients();
  await loadStoredTagColors({ allowEntityFallback: false, fallbackToCurrent: true });

  if (refreshTagCatalog) {
    await refreshTags({ showToast: false, fallbackToPrevious });
  }

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

  panelState.lastNotifiedSyncRevision = Math.max(previousRevision, panelState.syncRevision);
  setSyncState("synced");

  return changed;
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

function syncHighlightRangeControl() {
  const startControl = CONTROL_MAP.highlightStartPercent;
  const endControl = CONTROL_MAP.highlightEndPercent;

  if (!startControl || !endControl) {
    return;
  }

  const startValue = panelState.controlState.highlightStartPercent;
  const endValue = panelState.controlState.highlightEndPercent;

  document.querySelectorAll('[data-role="highlight-range"]').forEach((element) => {
    element.style.setProperty('--ctl-range-start', `${startValue}%`);
    element.style.setProperty('--ctl-range-end', `${endValue}%`);
  });

  document.querySelectorAll('[data-role="highlight-range-summary"]').forEach((element) => {
    element.textContent = `${formatControlValue(startControl, startValue)} -> ${formatControlValue(endControl, endValue)}`;
  });
}

function syncControlInputs() {
  for (const control of ALL_CONTROLS) {
    document.querySelectorAll(`[data-control-key="${control.key}"]`).forEach((input) => {
      input.value = panelState.controlState[control.key];
    });

    document.querySelectorAll(`[data-control-value-for="${control.key}"]`).forEach((value) => {
      value.textContent = formatControlValue(control, panelState.controlState[control.key]);
    });
  }

  syncHighlightRangeControl();
}

function buildEffectiveCssText(managedOverrides) {
  if (!hasEnabledAppearanceSections()) {
    return "";
  }

  const baseCssText = panelState.baseCssText.trim();
  const managedCssText = String(managedOverrides || "").trim();

  if (!baseCssText && !managedCssText) {
    return "";
  }

  return `${baseCssText}\n\n${managedCssText}\n`;
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

function buildDiagnosticsPaneMarkup() {
  return `
    <div class="ctl-preview-scroll" data-role="diagnostics-scroll">
      ${buildAppearanceDiagnosticsMarkup()}
    </div>
  `;
}

function renderDiagnosticsPane() {
  const container = document.querySelector('[data-pane="diagnostics"]');

  if (!container) {
    return;
  }

  container.innerHTML = buildDiagnosticsPaneMarkup();
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
  const highlightPreview = buildGradientEditorMarkup(
    "highlight",
    `
      <div class="ctl-preview-highlight" data-role="preview-highlight">
        <div class="ctl-preview-meta">Inline Highlight</div>
        <p class="ctl-preview-highlight-line">This sample uses a <mark class="ctl-preview-highlight-mark ctl-gradient-preview-surface" data-role="preview-highlight-mark" data-gradient-preview="highlight">highlighted phrase</mark> inside ordinary text.</p>
        ${buildGradientStripMarkup("highlight", getGradientArea("highlight"), GRADIENT_AREAS.highlight, getSelectedGradientStopIndex("highlight"))}
      </div>
    `,
    ["highlightStartPercent", "highlightEndPercent", "highlightRadius"]
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
          ${buildPreviewCardHeadMarkup("tagChips", "Tags", "Inline chips")}
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
          ${buildPreviewCardHeadMarkup("linkedBlocks", "Linked Blocks", "Tag-based fill")}
          <div class="ctl-preview-card-body">
            ${nodePreview}
          </div>
        </article>
        <article class="ctl-preview-card">
          ${buildPreviewCardHeadMarkup("pageTitles", "Page Titles", "Title accent")}
          <div class="ctl-preview-card-body">
            ${titlePreview}
          </div>
        </article>
        <article class="ctl-preview-card">
          ${buildPreviewCardHeadMarkup("highlights", "Highlights", "Inline mark fill")}
          <div class="ctl-preview-card-body">
            ${highlightPreview}
          </div>
        </article>
        <article class="ctl-preview-card">
          ${buildPreviewCardHeadMarkup("quotes", "Quotes", "Edge glow")}
          <div class="ctl-preview-card-body">
            ${quotePreview}
          </div>
        </article>
        <article class="ctl-preview-card">
          ${buildPreviewCardHeadMarkup("backgroundBlocks", "Background Block", "Standalone fill")}
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
  const chipsEnabled = isAppearanceSectionEnabled("tagChips");
  const nodeEnabled = isAppearanceSectionEnabled("linkedBlocks");
  const titleEnabled = isAppearanceSectionEnabled("pageTitles");
  const highlightEnabled = isAppearanceSectionEnabled("highlights");
  const quoteEnabled = isAppearanceSectionEnabled("quotes");
  const backgroundEnabled = isAppearanceSectionEnabled("backgroundBlocks");
  const nodePreviewLinkedColor = getGradientPreviewLinkedColor("node");
  const titlePreviewLinkedColor = getGradientPreviewLinkedColor("title");
  const highlightPreviewLinkedColor = getGradientPreviewLinkedColor("highlight");
  const quotePreviewLinkedColor = getGradientPreviewLinkedColor("quote");
  const backgroundPreviewLinkedColor = getGradientPreviewLinkedColor("background");
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
    opacity: chipsEnabled ? "1" : "0.55",
    transform: "translateY(0px)",
    boxShadow: "none",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-tag-hover"]'), {
    ...tagBase,
    opacity: chipsEnabled ? "1" : "0.55",
    transform: chipsEnabled ? `translateY(-${controls.tagHoverLift}px)` : "translateY(0px)",
    boxShadow: chipsEnabled ? (isDark ? "0 12px 28px rgba(2, 6, 23, 0.44)" : "0 10px 20px rgba(15, 23, 42, 0.12)") : "none",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-block"]'), {
    opacity: nodeEnabled ? "1" : "0.65",
    backgroundImage: nodeEnabled ? buildGradientCss("node", nodePreviewLinkedColor, "preview") : "none",
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.68)" : "rgba(255, 255, 255, 0.82)",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-title-card"]'), {
    opacity: titleEnabled ? "1" : "0.65",
    backgroundImage: titleEnabled ? buildGradientCss("title", titlePreviewLinkedColor, "preview") : "none",
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.84)",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-highlight"]'), {
    opacity: highlightEnabled ? "1" : "0.65",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-highlight-mark"]'), {
    backgroundColor: "transparent",
    color: "inherit",
    borderRadius: `${controls.highlightRadius}px`,
    padding: "0 0.18em",
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
  });

  const previewHighlightMark = document.querySelector('[data-role="preview-highlight-mark"]');

  if (previewHighlightMark) {
    previewHighlightMark.style.setProperty(
      "--ctl-preview-highlight-gradient",
      highlightEnabled ? buildGradientCss("highlight", highlightPreviewLinkedColor, "preview") : "none"
    );
    previewHighlightMark.style.setProperty(
      "--ctl-preview-highlight-size",
      highlightEnabled ? buildHighlightBandBackgroundSizeCss(controls.highlightStartPercent, controls.highlightEndPercent) : "100% 0%"
    );
    previewHighlightMark.style.setProperty(
      "--ctl-preview-highlight-position",
      highlightEnabled ? buildHighlightBandBackgroundPositionCss(controls.highlightStartPercent, controls.highlightEndPercent) : "0% 0%"
    );
  }

  setPreviewElementStyle(document.querySelector('[data-role="preview-quote"]'), {
    opacity: quoteEnabled ? "1" : "0.65",
    borderLeftWidth: `${controls.quoteBorderWidth}px`,
    borderLeftStyle: "solid",
    borderLeftColor: isDark ? "rgba(129, 140, 248, 0.8)" : "rgba(99, 102, 241, 0.58)",
    borderRadius: `0 ${controls.quoteRadius}px ${controls.quoteRadius}px 0`,
    padding: `${controls.quotePaddingY}px ${controls.quotePaddingX}px`,
    backgroundImage: quoteEnabled ? buildGradientCss("quote", quotePreviewLinkedColor, "preview") : "none",
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.82)",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-background"]'), {
    opacity: backgroundEnabled ? "1" : "0.65",
    borderRadius: `${controls.bgRadius}px`,
    padding: `${controls.bgPaddingY}px ${controls.bgPaddingX}px`,
    backgroundImage: backgroundEnabled ? buildGradientCss("background", backgroundPreviewLinkedColor, "preview") : "none",
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
      if (areaKey === "highlight") {
        preview.style.removeProperty("background-image");
        preview.style.setProperty(
          "--ctl-preview-highlight-gradient",
          buildGradientCss("highlight", getGradientPreviewLinkedColor("highlight"), "preview")
        );

        const highlightSize = buildHighlightBandBackgroundSizeCss(
          panelState.controlState.highlightStartPercent,
          panelState.controlState.highlightEndPercent
        );
        const highlightPosition = buildHighlightBandBackgroundPositionCss(
          panelState.controlState.highlightStartPercent,
          panelState.controlState.highlightEndPercent
        );

        preview.style.setProperty("--ctl-preview-highlight-size", highlightSize);
        preview.style.setProperty("--ctl-preview-highlight-position", highlightPosition);
      } else {
        preview.style.backgroundImage = buildGradientCss(areaKey, getGradientPreviewLinkedColor(areaKey), "preview");
        preview.style.removeProperty("--ctl-preview-highlight-gradient");
        preview.style.removeProperty("--ctl-preview-highlight-size");
        preview.style.removeProperty("--ctl-preview-highlight-position");
        preview.style.clipPath = "";
      }
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

      const swatchColor = getGradientStopColor(stop, getGradientPreviewLinkedColor(areaKey), "preview");
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

    if (renderMode !== "soft") {
      schedulePersistGradients();
    }

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

  if (renderMode !== "soft") {
    schedulePersistTagColors([panelState.selectedTag]);
  }
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
  const drag = panelState.colorDrag;
  panelState.colorDrag = null;

  if (!drag?.editor) {
    return;
  }

  if (drag.editor.dataset.colorScope === "gradient-stop") {
    schedulePersistGradients();
    return;
  }

  if (panelState.selectedTag) {
    schedulePersistTagColors([panelState.selectedTag]);
  }
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
  void applyManagedOverrides(false, "Adjusted gradient stop", "preview");
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
    schedulePersistGradients();
  }
}

function syncPanelMeta(statusMessage) {
  const status = document.querySelector('[data-role="status-text"]');
  const themeToggleButton = document.querySelector('[data-action="toggle-logseq-theme"]');

  if (!status) {
    return;
  }

  status.textContent = statusMessage ?? `Theme mode: ${panelState.themeMode} | Applied CSS: ${formatCssTextStats(panelState.cssStats.total)} | Graph-backed sync`;
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

  renderDiagnosticsPane();

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

function rerenderDiagnosticsPanePreservingScroll(statusMessage) {
  const diagnosticsScroll = document.querySelector('[data-role="diagnostics-scroll"]');
  const scrollTop = diagnosticsScroll?.scrollTop ?? 0;
  const scrollLeft = diagnosticsScroll?.scrollLeft ?? 0;

  refreshPanel(statusMessage);

  const nextDiagnosticsScroll = document.querySelector('[data-role="diagnostics-scroll"]');

  if (nextDiagnosticsScroll) {
    nextDiagnosticsScroll.scrollTop = scrollTop;
    nextDiagnosticsScroll.scrollLeft = scrollLeft;
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
  panelState.activeTab = ["preview", "tags", "diagnostics"].includes(tab) ? tab : "tags";

  if (panelState.activeTab === "diagnostics") {
    renderDiagnosticsPane();
  }

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
  const highlightGradient = buildGradientCss("highlight", "var(--ctl-highlight-color)");
  const backgroundGradient = buildGradientCss("background", "var(--ctl-bg-sweep-color)");
  const lightHighlightColor = "rgba(250, 204, 21, 0.32)";
  const darkHighlightColor = "rgba(250, 204, 21, 0.24)";
  const highlightMarkSelector = HOST_HIGHLIGHT_MARK_SELECTORS.join(",\n");
  const darkHighlightMarkSelector = HOST_HIGHLIGHT_MARK_SELECTORS.map((selector) => `.dark-theme ${selector}`).join(",\n");
  const cmdkTagFontSize = Math.max(10, controls.tagFontSize - 1);
  const cmdkTagHeight = Math.max(14, controls.tagHeight - 3);
  const cmdkTagPaddingX = Math.max(4, controls.tagPaddingX - 2);
  const cmdkTagRadius = Math.max(4, controls.tagRadius - 1);
  const tagChipLightBaseShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 1px 2px rgba(15, 23, 42, 0.08)";
  const tagChipDarkBaseShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 1px 2px rgba(2, 6, 23, 0.28)";
  const tagChipLightHoverShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 2px 4px rgba(15, 23, 42, 0.12)";
  const tagChipDarkHoverShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 2px 4px rgba(2, 6, 23, 0.34)";

  const quoteColorRules = QUOTE_COLOR_RULES.map(({ selector, token }) => `
${selector} {
  border-left-color: var(--bd-${token}) !important;
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
  const customGroups = new Map();
  const resetTagNames = [];

  managedTagNames.forEach((tagName) => {
    const assignment = getTagColorAssignment(tagName);

    if (!assignment) {
      if (emitResetRules) {
        resetTagNames.push(tagName);
      }

      return;
    }

    if (assignment.type === "custom") {
      const lightTheme = getResolvedCustomTagTheme(assignment, "light");
      const darkTheme = getResolvedCustomTagTheme(assignment, "dark");
      const lightGradient = getCustomTagGradientColor(assignment, "light");
      const darkGradient = getCustomTagGradientColor(assignment, "dark") || lightGradient;

      if (!lightTheme || !darkTheme || !lightGradient) {
        return;
      }

      const groupKey = JSON.stringify([
        lightTheme.background,
        lightTheme.borderColor,
        lightTheme.color,
        darkTheme.background,
        darkTheme.borderColor,
        darkTheme.color,
        lightGradient,
        darkGradient,
      ]);
      const group = customGroups.get(groupKey) || {
        tagNames: [],
        lightTheme,
        darkTheme,
        lightGradient,
        darkGradient,
      };

      group.tagNames.push(tagName);
      customGroups.set(groupKey, group);
      return;
    }

    if (assignment.type === "preset" && COLOR_PRESET_MAP[assignment.token]) {
      const group = presetGroups.get(assignment.token) || [];
      group.push(tagName);
      presetGroups.set(assignment.token, group);
    }
  });

  const customEntries = Array.from(customGroups.values());

  const resetTagRules = resetTagNames.length
    ? buildGroupedTagChipRule(resetTagNames, {
      lightChipDeclarations: `background: var(--bg-grey) !important;\n  background-color: var(--bg-grey) !important;\n  background-image: none !important;\n  border-color: var(--bd-grey) !important;\n  color: #111 !important;\n  box-shadow: none !important;\n  opacity: 1 !important;`,
      darkChipDeclarations: `background: #374151 !important;\n  background-color: #374151 !important;\n  background-image: none !important;\n  border-color: #4b5563 !important;\n  color: #f3f4f6 !important;\n  box-shadow: none !important;\n  opacity: 1 !important;`,
    })
    : "";

  const presetTagChipRules = Array.from(presetGroups.entries()).map(([token, tagNames]) => {
    const preset = getPresetMeta(token);

    if (!preset) {
      return "";
    }

    return buildGroupedTagChipRule(tagNames, {
      lightChipDeclarations: `background-color: var(--bg-${token}) !important;\n  border-color: var(--bd-${token}) !important;\n  color: ${preset.lightText} !important;`,
      darkChipDeclarations: `background-color: var(--bg-${token}) !important;\n  border-color: var(--bd-${token}) !important;\n  color: ${preset.darkText} !important;`,
    });
  }).join("");

  const customTagChipRules = customEntries.map(({ tagNames, lightTheme, darkTheme }) => buildGroupedTagChipRule(tagNames, {
    lightChipDeclarations: `background: ${lightTheme.background} !important;\n  background-color: ${lightTheme.background} !important;\n  background-image: none !important;\n  border-color: ${lightTheme.borderColor} !important;\n  color: ${lightTheme.color} !important;\n  box-shadow: none !important;\n  opacity: 1 !important;`,
    darkChipDeclarations: `background: ${darkTheme.background} !important;\n  background-color: ${darkTheme.background} !important;\n  background-image: none !important;\n  border-color: ${darkTheme.borderColor} !important;\n  color: ${darkTheme.color} !important;\n  box-shadow: none !important;\n  opacity: 1 !important;`,
  })).join("");

  const sections = {
    tagColors: `${resetTagRules}${presetTagChipRules}${customTagChipRules}`.trim(),
    tagChips: `
a.tag, a.tag:hover, h1 a.tag, h2 a.tag, h3 a.tag, h4 a.tag {
  border-radius: ${controls.tagRadius}px !important;
  font-size: ${controls.tagFontSize}px !important;
  height: ${controls.tagHeight}px !important;
  padding: 0 ${controls.tagPaddingX}px !important;
  border-width: ${controls.tagBorderWidth}px !important;
}

${buildSearchTagChipSelector()} {
  display: inline-flex !important;
  align-items: center !important;
  vertical-align: middle !important;
  margin-bottom: 0 !important;
  text-decoration: none !important;
  line-height: 1.2 !important;
  font-weight: 500 !important;
  background-color: var(--bg-grey) !important;
  color: #111 !important;
  border-style: solid !important;
  border-color: var(--bd-grey) !important;
  box-shadow: ${tagChipLightBaseShadow} !important;
  opacity: 1 !important;
}

${buildSearchTagChipSelector(".dark-theme ")} {
  background-color: #374151 !important;
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
  box-shadow: ${tagChipDarkBaseShadow} !important;
}

${buildSearchTagChipSelector()}::before,
${buildSearchTagChipSelector()} * {
  color: inherit !important;
  font-size: inherit !important;
}

a.tag:hover {
  transform: translateY(-${controls.tagHoverLift}px) !important;
}

${buildSearchTagChipSelector()}:hover {
  transform: translateY(-${controls.tagHoverLift}px) !important;
  box-shadow: ${tagChipLightHoverShadow} !important;
}

${buildSearchTagChipSelector(".dark-theme ")}:hover {
  box-shadow: ${tagChipDarkHoverShadow} !important;
}

[data-degrande-search-tag-label] {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  pointer-events: none !important;
  min-height: ${cmdkTagHeight}px !important;
  padding: 0 ${cmdkTagPaddingX}px !important;
  border-radius: ${cmdkTagRadius}px !important;
  border: ${controls.tagBorderWidth}px solid var(--degrande-search-chip-border, var(--bd-grey)) !important;
  background: var(--degrande-search-chip-bg, var(--bg-grey)) !important;
  color: var(--degrande-search-chip-color, #111) !important;
  font-size: ${cmdkTagFontSize}px !important;
  line-height: 1.2 !important;
  box-shadow: var(--degrande-search-chip-shadow, ${tagChipLightBaseShadow}) !important;
}

[data-degrande-search-tag-label]:hover {
  box-shadow: var(--degrande-search-chip-hover-shadow, ${tagChipLightHoverShadow}) !important;
  transform: translateY(-${controls.tagHoverLift}px) !important;
}

[data-degrande-search-tag-label] .ui__icon,
[data-degrande-search-tag-label] span,
[data-degrande-search-tag-label] mark {
  color: inherit !important;
}

[data-degrande-inline-tag] {
  display: inline-flex !important;
  align-items: center !important;
  vertical-align: middle !important;
  white-space: nowrap !important;
  pointer-events: none !important;
  margin: 0 2px !important;
  min-height: ${cmdkTagHeight}px !important;
  padding: 0 ${cmdkTagPaddingX}px !important;
  border-radius: ${cmdkTagRadius}px !important;
  border: ${controls.tagBorderWidth}px solid var(--degrande-search-chip-border, var(--bd-grey)) !important;
  background: var(--degrande-search-chip-bg, var(--bg-grey)) !important;
  color: var(--degrande-search-chip-color, #111) !important;
  font-size: ${cmdkTagFontSize}px !important;
  line-height: 1.2 !important;
  box-shadow: var(--degrande-search-chip-shadow, ${tagChipLightBaseShadow}) !important;
}

[data-degrande-inline-tag]:hover {
  transform: translateY(-${controls.tagHoverLift}px) !important;
  box-shadow: var(--degrande-search-chip-hover-shadow, ${tagChipLightHoverShadow}) !important;
}

[data-degrande-search-tag-icon] {
  color: var(--degrande-search-chip-color, #111) !important;
  background: var(--degrande-search-chip-bg, var(--bg-grey)) !important;
  pointer-events: none !important;
  border: 1px solid var(--degrande-search-chip-border, var(--bd-grey)) !important;
  box-shadow: var(--degrande-search-chip-shadow, ${tagChipLightBaseShadow}) !important;
}

[data-degrande-search-tag-icon] .ui__icon,
[data-degrande-search-tag-icon] svg {
  color: inherit !important;
}
`.trim(),
    linkedBlocks: `
.ls-block > div:first-child[data-degrande-linked-node="true"]:not(.selected):not(.selected-block) {
  background-image: ${nodeGradient} !important;
  background-color: transparent !important;
}
`.trim(),
    pageTitles: `
.block-main-content[data-degrande-page-title-node="true"] {
  background-image: ${titleGradient} !important;
  background-color: transparent !important;
}
`.trim(),
    highlights: `
${highlightMarkSelector} {
  --ctl-highlight-color: ${lightHighlightColor};
  color: inherit !important;
  -webkit-text-fill-color: currentColor !important;
  text-decoration: none !important;
  background-clip: border-box !important;
  -webkit-background-clip: border-box !important;
  box-shadow: none !important;
  background-color: transparent !important;
  border-radius: ${controls.highlightRadius}px !important;
  padding: 0 0.18em !important;
  box-decoration-break: clone !important;
  -webkit-box-decoration-break: clone !important;

  background-image: ${highlightGradient} !important;
  background-size: ${buildHighlightBandBackgroundSizeCss(controls.highlightStartPercent, controls.highlightEndPercent)} !important;
  background-position: ${buildHighlightBandBackgroundPositionCss(controls.highlightStartPercent, controls.highlightEndPercent)} !important;
  background-repeat: no-repeat !important;
}

${darkHighlightMarkSelector} {
  --ctl-highlight-color: ${darkHighlightColor};
}
`.trim(),
    quotes: `
div[data-node-type="quote"] {
  --ctl-quote-color: rgba(99, 102, 241, ${controls.quoteLightOpacity});
  border-left-width: ${controls.quoteBorderWidth}px !important;
  border-left-style: solid !important;
  border-left-color: #6366f1 !important;
  border-radius: 0 ${controls.quoteRadius}px ${controls.quoteRadius}px 0 !important;
  padding: ${controls.quotePaddingY}px ${controls.quotePaddingX}px !important;
  background-image: ${buildGradientCss("quote", "var(--ctl-quote-color)")} !important;
  background-color: transparent !important;
}

div[data-node-type="quote"] .block-content-inner {
  color: #334155 !important;
}

.dark-theme div[data-node-type="quote"] {
  --ctl-quote-color: rgba(99, 102, 241, ${controls.quoteDarkOpacity});
  border-left-color: #818cf8 !important;
  background-image: ${buildGradientCss("quote", "var(--ctl-quote-color)")} !important;
}

.dark-theme div[data-node-type="quote"] .block-content-inner {
  color: #e2e8f0 !important;
}

${quoteColorRules}
`.trim(),
    backgroundBlocks: `
.with-bg-color:not([data-node-type="quote"]) {
  --ctl-bg-sweep-color: rgba(244, 114, 182, 0.16);
  background-image: ${backgroundGradient} !important;
  background-color: transparent !important;
  border-radius: ${controls.bgRadius}px !important;
  padding: ${controls.bgPaddingY}px ${controls.bgPaddingX}px !important;
}

${backgroundRules}
`.trim(),
  };
  const activeSections = Object.entries(sections)
    .filter(([sectionKey, cssText]) => Boolean(cssText) && isAppearanceSectionEnabled(sectionKey))
    .map(([, cssText]) => cssText);

  return {
    sections,
    cssText: `
/* =============================================== */
/* === CUSTOM THEME LOADER MANAGED OVERRIDES ===== */
/* =============================================== */

${activeSections.join("\n\n")}
`,
  };
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
            <button class="ctl-sync-indicator" type="button" data-action="reload-local-state" data-role="sync-indicator"></button>
          </div>
        </div>
        <div class="ctl-tabbar" role="tablist" aria-label="Theme panel views">
          <button class="ctl-tab" type="button" data-tab="tags" role="tab" aria-selected="true">Tags</button>
          <button class="ctl-tab" type="button" data-tab="preview" role="tab" aria-selected="false">Appearance</button>
          <button class="ctl-tab" type="button" data-tab="diagnostics" role="tab" aria-selected="false">Diagnostics</button>
        </div>
        <div class="ctl-main">
          <section class="ctl-viewer">
            <div class="ctl-pane ctl-pane-tags" data-pane="tags">
              <div class="ctl-pane-stack" data-role="tags-pane"></div>
            </div>
            <div class="ctl-pane ctl-pane-preview" data-pane="preview" hidden>
              ${buildPreviewMarkup()}
            </div>
            <div class="ctl-pane ctl-pane-preview" data-pane="diagnostics" hidden>
              ${buildDiagnosticsPaneMarkup()}
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

    if (action === "reload-local-state") {
      await syncPersistedAppearance({
        reason: "Reloaded synced graph appearance for this graph",
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

    if (action === "toggle-appearance-section") {
      toggleAppearanceSection(target.dataset.appearanceSection || "");
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

    const nextValue = Number(input.value);

    if (controlKey === "highlightStartPercent") {
      panelState.controlState.highlightStartPercent = Math.min(nextValue, panelState.controlState.highlightEndPercent);
    } else if (controlKey === "highlightEndPercent") {
      panelState.controlState.highlightEndPercent = Math.max(nextValue, panelState.controlState.highlightStartPercent);
    } else {
      panelState.controlState[controlKey] = nextValue;
    }

    void applyManagedOverrides(false, `Adjusted ${control.label}`, "soft");
  });

  app.addEventListener("change", (event) => {
    const inlineColorHexInput = event.target.closest("[data-inline-color-hex]");
    const inlineColorHue = event.target.closest("[data-inline-color-hue]");
    const inlineColorAlpha = event.target.closest("[data-inline-color-alpha]");

    if (inlineColorHexInput || inlineColorHue || inlineColorAlpha) {
      const editor = (inlineColorHexInput || inlineColorHue || inlineColorAlpha).closest("[data-inline-color-editor]");
      const nextColor = getInlineColorEditorColor(editor);
      syncInlineColorEditor(editor, nextColor);

      if (editor?.dataset.colorScope === "gradient-stop") {
        schedulePersistGradients();
      } else if (panelState.selectedTag) {
        schedulePersistTagColors([panelState.selectedTag]);
      }

      return;
    }

    const gradientAngleInput = event.target.closest("[data-gradient-angle]");

    if (gradientAngleInput) {
      schedulePersistGradients();
      return;
    }

    const controlInput = event.target.closest("[data-control-key]");

    if (controlInput) {
      schedulePersistControls();
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
  const shouldApplyCss = hasEnabledAppearanceSections();

  rebuildTagDrivenNodeStyleState();

  panelState.cssText = buildEffectiveCssText(managedOverrides.cssText);
  panelState.cssStats = buildCssStats(panelState.baseCssText, managedOverrides.cssText, managedOverrides.sections);
  panelState.lastAppliedAt = new Date();

  if (!panelState.legacyManagedStylesCleaned) {
    cleanupLegacyManagedStyles();
    panelState.legacyManagedStylesCleaned = true;
  }

  setHostStyleText(BASE_STYLE_ELEMENT_ID, shouldApplyCss ? panelState.baseCssText : "");
  setHostStyleText(MANAGED_STYLE_ELEMENT_ID, managedOverrides.cssText);

  if (shouldUseProvideStyleFallback()) {
    if (renderMode === "full") {
      panelState.pendingFallbackCssText = panelState.cssText;
      flushPendingFallbackStyleText();
    } else {
      queueFallbackStyleText(panelState.cssText);
    }
  }

  syncHostColorVariables();
  syncAllTagDrivenNodeStyles();
  scheduleCmdkTagStyleSync();
  scheduleSidebarTagStyleSync();

  if (panelState.mounted) {
    if (renderMode === "soft") {
      refreshPanel(statusMessage);
    } else if (renderMode === "preview") {
      if (panelState.activeTab === "diagnostics") {
        rerenderDiagnosticsPanePreservingScroll(statusMessage);
      } else {
        rerenderPreviewPanePreservingScroll(statusMessage);
      }
    } else {
      renderPanel(statusMessage);
    }
  }

  if (showToast) {
    await logseq.UI.showMsg(statusMessage, "success");
  }
}

function toggleAppearanceSection(sectionKey) {
  const section = APPEARANCE_SECTION_MAP[sectionKey];

  if (!section) {
    return false;
  }

  panelState.appearanceState[sectionKey] = !isAppearanceSectionEnabled(sectionKey);
  persistAppearanceState();
  void applyManagedOverrides(false, `${section.label} ${panelState.appearanceState[sectionKey] ? "enabled" : "disabled"}`, "preview");
  return true;
}

async function openThemeLoader() {
  if (!panelState.mounted) {
    mountPanel();
  }

  setPanelRootVisibility(true);
  logseq.setMainUIInlineStyle(MAIN_UI_INLINE_STYLE);
  renderPanel("Loading synced graph state...");
  logseq.showMainUI({ autoFocus: true });
  syncThemeLoaderToggleState();

  try {
    await syncPersistedAppearance({
      reason: "Loaded latest synced graph state",
      forceRender: true,
      fallbackToPrevious: false,
      renderMode: "soft",
      refreshTagCatalog: true,
    });
  } catch (error) {
    console.error("[Degrande Colors] Failed to refresh local state when opening panel", error);

    await ensureTagsForCurrentGraph({ force: true, fallbackToPrevious: true });
    await applyManagedOverrides(false, "Reapplied saved theme controls");
    renderPanel("Unable to refresh local state. Showing current values.");
  }
}

function closeThemeLoader() {
  clearPendingTagSelection();
  flushPendingFallbackStyleText();
  setPanelRootVisibility(false);
  logseq.setMainUIInlineStyle({});
  logseq.hideMainUI({ restoreEditingCursor: true });
  syncThemeLoaderToggleState();
}

function toggleThemeLoader() {
  if (logseq.isMainUIVisible) {
    closeThemeLoader();
  } else {
    void openThemeLoader();
  }
}

async function reloadThemeCss(showToast = false, reopenUI = !!logseq.isMainUIVisible) {
  const rawCssText = await loadWorkspaceCss();
  panelState.baseTagColorMap = parseBaseTagColorMap(rawCssText);
  panelState.baseCssText = buildStaticBaseCssText(rawCssText);
  setHostStyleText(BASE_STYLE_ELEMENT_ID, panelState.baseCssText);

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

  schedulePersistControls();
  schedulePersistGradients();
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
  const activationMessage = `Degrande Colors v${PLUGIN_VERSION} is active with graph-backed sync for this Logseq DB graph.`;
  const hostWindow = getHostWindow();
  const hostSession = hostWindow[HOST_SESSION_KEY] || (hostWindow[HOST_SESSION_KEY] = {});
  const hostToolbarButtonExists = Boolean(getHostDocument().getElementById(TOOLBAR_BUTTON_ID));
  const shouldRegisterHostUi = !hostSession[pluginId] && !hostToolbarButtonExists;

  await syncCurrentGraphInfo();
  await primeGraphIndexedState();
  await loadStoredAppearanceState();
  await loadGraphSyncRevisionState();
  await loadStoredControls();
  await loadStoredTagColors();
  await loadStoredGradients();
  setSyncState("synced");
  bindHostTagContextMenu();

  const userConfigs = await logseq.App.getUserConfigs();
  setThemeMode(userConfigs?.preferredThemeMode);
  logseq.App.onThemeModeChanged(({ mode }) => {
    setThemeMode(mode);
    rebuildTagDrivenNodeStyleState();
    syncAllTagDrivenNodeStyles();
    renderPanel(`Logseq theme: ${mode}`);
  });

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

      void (async () => {
        await flushDeferredGraphSyncWrites();
        await syncPersistedAppearance({
          reason: "Reloaded synced graph appearance",
          fallbackToPrevious: false,
          forceRender: true,
          refreshTagCatalog: Boolean(logseq.isMainUIVisible && panelState.activeTab === "tags"),
        });
      })();
    });
  }

  if (typeof logseq.DB?.onChanged === "function") {
    logseq.DB.onChanged(({ txData }) => {
      if (!Array.isArray(txData) || !txData.length) {
        return;
      }

      const changeSummary = doesTxDataTouchDegrandeState(txData);

      if (!changeSummary.touched) {
        return;
      }

      if (changeSummary.syncStateChanged) {
        schedulePersistedAppearanceSync({
          reason: "Updated synced graph appearance",
          fallbackToPrevious: false,
          refreshTagCatalog: false,
        });
      }

      if (changeSummary.tagCatalogChanged) {
        scheduleTagCatalogRefresh();
      }
    });
  }

  await reloadThemeCss(false, false);
  observeHostColorTargets();
  observeTagDrivenNodeStyles();
  observeCmdkSearchResults();
  observeSidebarTagStyles();

  logseq.provideModel({
    openThemeLoader,
    closeThemeLoader,
    toggleThemeLoader,
  });

  logseq.provideStyle(getToolbarStyle());

  if (shouldRegisterHostUi) {
    registerToolbarItemSafely({
      key: "custom-theme-loader-open",
      template: `
        <a class="button" data-on-click="toggleThemeLoader" title="Open Degrande Colors" aria-label="Open Degrande Colors" aria-pressed="false">
          <i class="ti ti-palette" aria-hidden="true"></i>
        </a>
      `,
    });
  }

  syncThemeLoaderToggleState();

  if (shouldRegisterHostUi) {
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
        key: commandKey("reload-local-state"),
        label: "Degrande Colors: reload synced graph state",
      },
      () => syncPersistedAppearance({
        reason: "Reloaded synced graph appearance for this graph",
        showToast: true,
        forceRender: true,
        fallbackToPrevious: false,
        refreshTagCatalog: true,
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

    hostSession[pluginId] = {
      version: PLUGIN_VERSION,
      activatedAt: Date.now(),
    };
  }

  console.info(`[Degrande Colors] Loaded base styles and controls (v${PLUGIN_VERSION})`);
}

window.__degrandeColorsMain = main;
})();





