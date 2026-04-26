(() => {
const CONTROL_STORAGE_KEY = "custom-theme-loader-controls.json";
const FALLBACK_PLUGIN_VERSION = "0.5.31";
const TAG_COLOR_STORAGE_KEY = "custom-theme-loader-tag-colors.json";
const GRADIENT_STORAGE_KEY = "custom-theme-loader-gradients.json";
const APPEARANCE_STATE_STORAGE_KEY = "custom-theme-loader-appearance-state.json";
const THEME_LIBRARY_STORAGE_KEY = "custom-theme-loader-themes.json";
const GRAPH_SYNC_CONFIG_KEY = "mugpet-degrande-colors";
const GRAPH_SYNC_TAG_COLOR_VERSION = 1;
const GRAPH_SYNC_STORAGE_PAGE_NAME = "mugpet-degrande-colors-sync-state";
const GRAPH_SYNC_CONTROL_PROPERTY = "mugpet_degrande_colors_controls";
const GRAPH_SYNC_GRADIENT_PROPERTY = "mugpet_degrande_colors_gradients";
const GRAPH_SYNC_TAG_COLOR_PROPERTY = "mugpet_degrande_colors_tag_colors";
const GRAPH_SYNC_THEME_LIBRARY_PROPERTY = "mugpet_degrande_colors_themes";
const GRAPH_SYNC_REVISION_PROPERTY = "mugpet_degrande_colors_sync_revision";
const THEME_EXPORT_FORMAT = "degrande-colors-theme";
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
      { key: "nodeBorderWidth", label: "Border Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "nodeBorderTopWidth", label: "Top Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "nodeBorderRightWidth", label: "Right Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "nodeBorderBottomWidth", label: "Bottom Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "nodeBorderLeftWidth", label: "Left Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "nodeBorderRadius", label: "Radius", min: 0, max: 24, step: 1, unit: "px", defaultValue: 10 },
      { key: "nodeBorderOpacity", label: "Opacity", min: 0, max: 100, step: 1, unit: "%", defaultValue: 100 },
      { key: "nodeBorderColorMode", label: "Border Color Source", type: "string", defaultValue: "custom" },
      { key: "nodeBorderColorToken", label: "Border Color Preset", type: "string", defaultValue: "green" },
      { key: "nodeBorderColor", label: "Border Color", type: "color", defaultValue: "#10b98155" },
      { key: "nodePaddingY", label: "Vertical Padding", min: 0, max: 24, step: 1, unit: "px", defaultValue: 8 },
      { key: "nodePaddingX", label: "Horizontal Padding", min: 0, max: 28, step: 1, unit: "px", defaultValue: 12 },
      { key: "nodeBorderTop", label: "Top", type: "boolean", defaultValue: true },
      { key: "nodeBorderRight", label: "Right", type: "boolean", defaultValue: true },
      { key: "nodeBorderBottom", label: "Bottom", type: "boolean", defaultValue: true },
      { key: "nodeBorderLeft", label: "Left", type: "boolean", defaultValue: true },
      { key: "nodeBorderTopLeft", label: "Top Left", type: "boolean", defaultValue: true },
      { key: "nodeBorderTopRight", label: "Top Right", type: "boolean", defaultValue: true },
      { key: "nodeBorderBottomRight", label: "Bottom Right", type: "boolean", defaultValue: true },
      { key: "nodeBorderBottomLeft", label: "Bottom Left", type: "boolean", defaultValue: true },
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
      { key: "titleBorderWidth", label: "Border Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "titleBorderTopWidth", label: "Top Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "titleBorderRightWidth", label: "Right Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "titleBorderBottomWidth", label: "Bottom Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "titleBorderLeftWidth", label: "Left Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "titleBorderRadius", label: "Radius", min: 0, max: 24, step: 1, unit: "px", defaultValue: 12 },
      { key: "titleBorderOpacity", label: "Opacity", min: 0, max: 100, step: 1, unit: "%", defaultValue: 100 },
      { key: "titleBorderColorMode", label: "Border Color Source", type: "string", defaultValue: "custom" },
      { key: "titleBorderColorToken", label: "Border Color Preset", type: "string", defaultValue: "amber" },
      { key: "titleBorderColor", label: "Border Color", type: "color", defaultValue: "#f59e0b55" },
      { key: "titlePaddingY", label: "Vertical Padding", min: 0, max: 24, step: 1, unit: "px", defaultValue: 10 },
      { key: "titlePaddingX", label: "Horizontal Padding", min: 0, max: 28, step: 1, unit: "px", defaultValue: 16 },
      { key: "titleBorderTop", label: "Top", type: "boolean", defaultValue: true },
      { key: "titleBorderRight", label: "Right", type: "boolean", defaultValue: true },
      { key: "titleBorderBottom", label: "Bottom", type: "boolean", defaultValue: true },
      { key: "titleBorderLeft", label: "Left", type: "boolean", defaultValue: true },
      { key: "titleBorderTopLeft", label: "Top Left", type: "boolean", defaultValue: true },
      { key: "titleBorderTopRight", label: "Top Right", type: "boolean", defaultValue: true },
      { key: "titleBorderBottomRight", label: "Bottom Right", type: "boolean", defaultValue: true },
      { key: "titleBorderBottomLeft", label: "Bottom Left", type: "boolean", defaultValue: true },
    ],
  },
  {
    title: "Highlights",
    description: "Shape the highlight mark and adjust the visible color band.",
    controls: [
      { key: "highlightStartPercent", label: "Start", min: 0, max: 100, step: 1, unit: "%", defaultValue: 0 },
      { key: "highlightEndPercent", label: "Stop", min: 0, max: 100, step: 1, unit: "%", defaultValue: 100 },
      { key: "highlightRadius", label: "Radius", min: 0, max: 12, step: 1, unit: "px", defaultValue: 4 },
      { key: "highlightBorderWidth", label: "Border Width", min: 0, max: 6, step: 1, unit: "px", defaultValue: 0 },
      { key: "highlightBorderTopWidth", label: "Top Width", min: 0, max: 6, step: 1, unit: "px", defaultValue: 0 },
      { key: "highlightBorderRightWidth", label: "Right Width", min: 0, max: 6, step: 1, unit: "px", defaultValue: 0 },
      { key: "highlightBorderBottomWidth", label: "Bottom Width", min: 0, max: 6, step: 1, unit: "px", defaultValue: 0 },
      { key: "highlightBorderLeftWidth", label: "Left Width", min: 0, max: 6, step: 1, unit: "px", defaultValue: 0 },
      { key: "highlightBorderOpacity", label: "Opacity", min: 0, max: 100, step: 1, unit: "%", defaultValue: 100 },
      { key: "highlightBorderColorMode", label: "Border Color Source", type: "string", defaultValue: "custom" },
      { key: "highlightBorderColorToken", label: "Border Color Preset", type: "string", defaultValue: "yellow" },
      { key: "highlightBorderColor", label: "Border Color", type: "color", defaultValue: "#facc1566" },
      { key: "highlightPaddingY", label: "Vertical Padding", min: 0, max: 12, step: 1, unit: "px", defaultValue: 0 },
      { key: "highlightPaddingX", label: "Horizontal Padding", min: 0, max: 16, step: 1, unit: "px", defaultValue: 3 },
      { key: "highlightBorderTop", label: "Top", type: "boolean", defaultValue: true },
      { key: "highlightBorderRight", label: "Right", type: "boolean", defaultValue: true },
      { key: "highlightBorderBottom", label: "Bottom", type: "boolean", defaultValue: true },
      { key: "highlightBorderLeft", label: "Left", type: "boolean", defaultValue: true },
      { key: "highlightBorderTopLeft", label: "Top Left", type: "boolean", defaultValue: true },
      { key: "highlightBorderTopRight", label: "Top Right", type: "boolean", defaultValue: true },
      { key: "highlightBorderBottomRight", label: "Bottom Right", type: "boolean", defaultValue: true },
      { key: "highlightBorderBottomLeft", label: "Bottom Left", type: "boolean", defaultValue: true },
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
      { key: "quoteBorderTopWidth", label: "Top Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 4 },
      { key: "quoteBorderRightWidth", label: "Right Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 4 },
      { key: "quoteBorderBottomWidth", label: "Bottom Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 4 },
      { key: "quoteBorderLeftWidth", label: "Left Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 4 },
      { key: "quoteRadius", label: "Radius", min: 0, max: 16, step: 1, unit: "px", defaultValue: 8 },
      { key: "quoteBorderOpacity", label: "Opacity", min: 0, max: 100, step: 1, unit: "%", defaultValue: 100 },
      { key: "quoteBorderColorMode", label: "Border Color Source", type: "string", defaultValue: "custom" },
      { key: "quoteBorderColorToken", label: "Border Color Preset", type: "string", defaultValue: "indigo" },
      { key: "quoteBorderColor", label: "Border Color", type: "color", defaultValue: "#6366f194" },
      { key: "quoteBorderTop", label: "Top", type: "boolean", defaultValue: true },
      { key: "quoteBorderRight", label: "Right", type: "boolean", defaultValue: true },
      { key: "quoteBorderBottom", label: "Bottom", type: "boolean", defaultValue: true },
      { key: "quoteBorderLeft", label: "Left", type: "boolean", defaultValue: true },
      { key: "quoteBorderTopLeft", label: "Top Left", type: "boolean", defaultValue: false },
      { key: "quoteBorderTopRight", label: "Top Right", type: "boolean", defaultValue: true },
      { key: "quoteBorderBottomRight", label: "Bottom Right", type: "boolean", defaultValue: true },
      { key: "quoteBorderBottomLeft", label: "Bottom Left", type: "boolean", defaultValue: false },
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
      { key: "bgBorderWidth", label: "Border Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "bgBorderTopWidth", label: "Top Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "bgBorderRightWidth", label: "Right Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "bgBorderBottomWidth", label: "Bottom Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "bgBorderLeftWidth", label: "Left Width", min: 0, max: 8, step: 1, unit: "px", defaultValue: 0 },
      { key: "bgRadius", label: "Radius", min: 0, max: 16, step: 1, unit: "px", defaultValue: 6 },
      { key: "bgBorderOpacity", label: "Opacity", min: 0, max: 100, step: 1, unit: "%", defaultValue: 100 },
      { key: "bgBorderColorMode", label: "Border Color Source", type: "string", defaultValue: "custom" },
      { key: "bgBorderColorToken", label: "Border Color Preset", type: "string", defaultValue: "pink" },
      { key: "bgBorderColor", label: "Border Color", type: "color", defaultValue: "#f472b655" },
      { key: "bgBorderTop", label: "Top", type: "boolean", defaultValue: true },
      { key: "bgBorderRight", label: "Right", type: "boolean", defaultValue: true },
      { key: "bgBorderBottom", label: "Bottom", type: "boolean", defaultValue: true },
      { key: "bgBorderLeft", label: "Left", type: "boolean", defaultValue: true },
      { key: "bgBorderTopLeft", label: "Top Left", type: "boolean", defaultValue: true },
      { key: "bgBorderTopRight", label: "Top Right", type: "boolean", defaultValue: true },
      { key: "bgBorderBottomRight", label: "Bottom Right", type: "boolean", defaultValue: true },
      { key: "bgBorderBottomLeft", label: "Bottom Left", type: "boolean", defaultValue: true },
      { key: "bgPaddingY", label: "Vertical Padding", min: 0, max: 12, step: 1, unit: "px", defaultValue: 2 },
      { key: "bgPaddingX", label: "Horizontal Padding", min: 0, max: 16, step: 1, unit: "px", defaultValue: 4 },
    ],
  },
];

const ALL_CONTROLS = CONTROL_SECTIONS.flatMap((section) => section.controls);
const CONTROL_MAP = Object.fromEntries(ALL_CONTROLS.map((control) => [control.key, control]));
const DEFAULT_CONTROL_STATE = Object.fromEntries(ALL_CONTROLS.map((control) => [control.key, control.defaultValue]));
const BORDER_CORNER_DEFINITIONS = [
  { name: "topLeft", shortLabel: "TL", title: "Top Left" },
  { name: "topRight", shortLabel: "TR", title: "Top Right" },
  { name: "bottomRight", shortLabel: "BR", title: "Bottom Right" },
  { name: "bottomLeft", shortLabel: "BL", title: "Bottom Left" },
];
const BORDER_SIDE_DEFINITIONS = [
  { name: "top", shortLabel: "T", title: "Top" },
  { name: "right", shortLabel: "R", title: "Right" },
  { name: "bottom", shortLabel: "B", title: "Bottom" },
  { name: "left", shortLabel: "L", title: "Left" },
];

function buildCornerIconMarkup(name) {
  const iconPaths = {
    topLeft: 'M4 11V6a2 2 0 0 1 2-2h5',
    topRight: 'M5 4h5a2 2 0 0 1 2 2v5',
    bottomRight: 'M12 5v5a2 2 0 0 1-2 2H5',
    bottomLeft: 'M11 12H6a2 2 0 0 1-2-2V5',
  };
  const path = iconPaths[name] || iconPaths.topLeft;

  return `
    <span class="ctl-toggle-icon" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false">
        <rect x="2.75" y="2.75" width="10.5" height="10.5" rx="1.5" opacity="0.22"></rect>
        <path d="${path}"></path>
      </svg>
    </span>
  `;
}

function buildBorderSideIconMarkup(name) {
  const iconPaths = {
    top: 'M3.5 4H12.5',
    right: 'M12 3.5V12.5',
    bottom: 'M3.5 12H12.5',
    left: 'M4 3.5V12.5',
  };
  const path = iconPaths[name] || iconPaths.top;

  return `
    <span class="ctl-toggle-icon" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" focusable="false">
        <rect x="2.75" y="2.75" width="10.5" height="10.5" rx="1.5" stroke-width="1.3" opacity="0.22"></rect>
        <path d="${path}" stroke-width="2.4"></path>
      </svg>
    </span>
  `;
}

const BORDER_CONTROL_GROUPS = {
  node: {
    key: "node",
    label: "Linked Block Border",
    widthKey: "nodeBorderWidth",
    sideWidthKeys: {
      top: "nodeBorderTopWidth",
      right: "nodeBorderRightWidth",
      bottom: "nodeBorderBottomWidth",
      left: "nodeBorderLeftWidth",
    },
    radiusKey: "nodeBorderRadius",
    opacityKey: "nodeBorderOpacity",
    modeKey: "nodeBorderColorMode",
    tokenKey: "nodeBorderColorToken",
    colorKey: "nodeBorderColor",
    sideKeys: {
      top: "nodeBorderTop",
      right: "nodeBorderRight",
      bottom: "nodeBorderBottom",
      left: "nodeBorderLeft",
    },
    cornerKeys: {
      topLeft: "nodeBorderTopLeft",
      topRight: "nodeBorderTopRight",
      bottomRight: "nodeBorderBottomRight",
      bottomLeft: "nodeBorderBottomLeft",
    },
  },
  title: {
    key: "title",
    label: "Page Title Border",
    widthKey: "titleBorderWidth",
    sideWidthKeys: {
      top: "titleBorderTopWidth",
      right: "titleBorderRightWidth",
      bottom: "titleBorderBottomWidth",
      left: "titleBorderLeftWidth",
    },
    radiusKey: "titleBorderRadius",
    opacityKey: "titleBorderOpacity",
    modeKey: "titleBorderColorMode",
    tokenKey: "titleBorderColorToken",
    colorKey: "titleBorderColor",
    sideKeys: {
      top: "titleBorderTop",
      right: "titleBorderRight",
      bottom: "titleBorderBottom",
      left: "titleBorderLeft",
    },
    cornerKeys: {
      topLeft: "titleBorderTopLeft",
      topRight: "titleBorderTopRight",
      bottomRight: "titleBorderBottomRight",
      bottomLeft: "titleBorderBottomLeft",
    },
  },
  highlight: {
    key: "highlight",
    label: "Highlight Border",
    widthKey: "highlightBorderWidth",
    sideWidthKeys: {
      top: "highlightBorderTopWidth",
      right: "highlightBorderRightWidth",
      bottom: "highlightBorderBottomWidth",
      left: "highlightBorderLeftWidth",
    },
    radiusKey: "highlightRadius",
    opacityKey: "highlightBorderOpacity",
    modeKey: "highlightBorderColorMode",
    tokenKey: "highlightBorderColorToken",
    colorKey: "highlightBorderColor",
    sideKeys: {
      top: "highlightBorderTop",
      right: "highlightBorderRight",
      bottom: "highlightBorderBottom",
      left: "highlightBorderLeft",
    },
    cornerKeys: {
      topLeft: "highlightBorderTopLeft",
      topRight: "highlightBorderTopRight",
      bottomRight: "highlightBorderBottomRight",
      bottomLeft: "highlightBorderBottomLeft",
    },
  },
  quote: {
    key: "quote",
    label: "Quote Border",
    widthKey: "quoteBorderWidth",
    sideWidthKeys: {
      top: "quoteBorderTopWidth",
      right: "quoteBorderRightWidth",
      bottom: "quoteBorderBottomWidth",
      left: "quoteBorderLeftWidth",
    },
    radiusKey: "quoteRadius",
    opacityKey: "quoteBorderOpacity",
    modeKey: "quoteBorderColorMode",
    tokenKey: "quoteBorderColorToken",
    colorKey: "quoteBorderColor",
    sideKeys: {
      top: "quoteBorderTop",
      right: "quoteBorderRight",
      bottom: "quoteBorderBottom",
      left: "quoteBorderLeft",
    },
    cornerKeys: {
      topLeft: "quoteBorderTopLeft",
      topRight: "quoteBorderTopRight",
      bottomRight: "quoteBorderBottomRight",
      bottomLeft: "quoteBorderBottomLeft",
    },
  },
  background: {
    key: "background",
    label: "Background Block Border",
    widthKey: "bgBorderWidth",
    sideWidthKeys: {
      top: "bgBorderTopWidth",
      right: "bgBorderRightWidth",
      bottom: "bgBorderBottomWidth",
      left: "bgBorderLeftWidth",
    },
    radiusKey: "bgRadius",
    opacityKey: "bgBorderOpacity",
    modeKey: "bgBorderColorMode",
    tokenKey: "bgBorderColorToken",
    colorKey: "bgBorderColor",
    sideKeys: {
      top: "bgBorderTop",
      right: "bgBorderRight",
      bottom: "bgBorderBottom",
      left: "bgBorderLeft",
    },
    cornerKeys: {
      topLeft: "bgBorderTopLeft",
      topRight: "bgBorderTopRight",
      bottomRight: "bgBorderBottomRight",
      bottomLeft: "bgBorderBottomLeft",
    },
  },
};
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
const DEFAULT_THEME_EXPORT_SOURCE = JSON.parse(String.raw`{
  "format": "degrande-colors-theme",
  "version": 1,
  "pluginVersion": "0.5.23",
  "exportedAt": 1777110644947,
  "theme": {
    "id": "mpe",
    "name": "mpe",
    "createdAt": 1777110482319,
    "updatedAt": 1777110482319,
    "snapshot": {
      "appearanceState": {
        "tagColors": true,
        "tagChips": true,
        "linkedBlocks": true,
        "pageTitles": true,
        "highlights": true,
        "quotes": true,
        "backgroundBlocks": true
      },
      "controlState": {
        "tagRadius": 6,
        "tagFontSize": 11,
        "tagHeight": 18,
        "tagPaddingX": 6,
        "tagBorderWidth": 1,
        "tagHoverLift": 1,
        "nodeAngle": 90,
        "nodePeak": 50,
        "nodeFadeEnd": 80,
        "nodeBorderWidth": 0,
        "nodeBorderTopWidth": 0,
        "nodeBorderRightWidth": 0,
        "nodeBorderBottomWidth": 0,
        "nodeBorderLeftWidth": 0,
        "nodeBorderRadius": 4,
        "nodeBorderOpacity": 100,
        "nodeBorderColorMode": "linked",
        "nodeBorderColorToken": "acc-app-accent",
        "nodeBorderColor": "#905959",
        "nodePaddingY": 0,
        "nodePaddingX": 0,
        "nodeBorderTop": true,
        "nodeBorderRight": true,
        "nodeBorderBottom": true,
        "nodeBorderLeft": true,
        "nodeBorderTopLeft": true,
        "nodeBorderTopRight": true,
        "nodeBorderBottomRight": true,
        "nodeBorderBottomLeft": true,
        "titleAngle": 90,
        "titlePeak": 30,
        "titleFadeEnd": 60,
        "darkTitlePeak": 3,
        "darkTitleFadeEnd": 35,
        "titleBorderWidth": 1,
        "titleBorderTopWidth": 1,
        "titleBorderRightWidth": 1,
        "titleBorderBottomWidth": 1,
        "titleBorderLeftWidth": 1,
        "titleBorderRadius": 12,
        "titleBorderOpacity": 38,
        "titleBorderColorMode": "linked",
        "titleBorderColorToken": "amber",
        "titleBorderColor": "#f59e0b55",
        "titlePaddingY": 24,
        "titlePaddingX": 16,
        "titleBorderTop": true,
        "titleBorderRight": true,
        "titleBorderBottom": true,
        "titleBorderLeft": true,
        "titleBorderTopLeft": true,
        "titleBorderTopRight": true,
        "titleBorderBottomRight": true,
        "titleBorderBottomLeft": true,
        "highlightStartPercent": 0,
        "highlightEndPercent": 100,
        "highlightRadius": 4,
        "highlightBorderWidth": 1,
        "highlightBorderTopWidth": 1,
        "highlightBorderRightWidth": 1,
        "highlightBorderBottomWidth": 1,
        "highlightBorderLeftWidth": 1,
        "highlightBorderOpacity": 100,
        "highlightBorderColorMode": "custom",
        "highlightBorderColorToken": "acc-app-accent",
        "highlightBorderColor": "#ffcc00",
        "highlightPaddingY": 2,
        "highlightPaddingX": 4,
        "highlightBorderTop": true,
        "highlightBorderRight": true,
        "highlightBorderBottom": true,
        "highlightBorderLeft": true,
        "highlightBorderTopLeft": true,
        "highlightBorderTopRight": true,
        "highlightBorderBottomRight": true,
        "highlightBorderBottomLeft": true,
        "quoteAngle": 130,
        "quoteClearStart": 40,
        "quoteClearEnd": 70,
        "quoteLightOpacity": 0.1,
        "quoteDarkOpacity": 0.15,
        "quoteBorderWidth": 3,
        "quoteBorderTopWidth": 1,
        "quoteBorderRightWidth": 1,
        "quoteBorderBottomWidth": 1,
        "quoteBorderLeftWidth": 4,
        "quoteRadius": 1,
        "quoteBorderOpacity": 100,
        "quoteBorderColorMode": "linked",
        "quoteBorderColorToken": "acc-app-accent",
        "quoteBorderColor": "#6366f194",
        "quoteBorderTop": true,
        "quoteBorderRight": true,
        "quoteBorderBottom": true,
        "quoteBorderLeft": true,
        "quoteBorderTopLeft": false,
        "quoteBorderTopRight": true,
        "quoteBorderBottomRight": true,
        "quoteBorderBottomLeft": false,
        "quotePaddingY": 16,
        "quotePaddingX": 21,
        "bgAngle": 170,
        "bgClearStart": 30,
        "bgClearEnd": 80,
        "bgBorderWidth": 0,
        "bgBorderTopWidth": 0,
        "bgBorderRightWidth": 0,
        "bgBorderBottomWidth": 0,
        "bgBorderLeftWidth": 0,
        "bgRadius": 5,
        "bgBorderOpacity": 100,
        "bgBorderColorMode": "custom",
        "bgBorderColorToken": "pink",
        "bgBorderColor": "#f472b655",
        "bgBorderTop": true,
        "bgBorderRight": true,
        "bgBorderBottom": true,
        "bgBorderLeft": true,
        "bgBorderTopLeft": true,
        "bgBorderTopRight": true,
        "bgBorderBottomRight": true,
        "bgBorderBottomLeft": true,
        "bgPaddingY": 4,
        "bgPaddingX": 6
      },
      "gradientState": {
        "node": {
          "angle": 120,
          "stops": [
            {
              "source": "linked",
              "position": 0,
              "track": "bottom",
              "alpha": 5
            },
            {
              "source": "linked",
              "position": 39,
              "track": "bottom",
              "alpha": 3
            },
            {
              "source": "linked",
              "position": 39,
              "track": "top",
              "alpha": 10
            },
            {
              "source": "linked",
              "position": 68,
              "track": "top",
              "alpha": 35
            },
            {
              "source": "linked",
              "position": 68,
              "track": "bottom",
              "alpha": 53
            },
            {
              "source": "linked",
              "position": 72,
              "track": "top",
              "alpha": 59
            },
            {
              "source": "linked",
              "position": 72,
              "track": "bottom",
              "alpha": 70
            },
            {
              "source": "linked",
              "position": 88,
              "track": "top",
              "alpha": 59
            },
            {
              "source": "linked",
              "position": 88,
              "track": "bottom",
              "alpha": 100
            }
          ]
        },
        "title": {
          "angle": 120,
          "stops": [
            {
              "source": "linked",
              "position": 0,
              "track": "top",
              "alpha": 0
            },
            {
              "source": "linked",
              "position": 19,
              "track": "bottom",
              "alpha": 0
            },
            {
              "source": "linked",
              "position": 19,
              "track": "top",
              "alpha": 7
            },
            {
              "source": "linked",
              "position": 39,
              "track": "top",
              "alpha": 11
            },
            {
              "source": "linked",
              "position": 66,
              "track": "top",
              "alpha": 2
            },
            {
              "source": "linked",
              "position": 66,
              "track": "bottom",
              "alpha": 12
            },
            {
              "source": "linked",
              "position": 72,
              "track": "top",
              "alpha": 12
            },
            {
              "source": "linked",
              "position": 72,
              "track": "bottom",
              "alpha": 100
            },
            {
              "source": "linked",
              "position": 75,
              "track": "top",
              "alpha": 100
            },
            {
              "source": "linked",
              "position": 75,
              "track": "bottom",
              "alpha": 48
            },
            {
              "source": "linked",
              "position": 78,
              "track": "bottom",
              "alpha": 42
            },
            {
              "source": "linked",
              "position": 78,
              "track": "top",
              "alpha": 25
            },
            {
              "source": "linked",
              "position": 100,
              "track": "top",
              "alpha": 18
            }
          ]
        },
        "highlight": {
          "angle": 135,
          "stops": [
            {
              "source": "custom",
              "position": 0,
              "track": "top",
              "color": "#f2ff00"
            },
            {
              "source": "custom",
              "position": 23,
              "track": "top",
              "color": "#f2ff00",
              "alpha": 37
            },
            {
              "source": "custom",
              "position": 59,
              "track": "top",
              "color": "#f2ff00",
              "alpha": 64
            },
            {
              "source": "custom",
              "position": 100,
              "track": "top",
              "color": "#f2ff00",
              "alpha": 37
            }
          ]
        },
        "quote": {
          "angle": 120,
          "stops": [
            {
              "source": "linked",
              "position": 0,
              "track": "top",
              "alpha": 28
            },
            {
              "source": "linked",
              "position": 4,
              "track": "top",
              "alpha": 50
            },
            {
              "source": "linked",
              "position": 4,
              "track": "top",
              "alpha": 30
            },
            {
              "source": "linked",
              "position": 70,
              "track": "top",
              "alpha": 20
            },
            {
              "source": "linked",
              "position": 70,
              "track": "bottom",
              "alpha": 40
            },
            {
              "source": "linked",
              "position": 100,
              "track": "top",
              "alpha": 10
            }
          ]
        },
        "background": {
          "angle": 90,
          "stops": [
            {
              "source": "linked",
              "position": 0,
              "track": "top",
              "alpha": 0
            },
            {
              "source": "linked",
              "position": 37,
              "track": "top",
              "alpha": 13
            },
            {
              "source": "linked",
              "position": 70,
              "track": "top",
              "alpha": 40
            },
            {
              "source": "linked",
              "position": 85,
              "track": "top",
              "alpha": 15
            },
            {
              "source": "linked",
              "position": 100,
              "track": "top",
              "alpha": 10
            }
          ]
        }
      },
      "tagColorAssignments": {
        "journal": {
          "type": "preset",
          "token": "acc-app-accent"
        }
      }
    }
  }
}`);
const PLUGIN_DEFAULT_THEME_SNAPSHOT = normalizeStoredThemeSnapshot(DEFAULT_THEME_EXPORT_SOURCE.theme?.snapshot || {});

function createPluginDefaultGradientState() {
  return cloneGradientState(PLUGIN_DEFAULT_THEME_SNAPSHOT.gradientState);
}

function createPluginDefaultTagColorAssignments() {
  return mergeStoredTagColors(PLUGIN_DEFAULT_THEME_SNAPSHOT.tagColorAssignments);
}

function createPluginDefaultSnapshot() {
  return {
    appearanceState: { ...PLUGIN_DEFAULT_THEME_SNAPSHOT.appearanceState },
    controlState: { ...PLUGIN_DEFAULT_THEME_SNAPSHOT.controlState },
    gradientState: createPluginDefaultGradientState(),
    tagColorAssignments: createPluginDefaultTagColorAssignments(),
  };
}

function applyPluginDefaultThemeToPanelState() {
  applyThemeSnapshotToPanelState(PLUGIN_DEFAULT_THEME_SNAPSHOT);
}

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
const CMDK_HASH_ICON_SELECTOR = [
  '.ls-icon-hash',
  '.ti-hash',
  '.icon-tabler-hash',
  '[data-icon="hash"]',
].join(', ');
const CMDK_SCOPE_SELECTOR = '.cp__cmdk, .cp__select-main, .cp__palette-main, [data-editor-popup-ref="page-search"]';
const CMDK_ROW_SELECTOR = '.cp__cmdk [data-cmdk-item], .cp__select-main [data-cmdk-item], .cp__palette-main [data-cmdk-item], [data-editor-popup-ref="page-search"] .menu-link';
const SIDEBAR_ROOT_SELECTOR = '.left-sidebar-inner';
const SIDEBAR_TITLE_SELECTOR = [
  `${SIDEBAR_ROOT_SELECTOR} .page-title`,
  `${SIDEBAR_ROOT_SELECTOR} a`,
].join(', ');
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
  workspaceCssText: "",
  workspaceCssLoadPromise: null,
  cssText: "",
  themeMode: "light",
  controlState: { ...PLUGIN_DEFAULT_THEME_SNAPSHOT.controlState },
  appearanceState: { ...PLUGIN_DEFAULT_THEME_SNAPSHOT.appearanceState },
  cssStats: {
    base: { lines: 0, chars: 0 },
    managed: { lines: 0, chars: 0 },
    total: { lines: 0, chars: 0 },
    sections: Object.fromEntries(APPEARANCE_SECTIONS.map((section) => [section.key, { lines: 0, chars: 0 }])),
  },
  gradientState: createPluginDefaultGradientState(),
  gradientSelections: Object.fromEntries(Object.keys(GRADIENT_AREAS).map((areaKey) => [areaKey, 0])),
  gradientDrag: null,
  colorDrag: null,
  suppressGradientClick: false,
  tagColorAssignments: createPluginDefaultTagColorAssignments(),
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
  savedThemes: [],
  selectedThemeId: "",
  themeDraftName: "",
  themeSavePending: false,
  themeLoadPending: false,
  themeDeletePending: false,
  themeTransferPending: false,
  loadedThemeId: "",
  loadedThemeSnapshotKey: "",
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
  undoStack: [],
  redoStack: [],
  activeHistorySources: new Set(),
  historyApplying: false,
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

  return textColumn.querySelector('.text-sm.font-medium.text-gray-12')
    || Array.from(textColumn.children).find((child) => child.matches?.('.text-sm.font-medium, .text-sm'))
    || Array.from(textColumn.children).find((child) => child.textContent?.trim())
    || textColumn;
}

function getCmdkInlineTagScanRoot(row) {
  return row.querySelector('.text-sm.font-medium.text-gray-12')
    || row.querySelector('.text-sm.font-medium')
    || getCmdkPrimaryLine(row)
    || row.querySelector('.flex-1')
    || row;
}

function getCmdkTagLabelElement(row) {
  const primaryLine = getCmdkPrimaryLine(row) || row.querySelector('.flex-1') || row;

  return primaryLine.querySelector('.flex.flex-row.items-center.gap-1')
    || primaryLine.querySelector('.flex.items-center.gap-2.flex-wrap')
    || primaryLine.querySelector('.flex.items-center.gap-2')
    || primaryLine.querySelector('[data-testid]')
    || primaryLine.querySelector('span')
    || primaryLine;
}

function getCmdkHashIconNode(row) {
  return row.querySelector(CMDK_HASH_ICON_SELECTOR);
}

function getCmdkTagIconElement(row) {
  return getCmdkHashIconNode(row)?.closest('div');
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
  if (!getCmdkHashIconNode(row)) {
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

function createCmdkInlineTagChip(hostDocument, displayTagName, tagName, contentNode = null) {
  const chip = hostDocument.createElement('span');
  const chipTheme = getCmdkTagThemeState(tagName);

  chip.setAttribute('data-degrande-inline-tag', tagName);
  if (contentNode) {
    chip.appendChild(contentNode);
  } else {
    chip.textContent = `#${displayTagName}`;
  }
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

function isInlineTagBoundaryCharacter(character) {
  return !character || /[\s,.;:!?()[\]{}"']/u.test(character);
}

function getCmdkInlineTagCandidates() {
  return Array.from(new Set(getKnownTagNames().filter(Boolean)))
    .sort((left, right) => right.length - left.length);
}

function getGenericCmdkInlineTagEnd(text, startIndex) {
  let index = startIndex + 1;
  let lastNonWhitespaceIndex = startIndex + 1;

  while (index < text.length) {
    const character = text[index];

    if (character === '#') {
      break;
    }

    if (/[,.;:!?()[\]{}"']/u.test(character)) {
      break;
    }

    if (character === '|' && /\s/u.test(text[index - 1] || '') && /\s/u.test(text[index + 1] || '')) {
      break;
    }

    if (!/\s/u.test(character)) {
      lastNonWhitespaceIndex = index + 1;
    }

    index += 1;
  }

  return lastNonWhitespaceIndex;
}

function collectCmdkInlineTagMatches(text) {
  const matches = [];
  const loweredText = String(text || '').toLowerCase();

  if (!loweredText.includes('#')) {
    return matches;
  }

  const knownTags = getCmdkInlineTagCandidates();

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== '#') {
      continue;
    }

    if (!isInlineTagBoundaryCharacter(text[index - 1] || '')) {
      continue;
    }

    const match = knownTags.find((candidate) => {
      const candidateLength = candidate.length;
      const candidateText = loweredText.slice(index + 1, index + 1 + candidateLength);

      if (candidateText !== candidate.toLowerCase()) {
        return false;
      }

      return isInlineTagBoundaryCharacter(text[index + 1 + candidateLength] || '');
    });

    if (!match) {
      const fallbackEnd = getGenericCmdkInlineTagEnd(text, index);
      const fallbackDisplayTagName = text.slice(index + 1, fallbackEnd).trim();

      if (!fallbackDisplayTagName) {
        continue;
      }

      matches.push({
        start: index,
        end: fallbackEnd,
        displayTagName: fallbackDisplayTagName,
        canonicalTagName: getCanonicalTagName(fallbackDisplayTagName),
      });
      index = fallbackEnd - 1;
      continue;
    }

    const end = index + 1 + match.length;
    matches.push({
      start: index,
      end,
      displayTagName: text.slice(index + 1, end),
      canonicalTagName: getCanonicalTagName(match),
    });
    index = end - 1;
  }

  return matches;
}

function collectInlineTagTextSegments(container, hostWindow) {
  const textNodes = [];
  const walker = container.ownerDocument.createTreeWalker(
    container,
    hostWindow.NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parentElement = node.parentElement;

        if (!node.nodeValue || !parentElement) {
          return hostWindow.NodeFilter.FILTER_REJECT;
        }

        if (parentElement.closest('[data-degrande-inline-tag], [data-degrande-search-tag-label], a.tag[data-ref]')) {
          return hostWindow.NodeFilter.FILTER_REJECT;
        }

        return hostWindow.NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let offset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const value = node.nodeValue || '';

    textNodes.push({
      node,
      start: offset,
      end: offset + value.length,
      value,
    });
    offset += value.length;
  }

  return textNodes;
}

function getTextPositionForOffset(segments, offset) {
  const safeOffset = Math.max(0, offset);

  for (const segment of segments) {
    if (safeOffset >= segment.start && safeOffset <= segment.end) {
      return {
        node: segment.node,
        offset: safeOffset - segment.start,
      };
    }
  }

  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) {
    return null;
  }

  return {
    node: lastSegment.node,
    offset: lastSegment.value.length,
  };
}

function syncInlineTagTextNodes(container) {
  if (!container) {
    return;
  }

  const hostDocument = container.ownerDocument;
  const hostWindow = hostDocument.defaultView || window;

  container.querySelectorAll('[data-degrande-inline-tag]').forEach((chip) => {
    syncCmdkInlineTagChip(chip);
  });

  // Iterate by parent block so we can scan across <mark> splits within the same line/cell.
  // Re-query each pass because replacements mutate the tree.
  const seenParents = new WeakSet();
  let safety = 0;

  while (safety < 50) {
    safety += 1;

    const candidateText = Array.from(
      container.querySelectorAll('*')
    ).find((element) => {
      if (seenParents.has(element)) {
        return false;
      }

      if (element.closest('[data-degrande-inline-tag], [data-degrande-search-tag-label], a.tag[data-ref]')) {
        return false;
      }

      // Skip wrappers whose children include block-level layout — only scan inline content.
      const hasBlockChild = Array.from(element.children).some((child) =>
        /^(DIV|UL|OL|LI|P|H[1-6]|SECTION|ARTICLE|HEADER|FOOTER|NAV|TABLE)$/i.test(child.tagName)
      );
      if (hasBlockChild) {
        return false;
      }

      const text = element.textContent || '';
      if (!text.includes('#')) {
        return false;
      }

      const matches = collectCmdkInlineTagMatches(text);
      return matches.length > 0;
    });

    if (!candidateText) {
      break;
    }

    seenParents.add(candidateText);

    const replaced = replaceInlineTagsInElement(candidateText, hostDocument, hostWindow);

    if (!replaced) {
      // No replacement actually applied (e.g. matches collided with chip boundary). Move on.
      continue;
    }
  }
}

function replaceInlineTagsInElement(element, hostDocument, hostWindow) {
  let appliedAny = false;
  let safety = 0;

  while (safety < 100) {
    safety += 1;

    const segments = [];
    let combined = '';
    const walker = hostDocument.createTreeWalker(
      element,
      hostWindow.NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;

          if (!node.nodeValue || !parent) {
            return hostWindow.NodeFilter.FILTER_REJECT;
          }

          if (parent.closest('[data-degrande-inline-tag], [data-degrande-search-tag-label], a.tag[data-ref]')) {
            return hostWindow.NodeFilter.FILTER_REJECT;
          }

          return hostWindow.NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.nodeValue || '';

      segments.push({ node, start: combined.length, end: combined.length + value.length });
      combined += value;
    }

    if (!segments.length) {
      return appliedAny;
    }

    const matches = collectCmdkInlineTagMatches(combined);

    if (!matches.length) {
      return appliedAny;
    }

    const match = matches[0];
    const startPos = locateOffset(segments, match.start);
    const endPos = locateOffset(segments, match.end);

    if (!startPos || !endPos) {
      return appliedAny;
    }

    let inserted = false;

    try {
      const range = hostDocument.createRange();
      range.setStart(startPos.node, startPos.offset);
      range.setEnd(endPos.node, endPos.offset);

      if (!element.contains(range.commonAncestorContainer)) {
        return appliedAny;
      }

      const fragment = range.extractContents();
      const chip = createCmdkInlineTagChip(
        hostDocument,
        match.displayTagName,
        match.canonicalTagName,
        fragment
      );
      range.insertNode(chip);
      inserted = true;
      appliedAny = true;
    } catch (rangeError) {
      // If Range manipulation fails for any reason, stop to avoid an infinite loop.
      return appliedAny;
    }

    if (!inserted) {
      return appliedAny;
    }
  }

  return appliedAny;
}

function locateOffset(segments, offset) {
  for (const segment of segments) {
    if (offset >= segment.start && offset <= segment.end) {
      return { node: segment.node, offset: offset - segment.start };
    }
  }

  const last = segments[segments.length - 1];
  if (!last) return null;
  return { node: last.node, offset: last.node.nodeValue?.length || 0 };
}

// CSS Custom Highlights API path: lets us color inline tag text inside
// React-managed surfaces (page-search popover) without mutating the DOM, so
// React's reconciliation never sees orphaned text nodes (the cause of the
// removeChild crash that splicing chips would trigger).
const HIGHLIGHT_RANGES_KEY = '__degrandeColorsInlineHighlightRanges';
const HIGHLIGHT_REGISTRY_KEY = '__degrandeColorsInlineHighlightRegistry';
const HIGHLIGHT_NAME_PREFIX = 'degrande-inline-';
const HIGHLIGHT_STYLE_ELEMENT_ID = 'degrande-colors-inline-tag-highlights';

function slugifyTagForHighlight(tagName) {
  return String(tagName || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untagged';
}

function getInlineTagHighlightSupported(hostWindow) {
  return Boolean(hostWindow?.CSS?.highlights && typeof hostWindow.Highlight === 'function');
}

function getInlineTagHighlight(hostWindow, canonicalTagName) {
  if (!getInlineTagHighlightSupported(hostWindow)) {
    return null;
  }

  let registry = hostWindow[HIGHLIGHT_REGISTRY_KEY];
  if (!registry) {
    registry = new Map();
    hostWindow[HIGHLIGHT_REGISTRY_KEY] = registry;
  }

  const slug = slugifyTagForHighlight(canonicalTagName);
  const name = HIGHLIGHT_NAME_PREFIX + slug;

  let highlight = registry.get(name);
  if (!highlight) {
    highlight = new hostWindow.Highlight();
    registry.set(name, highlight);
    try {
      hostWindow.CSS.highlights.set(name, highlight);
    } catch (registerError) {
      registry.delete(name);
      return null;
    }
  }

  return highlight;
}

function getInlineTagHighlightTracker(hostWindow) {
  let tracker = hostWindow[HIGHLIGHT_RANGES_KEY];
  if (!tracker) {
    tracker = new WeakMap();
    hostWindow[HIGHLIGHT_RANGES_KEY] = tracker;
  }
  return tracker;
}

function clearInlineTagHighlightsForRoot(scanRoot, hostWindow) {
  if (!getInlineTagHighlightSupported(hostWindow)) {
    return;
  }
  const tracker = getInlineTagHighlightTracker(hostWindow);
  const previous = tracker.get(scanRoot);
  if (!previous || !previous.length) {
    return;
  }
  previous.forEach(({ highlight, range }) => {
    try { highlight.delete(range); } catch (_) { /* ignore */ }
  });
  tracker.delete(scanRoot);
}

function paintInlineTagHighlights(scanRoot, hostWindow) {
  if (!scanRoot || !getInlineTagHighlightSupported(hostWindow)) {
    return false;
  }

  const hostDocument = scanRoot.ownerDocument;
  if (!hostDocument) {
    return false;
  }

  clearInlineTagHighlightsForRoot(scanRoot, hostWindow);

  const tracker = getInlineTagHighlightTracker(hostWindow);
  const tracked = [];

  let walker;
  try {
    walker = hostDocument.createTreeWalker(
      scanRoot,
      hostWindow.NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const value = node.nodeValue;
          if (!value || !value.includes('#')) {
            return hostWindow.NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) {
            return hostWindow.NodeFilter.FILTER_REJECT;
          }
          // Skip nodes inside real tag links, existing chips, code, scripts.
          if (parent.closest(
            'a.tag[data-ref], [data-degrande-inline-tag], [data-degrande-search-tag-label], code, pre, script, style'
          )) {
            return hostWindow.NodeFilter.FILTER_REJECT;
          }
          return hostWindow.NodeFilter.FILTER_ACCEPT;
        },
      }
    );
  } catch (walkerError) {
    return false;
  }

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const value = node.nodeValue || '';
    let matches;
    try {
      matches = collectCmdkInlineTagMatches(value);
    } catch (matchError) {
      continue;
    }
    if (!matches || !matches.length) {
      continue;
    }
    for (const match of matches) {
      if (!match.canonicalTagName || !isKnownCmdkInlineTag(match.canonicalTagName)) {
        continue;
      }
      const highlight = getInlineTagHighlight(hostWindow, match.canonicalTagName);
      if (!highlight) {
        continue;
      }
      let range;
      try {
        range = hostDocument.createRange();
        range.setStart(node, match.start);
        range.setEnd(node, match.end);
        highlight.add(range);
      } catch (rangeError) {
        continue;
      }
      tracked.push({ highlight, range });
    }
  }

  if (tracked.length) {
    tracker.set(scanRoot, tracked);
    // Emit the ::highlight() rules lazily, only for tags we just registered
    // ranges for. The boot-time always-on rule list was the dominant cost.
    syncInlineTagHighlightStyle();
  }
  return true;
}

function buildInlineTagHighlightCss() {
  // Perf: only emit ::highlight() rules for tags that currently have live
  // Range objects registered with CSS.highlights. Emitting one rule per
  // *known* tag (used to be ~150 rules / 13KB) made every host
  // Recalculate Style pass evaluate the Highlights API against every
  // styled element and was the dominant cost for toolbar / Ctrl+K /
  // [[autocomplete]] interactions even when no popover was open.
  const hostWindow = getHostWindow();
  const registry = hostWindow?.[HIGHLIGHT_REGISTRY_KEY];
  if (!registry || !registry.size) {
    return '';
  }
  const rules = [];
  registry.forEach((highlight, name) => {
    if (!highlight || typeof highlight.size !== 'number' || highlight.size === 0) {
      return;
    }
    if (!name || !name.startsWith(HIGHLIGHT_NAME_PREFIX)) {
      return;
    }
    const slug = name.slice(HIGHLIGHT_NAME_PREFIX.length);
    // Recover canonical tag from registered tags by reverse-lookup of slug.
    let canonical = null;
    for (const tagName of getKnownTagNames()) {
      if (slugifyTagForHighlight(getCanonicalTagName(tagName)) === slug) {
        canonical = getCanonicalTagName(tagName);
        break;
      }
    }
    if (!canonical) {
      return;
    }
    const theme = getCmdkTagThemeState(canonical);
    if (!theme || !theme.theme) {
      return;
    }
    rules.push(
      `::highlight(${name}) {\n` +
      `  background-color: ${theme.theme.background};\n` +
      `  color: ${theme.theme.color};\n` +
      `}`
    );
  });
  return rules.join('\n');
}

function syncInlineTagHighlightStyle() {
  try {
    setHostStyleText(HIGHLIGHT_STYLE_ELEMENT_ID, buildInlineTagHighlightCss());
  } catch (_) {
    // ignore — host document may not be accessible (packaged plugin)
  }
}

// React-safe DOM mutation for the [[name]] page-search popover.
//
// The previous splicing approach used Range.extractContents() which REMOVED
// the React-tracked text node from its parent, causing crashes when React
// later called parent.removeChild(originalNode) on unmount.
//
// This approach uses Text.splitText() instead. splitText() keeps the original
// text node in place (just shortens its nodeValue) and inserts NEW text nodes
// next to it. The React-tracked node never leaves its parent. Only the
// newly-created sibling nodes (which React knows nothing about) get wrapped
// in our chip span.
//
// Cleanup merges chip text back into the original node by mutating its
// nodeValue (safe — React doesn't track text values defensively) and removes
// only the nodes we created.
function cleanupInlineTagChipsInRoot(scanRoot) {
  if (!scanRoot) {
    return;
  }
  let chips;
  try {
    chips = scanRoot.querySelectorAll('[data-degrande-popover-chip]');
  } catch (_) {
    return;
  }
  chips.forEach((chip) => {
    try {
      const inner = chip.firstChild;
      const innerText = (inner && inner.nodeType === 3)
        ? (inner.nodeValue || '')
        : (chip.textContent || '');
      const prev = chip.previousSibling;
      const next = chip.nextSibling;
      const parent = chip.parentNode;

      // Best effort: merge chip + trailing text node back into preceding
      // text node so the row text reads naturally again.
      if (prev && prev.nodeType === 3 && parent) {
        let merged = (prev.nodeValue || '') + innerText;
        if (next && next.nodeType === 3 && next.parentNode === parent) {
          merged += (next.nodeValue || '');
          try { parent.removeChild(next); } catch (_) {}
        }
        try { prev.nodeValue = merged; } catch (_) {}
      }

      if (parent) {
        try { parent.removeChild(chip); } catch (_) {}
      }
    } catch (_) {
      // ignore — best effort cleanup
    }
  });
}

function paintInlineTagChipsViaSplit(scanRoot, hostDocument, hostWindow) {
  if (!scanRoot || !hostDocument || !hostWindow) {
    return false;
  }

  // Clear any prior chips and any prior highlights for this scanRoot so the
  // two paint paths don't double-render.
  cleanupInlineTagChipsInRoot(scanRoot);
  try {
    clearInlineTagHighlightsForRoot(scanRoot, hostWindow);
  } catch (_) {}

  let walker;
  try {
    walker = hostDocument.createTreeWalker(
      scanRoot,
      hostWindow.NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const value = node.nodeValue;
          if (!value || !value.includes('#')) {
            return hostWindow.NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) {
            return hostWindow.NodeFilter.FILTER_REJECT;
          }
          if (parent.closest(
            'a.tag[data-ref], [data-degrande-inline-tag], [data-degrande-search-tag-label], [data-degrande-popover-chip], code, pre, script, style'
          )) {
            return hostWindow.NodeFilter.FILTER_REJECT;
          }
          return hostWindow.NodeFilter.FILTER_ACCEPT;
        },
      }
    );
  } catch (_) {
    return false;
  }

  // Collect first; do not mutate during walking.
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  let anySuccess = false;

  for (const node of textNodes) {
    const value = node.nodeValue || '';
    let matches;
    try {
      matches = collectCmdkInlineTagMatches(value);
    } catch (_) {
      continue;
    }
    if (!matches || !matches.length) {
      continue;
    }

    // Process right-to-left so earlier offsets remain valid as we splitText.
    matches.sort((a, b) => b.start - a.start);

    for (const match of matches) {
      if (!match.canonicalTagName || !isKnownCmdkInlineTag(match.canonicalTagName)) {
        continue;
      }
      const themeState = getCmdkTagThemeState(match.canonicalTagName);
      if (!themeState || !themeState.theme) {
        continue;
      }

      try {
        // node currently holds the (possibly already shortened) prefix that
        // still includes this match. splitText keeps `node` as the part
        // BEFORE match.start and returns a new text node containing match
        // and everything after.
        const tagAndRest = node.splitText(match.start);
        // Now isolate just the tag substring; afterTag = text following tag.
        tagAndRest.splitText(match.end - match.start);

        // Wrap tagAndRest (the brand-new tag-only text node) in a span chip.
        // tagAndRest is NOT React-tracked — we just created it via splitText.
        const span = hostDocument.createElement('span');
        span.setAttribute('data-degrande-popover-chip', match.canonicalTagName);
        const t = themeState.theme;
        span.style.setProperty('background-color', t.background);
        span.style.setProperty('color', t.color);
        span.style.setProperty('border', `1px solid ${t.borderColor}`);
        span.style.setProperty('border-radius', '6px');
        span.style.setProperty('padding', '0 5px');
        span.style.setProperty('font-size', '0.82em');
        span.style.setProperty('line-height', '1.25');
        span.style.setProperty('white-space', 'nowrap');
        span.style.setProperty('vertical-align', 'baseline');

        const parent = tagAndRest.parentNode;
        if (parent) {
          parent.insertBefore(span, tagAndRest);
          span.appendChild(tagAndRest);
          anySuccess = true;
        }
      } catch (_) {
        // Stop processing this text node; another may still succeed.
        break;
      }
    }
  }

  return anySuccess;
}

function syncCmdkInlineTags(row) {
  const scanRoot = getCmdkInlineTagScanRoot(row);

  if (!scanRoot) {
    return;
  }

  if (getCmdkHashIconNode(row)) {
    scanRoot.querySelectorAll('[data-degrande-inline-tag]').forEach((chip) => {
      syncCmdkInlineTagChip(chip);
    });
    return;
  }

  // Do NOT use Range.extractContents()/insertNode() inside the React-managed
  // page-search popover ([[name]] autocomplete) — that REMOVES the React-
  // tracked text node from its parent and crashes the editor on unmount.
  //
  // Instead try Text.splitText()-based wrapping first (keeps the original
  // text node in place; only newly-created sibling nodes are wrapped). If
  // any split throws, fall back to the CSS Custom Highlights API which
  // paints over Range objects without any DOM mutation.
  if (row.closest && row.closest('[data-editor-popup-ref="page-search"]')) {
    const hostWindow = scanRoot.ownerDocument?.defaultView || window;
    const hostDocument = scanRoot.ownerDocument;
    let chipPainted = false;
    try {
      chipPainted = paintInlineTagChipsViaSplit(scanRoot, hostDocument, hostWindow);
    } catch (_) {
      chipPainted = false;
    }
    if (!chipPainted) {
      paintInlineTagHighlights(scanRoot, hostWindow);
    }
    return;
  }

  syncInlineTagTextNodes(scanRoot);
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
  const hostWindow = getHostWindow();
  const diag = { ts: Date.now(), version: PLUGIN_VERSION, docs: 0, rows: 0, marked: 0, errors: [] };

  syncInlineTagHighlightStyle();

  try {
    getObservableHostDocuments().forEach((hostDocument) => {
      const docWindow = hostDocument.defaultView || window;

      if (!hostDocument.querySelector(CMDK_SCOPE_SELECTOR)) {
        return;
      }

      diag.docs += 1;

      collectMatchingElements(hostDocument, CMDK_ROW_SELECTOR, docWindow).forEach((row) => {
        if (!(row instanceof docWindow.Element)) {
          return;
        }

        diag.rows += 1;

        try {
          syncCmdkTagRow(row);
          syncCmdkInlineTags(row);

          if (row.querySelector('[data-degrande-inline-tag], [data-degrande-search-tag-label]')) {
            diag.marked += 1;
          }
        } catch (rowError) {
          diag.errors.push(String(rowError && rowError.stack || rowError));
        }
      });
    });
  } catch (outerError) {
    diag.errors.push('outer:' + String(outerError && outerError.stack || outerError));
  }

  try {
    hostWindow.__degrandeColorsCmdkDiag = diag;
  } catch (assignError) {
    // Ignore if host window is not writable.
  }
}

function runCmdkSyncNow() {
  scheduleCmdkTagStyleSync();
  return getHostWindow().__degrandeColorsCmdkDiag || null;
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

  if (candidate.matches(CMDK_SCOPE_SELECTOR)) {
    return true;
  }

  if (candidate.closest(CMDK_SCOPE_SELECTOR)) {
    return true;
  }

  return Boolean(candidate.querySelector(CMDK_SCOPE_SELECTOR));
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
      let shouldSync = false;

      mutations.forEach((mutation) => {
        if (!shouldSync && nodeTouchesCmdk(mutation.target, documentWindow)) {
          shouldSync = true;
        }

        Array.from(mutation.addedNodes || []).forEach((node) => {
          if (!shouldSync && nodeTouchesCmdk(node, documentWindow)) {
            shouldSync = true;
          }
        });
      });

      if (shouldSync) {
        scheduleCmdkTagStyleSync();
      }
    });

    observer.observe(hostDocument.body || hostDocument.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
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

async function loadWorkspaceCss(forceReload = false) {
  if (!forceReload) {
    if (panelState.workspaceCssText) {
      return panelState.workspaceCssText;
    }

    if (panelState.workspaceCssLoadPromise) {
      return panelState.workspaceCssLoadPromise;
    }
  }

  const cssUrl = typeof logseq.resolveResourceFullUrl === "function"
    ? logseq.resolveResourceFullUrl("custom.css")
    : "./custom.css";

  panelState.workspaceCssLoadPromise = fetch(cssUrl, { cache: forceReload ? "no-store" : "default" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load custom.css (${response.status})`);
      }

      return response.text();
    })
    .then((cssText) => {
      panelState.workspaceCssText = cssText;
      return cssText;
    })
    .finally(() => {
      panelState.workspaceCssLoadPromise = null;
    });

  return panelState.workspaceCssLoadPromise;
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
  if (getControlType(control) === "string") {
    return String(value || "");
  }

  if (getControlType(control) === "boolean") {
    return value ? "On" : "Off";
  }

  if (getControlType(control) === "color") {
    return normalizeHexColor(value) || String(value || "");
  }

  if (control.step < 1) {
    return `${Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}${control.unit}`;
  }

  return `${Math.round(value)}${control.unit}`;
}

function getControlType(control) {
  return control?.type || "number";
}

function normalizeBooleanControlValue(value, fallbackValue = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return Boolean(fallbackValue);
}

function normalizeStoredControlValue(control, rawValue) {
  if (rawValue == null) {
    return control.defaultValue;
  }

  if (getControlType(control) === "color") {
    return normalizeHexColor(rawValue) || control.defaultValue;
  }

  if (getControlType(control) === "string") {
    return String(rawValue || control.defaultValue || "");
  }

  if (getControlType(control) === "boolean") {
    return normalizeBooleanControlValue(rawValue, control.defaultValue);
  }

  const nextValue = Number(rawValue);
  return Number.isFinite(nextValue) ? nextValue : control.defaultValue;
}

function migrateLegacyBorderSideWidths(merged, saved) {
  for (const group of Object.values(BORDER_CONTROL_GROUPS)) {
    if (!group.sideWidthKeys || saved?.[group.widthKey] == null) {
      continue;
    }

    for (const controlKey of Object.values(group.sideWidthKeys)) {
      if (saved?.[controlKey] != null) {
        continue;
      }

      const control = CONTROL_MAP[controlKey];

      if (!control) {
        continue;
      }

      merged[controlKey] = normalizeStoredControlValue(control, saved[group.widthKey]);
    }
  }

  return merged;
}

function getBorderControlGroup(groupKey) {
  return typeof groupKey === "string" ? BORDER_CONTROL_GROUPS[groupKey] : groupKey;
}

function getBorderControlColor(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "#00000000";
  }

  const mode = String(panelState.controlState[group.modeKey] || "custom");
  const token = String(panelState.controlState[group.tokenKey] || "");
  const opacity = getBorderOpacity(group);

  let colorValue = normalizeHexColor(panelState.controlState[group.colorKey]) || "#00000000";

  if (mode === "linked") {
    colorValue = getBorderLinkedPreviewColor(group);
  } else if (mode === "preset" && COLOR_PRESET_MAP[token]) {
    colorValue = getPreviewGradientFallbackColor(token);
  }

  return applyColorOpacity(colorValue, opacity);
}

function getBorderRuntimeColor(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "transparent";
  }

  const mode = String(panelState.controlState[group.modeKey] || "custom");
  const token = String(panelState.controlState[group.tokenKey] || "");
  const opacity = getBorderOpacity(group);

  let colorValue = normalizeHexColor(panelState.controlState[group.colorKey]) || "transparent";

  if (mode === "linked") {
    colorValue = getBorderLinkedRuntimeColor(group);
  } else if (mode === "preset" && COLOR_PRESET_MAP[token]) {
    colorValue = `var(--bd-${token})`;
  }

  return applyColorOpacity(colorValue, opacity);
}

function getBorderLinkedPreviewColor(groupKey) {
  const group = getBorderControlGroup(groupKey);
  return group ? getGradientPreviewLinkedColor(group.key) : "transparent";
}

function getBorderLinkedRuntimeColor(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "transparent";
  }

  if (group.key === "node" || group.key === "title") {
    return "var(--node-color)";
  }

  if (group.key === "highlight") {
    return "var(--ctl-highlight-color)";
  }

  if (group.key === "quote") {
    return "var(--ctl-quote-color)";
  }

  if (group.key === "background") {
    return "var(--ctl-bg-sweep-color)";
  }

  return "transparent";
}

function getBorderColorMode(groupKey) {
  const group = getBorderControlGroup(groupKey);
  return group ? String(panelState.controlState[group.modeKey] || "custom") : "custom";
}

function getBorderColorToken(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "";
  }

  const token = String(panelState.controlState[group.tokenKey] || "");
  return COLOR_PRESET_MAP[token] ? token : String(CONTROL_MAP[group.tokenKey]?.defaultValue || "grey");
}

function getBorderOpacity(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group?.opacityKey) {
    return 1;
  }

  const rawValue = Number(panelState.controlState[group.opacityKey]);
  return clamp(Number.isFinite(rawValue) ? rawValue / 100 : 1, 0, 1);
}

function applyColorOpacity(colorValue, opacityMultiplier = 1) {
  const normalizedValue = typeof colorValue === "string" ? colorValue.trim() : "";
  const opacity = clamp(Number(opacityMultiplier ?? 1), 0, 1);

  if (!normalizedValue || opacity <= 0 || normalizedValue.toLowerCase() === "transparent") {
    return "transparent";
  }

  const parsedColor = parseCssColorValue(normalizedValue);

  if (parsedColor) {
    const baseAlpha = Number.isFinite(parsedColor.a) ? parsedColor.a : 1;
    return rgbToCss(parsedColor, clamp(baseAlpha * opacity, 0, 1));
  }

  if (opacity >= 0.999) {
    return normalizedValue;
  }

  const percent = Math.round(opacity * 1000) / 10;
  return `color-mix(in srgb, ${normalizedValue} ${percent}%, transparent)`;
}

function getBorderSideWidths(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const width = Number(panelState.controlState[group.widthKey]) || 0;
  const getSideWidth = (sideName) => {
    const controlKey = group.sideWidthKeys?.[sideName];
    const sideWidth = Number(panelState.controlState[controlKey]);
    return Number.isFinite(sideWidth) ? sideWidth : width;
  };

  return {
    top: panelState.controlState[group.sideKeys.top] ? getSideWidth("top") : 0,
    right: panelState.controlState[group.sideKeys.right] ? getSideWidth("right") : 0,
    bottom: panelState.controlState[group.sideKeys.bottom] ? getSideWidth("bottom") : 0,
    left: panelState.controlState[group.sideKeys.left] ? getSideWidth("left") : 0,
  };
}

function buildBorderWidthShorthand(groupKey) {
  const widths = getBorderSideWidths(groupKey);
  return `${widths.top}px ${widths.right}px ${widths.bottom}px ${widths.left}px`;
}

function buildBorderWidthDeclarations(groupKey, suffix = "") {
  return `border-width: ${buildBorderWidthShorthand(groupKey)}${suffix}`;
}

function getBorderRadiusValues(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
  }

  const radius = Number(panelState.controlState[group.radiusKey]) || 0;

  return {
    topLeft: panelState.controlState[group.cornerKeys.topLeft] ? radius : 0,
    topRight: panelState.controlState[group.cornerKeys.topRight] ? radius : 0,
    bottomRight: panelState.controlState[group.cornerKeys.bottomRight] ? radius : 0,
    bottomLeft: panelState.controlState[group.cornerKeys.bottomLeft] ? radius : 0,
  };
}

function buildBorderRadiusShorthand(groupKey) {
  const values = getBorderRadiusValues(groupKey);
  return `${values.topLeft}px ${values.topRight}px ${values.bottomRight}px ${values.bottomLeft}px`;
}

function buildBorderRadiusDeclarations(groupKey, suffix = "") {
  return `border-radius: ${buildBorderRadiusShorthand(groupKey)}${suffix}`;
}

function getEnabledBorderCornerCount(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return 0;
  }

  return Object.values(group.cornerKeys).reduce((count, controlKey) => count + (panelState.controlState[controlKey] ? 1 : 0), 0);
}

function getEnabledBorderSideCount(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return 0;
  }

  return Object.values(group.sideKeys).reduce((count, controlKey) => count + (panelState.controlState[controlKey] ? 1 : 0), 0);
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

  captureHistorySnapshot(`tag-preset:${tagName}`);
  panelState.selectedTag = tagName;
  panelState.tagColorAssignments[tagName.toLowerCase()] = {
    type: "preset",
    token,
  };
  void applyManagedOverrides(false, statusMessage || `Set ${tagName} to ${token}`);
  schedulePersistTagColors([tagName]);
  finishHistoryCapture(`tag-preset:${tagName}`);
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

  captureHistorySnapshot(`clear-tag:${tagName}`);
  delete panelState.tagColorAssignments[tagName.toLowerCase()];
  void applyManagedOverrides(false, statusMessage || `Reset ${tagName} to the default color`);
  schedulePersistTagColors([tagName]);
  finishHistoryCapture(`clear-tag:${tagName}`);
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

  captureHistorySnapshot("random-tag-colors");
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
  finishHistoryCapture("random-tag-colors");
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
  return `${themePrefix}:where(.cp__cmdk, .cp__select-main, .cp__palette-main, [data-editor-popup-ref="page-search"]) a.tag[data-ref]`;
}

function buildGroupedTagChipSelectors(tagNames, themePrefix = "") {
  return tagNames.flatMap((tagName) => {
    const escapedTagName = escapeAttributeValue(tagName);

    return [
      `${themePrefix}a.tag[data-ref="${escapedTagName}" i]`,
      `${themePrefix}a.tag[data-ref="${escapedTagName}" i]:hover`,
      `${themePrefix}:where(.cp__cmdk, .cp__select-main, .cp__palette-main, [data-editor-popup-ref="page-search"]) a.tag[data-ref="${escapedTagName}" i]`,
      `${themePrefix}:where(.cp__cmdk, .cp__select-main, .cp__palette-main, [data-editor-popup-ref="page-search"]) a.tag[data-ref="${escapedTagName}" i]:hover`,
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

  captureHistorySnapshot(`copy-tag-colors:${panelState.selectedTag}`);
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
  finishHistoryCapture(`copy-tag-colors:${panelState.selectedTag}`);
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

    merged[control.key] = normalizeStoredControlValue(control, saved[control.key]);
  }

  return migrateLegacyBorderSideWidths(merged, saved);
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

function normalizeThemeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

function buildThemeId(name) {
  return normalizeThemeName(name).toLowerCase();
}

function getNextAvailableThemeName(name, occupiedIds = new Set()) {
  const baseName = normalizeThemeName(name) || "Theme";
  let candidateName = baseName;
  let candidateId = buildThemeId(candidateName);
  let suffix = 2;

  while (!candidateId || occupiedIds.has(candidateId)) {
    candidateName = `${baseName} ${suffix}`;
    candidateId = buildThemeId(candidateName);
    suffix += 1;
  }

  return candidateName;
}

function createThemeSnapshot() {
  return {
    appearanceState: { ...panelState.appearanceState },
    controlState: { ...panelState.controlState },
    gradientState: cloneGradientState(panelState.gradientState),
    tagColorAssignments: mergeStoredTagColors(panelState.tagColorAssignments),
  };
}

function getThemeSnapshotKey(snapshot = {}) {
  return JSON.stringify(normalizeStoredThemeSnapshot(snapshot));
}

function findThemeBySnapshotKey(snapshotKey) {
  if (!snapshotKey) {
    return null;
  }

  return panelState.savedThemes.find((theme) => getThemeSnapshotKey(theme.snapshot) === snapshotKey) || null;
}

function setLoadedThemeState(theme = null, snapshot = null) {
  const resolvedTheme = theme && typeof theme === "object"
    ? theme
    : panelState.savedThemes.find((entry) => entry.id === String(theme || "")) || null;

  panelState.loadedThemeId = resolvedTheme?.id || "";
  panelState.loadedThemeSnapshotKey = resolvedTheme ? getThemeSnapshotKey(snapshot || resolvedTheme.snapshot) : "";
}

function getLoadedThemeStatus() {
  const currentSnapshotKey = getThemeSnapshotKey(createThemeSnapshot());
  const loadedTheme = panelState.savedThemes.find((theme) => theme.id === panelState.loadedThemeId) || null;
  const currentTheme = findThemeBySnapshotKey(currentSnapshotKey)
    || (loadedTheme && panelState.loadedThemeSnapshotKey === currentSnapshotKey ? loadedTheme : null);
  const isDirty = Boolean(
    loadedTheme
    && panelState.loadedThemeSnapshotKey
    && panelState.loadedThemeSnapshotKey !== currentSnapshotKey
    && !currentTheme
  );

  return {
    currentTheme,
    loadedTheme,
    isDirty,
    dirtyThemeId: isDirty ? loadedTheme.id : "",
  };
}

function normalizeStoredThemeSnapshot(snapshot = {}) {
  return {
    appearanceState: mergeStoredAppearanceState(snapshot.appearanceState),
    controlState: mergeStoredControls(snapshot.controlState),
    gradientState: mergeStoredGradients(snapshot.gradientState),
    tagColorAssignments: mergeStoredTagColors(snapshot.tagColorAssignments),
  };
}

function normalizeStoredThemeEntry(rawTheme, index = 0) {
  const fallbackName = `Theme ${index + 1}`;
  const name = normalizeThemeName(rawTheme?.name || fallbackName) || fallbackName;
  const id = String(rawTheme?.id || buildThemeId(name) || `theme-${index + 1}`);
  const createdAt = Number(rawTheme?.createdAt) || Date.now();
  const updatedAt = Number(rawTheme?.updatedAt) || createdAt;

  return {
    id,
    name,
    createdAt,
    updatedAt,
    snapshot: normalizeStoredThemeSnapshot(rawTheme?.snapshot || rawTheme),
  };
}

function mergeStoredThemes(saved) {
  const source = Array.isArray(saved)
    ? saved
    : Array.isArray(saved?.themes)
      ? saved.themes
      : [];
  const seenIds = new Set();

  return source.reduce((themes, rawTheme, index) => {
    const theme = normalizeStoredThemeEntry(rawTheme, index);

    if (!theme.id || seenIds.has(theme.id)) {
      return themes;
    }

    seenIds.add(theme.id);
    themes.push(theme);
    return themes;
  }, []).sort((left, right) => right.updatedAt - left.updatedAt || left.name.localeCompare(right.name));
}

function getThemeLibrarySnapshot() {
  return JSON.stringify(panelState.savedThemes);
}

function buildThemeExportPayload(theme) {
  return {
    format: THEME_EXPORT_FORMAT,
    version: 1,
    pluginVersion: PLUGIN_VERSION,
    exportedAt: Date.now(),
    theme: normalizeStoredThemeEntry(theme, 0),
  };
}

function buildThemeExportFileName(theme) {
  const slug = String(theme?.name || "degrande-theme")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "degrande-theme";

  return `${slug}.degrande-theme.json`;
}

function parseImportedThemes(rawText) {
  const parsed = JSON.parse(String(rawText || ""));
  const themes = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.themes)
      ? parsed.themes
      : parsed?.theme && typeof parsed.theme === "object"
        ? [parsed.theme]
        : parsed && typeof parsed === "object" && (parsed.name || parsed.id || parsed.snapshot)
          ? [parsed]
          : [];
  const mergedThemes = mergeStoredThemes(themes);

  if (!mergedThemes.length) {
    throw new Error("No themes found in import payload.");
  }

  return mergedThemes;
}

function makeImportedThemesUnique(importedThemes, existingThemes = []) {
  const occupiedIds = new Set((Array.isArray(existingThemes) ? existingThemes : [])
    .map((theme) => buildThemeId(theme?.name || theme?.id || ""))
    .filter(Boolean));

  return (Array.isArray(importedThemes) ? importedThemes : []).map((theme, index) => {
    const normalizedTheme = normalizeStoredThemeEntry(theme, index);
    const nextName = getNextAvailableThemeName(normalizedTheme.name, occupiedIds);
    const nextTheme = nextName === normalizedTheme.name
      ? normalizedTheme
      : {
        ...normalizedTheme,
        id: buildThemeId(nextName),
        name: nextName,
      };

    occupiedIds.add(nextTheme.id);
    return nextTheme;
  });
}

function downloadThemeExport(theme) {
  const payload = JSON.stringify(buildThemeExportPayload(theme), null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = buildThemeExportFileName(theme);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function getSelectedThemeEntry() {
  return panelState.savedThemes.find((theme) => theme.id === panelState.selectedThemeId) || null;
}

function syncSelectedThemeState(options = {}) {
  const preferredId = String(options.preferredId ?? panelState.selectedThemeId ?? "");
  const preferredName = normalizeThemeName(options.preferredName ?? panelState.themeDraftName);
  const shouldSyncDraftName = options.syncDraftName ?? !normalizeThemeName(panelState.themeDraftName);
  let selectedTheme = panelState.savedThemes.find((theme) => theme.id === preferredId) || null;

  if (!selectedTheme && preferredName) {
    const preferredThemeId = buildThemeId(preferredName);

    selectedTheme = panelState.savedThemes.find((theme) => (
      theme.id === preferredThemeId || theme.name.toLowerCase() === preferredName.toLowerCase()
    )) || null;
  }

  if (selectedTheme) {
    panelState.selectedThemeId = selectedTheme.id;

    if (shouldSyncDraftName) {
      panelState.themeDraftName = selectedTheme.name;
    }

    return selectedTheme;
  }

  panelState.selectedThemeId = panelState.savedThemes[0]?.id || "";

  selectedTheme = getSelectedThemeEntry();

  if (selectedTheme && shouldSyncDraftName) {
    panelState.themeDraftName = selectedTheme.name;
  }

  return selectedTheme;
}

function formatThemeTimestamp(timestamp) {
  const date = new Date(Number(timestamp) || Date.now());
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

function applyThemeSnapshotToPanelState(snapshot) {
  const normalizedSnapshot = normalizeStoredThemeSnapshot(snapshot);
  const assignedTagNames = Object.keys(normalizedSnapshot.tagColorAssignments)
    .map((tagName) => getCanonicalTagName(tagName))
    .filter(Boolean);

  panelState.appearanceState = normalizedSnapshot.appearanceState;
  panelState.controlState = normalizedSnapshot.controlState;
  panelState.gradientState = normalizedSnapshot.gradientState;
  panelState.tagColorAssignments = normalizedSnapshot.tagColorAssignments;
  panelState.tags = dedupeTagNames([
    ...panelState.tags,
    ...assignedTagNames,
  ]);
  assignedTagNames.forEach((tagName) => {
    const normalized = String(tagName || "").toLowerCase();
    const existingSource = panelState.tagSourceMap[normalized] || { tags: false, pages: false };

    if (existingSource.tags || existingSource.pages) {
      panelState.tagSourceMap[normalized] = existingSource;
      return;
    }

    panelState.tagSourceMap[normalized] = { tags: true, pages: true };
  });
  if (!getTagColorAssignment(panelState.selectedTag) && assignedTagNames.length) {
    panelState.selectedTag = assignedTagNames[0];
  }
  panelState.gradientSelections = Object.fromEntries(Object.entries(panelState.gradientState).map(([areaKey, area]) => [
    areaKey,
    Math.min(panelState.gradientSelections?.[areaKey] || 0, Math.max((area?.stops?.length || 1) - 1, 0)),
  ]));
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
      panelState.appearanceState = { ...PLUGIN_DEFAULT_THEME_SNAPSHOT.appearanceState };
      return;
    }

    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
    panelState.appearanceState = mergeStoredAppearanceState(parsed);
  } catch (error) {
    if (isMissingStorageError(error)) {
      panelState.appearanceState = { ...PLUGIN_DEFAULT_THEME_SNAPSHOT.appearanceState };
      return;
    }

    console.error("[Degrande Colors] Failed to load stored appearance toggles", error);
  }
}

async function primeOptimisticStartupState() {
  try {
    const [appearanceSaved, controlSaved, gradientSaved, tagColorSaved] = await Promise.all([
      loadStoredItemWithLegacyFallback(APPEARANCE_STATE_STORAGE_KEY),
      loadStoredItemWithLegacyFallback(CONTROL_STORAGE_KEY),
      loadStoredItemWithLegacyFallback(GRADIENT_STORAGE_KEY),
      loadStoredItemWithLegacyFallback(TAG_COLOR_STORAGE_KEY),
    ]);

    panelState.appearanceState = appearanceSaved
      ? mergeStoredAppearanceState(typeof appearanceSaved === "string" ? JSON.parse(appearanceSaved) : appearanceSaved)
      : { ...PLUGIN_DEFAULT_THEME_SNAPSHOT.appearanceState };

    const controlMirror = parseLocalMirrorValue(controlSaved, mergeStoredControls);

    if (controlMirror.exists) {
      panelState.controlState = controlMirror.value;
    } else {
      const settingsValue = readPluginSettingValue(SETTINGS_CONTROL_STATE_KEY);

      if (settingsValue != null && hasMeaningfulStoredControls(settingsValue)) {
        panelState.controlState = mergeStoredControls(settingsValue);
      }
    }

    const gradientMirror = parseLocalMirrorValue(gradientSaved, mergeStoredGradients);

    if (gradientMirror.exists) {
      panelState.gradientState = gradientMirror.value;
    } else {
      const settingsValue = readPluginSettingValue(SETTINGS_GRADIENT_STATE_KEY);

      if (settingsValue != null && hasMeaningfulStoredGradients(settingsValue)) {
        panelState.gradientState = mergeStoredGradients(settingsValue);
      }
    }

    const tagColorMirror = parseLocalMirrorValue(tagColorSaved, mergeStoredTagColors);

    if (tagColorMirror.exists) {
      panelState.tagColorAssignments = tagColorMirror.value;
    }
  } catch (error) {
    if (!isMissingStorageError(error)) {
      console.warn("[Degrande Colors] Failed to prime optimistic startup state", error);
    }
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

function createHistorySnapshot() {
  return {
    controlState: { ...panelState.controlState },
    appearanceState: { ...panelState.appearanceState },
    gradientState: cloneGradientState(panelState.gradientState),
    gradientSelections: { ...panelState.gradientSelections },
    tagColorAssignments: mergeStoredTagColors(panelState.tagColorAssignments),
    selectedTag: String(panelState.selectedTag || ""),
    tagCustomColorDraft: panelState.tagCustomColorDraft,
    tagCustomForegroundDraft: panelState.tagCustomForegroundDraft,
    tagCustomModeDrafts: JSON.parse(JSON.stringify(panelState.tagCustomModeDrafts || {})),
  };
}

function getHistorySnapshotSignature(snapshot) {
  return JSON.stringify(snapshot);
}

function syncUndoRedoButtons() {
  document.querySelectorAll('[data-action="undo-change"]').forEach((button) => {
    button.disabled = !panelState.undoStack.length;
  });

  document.querySelectorAll('[data-action="redo-change"]').forEach((button) => {
    button.disabled = !panelState.redoStack.length;
  });
}

function clearHistoryState() {
  panelState.undoStack = [];
  panelState.redoStack = [];
  panelState.activeHistorySources.clear();
  syncUndoRedoButtons();
}

function captureHistorySnapshot(sourceKey = "default") {
  if (panelState.historyApplying || panelState.activeHistorySources.has(sourceKey)) {
    return false;
  }

  const snapshot = createHistorySnapshot();
  const signature = getHistorySnapshotSignature(snapshot);
  const lastEntry = panelState.undoStack[panelState.undoStack.length - 1];

  if (!lastEntry || lastEntry.signature !== signature) {
    panelState.undoStack.push({ signature, snapshot });

    if (panelState.undoStack.length > 120) {
      panelState.undoStack.shift();
    }
  }

  panelState.redoStack = [];
  panelState.activeHistorySources.add(sourceKey);
  syncUndoRedoButtons();
  return true;
}

function finishHistoryCapture(sourceKey = "default") {
  panelState.activeHistorySources.delete(sourceKey);
}

function restoreHistorySnapshot(snapshot) {
  const previousTagKeys = Object.keys(panelState.tagColorAssignments || {});

  panelState.controlState = mergeStoredControls(snapshot.controlState);
  panelState.appearanceState = mergeStoredAppearanceState(snapshot.appearanceState);
  panelState.gradientState = mergeStoredGradients(snapshot.gradientState);
  panelState.gradientSelections = {
    ...Object.fromEntries(Object.keys(GRADIENT_AREAS).map((areaKey) => [areaKey, 0])),
    ...(snapshot.gradientSelections || {}),
  };
  panelState.tagColorAssignments = mergeStoredTagColors(snapshot.tagColorAssignments);
  panelState.selectedTag = String(snapshot.selectedTag || "");
  panelState.tagCustomColorDraft = normalizeHexColor(snapshot.tagCustomColorDraft) || "#14b8a6";
  panelState.tagCustomForegroundDraft = normalizeHexColor(snapshot.tagCustomForegroundDraft) || "#0f172a";
  panelState.tagCustomModeDrafts = JSON.parse(JSON.stringify(snapshot.tagCustomModeDrafts || {
    light: { backgroundColor: "#14b8a6", foregroundColor: "#0f172a" },
    dark: { backgroundColor: "#14b8a6", foregroundColor: "#f8fafc" },
  }));

  return Array.from(new Set([
    ...previousTagKeys,
    ...Object.keys(panelState.tagColorAssignments || {}),
  ]));
}

async function applyHistoryState(snapshot, statusMessage) {
  const tagNamesToPersist = restoreHistorySnapshot(snapshot);
  persistAppearanceState();
  schedulePersistControls();
  schedulePersistGradients();
  schedulePersistTagColors(tagNamesToPersist);
  await applyManagedOverrides(false, statusMessage, "soft");
  syncUndoRedoButtons();
}

async function undoChange() {
  if (!panelState.undoStack.length || panelState.historyApplying) {
    return false;
  }

  const currentSnapshot = createHistorySnapshot();
  const entry = panelState.undoStack.pop();
  panelState.redoStack.push({
    signature: getHistorySnapshotSignature(currentSnapshot),
    snapshot: currentSnapshot,
  });
  panelState.historyApplying = true;

  try {
    await applyHistoryState(entry.snapshot, "Undid change");
  } finally {
    panelState.historyApplying = false;
    panelState.activeHistorySources.clear();
    syncUndoRedoButtons();
  }

  return true;
}

async function redoChange() {
  if (!panelState.redoStack.length || panelState.historyApplying) {
    return false;
  }

  const currentSnapshot = createHistorySnapshot();
  const entry = panelState.redoStack.pop();
  panelState.undoStack.push({
    signature: getHistorySnapshotSignature(currentSnapshot),
    snapshot: currentSnapshot,
  });
  panelState.historyApplying = true;

  try {
    await applyHistoryState(entry.snapshot, "Redid change");
  } finally {
    panelState.historyApplying = false;
    panelState.activeHistorySources.clear();
    syncUndoRedoButtons();
  }

  return true;
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

function normalizeGradientStop(stop) {
  if (!stop || typeof stop !== "object") {
    return null;
  }

  const source = ["linked", "transparent", "preset", "custom"].includes(stop.source) ? stop.source : "transparent";
  const position = Math.min(100, Math.max(0, Number(stop.position ?? 0)));
  const track = stop.track === "bottom" ? "bottom" : "top";
  const normalized = { source, position, track };

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

  if (typeof stop.alpha === "number" && !isNaN(stop.alpha)) {
    normalized.alpha = Math.min(100, Math.max(0, stop.alpha));
  }

  return normalized;
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

function syncLocalThemeLibraryMirror(revision = panelState.lastLocalSyncRevision || panelState.syncRevision) {
  writeLocalPersistedItem(THEME_LIBRARY_STORAGE_KEY, buildLocalMirrorPayload(panelState.savedThemes, revision));
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
  return JSON.stringify(mergeStoredControls(saved)) !== JSON.stringify(PLUGIN_DEFAULT_THEME_SNAPSHOT.controlState);
}

function hasMeaningfulStoredGradients(saved) {
  return JSON.stringify(mergeStoredGradients(saved)) !== JSON.stringify(PLUGIN_DEFAULT_THEME_SNAPSHOT.gradientState);
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
      default: { ...PLUGIN_DEFAULT_THEME_SNAPSHOT.controlState },
      title: "Degrande Control State",
      description: "Internal persisted slider values for Degrande Colors.",
    },
    {
      key: SETTINGS_GRADIENT_STATE_KEY,
      type: "object",
      default: createPluginDefaultGradientState(),
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
    case GRAPH_SYNC_THEME_LIBRARY_PROPERTY:
      return "Degrande Colors Themes";
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
    await ensureGraphSyncProperty(propertyKey);
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
    await ensureGraphSyncProperty(GRAPH_SYNC_TAG_COLOR_PROPERTY);
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

  await ensureGraphSyncProperty(GRAPH_SYNC_TAG_COLOR_PROPERTY);
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

      panelState.tagColorAssignments = createPluginDefaultTagColorAssignments();
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

async function loadStoredThemes() {
  try {
    const previousSelectedThemeId = panelState.selectedThemeId;
    const previousThemeDraftName = panelState.themeDraftName;
    const localMirror = parseLocalMirrorValue(await loadStoredItemWithLegacyFallback(THEME_LIBRARY_STORAGE_KEY), mergeStoredThemes);
    const graphBackedState = await loadGraphBackedPageState(GRAPH_SYNC_THEME_LIBRARY_PROPERTY, mergeStoredThemes);
    const localMirrorRevision = normalizeGraphSyncRevision(localMirror.revision);
    const syncRevision = normalizeGraphSyncRevision(panelState.syncRevision);
    const shouldPreferSessionMirror = localMirror.exists
      && localMirrorRevision === normalizeGraphSyncRevision(panelState.lastLocalSyncRevision)
      && localMirrorRevision >= syncRevision
      && (
        !graphBackedState.exists
        || JSON.stringify(localMirror.value) !== JSON.stringify(graphBackedState.value)
      );

    if (localMirror.exists && (shouldPromoteLocalMirrorRevision(localMirror.revision) || shouldPreferSessionMirror)) {
      panelState.savedThemes = localMirror.value;
      syncSelectedThemeState({ preferredId: previousSelectedThemeId, preferredName: previousThemeDraftName, syncDraftName: false });
      syncLocalThemeLibraryMirror(localMirror.revision);
      await saveGraphBackedPageState(GRAPH_SYNC_THEME_LIBRARY_PROPERTY, panelState.savedThemes, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });
      return;
    }

    if (graphBackedState.exists) {
      panelState.savedThemes = graphBackedState.value;
      syncSelectedThemeState({ preferredId: previousSelectedThemeId, preferredName: previousThemeDraftName, syncDraftName: false });
      syncLocalThemeLibraryMirror(panelState.syncRevision);
      return;
    }

    if (!localMirror.exists) {
      panelState.savedThemes = [];
      syncSelectedThemeState({ preferredId: previousSelectedThemeId, preferredName: previousThemeDraftName, syncDraftName: false });
      return;
    }

    panelState.savedThemes = localMirror.value;
    syncSelectedThemeState({ preferredId: previousSelectedThemeId, preferredName: previousThemeDraftName, syncDraftName: false });
    syncLocalThemeLibraryMirror(localMirror.revision);

    if (shouldPromoteLocalMirrorRevision(localMirror.revision)) {
      await saveGraphBackedPageState(GRAPH_SYNC_THEME_LIBRARY_PROPERTY, panelState.savedThemes, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      });
    }
  } catch (error) {
    if (isMissingStorageError(error)) {
      panelState.savedThemes = [];
      syncSelectedThemeState({ preferredId: panelState.selectedThemeId, preferredName: panelState.themeDraftName, syncDraftName: false });
      return;
    }

    console.error("[Degrande Colors] Failed to load stored themes", error);
  }
}

async function persistThemeLibrary(reason = "themes") {
  setSyncState("pending");
  const localRevision = getNextGraphSyncRevision();
  syncSelectedThemeState();
  panelState.lastLocalSyncRevision = localRevision;
  syncLocalThemeLibraryMirror(localRevision);

  try {
    const saved = await saveGraphBackedPageState(GRAPH_SYNC_THEME_LIBRARY_PROPERTY, panelState.savedThemes, {
      suppressReadyErrors: true,
      deferUntilIndexed: true,
    });

    if (!saved) {
      setSyncState("pending");
      return true;
    }

    await bumpGraphSyncRevision(reason, localRevision);
    setSyncState("synced");
    return true;
  } catch (error) {
    console.error("[Degrande Colors] Failed to persist theme library", error);
    setSyncState("pending");
    return false;
  } finally {
    syncSyncIndicator();
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

function getGradientTrackFromClientY(areaKey, clientY) {
  const strip = getGradientStripElement(areaKey);

  if (!strip) {
    return null;
  }

  const rect = strip.getBoundingClientRect();
  const relativeY = clientY - rect.top;
  return relativeY > rect.height / 2 ? "bottom" : "top";
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

  if (areaKey === "quote") {
    const rawOpacity = panelState.themeMode === "dark"
      ? Number(panelState.controlState.quoteDarkOpacity)
      : Number(panelState.controlState.quoteLightOpacity);
    const opacity = Number.isFinite(rawOpacity) ? clamp(rawOpacity, 0, 1) : 0.18;

    return `rgba(99, 102, 241, ${opacity})`;
  }

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

  let color = "transparent";

  if (stop.source === "linked") {
    color = linkedColor;
  } else if (stop.source === "preset" && stop.token && COLOR_PRESET_MAP[stop.token]) {
    color = mode === "runtime" ? `var(--grad-${stop.token})` : resolvePreviewGradientColor(`var(--grad-${stop.token})`, getPreviewGradientFallbackColor(stop.token));
  } else if (stop.source === "custom" && stop.color) {
    const rgb = hexToRgb(stop.color);
    color = rgb ? rgbToCss(rgb) : stop.color;
  }

  if (color !== "transparent" && typeof stop.alpha === "number" && stop.alpha < 100) {
    return `color-mix(in srgb, ${color} ${Math.round(stop.alpha)}%, transparent)`;
  }

  return color;
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

function addGradientStop(areaKey, position = null, track = "top") {
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
        ...(typeof selectedStop.alpha === "number" ? { alpha: selectedStop.alpha } : {}),
      }
    : {
        source: "linked",
      };

  nextStop.position = Math.min(100, Math.max(0, Number(position ?? getSuggestedGradientStopPosition(area))));
  nextStop.track = track === "bottom" ? "bottom" : "top";

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

function buildInlineColorEditorMarkup({ color, scope, areaKey = "", stopIndex = "", controlColorKey = "", disabled = false }) {
  const rgb = hexToRgb(color) || { r: 20, g: 184, b: 166, a: 1 };
  const hsv = rgbToHsv(rgb);
  const normalized = normalizeHexColor(color) || rgbToHex(rgb);
  const disabledAttr = disabled ? " disabled" : "";
  const scopeAttrs = `data-inline-color-editor data-color-scope="${scope}" data-color-value="${normalized}" data-inline-color-disabled="${disabled ? "true" : "false"}"${areaKey ? ` data-area-key="${areaKey}"` : ""}${stopIndex !== "" ? ` data-stop-index="${stopIndex}"` : ""}${controlColorKey ? ` data-control-color-key="${controlColorKey}"` : ""}`;
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

function buildPaneIntroMarkup(title, description, actionsMarkup = "") {
  return `
    <section class="ctl-section ctl-section-inline">
      <div class="ctl-section-head">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(description)}</p>
        </div>
        ${actionsMarkup ? `<div class="ctl-pane-intro-actions">${actionsMarkup}</div>` : ""}
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

function queryThemePreviewElement(root, role) {
  return root?.querySelector(`[data-theme-preview-role="${role}"]`) || null;
}

function withTemporaryThemeState(snapshot, callback) {
  const previousState = {
    appearanceState: panelState.appearanceState,
    controlState: panelState.controlState,
    gradientState: panelState.gradientState,
    tagColorAssignments: mergeStoredTagColors(panelState.tagColorAssignments),
  };
  const normalizedSnapshot = normalizeStoredThemeSnapshot(snapshot);

  panelState.appearanceState = normalizedSnapshot.appearanceState;
  panelState.controlState = normalizedSnapshot.controlState;
  panelState.gradientState = cloneGradientState(normalizedSnapshot.gradientState);
  panelState.tagColorAssignments = normalizedSnapshot.tagColorAssignments;

  try {
    return callback(normalizedSnapshot);
  } finally {
    panelState.appearanceState = previousState.appearanceState;
    panelState.controlState = previousState.controlState;
    panelState.gradientState = previousState.gradientState;
    panelState.tagColorAssignments = previousState.tagColorAssignments;
  }
}

function buildThemePreviewCardMarkup(title, subtitle, bodyMarkup) {
  return `
    <article class="ctl-preview-card ctl-theme-preview-card">
      <div class="ctl-preview-card-head">
        <div class="ctl-preview-card-head-copy">
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(subtitle)}</span>
        </div>
      </div>
      <div class="ctl-preview-card-body">
        ${bodyMarkup}
      </div>
    </article>
  `;
}

function buildSelectedThemePreviewMarkup(theme) {
  if (!theme) {
    return `
      <div class="ctl-theme-empty-state">
        <strong>No saved themes yet</strong>
        <span>Save the current settings to create a reusable theme for this graph.</span>
      </div>
    `;
  }

  const { currentTheme, dirtyThemeId } = getLoadedThemeStatus();

  return `
    <div class="ctl-theme-preview-shell" data-role="theme-preview-root">
      <div class="ctl-theme-preview-meta">
        <strong>${escapeHtml(theme.name)}</strong>
        ${theme.id === currentTheme?.id ? '<span class="ctl-theme-status-badge is-current">Current</span>' : ""}
        ${theme.id === dirtyThemeId ? '<span class="ctl-theme-status-badge is-dirty">Modified</span>' : ""}
        <span>Updated ${escapeHtml(formatThemeTimestamp(theme.updatedAt))}</span>
        <span>${Object.keys(theme.snapshot.tagColorAssignments || {}).length} saved tag colors</span>
      </div>
      <div class="ctl-theme-preview-grid">
        ${buildThemePreviewCardMarkup(
          "Tags",
          "Inline chips",
          `
            <div class="ctl-preview-stage ctl-preview-stage-tags ctl-theme-preview-stage">
              <span class="ctl-preview-tag" data-theme-preview-role="preview-tag-primary">#Gradient</span>
              <span class="ctl-preview-tag ctl-preview-tag-hover" data-theme-preview-role="preview-tag-hover">#Hover</span>
            </div>
          `
        )}
        ${buildThemePreviewCardMarkup(
          "Linked Blocks",
          "Tag-based fill",
          `
            <div class="ctl-preview-block ctl-gradient-preview-surface" data-theme-preview-role="preview-block">
              <div class="ctl-preview-meta">#Project</div>
              <div class="ctl-preview-heading">Theme preview block</div>
              <p>Saved gradients, borders, padding, and fades appear here.</p>
            </div>
          `
        )}
        ${buildThemePreviewCardMarkup(
          "Page Titles",
          "Title accent",
          `
            <div class="ctl-preview-title-card ctl-gradient-preview-surface" data-theme-preview-role="preview-title-card">
              <div class="ctl-preview-meta">Journal</div>
              <h3 class="ctl-preview-title">Project Compass</h3>
            </div>
          `
        )}
        ${buildThemePreviewCardMarkup(
          "Highlights",
          "Inline mark fill",
          `
            <div class="ctl-preview-highlight" data-theme-preview-role="preview-highlight">
              <p class="ctl-preview-highlight-line">This sample uses a <mark class="ctl-preview-highlight-mark ctl-gradient-preview-surface" data-theme-preview-role="preview-highlight-mark">highlighted phrase</mark> inside ordinary text.</p>
            </div>
          `
        )}
        ${buildThemePreviewCardMarkup(
          "Quotes",
          "Edge glow",
          `
            <blockquote class="ctl-preview-quote ctl-gradient-preview-surface" data-theme-preview-role="preview-quote">
              <div>A preview should make the saved feel obvious before you load it.</div>
            </blockquote>
          `
        )}
        ${buildThemePreviewCardMarkup(
          "Background Block",
          "Standalone fill",
          `
            <div class="ctl-preview-background ctl-gradient-preview-surface" data-theme-preview-role="preview-background">
              <div>Saved background treatments, borders, and padding show here.</div>
            </div>
          `
        )}
      </div>
    </div>
  `;
}

function syncSelectedThemePreview(root, theme) {
  if (!root || !theme?.snapshot) {
    return;
  }

  withTemporaryThemeState(theme.snapshot, () => {
    const controls = panelState.controlState;
    const chipsEnabled = isAppearanceSectionEnabled("tagChips");
    const nodeEnabled = isAppearanceSectionEnabled("linkedBlocks");
    const titleEnabled = isAppearanceSectionEnabled("pageTitles");
    const highlightEnabled = isAppearanceSectionEnabled("highlights");
    const quoteEnabled = isAppearanceSectionEnabled("quotes");
    const backgroundEnabled = isAppearanceSectionEnabled("backgroundBlocks");
    const isDark = panelState.themeMode === "dark";
    const nodeBorderColor = getBorderControlColor("node");
    const titleBorderColor = getBorderControlColor("title");
    const highlightBorderColor = getBorderControlColor("highlight");
    const quoteBorderColor = getBorderControlColor("quote");
    const backgroundBorderColor = getBorderControlColor("background");

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

    setPreviewElementStyle(queryThemePreviewElement(root, "preview-tag-primary"), {
      ...tagBase,
      opacity: chipsEnabled ? "1" : "0.55",
      transform: "translateY(0px)",
      boxShadow: "none",
    });

    setPreviewElementStyle(queryThemePreviewElement(root, "preview-tag-hover"), {
      ...tagBase,
      opacity: chipsEnabled ? "1" : "0.55",
      transform: chipsEnabled ? `translateY(-${controls.tagHoverLift}px)` : "translateY(0px)",
      boxShadow: chipsEnabled ? (isDark ? "0 12px 28px rgba(2, 6, 23, 0.44)" : "0 10px 20px rgba(15, 23, 42, 0.12)") : "none",
    });

    setPreviewElementStyle(queryThemePreviewElement(root, "preview-block"), {
      opacity: nodeEnabled ? "1" : "0.65",
      backgroundImage: nodeEnabled ? buildGradientCss("node", getGradientPreviewLinkedColor("node"), "preview") : "none",
      backgroundColor: isDark ? "rgba(15, 23, 42, 0.68)" : "rgba(255, 255, 255, 0.82)",
      borderStyle: "solid",
      borderWidth: buildBorderWidthShorthand("node"),
      borderColor: nodeBorderColor,
      borderRadius: buildBorderRadiusShorthand("node"),
      padding: `${controls.nodePaddingY}px ${controls.nodePaddingX}px`,
    });

    setPreviewElementStyle(queryThemePreviewElement(root, "preview-title-card"), {
      opacity: titleEnabled ? "1" : "0.65",
      backgroundImage: titleEnabled ? buildGradientCss("title", getGradientPreviewLinkedColor("title"), "preview") : "none",
      backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.84)",
      borderStyle: "solid",
      borderWidth: buildBorderWidthShorthand("title"),
      borderColor: titleBorderColor,
      borderRadius: buildBorderRadiusShorthand("title"),
      padding: `${controls.titlePaddingY}px ${controls.titlePaddingX}px`,
    });

    setPreviewElementStyle(queryThemePreviewElement(root, "preview-highlight"), {
      opacity: highlightEnabled ? "1" : "0.65",
    });

    const previewHighlightMark = queryThemePreviewElement(root, "preview-highlight-mark");

    setPreviewElementStyle(previewHighlightMark, {
      backgroundColor: "transparent",
      color: "inherit",
      borderStyle: "solid",
      borderWidth: buildBorderWidthShorthand("highlight"),
      borderColor: highlightBorderColor,
      borderRadius: buildBorderRadiusShorthand("highlight"),
      padding: `${controls.highlightPaddingY}px ${controls.highlightPaddingX}px`,
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    });

    if (previewHighlightMark) {
      previewHighlightMark.style.setProperty("--ctl-preview-highlight-gradient", highlightEnabled ? buildGradientCss("highlight", getGradientPreviewLinkedColor("highlight"), "preview") : "none");
      previewHighlightMark.style.setProperty("--ctl-preview-highlight-size", highlightEnabled ? buildHighlightBandBackgroundSizeCss(controls.highlightStartPercent, controls.highlightEndPercent) : "100% 0%");
      previewHighlightMark.style.setProperty("--ctl-preview-highlight-position", highlightEnabled ? buildHighlightBandBackgroundPositionCss(controls.highlightStartPercent, controls.highlightEndPercent) : "0% 0%");
    }

    setPreviewElementStyle(queryThemePreviewElement(root, "preview-quote"), {
      opacity: quoteEnabled ? "1" : "0.65",
      borderWidth: buildBorderWidthShorthand("quote"),
      borderStyle: "solid",
      borderColor: quoteBorderColor,
      borderRadius: buildBorderRadiusShorthand("quote"),
      padding: `${controls.quotePaddingY}px ${controls.quotePaddingX}px`,
      backgroundImage: quoteEnabled ? buildGradientCss("quote", getGradientPreviewLinkedColor("quote"), "preview") : "none",
      backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.82)",
    });

    setPreviewElementStyle(queryThemePreviewElement(root, "preview-background"), {
      opacity: backgroundEnabled ? "1" : "0.65",
      borderWidth: buildBorderWidthShorthand("background"),
      borderStyle: "solid",
      borderColor: backgroundBorderColor,
      borderRadius: buildBorderRadiusShorthand("background"),
      padding: `${controls.bgPaddingY}px ${controls.bgPaddingX}px`,
      backgroundImage: backgroundEnabled ? buildGradientCss("background", getGradientPreviewLinkedColor("background"), "preview") : "none",
      backgroundColor: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.85)",
    });
  });
}

function buildThemeListMarkup() {
  if (!panelState.savedThemes.length) {
    return `<div class="ctl-theme-list-empty">No saved themes yet.</div>`;
  }

  const { currentTheme, dirtyThemeId } = getLoadedThemeStatus();

  return panelState.savedThemes.map((theme) => {
    const isActive = theme.id === panelState.selectedThemeId;
    const isCurrent = theme.id === currentTheme?.id;
    const isDirty = theme.id === dirtyThemeId;

    return `
      <button
        class="ctl-theme-list-item${isActive ? " is-active" : ""}"
        type="button"
        data-action="select-theme"
        data-theme-id="${escapeAttributeValue(theme.id)}"
        aria-pressed="${isActive ? "true" : "false"}"
        ${panelState.themeSavePending || panelState.themeLoadPending || panelState.themeDeletePending ? "disabled" : ""}
      >
        <div class="ctl-theme-list-head">
          <strong>${escapeHtml(theme.name)}</strong>
          <span class="ctl-theme-list-badges">
            ${isCurrent ? '<span class="ctl-theme-status-badge is-current">Current</span>' : ""}
            ${isDirty ? '<span class="ctl-theme-status-badge is-dirty">Modified</span>' : ""}
          </span>
        </div>
        <span>Updated ${escapeHtml(formatThemeTimestamp(theme.updatedAt))}</span>
      </button>
    `;
  }).join("");
}

function getThemeActionState() {
  const selectedTheme = syncSelectedThemeState();
  const themeName = panelState.themeDraftName || selectedTheme?.name || "";
  const themeActionPending = panelState.themeSavePending
    || panelState.themeLoadPending
    || panelState.themeDeletePending
    || panelState.themeTransferPending;
  const normalizedThemeName = normalizeThemeName(themeName);
  const duplicateTheme = normalizedThemeName
    ? panelState.savedThemes.find((theme) => theme.id === buildThemeId(normalizedThemeName)) || null
    : null;
  const saveDisabled = themeActionPending || !normalizedThemeName || Boolean(duplicateTheme);
  const updateDisabled = themeActionPending || !selectedTheme || !normalizedThemeName || Boolean(duplicateTheme && duplicateTheme.id !== selectedTheme.id);
  const actionDisabled = themeActionPending || !selectedTheme;

  return {
    selectedTheme,
    themeName,
    themeActionPending,
    normalizedThemeName,
    duplicateTheme,
    saveDisabled,
    updateDisabled,
    actionDisabled,
  };
}

function syncThemeActionButtons() {
  const { saveDisabled, updateDisabled } = getThemeActionState();
  const saveNewButton = document.querySelector('[data-action="save-new-theme"]');
  const updateButton = document.querySelector('[data-action="update-current-theme"]');

  if (saveNewButton) {
    saveNewButton.disabled = saveDisabled;
  }

  if (updateButton) {
    updateButton.disabled = updateDisabled;
  }
}

function buildThemesPaneMarkup() {
  const {
    selectedTheme,
    themeName,
    themeActionPending,
    saveDisabled,
    updateDisabled,
    actionDisabled,
  } = getThemeActionState();
  const themeNameInputDisabled = panelState.themeSavePending || panelState.themeTransferPending;
  const { currentTheme, dirtyThemeId } = getLoadedThemeStatus();
  const selectedThemeStatus = selectedTheme?.id === dirtyThemeId
    ? "This theme is loaded, but the live settings have changed and are not saved here yet."
    : selectedTheme?.id === currentTheme?.id
      ? "This theme matches the current live settings."
      : currentTheme?.name
        ? `Current live theme: ${currentTheme.name}.`
        : (selectedTheme ? "Review the saved snapshot before loading it." : "Choose a saved theme to preview it here.");
  const importActionsMarkup = `
    <input type="file" accept=".json,application/json" data-role="theme-import-file" hidden>
    <button class="ctl-button ctl-button-secondary ctl-button-small${panelState.themeTransferPending ? " is-busy" : ""}" type="button" data-action="import-theme-file"${themeActionPending ? " disabled" : ""}>${panelState.themeTransferPending ? "Importing..." : "Import File"}</button>
    <button class="ctl-button ctl-button-secondary ctl-button-small" type="button" data-action="import-theme-clipboard"${themeActionPending ? " disabled" : ""}>Paste Clipboard</button>
  `;

  return `
    ${buildPaneIntroMarkup(
      "Themes",
      "Save the current Degrande settings as reusable named themes, then preview, load, or delete them from this graph-backed library.",
      importActionsMarkup
    )}
    <div class="ctl-themes-layout">
      <section class="ctl-themes-sidebar">
        <div class="ctl-themes-save-box">
          <label class="ctl-field">
            <span>Theme Name</span>
            <input class="ctl-input" type="text" value="${escapeAttributeValue(themeName)}" placeholder="My Theme" data-theme-name${themeNameInputDisabled ? " disabled" : ""}>
          </label>
          <div class="ctl-theme-save-actions">
            <button class="ctl-button ctl-button-primary${panelState.themeSavePending ? " is-busy" : ""}" type="button" data-action="save-new-theme"${saveDisabled ? " disabled" : ""}>${panelState.themeSavePending ? "Saving..." : "Save New Theme"}</button>
            <button class="ctl-button ctl-button-secondary${panelState.themeSavePending ? " is-busy" : ""}" type="button" data-action="update-current-theme"${updateDisabled ? " disabled" : ""}>${panelState.themeSavePending ? "Updating..." : "Update Current Theme"}</button>
          </div>
        </div>
        <div class="ctl-themes-list" data-role="theme-list">
          ${buildThemeListMarkup()}
        </div>
      </section>
      <section class="ctl-themes-preview-pane">
        <div class="ctl-themes-preview-toolbar">
          <div>
            <div class="ctl-theme-preview-title-row">
              <strong>${escapeHtml(selectedTheme?.name || "Theme Preview")}</strong>
              ${selectedTheme?.id === currentTheme?.id ? '<span class="ctl-theme-status-badge is-current">Current</span>' : ""}
              ${selectedTheme?.id === dirtyThemeId ? '<span class="ctl-theme-status-badge is-dirty">Modified</span>' : ""}
            </div>
            <span>${escapeHtml(selectedThemeStatus)}</span>
          </div>
          <div class="ctl-toolbar-actions">
            <button class="ctl-button ctl-button-secondary" type="button" data-action="export-theme-file"${actionDisabled ? " disabled" : ""}>Export File</button>
            <button class="ctl-button ctl-button-secondary" type="button" data-action="export-theme-clipboard"${actionDisabled ? " disabled" : ""}>Copy Theme</button>
            <button class="ctl-button ctl-button-secondary${panelState.themeLoadPending ? " is-busy" : ""}" type="button" data-action="load-theme"${actionDisabled ? " disabled" : ""}>${panelState.themeLoadPending ? "Loading..." : "Load Theme"}</button>
            <button class="ctl-button ctl-button-secondary${panelState.themeDeletePending ? " is-busy" : ""}" type="button" data-action="delete-theme"${actionDisabled ? " disabled" : ""}>${panelState.themeDeletePending ? "Deleting..." : "Delete Theme"}</button>
          </div>
        </div>
        <div class="ctl-themes-preview-window">
          ${buildSelectedThemePreviewMarkup(selectedTheme)}
        </div>
      </section>
    </div>
  `;
}

function syncThemesPaneState() {
  const selectedTheme = getSelectedThemeEntry();
  const previewRoot = document.querySelector('[data-role="theme-preview-root"]');

  if (previewRoot && selectedTheme) {
    syncSelectedThemePreview(previewRoot, selectedTheme);
  }
}

function renderThemesPane() {
  const container = document.querySelector('[data-pane="themes"]');

  if (!container) {
    return;
  }

  container.innerHTML = buildThemesPaneMarkup();
  syncThemesPaneState();
}

async function persistAppliedThemeState() {
  setSyncState("pending");
  const localRevision = getNextGraphSyncRevision();
  const normalizedTagColors = mergeStoredTagColors(panelState.tagColorAssignments);

  persistAppearanceState();
  syncLocalControlMirror(localRevision);
  syncLocalGradientMirror(localRevision);
  syncLocalTagColorMirror(localRevision);

  try {
    const controlsSaved = await saveGraphBackedPageState(GRAPH_SYNC_CONTROL_PROPERTY, panelState.controlState, {
      suppressReadyErrors: true,
      deferUntilIndexed: true,
    });
    const gradientsSaved = await saveGraphBackedPageState(GRAPH_SYNC_GRADIENT_PROPERTY, panelState.gradientState, {
      suppressReadyErrors: true,
      deferUntilIndexed: true,
    });
    const tagColorsSaved = Object.keys(normalizedTagColors).length
      ? await saveGraphBackedPageState(GRAPH_SYNC_TAG_COLOR_PROPERTY, normalizedTagColors, {
        suppressReadyErrors: true,
        deferUntilIndexed: true,
      })
      : await removeGraphBackedPageState(GRAPH_SYNC_TAG_COLOR_PROPERTY);

    const saved = controlsSaved && gradientsSaved && tagColorsSaved;

    if (saved) {
      await bumpGraphSyncRevision("theme-load", localRevision);
      setSyncState("synced");
      return true;
    }

    setSyncState("pending");
    return false;
  } catch (error) {
    console.error("[Degrande Colors] Failed to persist loaded theme state", error);
    setSyncState("pending");
    return false;
  } finally {
    syncSyncIndicator();
  }
}

async function saveThemeEntry(mode = "create") {
  const themeName = normalizeThemeName(panelState.themeDraftName);
  const selectedTheme = getSelectedThemeEntry();
  const isUpdate = mode === "update";

  if (!themeName) {
    syncPanelMeta("Enter a theme name before saving.");
    return false;
  }

  const themeId = buildThemeId(themeName);
  const existingTheme = panelState.savedThemes.find((theme) => theme.id === themeId) || null;

  if (isUpdate && !selectedTheme) {
    syncPanelMeta("Select a saved theme before updating it.");
    return false;
  }

  if (!isUpdate && existingTheme) {
    syncPanelMeta(`Theme ${themeName} already exists. Use Update Current Theme or choose another name.`);
    return false;
  }

  if (isUpdate && existingTheme && existingTheme.id !== selectedTheme.id) {
    syncPanelMeta(`Theme ${themeName} already exists. Choose another name or update that theme directly.`);
    return false;
  }

  const previousThemes = panelState.savedThemes.slice();
  const now = Date.now();
  const themeToReplaceId = isUpdate ? selectedTheme.id : themeId;
  const nextTheme = {
    id: themeId,
    name: themeName,
    createdAt: isUpdate ? (selectedTheme.createdAt || now) : now,
    updatedAt: now,
    snapshot: createThemeSnapshot(),
  };

  panelState.savedThemes = [
    nextTheme,
    ...panelState.savedThemes.filter((theme) => theme.id !== themeToReplaceId && theme.id !== themeId),
  ].sort((left, right) => right.updatedAt - left.updatedAt || left.name.localeCompare(right.name));
  panelState.selectedThemeId = themeId;
  panelState.themeDraftName = themeName;

  panelState.themeSavePending = true;
  renderThemesPane();
  syncPanelMeta(`${isUpdate ? "Updating" : "Saving"} theme ${themeName}...`);

  try {
    const saved = await persistThemeLibrary(isUpdate ? "themes-update" : "themes-create");

    if (!saved) {
      panelState.savedThemes = previousThemes;
      syncSelectedThemeState();
    } else {
      setLoadedThemeState(nextTheme, nextTheme.snapshot);
    }

    syncPanelMeta(
      saved
        ? `${isUpdate ? "Updated" : "Saved"} theme ${themeName}${panelState.syncState === "pending" ? " locally. Graph sync is still pending." : ""}`
        : `Unable to ${isUpdate ? "update" : "save"} theme ${themeName}`
    );
    return saved;
  } finally {
    panelState.themeSavePending = false;
    renderThemesPane();
  }
}

async function saveCurrentTheme() {
  return saveThemeEntry("create");
}

async function updateCurrentTheme() {
  return saveThemeEntry("update");
}

async function exportSelectedThemeToFile() {
  const selectedTheme = getSelectedThemeEntry();

  if (!selectedTheme) {
    return false;
  }

  try {
    downloadThemeExport(selectedTheme);
    syncPanelMeta(`Exported theme ${selectedTheme.name} to file`);
    return true;
  } catch (error) {
    console.error("[Degrande Colors] Failed to export theme to file", error);
    syncPanelMeta(`Unable to export theme ${selectedTheme.name}`);
    return false;
  }
}

async function exportSelectedThemeToClipboard() {
  const selectedTheme = getSelectedThemeEntry();

  if (!selectedTheme) {
    return false;
  }

  if (!navigator.clipboard?.writeText) {
    syncPanelMeta("Clipboard export is not available in this context.");
    return false;
  }

  try {
    await navigator.clipboard.writeText(JSON.stringify(buildThemeExportPayload(selectedTheme), null, 2));
    syncPanelMeta(`Copied theme ${selectedTheme.name} to the clipboard`);
    return true;
  } catch (error) {
    console.error("[Degrande Colors] Failed to copy theme to clipboard", error);
    syncPanelMeta(`Unable to copy theme ${selectedTheme.name}`);
    return false;
  }
}

async function importThemesFromText(rawText, sourceLabel = "clipboard") {
  let importedThemes;

  try {
    importedThemes = parseImportedThemes(rawText);
  } catch (error) {
    console.error(`[Degrande Colors] Failed to parse imported themes from ${sourceLabel}`, error);
    syncPanelMeta(`Unable to import themes from ${sourceLabel}`);
    return false;
  }

  const previousThemes = panelState.savedThemes.slice();
  const previousSelectedThemeId = panelState.selectedThemeId;
  const previousThemeDraftName = panelState.themeDraftName;
  importedThemes = makeImportedThemesUnique(importedThemes, previousThemes);
  const importedCount = importedThemes.length;
  const preferredTheme = importedThemes[0];

  panelState.savedThemes = mergeStoredThemes([...importedThemes, ...panelState.savedThemes]);
  syncSelectedThemeState({ preferredId: preferredTheme.id, preferredName: preferredTheme.name, syncDraftName: true });

  panelState.themeTransferPending = true;
  renderThemesPane();
  syncPanelMeta(`Importing ${importedCount} theme${importedCount === 1 ? "" : "s"} from ${sourceLabel}...`);

  try {
    const saved = await persistThemeLibrary(importedCount === 1 ? "themes-import" : "themes-import-bulk");

    if (!saved) {
      panelState.savedThemes = previousThemes;
      syncSelectedThemeState({ preferredId: previousSelectedThemeId, preferredName: previousThemeDraftName, syncDraftName: true });
    }

    syncPanelMeta(
      saved
        ? `Imported ${importedCount} theme${importedCount === 1 ? "" : "s"} from ${sourceLabel}`
        : `Unable to import themes from ${sourceLabel}`
    );
    return saved;
  } finally {
    panelState.themeTransferPending = false;
    renderThemesPane();
  }
}

async function importThemesFromClipboard() {
  if (!navigator.clipboard?.readText) {
    syncPanelMeta("Clipboard import is not available in this context.");
    return false;
  }

  try {
    const rawText = await navigator.clipboard.readText();
    return await importThemesFromText(rawText, "clipboard");
  } catch (error) {
    console.error("[Degrande Colors] Failed to read theme data from clipboard", error);
    syncPanelMeta("Unable to read theme data from the clipboard");
    return false;
  }
}

async function importThemesFromFile(file) {
  if (!file) {
    return false;
  }

  try {
    const rawText = await file.text();
    return await importThemesFromText(rawText, file.name || "file");
  } catch (error) {
    console.error(`[Degrande Colors] Failed to read imported theme file ${file?.name || ""}`.trim(), error);
    syncPanelMeta(`Unable to import themes from ${file?.name || "file"}`);
    return false;
  }
}

async function loadSelectedTheme() {
  const selectedTheme = getSelectedThemeEntry();

  if (!selectedTheme) {
    return false;
  }

  panelState.themeLoadPending = true;
  renderThemesPane();
  syncPanelMeta(`Loading theme ${selectedTheme.name}...`);

  captureHistorySnapshot(`load-theme:${selectedTheme.id}`);

  try {
    applyThemeSnapshotToPanelState(selectedTheme.snapshot);
    const persisted = await persistAppliedThemeState();
    setLoadedThemeState(selectedTheme, selectedTheme.snapshot);
    await applyManagedOverrides(false, persisted ? `Loaded theme ${selectedTheme.name}` : `Applied theme ${selectedTheme.name} locally`);
    renderThemesPane();
    return persisted;
  } finally {
    finishHistoryCapture(`load-theme:${selectedTheme.id}`);
    panelState.themeLoadPending = false;
    renderThemesPane();
  }
}

async function deleteSelectedTheme() {
  const selectedTheme = getSelectedThemeEntry();

  if (!selectedTheme) {
    return false;
  }

  panelState.themeDeletePending = true;
  panelState.savedThemes = panelState.savedThemes.filter((theme) => theme.id !== selectedTheme.id);

  if (selectedTheme.id === panelState.loadedThemeId) {
    setLoadedThemeState(null);
  }

  syncSelectedThemeState();
  panelState.themeDraftName = getSelectedThemeEntry()?.name || "";
  renderThemesPane();
  syncPanelMeta(`Deleting theme ${selectedTheme.name}...`);

  try {
    const saved = await persistThemeLibrary("themes-delete");
    syncPanelMeta(saved ? `Deleted theme ${selectedTheme.name}` : `Unable to delete theme ${selectedTheme.name}`);
    return saved;
  } finally {
    panelState.themeDeletePending = false;
    renderThemesPane();
  }
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

    if (!control || getControlType(control) !== "number") {
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

function buildBorderCornerToggleMarkup(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "";
  }

  return BORDER_CORNER_DEFINITIONS.map(({ name, title }) => {
    const controlKey = group.cornerKeys[name];
    const isActive = Boolean(panelState.controlState[controlKey]);
    const label = `${title} radius ${isActive ? "on" : "off"}`;

    return `
      <button
        class="ctl-button ctl-button-secondary ctl-button-small ctl-filter-toggle ctl-icon-toggle-button${isActive ? " is-active" : ""}"
        type="button"
        data-action="toggle-control-boolean"
        data-control-boolean-key="${controlKey}"
        aria-pressed="${isActive ? "true" : "false"}"
        aria-label="${label}"
        title="${label}"
      >${buildCornerIconMarkup(name)}</button>
    `;
  }).join("");
}

function buildBorderSideControlMarkup(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "";
  }

  return BORDER_SIDE_DEFINITIONS.map(({ name, title }) => {
    const toggleKey = group.sideKeys[name];
    const widthKey = group.sideWidthKeys?.[name];
    const control = CONTROL_MAP[widthKey];
    const value = control ? panelState.controlState[widthKey] : 0;
    const isActive = Boolean(panelState.controlState[toggleKey]);
    const label = `${title} border ${isActive ? "on" : "off"}`;

    return `
      <div class="ctl-border-side-row">
        <button
          class="ctl-button ctl-button-secondary ctl-button-small ctl-filter-toggle ctl-icon-toggle-button${isActive ? " is-active" : ""}"
          type="button"
          data-action="toggle-control-boolean"
          data-control-boolean-key="${toggleKey}"
          aria-pressed="${isActive ? "true" : "false"}"
          aria-label="${label}"
          title="${label}"
        >${buildBorderSideIconMarkup(name)}</button>
        <input
          class="ctl-range ctl-border-side-range"
          id="ctl-${widthKey}"
          type="range"
          data-control-key="${widthKey}"
          min="${control.min}"
          max="${control.max}"
          step="${control.step}"
          value="${value}"
          aria-label="${title} border width"
        >
        <strong class="ctl-control-value ctl-border-side-value" data-control-value-for="${widthKey}">${formatControlValue(control, value)}</strong>
      </div>
    `;
  }).join("");
}

function buildBorderColorModeOptionsMarkup(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "";
  }

  const areaConfig = GRADIENT_AREAS[group.key] || {};
  const mode = getBorderColorMode(group);
  const token = getBorderColorToken(group);
  const options = [
    {
      title: areaConfig.linkedLabel || "Linked Color",
      caption: "Follow the live surface color",
      active: mode === "linked",
      action: `data-action="set-border-color-mode" data-border-group-key="${group.key}" data-border-color-mode="linked"`,
    },
    {
      title: "Custom",
      caption: "Use the editor below",
      active: mode === "custom",
      action: `data-action="set-border-color-mode" data-border-group-key="${group.key}" data-border-color-mode="custom"`,
    },
    {
      title: "Logseq Accent",
      caption: "Use the current app accent",
      active: mode === "preset" && token === "acc-app-accent",
      action: `data-action="set-border-color-preset" data-border-group-key="${group.key}" data-border-color-token="acc-app-accent"`,
    },
  ];

  return options.map((option) => `
    <button
      class="ctl-mode-option${option.active ? " is-active" : ""}"
      type="button"
      ${option.action}
      title="${escapeHtml(option.caption)}"
    >
      <strong>${escapeHtml(option.title)}</strong>
      <span>${escapeHtml(option.caption)}</span>
    </button>
  `).join("");
}

function buildBorderPresetPaletteMarkup(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "";
  }

  const mode = getBorderColorMode(group);
  const activeToken = getBorderColorToken(group);
  const renderButtons = (presets) => presets.map((preset) => {
    const style = getTagChipThemeStyle(preset.token);
    const isActive = mode === "preset" && activeToken === preset.token;
    const isSpecialAccent = preset.token === "acc-app-accent";

    return `
      <button
        class="ctl-preset-option${isActive ? " is-active" : ""}${isSpecialAccent ? " ctl-preset-option-special" : ""}"
        type="button"
        data-action="set-border-color-preset"
        data-border-group-key="${group.key}"
        data-border-color-token="${preset.token}"
        aria-label="Use ${preset.label} for this border"
        style="background:${style.background};border-color:${style.borderColor};color:${style.color};"
        title="Use ${preset.label} for this border"
      >${isSpecialAccent ? "A" : ""}</button>
    `;
  }).join("");

  const standardPresets = COLOR_PRESETS.filter((preset) => !preset.token.startsWith("acc-"));
  const accentPresets = COLOR_PRESETS.filter((preset) => preset.token.startsWith("acc-") && preset.token !== "acc-app-accent");

  return `
    <div class="ctl-preset-row">
      <div class="ctl-preset-column">
        <span class="ctl-gradient-group-label">Preset Colors</span>
        <div class="ctl-preset-grid">
          ${renderButtons(standardPresets)}
        </div>
      </div>
      <div class="ctl-preset-column">
        <span class="ctl-gradient-group-label">Accent Colors</span>
        <div class="ctl-preset-grid">
          ${renderButtons(accentPresets)}
        </div>
      </div>
    </div>
  `;
}

function buildBorderEditorMarkup(groupKey) {
  const group = getBorderControlGroup(groupKey);

  if (!group) {
    return "";
  }

  const isCustomMode = getBorderColorMode(group) === "custom";
  const customColor = normalizeHexColor(panelState.controlState[group.colorKey]) || "#14b8a6";

  return `
    <div class="ctl-custom-color-box">
      <div class="ctl-custom-color-head">
        <strong>${escapeHtml(group.label)}</strong>
        <span>Width, sides, corners, and color source.</span>
      </div>
      <div class="ctl-gradient-extra">
        ${buildNumericControlsMarkup([group.radiusKey, group.opacityKey])}
      </div>
      <div class="ctl-custom-color-grid">
        <section class="ctl-custom-color-panel">
          <div class="ctl-control ctl-control-tight">
            <div class="ctl-control-header">
              <span class="ctl-control-label">Visible Sides</span>
              <strong class="ctl-control-value" data-border-side-summary="${groupKey}">${getEnabledBorderSideCount(groupKey)}/4</strong>
            </div>
            <div class="ctl-border-side-grid" role="group" aria-label="${escapeHtml(group.label)} visible sides and widths">
              ${buildBorderSideControlMarkup(groupKey)}
            </div>
          </div>
        </section>
        <section class="ctl-custom-color-panel">
          <div class="ctl-control ctl-control-tight">
            <div class="ctl-control-header">
              <span class="ctl-control-label">Rounded Corners</span>
              <strong class="ctl-control-value" data-border-corner-summary="${groupKey}">${getEnabledBorderCornerCount(groupKey)}/4</strong>
            </div>
            <div class="ctl-filter-toggle-grid" role="group" aria-label="${escapeHtml(group.label)} rounded corners">
              ${buildBorderCornerToggleMarkup(groupKey)}
            </div>
          </div>
        </section>
      </div>
      <section class="ctl-gradient-group">
        <span class="ctl-gradient-group-label">Border Color Source</span>
        <div class="ctl-mode-grid">
          ${buildBorderColorModeOptionsMarkup(groupKey)}
        </div>
      </section>
      <section class="ctl-gradient-group">
        ${buildBorderPresetPaletteMarkup(groupKey)}
      </section>
      <details class="ctl-gradient-group ctl-gradient-custom-toggle"${isCustomMode ? " open" : ""}>
        <summary class="ctl-gradient-custom-summary">
          <span class="ctl-gradient-group-label">Custom Border Color</span>
          <span class="ctl-gradient-custom-summary-text">Show / Hide</span>
        </summary>
        <div class="ctl-gradient-custom-toggle-body">
          ${buildInlineColorEditorMarkup({
            color: customColor,
            scope: "control-color",
            controlColorKey: group.colorKey,
          })}
        </div>
      </details>
    </div>
  `;
}

function buildGradientModeOptionsMarkup(areaKey, stopIndex, selectedStop, areaConfig) {
  const options = [
    { mode: "linked", title: areaConfig.linkedLabel, caption: areaConfig.linkedCaption || "Follows the live graph color" },
    { mode: "custom", title: "Custom", caption: "Use the editor below" },
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
    <div class="ctl-preset-row">
      <div class="ctl-preset-column">
        <span class="ctl-gradient-group-label">Preset Colors</span>
        <div class="ctl-preset-grid">
          ${renderButtons(standardPresets)}
        </div>
      </div>
      <div class="ctl-preset-column">
        <span class="ctl-gradient-group-label">Accent Colors</span>
        <div class="ctl-preset-grid">
          ${renderButtons(accentPresets)}
        </div>
      </div>
    </div>
  `;
}

function buildGradientCustomColorMarkup(areaKey, stopIndex, selectedStop) {
  const customColor = selectedStop.source === "custom"
    ? selectedStop.color || "#14b8a6"
    : panelState.tagCustomColorDraft;

  return `
    <div class="ctl-gradient-custom-card${selectedStop.source === "custom" ? " is-active" : ""}" data-gradient-custom-card data-area-key="${areaKey}">
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

function buildGradientStopPickerMarkup(areaKey, area, areaConfig, selectedIndex) {
  const previewLinkedColor = getGradientPreviewLinkedColor(areaKey);

  const chips = area.stops.map((stop, index) => {
    const swatchColor = getGradientStopColor(stop, previewLinkedColor, "preview");
    const isTransparent = stop.source === "transparent";
    const sourceLabel = stop.source === "linked"
      ? areaConfig.linkedLabel
      : stop.source === "preset"
        ? "Preset"
        : stop.source === "custom"
          ? "Custom"
          : "Transparent";
    const swatchStyle = isTransparent
      ? `background-image: linear-gradient(45deg, rgba(148, 163, 184, 0.32) 25%, transparent 25%, transparent 50%, rgba(148, 163, 184, 0.32) 50%, rgba(148, 163, 184, 0.32) 75%, transparent 75%, transparent); background-size: 6px 6px;`
      : `background:${swatchColor};`;

    return `
      <button
        class="ctl-stop-chip${index === selectedIndex ? " is-active" : ""}"
        type="button"
        data-action="select-gradient-stop"
        data-area-key="${areaKey}"
        data-stop-index="${index}"
        title="Select stop ${index + 1} (${sourceLabel} at ${Math.round(stop.position)}%)"
      >
        <span class="ctl-stop-chip-swatch" style="${swatchStyle}"></span>
        <span class="ctl-stop-chip-label">${index + 1}</span>
        <span class="ctl-stop-chip-position">${Math.round(stop.position)}%</span>
      </button>
    `;
  }).join("");

  return `
    <div class="ctl-stop-picker" role="listbox" aria-label="Gradient stops">
      ${chips}
    </div>
  `;
}

function computeStopStaggerOffsets(stops) {
  // For each stop index, return a vertical offset (in px) so that stops within
  // ~3% of each other fan out instead of stacking and stealing each other's clicks.
  const CLUSTER_THRESHOLD = 3;
  const STEP = 11;
  const offsets = new Array(stops.length).fill(0);

  // Group indices by cluster (left-to-right scan over position-sorted indices).
  const order = stops
    .map((stop, index) => ({ index, position: Number(stop.position) || 0 }))
    .sort((a, b) => a.position - b.position || a.index - b.index);

  let cluster = [];
  const flushCluster = () => {
    if (cluster.length <= 1) {
      cluster = [];
      return;
    }
    // Fan around 0: [0, -STEP, +STEP, -2*STEP, +2*STEP, ...]
    cluster.forEach((item, position) => {
      const direction = position % 2 === 0 ? -1 : 1;
      const magnitude = Math.ceil(position / 2) * STEP;
      offsets[item.index] = direction * magnitude;
    });
    cluster = [];
  };

  order.forEach((item) => {
    if (!cluster.length) {
      cluster.push(item);
      return;
    }
    const last = cluster[cluster.length - 1];
    if (Math.abs(item.position - last.position) <= CLUSTER_THRESHOLD) {
      cluster.push(item);
    } else {
      flushCluster();
      cluster.push(item);
    }
  });
  flushCluster();

  return offsets;
}

function buildGradientStripMarkup(areaKey, area, areaConfig, selectedIndex) {
  const previewLinkedColor = getGradientPreviewLinkedColor(areaKey);

  return `
    <div class="ctl-gradient-strip" data-gradient-strip data-area-key="${areaKey}" title="Click top or bottom track to add a stop. Drag a stop between tracks to keep overlapping stops reachable. Right-click to remove.">
      ${area.stops.map((stop, index) => {
        const swatchColor = getGradientStopColor(stop, previewLinkedColor, "preview");
        const isTransparent = stop.source === "transparent";
        const track = stop.track === "bottom" ? "bottom" : "top";
        const baseStyle = `left: calc(${stop.position}% - 9px);`;
        const style = isTransparent
          ? baseStyle
          : `${baseStyle} --ctl-stop-swatch:${swatchColor};`;
        const label = stop.source === "linked"
          ? areaConfig.linkedLabel
          : stop.source === "preset"
            ? "Preset Color"
            : stop.source === "custom"
              ? "Custom Color"
              : "Transparent";
        const zIndex = index === selectedIndex ? 5 : 2;

        return `
          <button
            class="ctl-gradient-handle is-track-${track}${index === selectedIndex ? " is-active" : ""}${isTransparent ? " is-transparent" : ""}"
            type="button"
            style="${style} z-index:${zIndex};"
            data-action="select-gradient-stop"
            data-gradient-handle
            data-area-key="${areaKey}"
            data-stop-index="${index}"
            title="${label} at ${Math.round(stop.position)}% (${track} track). Drag horizontally to move, drag vertically to switch tracks, right-click to remove."
          ></button>
        `;
      }).join("")}
    </div>
  `;
}

function buildGradientEditorMarkup(areaKey, previewMarkup, controlKeys = [], extraMarkup = "") {
  const area = getGradientArea(areaKey);
  const areaConfig = GRADIENT_AREAS[areaKey];
  const selectedIndex = getSelectedGradientStopIndex(areaKey);
  const selectedStop = area.stops[selectedIndex];
  const primaryControlKeys = controlKeys.filter((key) => /Padding[XY]$/.test(key));
  const secondaryControlKeys = controlKeys.filter((key) => !primaryControlKeys.includes(key));
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
        <div class="ctl-gradient-primary-controls">
          <label class="ctl-control ctl-control-tight ctl-gradient-angle" for="gradient-angle-${areaKey}">
            <div class="ctl-control-header">
              <span class="ctl-control-label">Angle</span>
              <strong class="ctl-control-value" data-gradient-angle-value="${areaKey}">${Math.round(area.angle)}deg</strong>
            </div>
            <input class="ctl-range" id="gradient-angle-${areaKey}" type="range" min="0" max="360" step="1" value="${area.angle}" data-gradient-angle="${areaKey}">
          </label>
          ${primaryControlKeys.length ? buildNumericControlsMarkup(primaryControlKeys) : ""}
        </div>
        ${secondaryControlKeys.length ? `<div class="ctl-gradient-extra">${buildNumericControlsMarkup(secondaryControlKeys)}</div>` : ""}
        <div class="ctl-gradient-detail-grid${extraMarkup ? "" : " is-single"}">
          <aside class="ctl-gradient-inspector ctl-gradient-column ctl-gradient-column-side">
            <div class="ctl-gradient-inspector-head">
              <strong data-gradient-selected-index="${areaKey}">Stop ${selectedIndex + 1}</strong>
              <span data-gradient-selected-label="${areaKey}">${selectedLabel} · ${Math.round(selectedStop.position)}%</span>
            </div>
            ${buildGradientStopPickerMarkup(areaKey, area, areaConfig, selectedIndex)}
            <section class="ctl-gradient-group">
              <label class="ctl-control ctl-control-tight" for="gradient-alpha-${areaKey}">
                <div class="ctl-control-header">
                  <span class="ctl-control-label">Stop Opacity</span>
                  <strong class="ctl-control-value" data-gradient-alpha-value="${areaKey}">${typeof selectedStop.alpha === "number" ? selectedStop.alpha : 100}%</strong>
                </div>
                <input class="ctl-range" id="gradient-alpha-${areaKey}" type="range" min="0" max="100" step="1" value="${typeof selectedStop.alpha === "number" ? selectedStop.alpha : 100}" data-gradient-alpha="${areaKey}">
              </label>
            </section>
            <section class="ctl-gradient-group">
              <span class="ctl-gradient-group-label">Step Color Source</span>
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
          ${extraMarkup ? `<div class="ctl-gradient-detail-side">${extraMarkup}</div>` : ""}
        </div>
      </div>
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
  applyPluginDefaultThemeToPanelState();
  panelState.savedThemes = [];
  panelState.selectedThemeId = "";
  panelState.themeDraftName = "";
  setLoadedThemeState(null);
  clearHistoryState();
  renderPanel(`Graph changed to ${graphInfo?.name || "current graph"}. Refreshing local tags...`);
  await loadStoredAppearanceState();
  await loadGraphSyncRevisionState();
  await loadStoredControls();
  await loadStoredGradients();
  await loadStoredThemes();
  await refreshTags({ showToast: false, fallbackToPrevious: false });
  await loadStoredTagColors();
  await applyManagedOverrides(false, `Loaded synced graph state for ${graphInfo?.name || "current graph"}`, "soft");
}

function doesTxDataTouchDegrandeState(txData = []) {
  const syncAttributes = new Set([
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_CONTROL_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_GRADIENT_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_TAG_COLOR_PROPERTY),
    ...getGraphSyncPropertyAttrCandidates(GRAPH_SYNC_THEME_LIBRARY_PROPERTY),
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
      || value === GRAPH_SYNC_THEME_LIBRARY_PROPERTY
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
  const previousThemeLibrarySnapshot = getThemeLibrarySnapshot();
  const previousSelectedTag = String(panelState.selectedTag || "").toLowerCase();

  setSyncState("pending");

  await syncCurrentGraphInfo();
  await loadGraphSyncRevisionState();
  await loadStoredControls();
  await loadStoredGradients();
  await loadStoredTagColors({ allowEntityFallback: false, fallbackToCurrent: true });
  await loadStoredThemes();

  if (refreshTagCatalog) {
    await refreshTags({ showToast: false, fallbackToPrevious });
  }

  const nextSnapshot = buildPersistedAppearanceSnapshot();
  const appearanceChanged = previousSnapshot !== nextSnapshot
    || previousSelectedTag !== String(panelState.selectedTag || "").toLowerCase();
  const themeLibraryChanged = previousThemeLibrarySnapshot !== getThemeLibrarySnapshot();

  if (appearanceChanged) {
    clearHistoryState();
  }

  if (!appearanceChanged && !themeLibraryChanged && !forceRender && !showToast) {
    setSyncState("synced");
    return false;
  }

  await applyManagedOverrides(
    showToast,
    appearanceChanged || themeLibraryChanged ? reason : "Synced graph state is already current",
    renderMode
  );

  if ((themeLibraryChanged || (appearanceChanged && panelState.activeTab === "themes")) && panelState.mounted) {
    renderThemesPane();
  }

  panelState.lastNotifiedSyncRevision = Math.max(previousRevision, panelState.syncRevision);
  setSyncState("synced");

  return appearanceChanged || themeLibraryChanged;
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
      ${section.controls.filter((control) => getControlType(control) === "number").map((control) => `
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
      ${section.controls.filter((control) => getControlType(control) === "number").map((control) => `
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
    if (getControlType(control) === "number") {
      document.querySelectorAll(`[data-control-key="${control.key}"]`).forEach((input) => {
        input.value = panelState.controlState[control.key];
      });
    }

    if (getControlType(control) === "color") {
      document.querySelectorAll(`[data-control-color-key="${control.key}"]`).forEach((editor) => {
        syncInlineColorEditor(editor, panelState.controlState[control.key]);
      });
    }

    if (getControlType(control) === "boolean") {
      document.querySelectorAll(`[data-control-boolean-key="${control.key}"]`).forEach((button) => {
        const isActive = Boolean(panelState.controlState[control.key]);
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    document.querySelectorAll(`[data-control-value-for="${control.key}"]`).forEach((value) => {
      value.textContent = formatControlValue(control, panelState.controlState[control.key]);
    });
  }

  Object.keys(BORDER_CONTROL_GROUPS).forEach((groupKey) => {
    document.querySelectorAll(`[data-border-corner-summary="${groupKey}"]`).forEach((value) => {
      value.textContent = `${getEnabledBorderCornerCount(groupKey)}/4`;
    });

    document.querySelectorAll(`[data-border-side-summary="${groupKey}"]`).forEach((value) => {
      value.textContent = `${getEnabledBorderSideCount(groupKey)}/4`;
    });
  });

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
    `,
    ["nodePaddingY", "nodePaddingX"],
    buildBorderEditorMarkup("node")
  );
  const titlePreview = buildGradientEditorMarkup(
    "title",
    `
      <div class="ctl-preview-title-card ctl-gradient-preview-surface" data-role="preview-title-card" data-gradient-preview="title">
        <div class="ctl-preview-meta">Journal</div>
        <h3 class="ctl-preview-title">Project Compass</h3>
        ${buildGradientStripMarkup("title", getGradientArea("title"), GRADIENT_AREAS.title, getSelectedGradientStopIndex("title"))}
      </div>
    `,
    ["titlePaddingY", "titlePaddingX"],
    buildBorderEditorMarkup("title")
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
    ["highlightStartPercent", "highlightEndPercent", "highlightPaddingY", "highlightPaddingX"],
    buildBorderEditorMarkup("highlight")
  );
  const quotePreview = buildGradientEditorMarkup(
    "quote",
    `
      <blockquote class="ctl-preview-quote ctl-gradient-preview-surface" data-role="preview-quote" data-gradient-preview="quote">
        <div>A gradient should support the content, not swallow it.</div>
        ${buildGradientStripMarkup("quote", getGradientArea("quote"), GRADIENT_AREAS.quote, getSelectedGradientStopIndex("quote"))}
      </blockquote>
    `,
    ["quotePaddingY", "quotePaddingX"],
    buildBorderEditorMarkup("quote")
  );
  const backgroundPreview = buildGradientEditorMarkup(
    "background",
    `
      <div class="ctl-preview-background ctl-gradient-preview-surface" data-role="preview-background" data-gradient-preview="background">
        <div>Standalone background blocks keep their color banding, but you can tune the angle, fade, radius, and padding here.</div>
        ${buildGradientStripMarkup("background", getGradientArea("background"), GRADIENT_AREAS.background, getSelectedGradientStopIndex("background"))}
      </div>
    `,
    ["bgPaddingY", "bgPaddingX"],
    buildBorderEditorMarkup("background")
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
  const nodeBorderColor = getBorderControlColor("node");
  const titleBorderColor = getBorderControlColor("title");
  const highlightBorderColor = getBorderControlColor("highlight");
  const quoteBorderColor = getBorderControlColor("quote");
  const backgroundBorderColor = getBorderControlColor("background");
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
    borderStyle: "solid",
    borderWidth: buildBorderWidthShorthand("node"),
    borderColor: nodeBorderColor,
    borderRadius: buildBorderRadiusShorthand("node"),
    padding: `${controls.nodePaddingY}px ${controls.nodePaddingX}px`,
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-title-card"]'), {
    opacity: titleEnabled ? "1" : "0.65",
    backgroundImage: titleEnabled ? buildGradientCss("title", titlePreviewLinkedColor, "preview") : "none",
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.84)",
    borderStyle: "solid",
    borderWidth: buildBorderWidthShorthand("title"),
    borderColor: titleBorderColor,
    borderRadius: buildBorderRadiusShorthand("title"),
    padding: `${controls.titlePaddingY}px ${controls.titlePaddingX}px`,
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-highlight"]'), {
    opacity: highlightEnabled ? "1" : "0.65",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-highlight-mark"]'), {
    backgroundColor: "transparent",
    color: "inherit",
    borderStyle: "solid",
    borderWidth: buildBorderWidthShorthand("highlight"),
    borderColor: highlightBorderColor,
    borderRadius: buildBorderRadiusShorthand("highlight"),
    padding: `${controls.highlightPaddingY}px ${controls.highlightPaddingX}px`,
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
    borderWidth: buildBorderWidthShorthand("quote"),
    borderStyle: "solid",
    borderColor: quoteBorderColor,
    borderRadius: buildBorderRadiusShorthand("quote"),
    padding: `${controls.quotePaddingY}px ${controls.quotePaddingX}px`,
    backgroundImage: quoteEnabled ? buildGradientCss("quote", quotePreviewLinkedColor, "preview") : "none",
    backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "rgba(255, 255, 255, 0.82)",
  });

  setPreviewElementStyle(document.querySelector('[data-role="preview-background"]'), {
    opacity: backgroundEnabled ? "1" : "0.65",
    borderWidth: buildBorderWidthShorthand("background"),
    borderStyle: "solid",
    borderColor: backgroundBorderColor,
    borderRadius: buildBorderRadiusShorthand("background"),
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

    const alphaValue = document.querySelector(`[data-gradient-alpha-value="${areaKey}"]`);
    const alphaInput = document.querySelector(`[data-gradient-alpha="${areaKey}"]`);
    if (alphaInput) {
      alphaInput.value = typeof selectedStop.alpha === "number" ? selectedStop.alpha : 100;
    }
    if (alphaValue) {
      alphaValue.textContent = `${typeof selectedStop.alpha === "number" ? selectedStop.alpha : 100}%`;
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

      const track = stop.track === "bottom" ? "bottom" : "top";
      handle.classList.toggle("is-track-bottom", track === "bottom");
      handle.classList.toggle("is-track-top", track === "top");
      handle.style.removeProperty("transform");
      handle.style.zIndex = index === selectedIndex ? 5 : 2;

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

    // Sync stop-chip picker is-active.
    const chips = document.querySelectorAll(`.ctl-stop-chip[data-area-key="${areaKey}"]`);
    chips.forEach((chip) => {
      const chipIndex = Number(chip.dataset.stopIndex);
      chip.classList.toggle("is-active", chipIndex === selectedIndex);
    });

    // Sync quick-mode is-active for the currently-selected stop.
    const modeButtons = document.querySelectorAll(`.ctl-mode-option[data-area-key="${areaKey}"]`);
    modeButtons.forEach((button) => {
      const isActive = Number(button.dataset.stopIndex) === selectedIndex
        && button.dataset.stopMode === selectedStop.source;
      button.classList.toggle("is-active", isActive);
      // Refresh the data-stop-index so subsequent clicks target the new selection.
      button.dataset.stopIndex = String(selectedIndex);
    });

    // Sync preset palette is-active for the currently-selected stop.
    const presetButtons = document.querySelectorAll(`.ctl-preset-option[data-area-key="${areaKey}"]`);
    presetButtons.forEach((button) => {
      const isActive = selectedStop.source === "preset" && button.dataset.stopToken === selectedStop.token;
      button.classList.toggle("is-active", isActive);
      button.dataset.stopIndex = String(selectedIndex);
    });

    // Sync the gradient custom-color picker so it reflects the current draft
    // (e.g. after clicking a preset, the picker shows that preset's hex).
    const customColorForPicker = selectedStop.source === "custom"
      ? (selectedStop.color || "#14b8a6")
      : panelState.tagCustomColorDraft;
    const customSwatch = document.querySelector(`[data-gradient-custom-card][data-area-key="${areaKey}"] .ctl-gradient-custom-swatch`);
    if (customSwatch) {
      customSwatch.style.background = customColorForPicker;
    }
    const customEditor = document.querySelector(`[data-inline-color-editor][data-color-scope="gradient-stop"][data-area-key="${areaKey}"]`);
    syncInlineColorEditor(customEditor, customColorForPicker);
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

  if (editor.dataset.colorScope === "control-color") {
    const controlKey = editor.dataset.controlColorKey;
    const control = CONTROL_MAP[controlKey];
    const group = Object.values(BORDER_CONTROL_GROUPS).find((candidate) => candidate.colorKey === controlKey);

    if (!control) {
      return;
    }

    panelState.controlState[controlKey] = normalized;

    if (group) {
      panelState.controlState[group.modeKey] = "custom";
    }

    void applyManagedOverrides(false, `Adjusted ${control.label}`, renderMode);

    if (renderMode !== "soft") {
      schedulePersistControls();
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
    finishHistoryCapture(`inline-color:${drag.editor.dataset.colorScope}:${drag.editor.dataset.areaKey || ""}:${drag.editor.dataset.stopIndex || ""}:${drag.editor.dataset.controlColorKey || ""}`);
    return;
  }

  if (drag.editor.dataset.colorScope === "control-color") {
    schedulePersistControls();
    finishHistoryCapture(`inline-color:${drag.editor.dataset.colorScope}:${drag.editor.dataset.areaKey || ""}:${drag.editor.dataset.stopIndex || ""}:${drag.editor.dataset.controlColorKey || ""}`);
    return;
  }

  if (panelState.selectedTag) {
    schedulePersistTagColors([panelState.selectedTag]);
  }

  finishHistoryCapture(`inline-color:${drag.editor.dataset.colorScope}:${drag.editor.dataset.areaKey || ""}:${drag.editor.dataset.stopIndex || ""}:${drag.editor.dataset.controlColorKey || ""}`);
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

function updateGradientHandleDrag(clientX, clientY) {
  const drag = panelState.gradientDrag;

  if (!drag) {
    return;
  }

  const nextPosition = getGradientPositionFromClientX(drag.areaKey, clientX);

  if (nextPosition === null) {
    return;
  }

  drag.moved = true;
  const nextTrack = getGradientTrackFromClientY(drag.areaKey, clientY) || "top";
  updateGradientStop(drag.areaKey, drag.stopIndex, { position: nextPosition, track: nextTrack });
  void applyManagedOverrides(false, "Adjusted gradient stop", "soft");
}

function endGradientHandleDrag() {
  const drag = panelState.gradientDrag;

  if (!drag) {
    return;
  }

  panelState.gradientDrag = null;

  if (drag.moved) {
    panelState.suppressGradientClick = true;
    schedulePersistGradients();
  }

  finishHistoryCapture(`gradient-drag:${drag.areaKey}:${drag.stopIndex}`);
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

  syncUndoRedoButtons();
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
  syncThemesPaneState();
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
  panelState.activeTab = ["preview", "tags", "themes", "diagnostics"].includes(tab) ? tab : "tags";

  if (panelState.activeTab === "diagnostics") {
    renderDiagnosticsPane();
  }

  if (panelState.activeTab === "themes") {
    renderThemesPane();
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
  const nodeBorderColor = getBorderRuntimeColor("node");
  const titleBorderColor = getBorderRuntimeColor("title");
  const highlightBorderColor = getBorderRuntimeColor("highlight");
  const quoteBorderColor = getBorderRuntimeColor("quote");
  const backgroundBorderColor = getBorderRuntimeColor("background");
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
  ${buildBorderWidthDeclarations("node", " !important;")}
  border-style: solid !important;
  border-color: ${nodeBorderColor} !important;
  ${buildBorderRadiusDeclarations("node", " !important;")}
  padding: ${controls.nodePaddingY}px ${controls.nodePaddingX}px !important;
}
`.trim(),
    pageTitles: `
.block-main-content[data-degrande-page-title-node="true"] {
  background-image: ${titleGradient} !important;
  background-color: transparent !important;
  ${buildBorderWidthDeclarations("title", " !important;")}
  border-style: solid !important;
  border-color: ${titleBorderColor} !important;
  ${buildBorderRadiusDeclarations("title", " !important;")}
  padding: ${controls.titlePaddingY}px ${controls.titlePaddingX}px !important;
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
  ${buildBorderWidthDeclarations("highlight", " !important;")}
  border-style: solid !important;
  border-color: ${highlightBorderColor} !important;
  ${buildBorderRadiusDeclarations("highlight", " !important;")}
  padding: ${controls.highlightPaddingY}px ${controls.highlightPaddingX}px !important;
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
  ${buildBorderWidthDeclarations("quote", " !important;")}
  border-style: solid !important;
  border-color: ${quoteBorderColor} !important;
  ${buildBorderRadiusDeclarations("quote", " !important;")}
  padding: ${controls.quotePaddingY}px ${controls.quotePaddingX}px !important;
  background-image: ${buildGradientCss("quote", "var(--ctl-quote-color)")} !important;
  background-color: transparent !important;
}

div[data-node-type="quote"] .block-content-inner {
  color: #334155 !important;
}

.dark-theme div[data-node-type="quote"] {
  --ctl-quote-color: rgba(99, 102, 241, ${controls.quoteDarkOpacity});
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
  ${buildBorderWidthDeclarations("background", " !important;")}
  border-style: solid !important;
  border-color: ${backgroundBorderColor} !important;
  ${buildBorderRadiusDeclarations("background", " !important;")}
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

function isEditableUndoRedoTarget(target) {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest('[contenteditable="true"]')) {
    return true;
  }

  const input = target.closest("input, textarea");

  if (!input) {
    return false;
  }

  if (input instanceof HTMLTextAreaElement) {
    return true;
  }

  if (!(input instanceof HTMLInputElement)) {
    return false;
  }

  return input.type !== "range" && input.type !== "checkbox" && input.type !== "radio" && input.type !== "button";
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
            <button class="ctl-button ctl-button-secondary" data-action="undo-change" disabled>Undo</button>
            <button class="ctl-button ctl-button-secondary" data-action="redo-change" disabled>Redo</button>
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
          <button class="ctl-tab" type="button" data-tab="themes" role="tab" aria-selected="false">Themes</button>
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
            <div class="ctl-pane ctl-pane-preview" data-pane="themes" hidden>
              ${buildThemesPaneMarkup()}
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
      if (panelState.suppressGradientClick) {
        panelState.suppressGradientClick = false;
        return;
      }

      const rect = gradientStrip.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;
      const position = Math.round((relativeX / Math.max(rect.width, 1)) * 100);
      const track = relativeY > rect.height / 2 ? "bottom" : "top";
      captureHistorySnapshot(`add-gradient-stop:${gradientStrip.dataset.areaKey}`);
      addGradientStop(gradientStrip.dataset.areaKey, position, track);
      void applyManagedOverrides(false, "Added gradient stop", "preview");
      schedulePersistGradients();
      finishHistoryCapture(`add-gradient-stop:${gradientStrip.dataset.areaKey}`);
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
      refreshPanel();
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

    if (action === "undo-change") {
      await undoChange();
      return;
    }

    if (action === "redo-change") {
      await redoChange();
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

    if (action === "select-theme") {
      panelState.selectedThemeId = target.dataset.themeId || "";
      panelState.themeDraftName = getSelectedThemeEntry()?.name || panelState.themeDraftName;
      renderThemesPane();
      return;
    }

    if (action === "save-new-theme") {
      await saveCurrentTheme();
      return;
    }

    if (action === "update-current-theme") {
      await updateCurrentTheme();
      return;
    }

    if (action === "export-theme-file") {
      await exportSelectedThemeToFile();
      return;
    }

    if (action === "export-theme-clipboard") {
      await exportSelectedThemeToClipboard();
      return;
    }

    if (action === "import-theme-file") {
      const themeImportInput = document.querySelector('[data-role="theme-import-file"]');

      if (themeImportInput) {
        themeImportInput.value = "";
        themeImportInput.click();
      }

      return;
    }

    if (action === "import-theme-clipboard") {
      await importThemesFromClipboard();
      return;
    }

    if (action === "load-theme") {
      await loadSelectedTheme();
      return;
    }

    if (action === "delete-theme") {
      await deleteSelectedTheme();
      return;
    }

    if (action === "toggle-logseq-theme") {
      await toggleLogseqTheme();
      return;
    }

    if (action === "toggle-appearance-section") {
      captureHistorySnapshot(`appearance-toggle:${target.dataset.appearanceSection || ""}`);
      toggleAppearanceSection(target.dataset.appearanceSection || "");
      finishHistoryCapture(`appearance-toggle:${target.dataset.appearanceSection || ""}`);
      return;
    }

    if (action === "toggle-control-boolean") {
      const controlKey = target.dataset.controlBooleanKey;
      const control = CONTROL_MAP[controlKey];

      if (!control) {
        return;
      }

      captureHistorySnapshot(`toggle-control:${controlKey}`);
      panelState.controlState[controlKey] = !panelState.controlState[controlKey];
      void applyManagedOverrides(false, `Adjusted ${control.label}`, "soft");
      schedulePersistControls();
      finishHistoryCapture(`toggle-control:${controlKey}`);
      return;
    }

    if (action === "set-border-color-mode") {
      const group = getBorderControlGroup(target.dataset.borderGroupKey || "");

      if (!group) {
        return;
      }

      captureHistorySnapshot(`border-mode:${group.key}`);
      panelState.controlState[group.modeKey] = target.dataset.borderColorMode === "linked" ? "linked" : "custom";
      void applyManagedOverrides(false, `Adjusted ${group.label}`, "preview");
      schedulePersistControls();
      finishHistoryCapture(`border-mode:${group.key}`);
      return;
    }

    if (action === "set-border-color-preset") {
      const group = getBorderControlGroup(target.dataset.borderGroupKey || "");
      const token = target.dataset.borderColorToken || "";

      if (!group || !COLOR_PRESET_MAP[token]) {
        return;
      }

      captureHistorySnapshot(`border-preset:${group.key}`);
      panelState.controlState[group.modeKey] = "preset";
      panelState.controlState[group.tokenKey] = token;
      void applyManagedOverrides(false, `Adjusted ${group.label}`, "preview");
      schedulePersistControls();
      finishHistoryCapture(`border-preset:${group.key}`);
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
      captureHistorySnapshot("reset-controls");
      await resetControls();
      finishHistoryCapture("reset-controls");
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
      captureHistorySnapshot("reset-tag-colors");
      await resetTagColors();
      finishHistoryCapture("reset-tag-colors");
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
      captureHistorySnapshot(`gradient-stop-mode:${target.dataset.areaKey}:${target.dataset.stopIndex}`);
      updateGradientStop(
        target.dataset.areaKey,
        Number(target.dataset.stopIndex),
        { source: target.dataset.stopMode, token: COLOR_PRESETS[0].token, color: panelState.tagCustomColorDraft }
      );
      void applyManagedOverrides(false, "Updated gradient stop type", "soft");
      schedulePersistGradients();
      finishHistoryCapture(`gradient-stop-mode:${target.dataset.areaKey}:${target.dataset.stopIndex}`);
      return;
    }

    if (action === "set-gradient-stop-preset") {
      captureHistorySnapshot(`gradient-stop-preset:${target.dataset.areaKey}:${target.dataset.stopIndex}`);
      const presetMeta = getPresetMeta(target.dataset.stopToken);
      if (presetMeta) {
        const presetHex = panelState.themeMode === "dark" ? presetMeta.darkBorder : presetMeta.lightBorder;
        const normalized = normalizeHexColor(presetHex);
        if (normalized) {
          panelState.tagCustomColorDraft = normalized;
        }
      }
      updateGradientStop(
        target.dataset.areaKey,
        Number(target.dataset.stopIndex),
        { source: "preset", token: target.dataset.stopToken }
      );
      void applyManagedOverrides(false, "Updated preset gradient color", "soft");
      schedulePersistGradients();
      finishHistoryCapture(`gradient-stop-preset:${target.dataset.areaKey}:${target.dataset.stopIndex}`);
      return;
    }

    if (action === "remove-gradient-stop") {
      captureHistorySnapshot(`remove-gradient-stop:${target.dataset.areaKey}:${target.dataset.stopIndex}`);
      removeGradientStop(target.dataset.areaKey, Number(target.dataset.stopIndex));
      void applyManagedOverrides(false, "Removed gradient stop", "preview");
      schedulePersistGradients();
      finishHistoryCapture(`remove-gradient-stop:${target.dataset.areaKey}:${target.dataset.stopIndex}`);
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
    captureHistorySnapshot(`gradient-drag:${gradientHandle.dataset.areaKey}:${gradientHandle.dataset.stopIndex}`);
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
    captureHistorySnapshot(`remove-gradient-stop:${gradientHandle.dataset.areaKey}:${gradientHandle.dataset.stopIndex}`);
    removeGradientStop(gradientHandle.dataset.areaKey, Number(gradientHandle.dataset.stopIndex));
    void applyManagedOverrides(false, "Removed gradient stop", "preview");
    schedulePersistGradients();
    finishHistoryCapture(`remove-gradient-stop:${gradientHandle.dataset.areaKey}:${gradientHandle.dataset.stopIndex}`);
  });

  document.addEventListener("pointermove", (event) => {
    if (!panelState.gradientDrag || event.pointerId !== panelState.gradientDrag.pointerId) {
      return;
    }

    event.preventDefault();
    updateGradientHandleDrag(event.clientX, event.clientY);
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
    captureHistorySnapshot(`inline-color:${editor.dataset.colorScope}:${editor.dataset.areaKey || ""}:${editor.dataset.stopIndex || ""}:${editor.dataset.controlColorKey || ""}`);
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
      captureHistorySnapshot(`gradient-angle:${gradientAngleInput.dataset.gradientAngle}`);
      const area = getGradientArea(gradientAngleInput.dataset.gradientAngle);

      if (area) {
        area.angle = Number(gradientAngleInput.value);
        void applyManagedOverrides(false, `Adjusted ${GRADIENT_AREAS[gradientAngleInput.dataset.gradientAngle].label}`, "soft");
      }

      return;
    }

    const gradientAlphaInput = event.target.closest("[data-gradient-alpha]");

    if (gradientAlphaInput) {
      captureHistorySnapshot(`gradient-alpha:${gradientAlphaInput.dataset.gradientAlpha}`);
      const areaKey = gradientAlphaInput.dataset.gradientAlpha;
      const index = getSelectedGradientStopIndex(areaKey);
      
      updateGradientStop(areaKey, index, { alpha: Number(gradientAlphaInput.value) });
      syncGradientEditorState();
      void applyManagedOverrides(false, `Adjusted stop opacity`, "soft");
      return;
    }

    const inlineColorHexInput = event.target.closest("[data-inline-color-hex]");

    if (inlineColorHexInput) {
      const editor = inlineColorHexInput.closest("[data-inline-color-editor]");
      const normalized = normalizeHexColor(inlineColorHexInput.value);

      if (!editor || !normalized) {
        return;
      }

      captureHistorySnapshot(`inline-color:${editor.dataset.colorScope}:${editor.dataset.areaKey || ""}:${editor.dataset.stopIndex || ""}:${editor.dataset.controlColorKey || ""}`);
      applyInlineEditorColor(editor, normalized, "soft");
      return;
    }

    const inlineColorHue = event.target.closest("[data-inline-color-hue]");

    if (inlineColorHue) {
      const editor = inlineColorHue.closest("[data-inline-color-editor]");

      if (!editor) {
        return;
      }

      captureHistorySnapshot(`inline-color:${editor.dataset.colorScope}:${editor.dataset.areaKey || ""}:${editor.dataset.stopIndex || ""}:${editor.dataset.controlColorKey || ""}`);
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

      captureHistorySnapshot(`inline-color:${editor.dataset.colorScope}:${editor.dataset.areaKey || ""}:${editor.dataset.stopIndex || ""}:${editor.dataset.controlColorKey || ""}`);
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

    const themeNameInput = event.target.closest("[data-theme-name]");

    if (themeNameInput) {
      panelState.themeDraftName = themeNameInput.value || "";
      syncThemeActionButtons();
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
    captureHistorySnapshot(`control-input:${controlKey}`);

    if (controlKey === "highlightStartPercent") {
      panelState.controlState.highlightStartPercent = Math.min(nextValue, panelState.controlState.highlightEndPercent);
    } else if (controlKey === "highlightEndPercent") {
      panelState.controlState.highlightEndPercent = Math.max(nextValue, panelState.controlState.highlightStartPercent);
    } else {
      panelState.controlState[controlKey] = nextValue;
    }

    void applyManagedOverrides(false, `Adjusted ${control.label}`, "soft");
  });

  app.addEventListener("change", async (event) => {
    const themeImportInput = event.target.closest('[data-role="theme-import-file"]');

    if (themeImportInput) {
      const file = themeImportInput.files?.[0] || null;
      themeImportInput.value = "";

      if (file) {
        await importThemesFromFile(file);
      }

      return;
    }

    const inlineColorHexInput = event.target.closest("[data-inline-color-hex]");
    const inlineColorHue = event.target.closest("[data-inline-color-hue]");
    const inlineColorAlpha = event.target.closest("[data-inline-color-alpha]");

    if (inlineColorHexInput || inlineColorHue || inlineColorAlpha) {
      const editor = (inlineColorHexInput || inlineColorHue || inlineColorAlpha).closest("[data-inline-color-editor]");
      const nextColor = getInlineColorEditorColor(editor);
      syncInlineColorEditor(editor, nextColor);

      if (editor?.dataset.colorScope === "gradient-stop") {
        schedulePersistGradients();
      } else if (editor?.dataset.colorScope === "control-color") {
        schedulePersistControls();
      } else if (panelState.selectedTag) {
        schedulePersistTagColors([panelState.selectedTag]);
      }

      finishHistoryCapture(`inline-color:${editor?.dataset.colorScope || ""}:${editor?.dataset.areaKey || ""}:${editor?.dataset.stopIndex || ""}:${editor?.dataset.controlColorKey || ""}`);

      return;
    }

    const gradientAngleInput = event.target.closest("[data-gradient-angle]");

    if (gradientAngleInput) {
      schedulePersistGradients();
      finishHistoryCapture(`gradient-angle:${gradientAngleInput.dataset.gradientAngle}`);
      return;
    }

    const gradientAlphaInput = event.target.closest("[data-gradient-alpha]");

    if (gradientAlphaInput) {
      schedulePersistGradients();
      finishHistoryCapture(`gradient-alpha:${gradientAlphaInput.dataset.gradientAlpha}`);
      return;
    }

    const controlInput = event.target.closest("[data-control-key]");

    if (controlInput) {
      schedulePersistControls();
      finishHistoryCapture(`control-input:${controlInput.dataset.controlKey}`);
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
    const modifierKey = isMacPlatform() ? event.metaKey : event.ctrlKey;

    if (!event.altKey && modifierKey && !isEditableUndoRedoTarget(event.target)) {
      const lowerKey = String(event.key || "").toLowerCase();

      if (lowerKey === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          void redoChange();
        } else {
          void undoChange();
        }

        return;
      }

      if (lowerKey === "y") {
        event.preventDefault();
        void redoChange();
        return;
      }
    }

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
  syncInlineTagHighlightStyle();
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

async function reloadThemeCss(showToast = false, reopenUI = !!logseq.isMainUIVisible, forceCssReload = showToast) {
  const rawCssText = await loadWorkspaceCss(forceCssReload);
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
    ? window.confirm("Reset all live controls back to the default theme?")
    : true;

  if (!confirmed) {
    renderPanel("Reset controls cancelled");
    return;
  }

  applyPluginDefaultThemeToPanelState();
  setLoadedThemeState(null);
  const persisted = await persistAppliedThemeState();
  await applyManagedOverrides(true, persisted ? "Reset live controls to the default theme" : "Applied the default theme locally");
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

  // The ONLY reliable "DB worker is ready" signal is onGraphAfterIndexed.
  // primeGraphIndexedState via datascriptQuery returns a false-positive (null
  // result, no error) during the ~2s worker boot, so we run the entire boot
  // data-load from inside the onGraphAfterIndexed handler. If it never fires
  // (e.g. plugin hot-reload on an already-indexed graph), a 10s fallback
  // timer kicks the same path.
  panelState.bootLoadStarted = false;
  const _runBootDataLoad = async () => {
    if (panelState.bootLoadStarted) return;
    panelState.bootLoadStarted = true;
    await syncCurrentGraphInfo();
    await primeGraphIndexedState();
    await loadStoredAppearanceState();
    await flushDeferredGraphSyncWrites();
    await loadGraphSyncRevisionState();
    await loadStoredControls();
    await loadStoredTagColors();
    await loadStoredGradients();
    setSyncState("synced");
    if (panelState.baseCssText) {
      await applyManagedOverrides(false, "Reloaded base styles and re-applied controls");
    } else {
      await reloadThemeCss(false, false);
    }
  };
  panelState._runBootDataLoad = _runBootDataLoad;

  setTimeout(() => {
    if (!panelState.bootLoadStarted) {
      void _runBootDataLoad();
    }
  }, 2500);

  bindHostTagContextMenu();

  const userConfigsPromise = typeof logseq.App?.getUserConfigs === "function"
    ? logseq.App.getUserConfigs().catch((error) => {
      console.warn("[Degrande Colors] Failed to load user configs during startup", error);
      return null;
    })
    : Promise.resolve(null);

  await primeOptimisticStartupState();
  await reloadThemeCss(false, false);
  void userConfigsPromise.then((userConfigs) => {
    setThemeMode(userConfigs?.preferredThemeMode);

    if (panelState.mounted) {
      syncPreviewStyles();
    }
  });

  logseq.App.onThemeModeChanged(({ mode }) => {
    setThemeMode(mode);
    rebuildTagDrivenNodeStyleState();
    syncAllTagDrivenNodeStyles();
    renderPanel(`Logseq theme: ${mode}`);
  });

  if (typeof logseq.App.onCurrentGraphChanged === "function") {
    logseq.App.onCurrentGraphChanged(() => { void handleCurrentGraphChanged(); });
  }

  if (typeof logseq.App.onGraphAfterIndexed === "function") {
    // Logseq fires onGraphAfterIndexed many times during normal use, not just
    // once on boot. We use this callback only for its one critical job:
    // kicking off the deferred boot data-load. After that, graph switches are
    // handled by onCurrentGraphChanged, intra-graph state changes by
    // DB.onChanged, and we try to unsubscribe to skip bridge cost on future
    // fires.
    let _unsubscribeAfterIndexed = null;
    const _indexedHandler = ({ repo }) => {
      if (panelState.bootLoadStarted) {
        try { _unsubscribeAfterIndexed?.(); } catch (_) {}
        return;
      }
      if (!doesRepoMatchGraph(repo)) {
        return;
      }
      panelState.graphIndexed = true;
      if (typeof panelState._runBootDataLoad === "function") {
        void panelState._runBootDataLoad();
      }
    };
    try {
      _unsubscribeAfterIndexed = logseq.App.onGraphAfterIndexed(_indexedHandler);
    } catch (_) {
      logseq.App.onGraphAfterIndexed(_indexedHandler);
    }
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
  } else if (shouldRegisterHostUi) {
    try { getHostWindow().console?.warn?.('[degrande] BISECT: command palette commands skipped'); } catch (_) {}
  }

  console.info(`[Degrande Colors] Loaded base styles and controls (v${PLUGIN_VERSION})`);

  try {
    const diagHost = getHostWindow();
    diagHost.__degrandeColorsRunCmdkSync = () => {
      syncCmdkTagStyles();
      return diagHost.__degrandeColorsCmdkDiag || null;
    };
    diagHost.__degrandeColorsVersion = PLUGIN_VERSION;
  } catch (diagAttachError) {
    // Ignore — diagnostics are optional.
  }
}

window.__degrandeColorsMain = main;
})();







