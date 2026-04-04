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
  - a local unpacked plugin under `logseq-db-degrande-colors/` can load `custom.css` through `logseq.provideStyle` at plugin runtime
  - the plugin panel now includes preview, tags, and CSS tabs plus live gradient and tag-color controls
  - in Logseq DB mode, Degrande state that should follow the graph must be stored in graph-backed DB properties rather than plugin settings; controls and gradients should live in graph-backed DB properties and tag colors should live on the actual tag/page entities
  - for DB tag-color reads in `logseq-db-degrande-colors`, prefer Datascript/property-query loading over per-tag `Editor.getBlockProperty` fallback reads; some DB tag/page entities can throw on the fallback path
  - keep a manual sync action in the Degrande panel plus event-driven reload hooks and limited startup refresh retries; avoid recurring timer polling unless the user explicitly asks for it
  - for the Degrande panel sync affordance, prefer a small clickable status dot with tooltip text plus a visible revision label sourced from a graph-backed revision property; bump that revision value on successful graph-backed writes, and when other instances observe a higher revision through the existing DB/app hooks, emit a revision-change event and show the new revision number in a Logseq message
  - when opening the Degrande panel, refresh from the latest synced graph state before the user edits anything so the controls, tag colors, and visible revision are current for that instance
  - in `plugin-main.js`, keep sync/helper functions outside the `getToolbarStyle()` template literal; that function should emit CSS text only, and mixing JS into the template will break startup at runtime
  - for `logseq-db-degrande-colors` publish work, do not open or prepare marketplace PRs unless the user explicitly asks; the normal path is repo update plus version bump and release tag
  - published installs now keep styling working through a packaged-plugin `logseq.provideStyle` fallback when direct host-document style injection is unavailable; do not remove that fallback when editing publish-facing code
  - packaged fallback updates must emit neutral per-tag reset rules for known tags so stale published tag styles do not survive after a reset
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
7. For persistent appearance changes in this workspace, edit `logseq-db-degrande-colors/custom.css` and load `logseq-db-degrande-colors/` as an unpacked plugin in Logseq.
8. For Logseq DB persistence work in `logseq-db-degrande-colors`, keep graph-owned appearance state in DB properties. Do not use plugin settings as the primary persistence target when the state is expected to survive with the graph across devices.
9. For `logseq-db-degrande-colors` publish updates, treat a repo update plus version bump and release tag as the default publish path. Do not open or prepare marketplace PRs unless the user explicitly asks.
10. For Degrande styling changes, keep one managed host `<style>` element when the host document is accessible, but preserve the `logseq.provideStyle` fallback for packaged installs that cannot reach the host document directly.
11. When packaged fallback styling is involved, generate neutral per-tag reset rules for known tags in addition to active custom rules so stale published colors and gradients are actually cleared.
12. When adjusting the Degrande panel layout, keep the backdrop transparent and non-interactive unless the user explicitly asks for a modal effect.
13. When adjusting the Degrande panel layout, do not add a shared `order` rule to `.ctl-section-inline`; scope preview-card ordering/layout changes to `.ctl-preview-card .ctl-section-inline` instead.
14. For Degrande panel scroll fixes, use remaining-space grid rows and `min-height: 0` instead of forcing `height: 100%` on nested scroll wrappers.
15. For page title gradients, use `.block-main-content:has(.ls-page-title-container)` as the painted page-only row and keep linked-block gradients on their separate `.ls-block > div:first-child` selector path.
16. Do not broaden page-title rules to `.block-title-wrap` or other shared inner wrappers without a page-only container, or linked blocks will regress.
17. When node and page-title gradients coexist, exclude page-title containers from the linked-block selector with `:not(:has(.block-content-or-editor-wrap.ls-page-title-container))`.

## Examples

- List all tags:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.Editor.getAllTags`
- Show the current graph:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.App.getCurrentGraph`
- Show a Logseq toast:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.UI.showMsg --args '["Hello from the Logseq HTTP API","success"]'`

## References

- [./references/http-api.md](./references/http-api.md)