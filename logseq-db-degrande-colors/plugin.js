const CONTROL_STORAGE_KEY = "custom-theme-loader-controls.json";
const TAG_COLOR_STORAGE_KEY = "custom-theme-loader-tag-colors.json";
const GRADIENT_STORAGE_KEY = "custom-theme-loader-gradients.json";

const COLOR_PRESETS = [
  { token: "red", label: "Red", lightBg: "#fee2e2", lightBorder: "#fca5a5", darkBg: "#7f1d1d", darkBorder: "#dc2626", lightText: "#7f1d1d", darkText: "#fee2e2" },
  { token: "orange", label: "Orange", lightBg: "#ffedd5", lightBorder: "#fdba74", darkBg: "#7c2d12", darkBorder: "#ea580c", lightText: "#7c2d12", darkText: "#ffedd5" },
  { token: "yellow", label: "Yellow", lightBg: "#fef9c3", lightBorder: "#fde047", darkBg: "#713f12", darkBorder: "#ca8a04", lightText: "#713f12", darkText: "#fef9c3" },
  { token: "green", label: "Green", lightBg: "#dcfce7", lightBorder: "#86efac", darkBg: "#14532d", darkBorder: "#16a34a", lightText: "#14532d", darkText: "#dcfce7" },
  { token: "teal", label: "Teal", lightBg: "#ccfbf1", lightBorder: "#5eead4", darkBg: "#134e4a", darkBorder: "#0d9488", lightText: "#134e4a", darkText: "#ccfbf1" },
  { token: "blue", label: "Blue", lightBg: "#dbeafe", lightBorder: "#93c5fd", darkBg: "#1e3a8a", darkBorder: "#2563eb", lightText: "#1e3a8a", darkText: "#dbeafe" },
  { token: "indigo", label: "Indigo", lightBg: "#e0e7ff", lightBorder: "#a5b4fc", darkBg: "#312e81", darkBorder: "#4f46e5", lightText: "#312e81", darkText: "#e0e7ff" },
  { token: "purple", label: "Purple", lightBg: "#f3e8ff", lightBorder: "#d8b4fe", darkBg: "#4c1d95", darkBorder: "#9333ea", lightText: "#4c1d95", darkText: "#f3e8ff" },
  { token: "pink", label: "Pink", lightBg: "#fce7f3", lightBorder: "#f9a8d4", darkBg: "#831843", darkBorder: "#db2777", lightText: "#831843", darkText: "#fce7f3" },
  { token: "grey", label: "Grey", lightBg: "#f3f4f6", lightBorder: "#d1d5db", darkBg: "#374151", darkBorder: "#6b7280", lightText: "#111827", darkText: "#f3f4f6" },
  { token: "mint", label: "Mint", lightBg: "#f0fdf4", lightBorder: "#bbf7d0", darkBg: "#064e3b", darkBorder: "#059669", lightText: "#064e3b", darkText: "#f0fdf4" },
  { token: "rose", label: "Rose", lightBg: "#fff1f2", lightBorder: "#fecdd3", darkBg: "#881337", darkBorder: "#e11d48", lightText: "#881337", darkText: "#fff1f2" },
  { token: "amber", label: "Amber", lightBg: "#fffbeb", lightBorder: "#fef3c7", darkBg: "#78350f", darkBorder: "#d97706", lightText: "#78350f", darkText: "#fffbeb" },
  { token: "sky", label: "Sky", lightBg: "#f0f9ff", lightBorder: "#bae6fd", darkBg: "#0c4a6e", darkBorder: "#0284c7", lightText: "#0c4a6e", darkText: "#f0f9ff" },
  { token: "lime", label: "Lime", lightBg: "#f7fee7", lightBorder: "#d9f99d", darkBg: "#3f6212", darkBorder: "#65a30d", lightText: "#3f6212", darkText: "#f7fee7" },
  { token: "slate", label: "Slate", lightBg: "#f8fafc", lightBorder: "#e2e8f0", darkBg: "#1e293b", darkBorder: "#475569", lightText: "#0f172a", darkText: "#e2e8f0" },
];

const COLOR_PRESET_MAP = Object.fromEntries(COLOR_PRESETS.map((preset) => [preset.token, preset]));
const TAGS_DATASCRIPT_QUERY = '[:find ?name :where [_ :block/tags ?t] [?t :block/name ?name]]';
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
  tagColorAssignments: {},
  baseTagColorMap: {},
  tags: [],
  selectedTag: "",
  tagCustomColorDraft: "#14b8a6",
  tagSortMode: "name",
  tagFilter: "",
  activeTab: "preview",
  lastAppliedAt: null,
  mounted: false,
  persistTimer: null,
  gradientPersistTimer: null,
  tagPersistTimer: null,
};

function getToolbarStyle(pluginId) {
  return `
div[data-injected-ui="custom-theme-loader-open-${pluginId}"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

div[data-injected-ui="custom-theme-loader-open-${pluginId}"] a,
div[data-injected-ui="custom-theme-loader-open-${pluginId}"] a.button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
  min-width: 0 !important;
  min-height: 0 !important;
  width: 24px !important;
  height: 24px !important;
  font-size: inherit !important;
  line-height: 1 !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  opacity: 1 !important;
  vertical-align: middle !important;
}

div[data-injected-ui="custom-theme-loader-open-${pluginId}"] a i,
div[data-injected-ui="custom-theme-loader-open-${pluginId}"] a.button i {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 18px !important;
  height: 18px !important;
  font-size: 18px !important;
  line-height: 1 !important;
  color: var(--ls-primary-text-color, currentColor) !important;
  opacity: 0.82 !important;
}

div[data-injected-ui="custom-theme-loader-open-${pluginId}"] a:hover i,
div[data-injected-ui="custom-theme-loader-open-${pluginId}"] a.button:hover i {
  opacity: 1 !important;
}
`;
}

async function loadWorkspaceCss() {
  const response = await fetch("./custom.css", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load custom.css (${response.status})`);
  }

  return response.text();
}

function setThemeMode(mode) {
  panelState.themeMode = mode === "dark" ? "dark" : "light";
  document.body.classList.toggle("theme-dark", panelState.themeMode === "dark");
}

function lineCount(text) {
  return text ? text.split(/\r?\n/).length : 0;
}

function formatAppliedAt(value) {
  if (!value) {
    return "Not applied yet";
  }

  return value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
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

  const rawName = typeof tag === "string"
    ? tag
    : tag.originalName || tag.name || tag.label || tag.tag || "";

  return String(rawName).trim().replace(/^#+/, "");
}

function getPresetMeta(token) {
  return COLOR_PRESET_MAP[token] || null;
}

function normalizeHexColor(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) {
    return null;
  }

  if (trimmed.length === 4) {
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
  };
}

function mixRgb(source, target, amount) {
  return {
    r: Math.round(source.r + (target.r - source.r) * amount),
    g: Math.round(source.g + (target.g - source.g) * amount),
    b: Math.round(source.b + (target.b - source.b) * amount),
  };
}

function rgbToCss(rgb, alpha = 1) {
  if (alpha >= 1) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function getContrastTextColor(rgb) {
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.62 ? "#0f172a" : "#f8fafc";
}

function getCustomColorTheme(baseColor) {
  const rgb = hexToRgb(baseColor);

  if (!rgb) {
    return null;
  }

  const lightBg = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.82);
  const lightBorder = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.58);
  const darkBg = mixRgb(rgb, { r: 0, g: 0, b: 0 }, 0.58);
  const darkBorder = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.16);

  return {
    lightBg: rgbToCss(lightBg),
    lightBorder: rgbToCss(lightBorder),
    lightText: getContrastTextColor(lightBg),
    darkBg: rgbToCss(darkBg),
    darkBorder: rgbToCss(darkBorder),
    darkText: getContrastTextColor(darkBg),
    gradient: rgbToCss(rgb, 0.25),
    border: rgbToCss(rgb, 0.78),
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
      const baseColor = normalizeHexColor(entry.baseColor);

      if (baseColor) {
        return { type: "custom", baseColor };
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

function getTagColorToken(tagName) {
  const assignment = getTagColorAssignment(tagName);

  if (!assignment) {
    return null;
  }

  return assignment.type === "preset" ? assignment.token : "custom";
}

function getTagChipThemeStyle(assignmentOrToken) {
  const assignment = typeof assignmentOrToken === "string"
    ? normalizeTagColorAssignment(assignmentOrToken)
    : normalizeTagColorAssignment(assignmentOrToken);
  const isDark = panelState.themeMode === "dark";

  if (assignment?.type === "custom") {
    const customTheme = getCustomColorTheme(assignment.baseColor);

    if (customTheme) {
      return {
        background: isDark ? customTheme.darkBg : customTheme.lightBg,
        borderColor: isDark ? customTheme.darkBorder : customTheme.lightBorder,
        color: isDark ? customTheme.darkText : customTheme.lightText,
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

async function loadStoredControls() {
  try {
    const saved = await logseq.FileStorage.getItem(CONTROL_STORAGE_KEY);

    if (!saved) {
      return;
    }

    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
    panelState.controlState = mergeStoredControls(parsed);
  } catch (error) {
    console.error("[Local Custom Theme Loader] Failed to load stored controls", error);
  }
}

async function loadStoredTagColors() {
  try {
    const saved = await logseq.FileStorage.getItem(TAG_COLOR_STORAGE_KEY);

    if (!saved) {
      return;
    }

    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
    panelState.tagColorAssignments = mergeStoredTagColors(parsed);
  } catch (error) {
    console.error("[Local Custom Theme Loader] Failed to load stored tag colors", error);
  }
}

async function loadStoredGradients() {
  try {
    const saved = await logseq.FileStorage.getItem(GRADIENT_STORAGE_KEY);

    if (!saved) {
      return;
    }

    const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
    panelState.gradientState = mergeStoredGradients(parsed);
  } catch (error) {
    console.error("[Local Custom Theme Loader] Failed to load stored gradients", error);
  }
}

function schedulePersistControls() {
  if (panelState.persistTimer) {
    clearTimeout(panelState.persistTimer);
  }

  const serializedControls = JSON.stringify(panelState.controlState);

  panelState.persistTimer = setTimeout(async () => {
    try {
      await logseq.FileStorage.setItem(CONTROL_STORAGE_KEY, serializedControls);
    } catch (error) {
      console.error("[Local Custom Theme Loader] Failed to persist controls", error);
    } finally {
      panelState.persistTimer = null;
    }
  }, 120);
}

function schedulePersistTagColors() {
  if (panelState.tagPersistTimer) {
    clearTimeout(panelState.tagPersistTimer);
  }

  const serializedTagColors = JSON.stringify(panelState.tagColorAssignments);

  panelState.tagPersistTimer = setTimeout(async () => {
    try {
      await logseq.FileStorage.setItem(TAG_COLOR_STORAGE_KEY, serializedTagColors);
    } catch (error) {
      console.error("[Local Custom Theme Loader] Failed to persist tag colors", error);
    } finally {
      panelState.tagPersistTimer = null;
    }
  }, 120);
}

function schedulePersistGradients() {
  if (panelState.gradientPersistTimer) {
    clearTimeout(panelState.gradientPersistTimer);
  }

  const serializedGradients = JSON.stringify(panelState.gradientState);

  panelState.gradientPersistTimer = setTimeout(async () => {
    try {
      await logseq.FileStorage.setItem(GRADIENT_STORAGE_KEY, serializedGradients);
    } catch (error) {
      console.error("[Local Custom Theme Loader] Failed to persist gradients", error);
    } finally {
      panelState.gradientPersistTimer = null;
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
    return mode === "runtime"
      ? getCustomColorTheme(stop.color)?.gradient || stop.color
      : stop.color;
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

  const nextStop = {
    source: "linked",
    position: Math.min(100, Math.max(0, Number(position ?? getSuggestedGradientStopPosition(area)))),
  };

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
    return !filter || tagName.toLowerCase().includes(filter);
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
  return `background:${style.background};border-color:${style.borderColor};color:${style.color};`;
}

function buildTagListMarkup() {
  const tags = getVisibleTags();

  if (!tags.length) {
    return '<div class="ctl-tag-empty">No tags matched the current filter.</div>';
  }

  return tags.map((tagName) => {
    const isSelected = panelState.selectedTag === tagName;
    const token = getTagColorToken(tagName);
    const label = token ? `${tagName} · ${token}` : tagName;

    return `
      <button
        class="ctl-tag-chip${isSelected ? " is-selected" : ""}"
        type="button"
        data-select-tag="${escapeHtml(tagName)}"
        title="${escapeHtml(label)}"
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
        title="Set ${escapeHtml(panelState.selectedTag)} to ${preset.label}"
        style="background:${style.background};border-color:${style.borderColor};color:${style.color};"
      >
        <span class="ctl-color-swatch" style="background:${style.background};border-color:${style.borderColor};"></span>
        <span>${preset.label}</span>
      </button>
    `;
  }).join("");
}

function buildCustomTagColorMarkup() {
  const selectedAssignment = panelState.selectedTag ? getTagColorAssignment(panelState.selectedTag) : null;
  const currentColor = selectedAssignment?.type === "custom" ? selectedAssignment.baseColor : panelState.tagCustomColorDraft;

  return `
    <div class="ctl-custom-color-box">
      <div class="ctl-custom-color-head">
        <strong>Custom Base Color</strong>
        <span>Create a tag-specific color outside the preset palette.</span>
      </div>
      <div class="ctl-custom-color-row">
        <input class="ctl-color-input" type="color" data-tag-custom-color value="${escapeHtml(currentColor || "#14b8a6")}">
        <button class="ctl-button ctl-button-secondary" type="button" data-action="apply-custom-tag-color"${panelState.selectedTag ? "" : " disabled"}>Apply Custom</button>
      </div>
    </div>
  `;
}

function buildTagsPaneMarkup() {
  const tags = getVisibleTags();
  const selectedTag = panelState.selectedTag;
  const selectedColor = selectedTag ? getTagColorToken(selectedTag) : null;
  const hasCustomAssignment = selectedTag ? Boolean(panelState.tagColorAssignments[selectedTag.toLowerCase()]) : false;

  return `
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
        <div class="ctl-tags-summary">${tags.length} visible tags · ${Object.keys(panelState.tagColorAssignments).length} custom assignments</div>
        <div class="ctl-tag-grid">${buildTagListMarkup()}</div>
      </section>
      <section class="ctl-tags-detail">
        <div class="ctl-tags-detail-head">
          <strong>${selectedTag ? `#${escapeHtml(selectedTag)}` : "Tag Color"}</strong>
          <span>${selectedTag ? `Current color: ${selectedColor || "default"}` : "Choose a tag to edit its color"}</span>
        </div>
        <div class="ctl-selected-tag-preview-wrap">
          ${selectedTag ? `<span class="ctl-selected-tag-preview" style="${buildTagChipStyleAttribute(selectedTag)}">#${escapeHtml(selectedTag)}</span>` : ""}
        </div>
        <div class="ctl-color-grid">${buildColorPaletteMarkup()}</div>
        ${buildCustomTagColorMarkup()}
        <div class="ctl-tags-actions">
          <button class="ctl-button ctl-button-secondary" type="button" data-action="refresh-tags">Refresh Tags</button>
          <button class="ctl-button ctl-button-secondary" type="button" data-action="clear-tag-color"${selectedTag && hasCustomAssignment ? "" : " disabled"}>Clear Custom Color</button>
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

function buildGradientEditorMarkup(areaKey, controlKeys = []) {
  const area = getGradientArea(areaKey);
  const areaConfig = GRADIENT_AREAS[areaKey];
  const previewGradient = buildGradientCss(areaKey, areaConfig.previewLinkedColor, "preview");
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
      <div class="ctl-section-head">
        <div>
          <h2>${areaConfig.label}</h2>
          <p>Click the strip to add a stop, then tune the selected stop below.</p>
        </div>
      </div>
      <div class="ctl-gradient-canvas">
        <div class="ctl-gradient-preview" data-gradient-preview="${areaKey}" style="background-image:${previewGradient};"></div>
        <div class="ctl-gradient-strip" data-gradient-strip data-area-key="${areaKey}" title="Click to add a stop">
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
                data-area-key="${areaKey}"
                data-stop-index="${index}"
                title="${label} at ${Math.round(stop.position)}%"
              ></button>
            `;
          }).join("")}
        </div>
      </div>
      <div class="ctl-gradient-toolbar">
        <label class="ctl-control ctl-control-tight ctl-gradient-angle" for="gradient-angle-${areaKey}">
          <div class="ctl-control-header">
            <span class="ctl-control-label">Angle</span>
            <strong class="ctl-control-value" data-gradient-angle-value="${areaKey}">${Math.round(area.angle)}deg</strong>
          </div>
          <input class="ctl-range" id="gradient-angle-${areaKey}" type="range" min="0" max="360" step="1" value="${area.angle}" data-gradient-angle="${areaKey}">
        </label>
        <button class="ctl-button ctl-button-secondary ctl-button-small" type="button" data-action="add-gradient-stop" data-area-key="${areaKey}">Add Stop</button>
      </div>
      <div class="ctl-gradient-inspector">
        <div class="ctl-gradient-inspector-head">
          <strong data-gradient-selected-index="${areaKey}">Stop ${selectedIndex + 1}</strong>
          <span data-gradient-selected-label="${areaKey}">${selectedLabel} · ${Math.round(selectedStop.position)}%</span>
        </div>
        <div class="ctl-gradient-inspector-grid">
          <label class="ctl-field">
            <span>Mode</span>
            <select class="ctl-select ctl-select-compact" data-gradient-stop-source data-area-key="${areaKey}" data-stop-index="${selectedIndex}">
              <option value="linked"${selectedStop.source === "linked" ? " selected" : ""}>${areaConfig.linkedLabel}</option>
              <option value="transparent"${selectedStop.source === "transparent" ? " selected" : ""}>Transparent</option>
              <option value="preset"${selectedStop.source === "preset" ? " selected" : ""}>Preset Color</option>
              <option value="custom"${selectedStop.source === "custom" ? " selected" : ""}>Custom Color</option>
            </select>
          </label>
          ${selectedStop.source === "preset" ? `
            <label class="ctl-field">
              <span>Preset</span>
              <select class="ctl-select ctl-select-compact" data-gradient-stop-preset data-area-key="${areaKey}" data-stop-index="${selectedIndex}">
                ${COLOR_PRESETS.map((preset) => `<option value="${preset.token}"${selectedStop.token === preset.token ? " selected" : ""}>${preset.label}</option>`).join("")}
              </select>
            </label>
          ` : ""}
          ${selectedStop.source === "custom" ? `
            <label class="ctl-field">
              <span>Custom</span>
              <input class="ctl-color-input ctl-color-input-wide" type="color" value="${escapeHtml(selectedStop.color || "#14b8a6")}" data-gradient-stop-color data-area-key="${areaKey}" data-stop-index="${selectedIndex}">
            </label>
          ` : ""}
          <button class="ctl-icon-button" type="button" data-action="remove-gradient-stop" data-area-key="${areaKey}" data-stop-index="${selectedIndex}"${area.stops.length <= 2 ? " disabled" : ""}>Remove Stop</button>
        </div>
        <label class="ctl-control ctl-control-tight" for="gradient-${areaKey}-${selectedIndex}">
          <div class="ctl-control-header">
            <span class="ctl-control-label">Position</span>
            <strong class="ctl-control-value" data-gradient-position-value="${areaKey}">${Math.round(selectedStop.position)}%</strong>
          </div>
          <input class="ctl-range" id="gradient-${areaKey}-${selectedIndex}" type="range" min="0" max="100" step="1" value="${selectedStop.position}" data-gradient-stop-position data-area-key="${areaKey}" data-stop-index="${selectedIndex}">
        </label>
      </div>
      ${controlKeys.length ? `<div class="ctl-gradient-extra">${buildNumericControlsMarkup(controlKeys)}</div>` : ""}
    </section>
  `;
}

async function refreshTags(showToast = false) {
  try {
    let rawTags = [];

    if (typeof logseq.Editor.getAllTags === "function") {
      rawTags = await logseq.Editor.getAllTags();
    } else if (typeof logseq.DB?.datascriptQuery === "function") {
      const rows = await logseq.DB.datascriptQuery(TAGS_DATASCRIPT_QUERY);
      rawTags = (rows || []).map((row) => Array.isArray(row) ? row[0] : row);
    } else if (typeof logseq.Editor.getAllPages === "function") {
      rawTags = await logseq.Editor.getAllPages();
    }

    const normalizedTags = Array.from(new Set((rawTags || [])
      .map(normalizeTagName)
      .filter(Boolean)
      .filter((tagName) => tagName.toLowerCase() !== "tags")))
      .sort((left, right) => left.localeCompare(right));

    panelState.tags = normalizedTags;

    if (!normalizedTags.includes(panelState.selectedTag)) {
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
  return `
    <div class="ctl-preview-grid">
      <article class="ctl-preview-card">
        <div class="ctl-preview-card-head">
          <strong>Tag Chips</strong>
          <span>Inline tags and hover lift</span>
        </div>
        <div class="ctl-preview-card-body">
          <div class="ctl-preview-stage ctl-preview-stage-tags">
            <span class="ctl-preview-tag" data-role="preview-tag-primary">#Gradient</span>
            <span class="ctl-preview-tag ctl-preview-tag-hover" data-role="preview-tag-hover">#Hover</span>
          </div>
          <section class="ctl-section ctl-section-inline">
            <div class="ctl-section-head">
              <div>
                <h2>Tag Chip Styling</h2>
                <p>Shape, size, and hover motion for inline tags.</p>
              </div>
            </div>
            ${buildNumericControlsMarkup(["tagRadius", "tagFontSize", "tagHeight", "tagPaddingX", "tagBorderWidth", "tagHoverLift"])}
          </section>
        </div>
      </article>
      <article class="ctl-preview-card">
        <div class="ctl-preview-card-head">
          <strong>Tagged Block</strong>
          <span>Block highlight sweep</span>
        </div>
        <div class="ctl-preview-card-body">
          <div class="ctl-preview-block" data-role="preview-block">
            <div class="ctl-preview-meta">#Project</div>
            <div class="ctl-preview-heading">Tune the block gradient</div>
            <p>Use this area to preview the spread and fade for tag-driven block highlights.</p>
          </div>
          ${buildGradientEditorMarkup("node")}
        </div>
      </article>
      <article class="ctl-preview-card">
        <div class="ctl-preview-card-head">
          <strong>Page Title</strong>
          <span>Page and journal title accent</span>
        </div>
        <div class="ctl-preview-card-body">
          <div class="ctl-preview-title-card" data-role="preview-title-card">
            <div class="ctl-preview-meta">Journal</div>
            <h3 class="ctl-preview-title">Project Compass</h3>
          </div>
          ${buildGradientEditorMarkup("title")}
        </div>
      </article>
      <article class="ctl-preview-card">
        <div class="ctl-preview-card-head">
          <strong>Quote</strong>
          <span>Quote edge glow and spacing</span>
        </div>
        <div class="ctl-preview-card-body">
          <blockquote class="ctl-preview-quote" data-role="preview-quote">
            A gradient should support the content, not swallow it.
          </blockquote>
          ${buildGradientEditorMarkup("quote", ["quoteBorderWidth", "quoteRadius", "quotePaddingY", "quotePaddingX"])}
        </div>
      </article>
      <article class="ctl-preview-card">
        <div class="ctl-preview-card-head">
          <strong>Background Block</strong>
          <span>Regular block background sweep</span>
        </div>
        <div class="ctl-preview-card-body">
          <div class="ctl-preview-background" data-role="preview-background">
            Standalone background blocks keep their color banding, but you can tune the angle, fade, radius, and padding here.
          </div>
          ${buildGradientEditorMarkup("background", ["bgRadius", "bgPaddingY", "bgPaddingX"])}
        </div>
      </article>
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

    const positionValue = document.querySelector(`[data-gradient-position-value="${areaKey}"]`);

    if (positionValue) {
      positionValue.textContent = `${Math.round(selectedStop.position)}%`;
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

function syncPanelMeta(statusMessage) {
  const content = document.querySelector('[data-role="css-content"]');
  const meta = document.querySelector('[data-role="meta"]');
  const status = document.querySelector('[data-role="status"]');

  if (!content || !meta || !status) {
    return;
  }

  content.value = panelState.cssText;
  meta.textContent = `${lineCount(panelState.cssText)} lines | ${panelState.cssText.length} chars | Base file plus live overrides | Applied ${formatAppliedAt(panelState.lastAppliedAt)}`;
  status.textContent = statusMessage ?? `Theme mode: ${panelState.themeMode} | Controls are stored in plugin state`;
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
  syncTabState();
}

function setActiveTab(tab) {
  panelState.activeTab = ["preview", "css", "tags"].includes(tab) ? tab : "preview";
  syncTabState();

  if (panelState.activeTab === "tags" && !panelState.tags.length) {
    void refreshTags(false);
  }
}

function buildManagedOverrides() {
  const controls = panelState.controlState;
  const nodeGradient = buildGradientCss("node", "var(--node-color)");
  const titleGradient = buildGradientCss("title", "var(--node-color)");
  const quoteDefaultLight = buildGradientCss("quote", `rgba(99, 102, 241, ${controls.quoteLightOpacity})`);
  const quoteDefaultDark = buildGradientCss("quote", `rgba(99, 102, 241, ${controls.quoteDarkOpacity})`);
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

  const tagColorRules = Object.entries(panelState.tagColorAssignments).map(([tagName, assignment]) => {
    const escapedTagName = escapeAttributeValue(tagName);

    if (assignment?.type === "custom") {
      const customTheme = getCustomColorTheme(assignment.baseColor);

      if (!customTheme) {
        return "";
      }

      return `
a.tag[data-ref="${escapedTagName}" i] {
  background-color: ${customTheme.lightBg} !important;
  border-color: ${customTheme.lightBorder} !important;
  color: ${customTheme.lightText} !important;
}

.dark-theme a.tag[data-ref="${escapedTagName}" i] {
  background-color: ${customTheme.darkBg} !important;
  border-color: ${customTheme.darkBorder} !important;
  color: ${customTheme.darkText} !important;
}

:is(.ls-block > div:first-child, h1.title, .journal-title):has(a.tag[data-ref="${escapedTagName}" i]) {
  --node-color: ${customTheme.gradient};
}
`;
    }

    const token = assignment?.token;

    if (!token) {
      return "";
    }

    return `
a.tag[data-ref="${escapedTagName}" i] {
  background-color: var(--bg-${token}) !important;
  border-color: var(--bd-${token}) !important;
}

:is(.ls-block > div:first-child, h1.title, .journal-title):has(a.tag[data-ref="${escapedTagName}" i]) {
  --node-color: var(--grad-${token});
}
`;
  }).join("");

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

.ls-block > div:first-child:not(.selected):not(.selected-block):has(a.tag[data-ref]) {
  background-image: ${nodeGradient} !important;
  background-color: transparent !important;
}

.dark-theme .ls-block > div:first-child:not(.selected):not(.selected-block):has(a.tag[data-ref]) {
  background-image: ${nodeGradient} !important;
  background-color: transparent !important;
}

:is(h1.title, .journal-title):has(a.tag[data-ref]) {
  background-image: ${titleGradient} !important;
  background-color: transparent !important;
}

.dark-theme :is(h1.title, .journal-title):has(a.tag[data-ref]) {
  background-image: ${titleGradient} !important;
  background-color: transparent !important;
}

div[data-node-type="quote"] {
  --ctl-quote-color: rgba(99, 102, 241, ${controls.quoteLightOpacity});
  border-left-width: ${controls.quoteBorderWidth}px !important;
  border-radius: 0 ${controls.quoteRadius}px ${controls.quoteRadius}px 0 !important;
  padding: ${controls.quotePaddingY}px ${controls.quotePaddingX}px !important;
  background-image: ${quoteDefaultLight} !important;
}

.dark-theme div[data-node-type="quote"] {
  --ctl-quote-color: rgba(99, 102, 241, ${controls.quoteDarkOpacity});
  background-image: ${quoteDefaultDark} !important;
}

${quoteColorRules}

.with-bg-color:not([data-node-type="quote"]) {
  --ctl-bg-sweep-color: rgba(244, 114, 182, 0.16);
  background-color: transparent !important;
  border-radius: ${controls.bgRadius}px !important;
  padding: ${controls.bgPaddingY}px ${controls.bgPaddingX}px !important;
}

${backgroundRules}
`;
}

function renderPanel(statusMessage) {
  refreshPanel(statusMessage, { rerenderPreview: true, rerenderTags: true });
}

function mountPanel() {
  if (panelState.mounted) {
    return;
  }

  const app = document.getElementById("app");

  if (!app) {
    throw new Error("Missing #app root for Custom Theme Loader panel");
  }

  app.innerHTML = `
    <div class="ctl-shell">
      <div class="ctl-backdrop" data-action="close"></div>
      <section class="ctl-window" aria-label="Custom Theme Loader panel">
        <header class="ctl-header">
          <div>
            <p class="ctl-eyebrow">Live Theme Controls</p>
            <h1>Custom Theme Loader</h1>
            <p class="ctl-subtitle">Tune gradients for tags, background blocks, and quotes. The live stylesheet preview updates as you move the controls.</p>
          </div>
          <aside class="ctl-header-meta">
            <strong>Source Layer</strong>
            <span>./custom.css + plugin overrides</span>
          </aside>
        </header>
        <div class="ctl-toolbar">
          <div class="ctl-toolbar-actions">
            <button class="ctl-button ctl-button-primary" data-action="reload-file">Reload File</button>
            <button class="ctl-button ctl-button-secondary" data-action="refresh-tags">Refresh Tags</button>
            <button class="ctl-button ctl-button-secondary" data-action="reset-controls">Reset Controls</button>
            <button class="ctl-button ctl-button-secondary" data-action="copy">Copy CSS</button>
            <button class="ctl-button ctl-button-secondary" data-action="close">Close</button>
          </div>
          <div class="ctl-status" data-role="status"></div>
        </div>
        <div class="ctl-tabbar" role="tablist" aria-label="Theme panel views">
          <button class="ctl-tab" type="button" data-tab="preview" role="tab" aria-selected="true">Preview</button>
          <button class="ctl-tab" type="button" data-tab="tags" role="tab" aria-selected="false">Tags</button>
          <button class="ctl-tab" type="button" data-tab="css" role="tab" aria-selected="false">CSS</button>
        </div>
        <div class="ctl-main">
          <section class="ctl-viewer">
            <div class="ctl-pane ctl-pane-preview" data-pane="preview">
              ${buildPreviewMarkup()}
            </div>
            <div class="ctl-pane ctl-pane-tags" data-pane="tags" hidden>
              <div data-role="tags-pane"></div>
            </div>
            <div class="ctl-pane ctl-pane-css" data-pane="css" hidden>
              <textarea class="ctl-code" data-role="css-content" readonly spellcheck="false"></textarea>
            </div>
          </section>
        </div>
        <footer class="ctl-footer">
          <div data-role="meta"></div>
          <div>Preview is the default view. The raw effective CSS is available in the CSS tab.</div>
        </footer>
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
      panelState.selectedTag = tagSelectButton.dataset.selectTag || "";
      renderPanel(`Selected ${panelState.selectedTag}`);
      return;
    }

    const colorButton = event.target.closest("[data-set-tag-color]");

    if (colorButton && panelState.selectedTag) {
      panelState.tagColorAssignments[panelState.selectedTag.toLowerCase()] = {
        type: "preset",
        token: colorButton.dataset.setTagColor,
      };
      void applyManagedOverrides(false, `Updated ${panelState.selectedTag} color`);
      renderPanel(`Set ${panelState.selectedTag} to ${colorButton.dataset.setTagColor}`);
      schedulePersistTagColors();
      return;
    }

    const gradientStrip = event.target.closest("[data-gradient-strip]");

    if (gradientStrip && !event.target.closest('[data-action="select-gradient-stop"]')) {
      const rect = gradientStrip.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const position = Math.round((relativeX / Math.max(rect.width, 1)) * 100);
      addGradientStop(gradientStrip.dataset.areaKey, position);
      void applyManagedOverrides(false, "Added gradient stop");
      schedulePersistGradients();
      return;
    }

    const target = event.target.closest("[data-action]");

    if (!target) {
      return;
    }

    const { action } = target.dataset;

    if (action === "select-gradient-stop") {
      setSelectedGradientStop(target.dataset.areaKey, Number(target.dataset.stopIndex));
      renderPanel();
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

    if (action === "refresh-tags") {
      await refreshTags(true);
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

      delete panelState.tagColorAssignments[panelState.selectedTag.toLowerCase()];
      renderPanel(`Cleared custom color for ${panelState.selectedTag}`);
      void applyManagedOverrides(false, `Cleared custom color for ${panelState.selectedTag}`);
      schedulePersistTagColors();
      return;
    }

    if (action === "apply-custom-tag-color") {
      if (!panelState.selectedTag) {
        return;
      }

      panelState.tagColorAssignments[panelState.selectedTag.toLowerCase()] = {
        type: "custom",
        baseColor: panelState.tagCustomColorDraft,
      };
      void applyManagedOverrides(false, `Updated ${panelState.selectedTag} custom color`);
      renderPanel(`Set ${panelState.selectedTag} to a custom color`);
      schedulePersistTagColors();
      return;
    }

    if (action === "add-gradient-stop") {
      addGradientStop(target.dataset.areaKey);
      void applyManagedOverrides(false, "Added gradient stop");
      schedulePersistGradients();
      return;
    }

    if (action === "remove-gradient-stop") {
      removeGradientStop(target.dataset.areaKey, Number(target.dataset.stopIndex));
      void applyManagedOverrides(false, "Removed gradient stop");
      schedulePersistGradients();
      return;
    }

    if (action === "copy") {
      await copyCssToClipboard();
    }
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

    const gradientPositionInput = event.target.closest("[data-gradient-stop-position]");

    if (gradientPositionInput) {
      updateGradientStop(
        gradientPositionInput.dataset.areaKey,
        Number(gradientPositionInput.dataset.stopIndex),
        { position: Number(gradientPositionInput.value) }
      );
      void applyManagedOverrides(false, "Adjusted gradient stop", "soft");
      schedulePersistGradients();
      return;
    }

    const gradientColorInput = event.target.closest("[data-gradient-stop-color]");

    if (gradientColorInput) {
      updateGradientStop(
        gradientColorInput.dataset.areaKey,
        Number(gradientColorInput.dataset.stopIndex),
        { color: gradientColorInput.value, source: "custom" }
      );
      void applyManagedOverrides(false, "Updated custom gradient color", "soft");
      schedulePersistGradients();
      return;
    }

    const tagFilterInput = event.target.closest("[data-tag-filter]");

    if (tagFilterInput) {
      panelState.tagFilter = tagFilterInput.value || "";
      renderPanel();
      return;
    }

    const customTagColorInput = event.target.closest("[data-tag-custom-color]");

    if (customTagColorInput) {
      panelState.tagCustomColorDraft = customTagColorInput.value || "#14b8a6";
      renderTagsPane();
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
    const gradientSourceSelect = event.target.closest("[data-gradient-stop-source]");

    if (gradientSourceSelect) {
      updateGradientStop(
        gradientSourceSelect.dataset.areaKey,
        Number(gradientSourceSelect.dataset.stopIndex),
        { source: gradientSourceSelect.value, token: COLOR_PRESETS[0].token, color: panelState.tagCustomColorDraft }
      );
      void applyManagedOverrides(false, "Updated gradient stop type");
      schedulePersistGradients();
      return;
    }

    const gradientPresetSelect = event.target.closest("[data-gradient-stop-preset]");

    if (gradientPresetSelect) {
      updateGradientStop(
        gradientPresetSelect.dataset.areaKey,
        Number(gradientPresetSelect.dataset.stopIndex),
        { source: "preset", token: gradientPresetSelect.value }
      );
      void applyManagedOverrides(false, "Updated preset gradient color");
      schedulePersistGradients();
      return;
    }

    const sortSelect = event.target.closest("[data-tag-sort]");

    if (!sortSelect) {
      return;
    }

    panelState.tagSortMode = sortSelect.value || "name";
    renderPanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeThemeLoader();
    }
  });

  panelState.mounted = true;
  syncControlInputs();
  syncPreviewStyles();
  syncTabState();
}

async function applyManagedOverrides(showToast = false, statusMessage = "Updated live overrides", renderMode = "full") {
  const managedOverrides = buildManagedOverrides();

  panelState.cssText = buildEffectiveCssText(managedOverrides);
  panelState.lastAppliedAt = new Date();
  logseq.provideStyle(managedOverrides);

  if (renderMode === "soft") {
    refreshPanel(statusMessage);
  } else {
    renderPanel(statusMessage);
  }

  if (showToast) {
    await logseq.UI.showMsg(statusMessage, "success");
  }
}

function openThemeLoader() {
  renderPanel();
  logseq.showMainUI({ autoFocus: true });

  if (!panelState.tags.length) {
    void refreshTags(false);
  }

  void applyManagedOverrides(false, "Reapplied saved theme controls");
}

function closeThemeLoader() {
  logseq.hideMainUI({ restoreEditingCursor: true });
}

function toggleThemeLoader() {
  if (logseq.isMainUIVisible) {
    closeThemeLoader();
  } else {
    openThemeLoader();
  }
}

async function reloadThemeCss(showToast = false) {
  panelState.baseCssText = await loadWorkspaceCss();
  panelState.baseTagColorMap = parseBaseTagColorMap(panelState.baseCssText);
  logseq.provideStyle(panelState.baseCssText);
  await applyManagedOverrides(showToast, "Reloaded workspace custom.css and re-applied controls");
  openThemeLoader();
}

async function resetControls() {
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

  await logseq.FileStorage.removeItem(CONTROL_STORAGE_KEY);
  await logseq.FileStorage.removeItem(GRADIENT_STORAGE_KEY);
  await applyManagedOverrides(true, "Reset live controls to the custom.css defaults");
}

async function copyCssToClipboard() {
  try {
    await navigator.clipboard.writeText(panelState.cssText);
    renderPanel("Copied effective CSS to clipboard");
    await logseq.UI.showMsg("Copied effective CSS to clipboard.", "success");
  } catch (error) {
    console.error("[Local Custom Theme Loader] Clipboard copy failed", error);
    renderPanel("Clipboard copy failed");
    await logseq.UI.showMsg("Unable to copy CSS from the plugin window.", "warning");
  }
}

async function main() {
  const pluginId = logseq.baseInfo.id;

  await loadStoredControls();
  await loadStoredTagColors();
  await loadStoredGradients();
  mountPanel();

  const userConfigs = await logseq.App.getUserConfigs();
  setThemeMode(userConfigs?.preferredThemeMode);
  logseq.App.onThemeModeChanged(({ mode }) => {
    setThemeMode(mode);
    renderPanel();
  });

  logseq.setMainUIInlineStyle({
    position: "fixed",
    zIndex: 999,
    top: "5vh",
    left: "50%",
    width: "min(1280px, 92vw)",
    height: "88vh",
    transform: "translateX(-50%)",
  });

  await reloadThemeCss(false);
  await refreshTags(false);
  setTimeout(() => {
    void applyManagedOverrides(false, "Reapplied saved theme controls");
  }, 900);
  logseq.provideStyle(getToolbarStyle(pluginId));

  logseq.provideModel({
    openThemeLoader,
    closeThemeLoader,
    toggleThemeLoader,
  });

  await logseq.UI.showMsg(
    "Local Custom Theme Loader is active.",
    "success",
    { timeout: 2500 }
  );

  logseq.App.registerUIItem("toolbar", {
    key: "custom-theme-loader-open",
    template: `
      <a class="button" data-on-click="toggleThemeLoader" title="Open Custom Theme Loader">
        <i class="ti ti-palette" aria-hidden="true"></i>
      </a>
    `,
  });

  logseq.App.registerCommandPalette(
    {
      key: "custom-theme-loader-open-panel",
      label: "Custom Theme Loader: open panel",
    },
    openThemeLoader
  );

  logseq.App.registerCommandPalette(
    {
      key: "custom-theme-loader-status",
      label: "Custom Theme Loader: show status",
    },
    async () => {
      await logseq.UI.showMsg(
        "Workspace custom.css is active through the Custom Theme Loader plugin.",
        "success"
      );
      openThemeLoader();
    }
  );

  logseq.App.registerCommandPalette(
    {
      key: "custom-theme-loader-reload-css",
      label: "Custom Theme Loader: reload CSS",
    },
    () => reloadThemeCss(true)
  );

  logseq.App.registerCommandPalette(
    {
      key: "custom-theme-loader-refresh-tags",
      label: "Custom Theme Loader: refresh tags",
    },
    () => refreshTags(true)
  );

  console.info("[Local Custom Theme Loader] Loaded workspace custom.css and controls");
}

logseq.ready(main).catch((error) => {
  console.error("[Local Custom Theme Loader] Failed to start", error);
});
