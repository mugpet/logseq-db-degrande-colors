---
name: logseq-http-api
description: 'Investigate Logseq DB graphs and the local HTTP API bridge. Use for Logseq tags, getAllTags, datascriptQuery, DB queries, plugin SDK methods, local API calls to 127.0.0.1:12315, user configs, and HTTP bridge capability checks.'
argument-hint: 'Provide the Logseq method to call, the token, and any JSON args.'
user-invocable: true
disable-model-invocation: false
---

# Logseq HTTP API

Use this skill when working against a running local Logseq desktop instance that exposes the HTTP API.

## Verified Facts

- The root endpoint serves built-in API docs.
- The callable endpoint is `POST /api`.
- Auth is required through `Authorization: Bearer <token>`.
- The body format is `{"method":"logseq.Namespace.method","args":[...]}`.
- Verified working methods in this environment:
  - `logseq.App.getCurrentGraph`
  - `logseq.App.getUserConfigs`
  - `logseq.Editor.getAllTags`
  - `logseq.UI.showMsg`
- Verified graph-specific caveat in this environment:
  - `logseq.Editor.getAllTags` can be incomplete for the DB graph tag browser; some tag-like pages are only recovered when merged with Datascript `:block/tags` and `:block/refs` results or `logseq.Editor.getAllPages`
- Verified bridge limitations in this environment:
  - `logseq.provideStyle`
  - `logseq.App.registerUIItem`
  - `logseq.App.setZoomFactor`
- Verified workspace customization path:
  - a local unpacked plugin at the repository root can load `custom.css` through `logseq.provideStyle` at plugin runtime
  - the plugin panel now includes preview, tags, and CSS tabs plus live gradient and tag-color controls
  - for `degrande-colors` publish work, do not open or prepare marketplace PRs unless the user explicitly asks; the normal path is repo update plus version bump and release tag
  - keep the plugin panel on Logseq's standard main UI handler; avoid blur backdrops and root-level pointer blocking that make the page feel hijacked or break panel interaction
  - `.ctl-section-inline` is shared by tab intro sections and preview-card internals, so do not apply a global `order` to that class
  - for the panel scroll layout, prefer `minmax(0, 1fr)` plus `min-height: 0` and avoid forcing `height: 100%` on `.ctl-tags-layout`, `.ctl-tags-detail-scroll`, or `.ctl-preview-scroll`
  - custom tag colors now propagate to tag-driven elements through plugin-generated CSS
  - for the current Logseq UI, page title gradients should target `.block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container)` so the gradient spans the full title bar and page icon; the corresponding tags are rendered in the sibling `.ls-block-right .block-tags` area
  - linked-block gradient selectors must exclude page-title containers with `:not(:has(.block-content-or-editor-wrap.ls-page-title-container))` so node updates do not override page-title gradients

## Procedure

1. Confirm the server is up by opening the root endpoint or reading the built-in docs.
2. Use the helper script at [./scripts/invoke-logseq-api.mjs](./scripts/invoke-logseq-api.mjs) for stable local calls.
3. Prefer high-level SDK methods first.
4. For tag coverage work, start with `logseq.Editor.getAllTags` but merge it with Datascript queries such as `[:find ?name :where [_ :block/tags ?t] [?t :block/name ?name]]` and `[:find ?name :where [_ :block/refs ?p] [?p :block/name ?name]]` when the graph appears to omit expected tags.
5. Only reach for `logseq.DB.datascriptQuery` when the editor/app methods are insufficient.
6. Record whether a method is working, failing, or ambiguous when investigating bridge coverage.
7. For persistent appearance changes in this workspace, edit `custom.css` and load the repository root as an unpacked plugin in Logseq.
8. For `degrande-colors` publish updates, treat a repo update plus version bump and release tag as the default publish path. Do not open or prepare marketplace PRs unless the user explicitly asks.
9. When adjusting the Degrande panel layout, keep the backdrop transparent and non-interactive unless the user explicitly asks for a modal effect.
10. When adjusting the Degrande panel layout, do not add a shared `order` rule to `.ctl-section-inline`; scope preview-card ordering/layout changes to `.ctl-preview-card .ctl-section-inline` instead.
11. For Degrande panel scroll fixes, use remaining-space grid rows and `min-height: 0` instead of forcing `height: 100%` on nested scroll wrappers.
12. For page title gradients, use `.block-main-content:has(.ls-page-title-container)` as the painted page-only row and keep linked-block gradients on their separate `.ls-block > div:first-child` selector path.
13. Do not broaden page-title rules to `.block-title-wrap` or other shared inner wrappers without a page-only container, or linked blocks will regress.
14. When node and page-title gradients coexist, exclude page-title containers from the linked-block selector with `:not(:has(.block-content-or-editor-wrap.ls-page-title-container))`.

## Examples

- List all tags:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.Editor.getAllTags`
- Show the current graph:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.App.getCurrentGraph`
- Show a Logseq toast:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.UI.showMsg --args '["Hello from the Logseq HTTP API","success"]'`

## References

- [./references/http-api.md](./references/http-api.md)