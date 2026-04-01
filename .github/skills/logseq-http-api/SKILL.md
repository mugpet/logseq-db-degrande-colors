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
- Verified bridge limitations in this environment:
  - `logseq.provideStyle`
  - `logseq.App.registerUIItem`
  - `logseq.App.setZoomFactor`
- Verified workspace customization path:
  - a local unpacked plugin under `logseq-db-degrande-colors/` can load `custom.css` through `logseq.provideStyle` at plugin runtime
  - the plugin panel now includes preview, tags, and CSS tabs plus live gradient and tag-color controls
  - custom tag colors now propagate to tag-driven elements through plugin-generated CSS, but page title gradients remain partially unresolved in live Logseq because the title-row selector still needs exact DOM targeting

## Procedure

1. Confirm the server is up by opening the root endpoint or reading the built-in docs.
2. Use the helper script at [./scripts/invoke-logseq-api.mjs](./scripts/invoke-logseq-api.mjs) for stable local calls.
3. Prefer high-level SDK methods first.
4. Only reach for `logseq.DB.datascriptQuery` when the editor/app methods are insufficient.
5. Record whether a method is working, failing, or ambiguous when investigating bridge coverage.
6. For persistent appearance changes in this workspace, edit `logseq-db-degrande-colors/custom.css` and load `logseq-db-degrande-colors/` as an unpacked plugin in Logseq.
7. For the current title-gradient bug, inspect the live title-row DOM first; do not assume preview correctness means the runtime selectors are correct.

## Examples

- List all tags:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.Editor.getAllTags`
- Show the current graph:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.App.getCurrentGraph`
- Show a Logseq toast:
  - `node .github/skills/logseq-http-api/scripts/invoke-logseq-api.mjs --token iftla2wew --method logseq.UI.showMsg --args '["Hello from the Logseq HTTP API","success"]'`

## References

- [./references/http-api.md](./references/http-api.md)