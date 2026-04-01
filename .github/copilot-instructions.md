# Project Guidelines

## Context
This workspace is used to investigate Logseq DB graphs and the local Logseq HTTP API exposed by the desktop app.

## Logseq HTTP API
- Treat `http://127.0.0.1:12315` as the local Logseq API host unless the user provides a different address.
- The root path returns built-in documentation. The actual API entry point is `POST /api`.
- Every API request must include `Authorization: Bearer <token>` and `Content-Type: application/json`.
- The request body shape is `{ "method": "logseq.Namespace.method", "args": [] }`.
- Prefer high-level SDK methods such as `logseq.Editor.getAllTags`, `logseq.Editor.getPage`, `logseq.App.getCurrentGraph`, and `logseq.DB.datascriptQuery` over guessing raw database schema.

## Verified Behavior
- Verified working through the HTTP bridge: `logseq.App.getCurrentGraph`, `logseq.App.getUserConfigs`, `logseq.Editor.getAllTags`, `logseq.UI.showMsg`.
- Verified limitation: some sync or registration-style SDK methods are not exposed cleanly through the HTTP bridge, including attempted calls to `logseq.provideStyle`, `logseq.App.registerUIItem`, and `logseq.App.setZoomFactor`.
- For DB graphs, do not assume a graph-local `logseq/custom.css` file exists.
- This workspace now contains an unpacked Logseq plugin under `logseq-db-degrande-colors/` (`package.json`, `index.html`, `plugin.js`, `custom.css`) that loads `custom.css` with `logseq.provideStyle`.
- The plugin exposes a main UI panel with preview, tags, and CSS tabs, live gradient editing, preset/custom tag colors, and reload controls.
- Verified title-gradient targeting for the current Logseq UI: page titles should be matched through `.block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container)` so the gradient spans the full title bar, including the page icon. The related tags live separately in the sibling `.ls-block-right .block-tags` area.
- Verified selector separation rule: linked-block gradients must exclude containers that include `.block-content-or-editor-wrap.ls-page-title-container`, or node gradient updates will bleed through and override the page-title gradient.

## Execution Notes
- On Windows, avoid fragile shell one-liners with embedded JSON when calling Logseq. Prefer a script file or browser `fetch` execution so the JSON body stays intact.
- When the user asks for tags, use `logseq.Editor.getAllTags()` first.
- For UI customization work in this workspace, prefer editing `logseq-db-degrande-colors/custom.css` and loading the unpacked plugin from `logseq-db-degrande-colors/` rather than relying on the HTTP bridge for style injection.
- For page title gradients, do not reuse generic linked-block selectors or broad `.block-title-wrap` matches. Keep linked-block gradients on their existing `.ls-block > div:first-child` path and target page titles specifically through `.block-main-content:has(.ls-page-title-container)`.
- When editing linked-block gradients, keep `.ls-block > div:first-child` scoped with `:not(:has(.block-content-or-editor-wrap.ls-page-title-container))` so node changes cannot override the page-title styling.