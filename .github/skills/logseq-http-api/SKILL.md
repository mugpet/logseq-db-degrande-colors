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
8. For page title gradients, use `.block-main-content:has(.ls-page-title-container)` as the painted page-only row and keep linked-block gradients on their separate `.ls-block > div:first-child` selector path.
9. Do not broaden page-title rules to `.block-title-wrap` or other shared inner wrappers without a page-only container, or linked blocks will regress.
10. When node and page-title gradients coexist, exclude page-title containers from the linked-block selector with `:not(:has(.block-content-or-editor-wrap.ls-page-title-container))`.

## Examples

- List all tags:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.Editor.getAllTags`
- Show the current graph:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.App.getCurrentGraph`
- Show a Logseq toast:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.UI.showMsg --args '["Hello from the Logseq HTTP API","success"]'`

## References

- [./references/http-api.md](./references/http-api.md)