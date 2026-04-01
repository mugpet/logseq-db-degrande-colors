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

## Execution Notes
- On Windows, avoid fragile shell one-liners with embedded JSON when calling Logseq. Prefer a script file or browser `fetch` execution so the JSON body stays intact.
- When the user asks for tags, use `logseq.Editor.getAllTags()` first.
- For UI customization work in this workspace, prefer editing `logseq-db-degrande-colors/custom.css` and loading the unpacked plugin from `logseq-db-degrande-colors/` rather than relying on the HTTP bridge for style injection.