---
applyTo: "**/*.{md,mjs,js,ts,json}"
description: "Use for files and docs related to Logseq DB graph investigation, the local HTTP API, tag queries, plugin SDK bridge calls, and Logseq automation scripts."
---

# Logseq HTTP API File Guidance

- Use `POST /api` with a JSON body containing `method` and `args`.
- Keep examples concrete and reproducible against a local Logseq desktop instance.
- Prefer documented SDK method names such as `logseq.Editor.getAllTags` instead of undocumented internal endpoints.
- In this investigated DB graph, treat `logseq.Editor.getAllTags` as the first source for tags, but not necessarily the complete source. If tag coverage matters, merge it with Datascript results such as `:block/tags` and `:block/refs`, and fall back to `logseq.Editor.getAllPages()` for missing tag-like pages.
- Document whether a method was verified working, inferred from docs, or verified failing through the HTTP bridge.
- When discussing UI customization for DB graphs, note that a file-backed `custom.css` was not found in the investigated graph and runtime style injection was not exposed through the HTTP bridge in this environment.
- In this workspace, the repository root contains the unpacked plugin that loads `custom.css`; prefer evolving that plugin for persistent UI changes.
- For `degrande-colors` publish work in this repo, do not open or prepare marketplace PRs unless the user explicitly asks. Treat a repo update plus version bump and release tag as the default publish path.
- For `degrande-colors` styling work, keep the managed host `<style>` path for unpacked/accessible-host contexts, but preserve the `logseq.provideStyle` fallback for packaged installs where direct host-document styling is unavailable.
- When touching packaged-style fallback logic, emit neutral per-tag reset rules for known tags as well as active custom rules so stale published tag colors and gradients do not survive resets.
- For the Degrande plugin panel, keep the panel on Logseq's normal main UI handler. Do not add blur/tint backdrops or root-level pointer blocking unless the user explicitly asks for a modal overlay.
- In the Degrande panel CSS, do not assign a global `order` to `.ctl-section-inline`; that class is shared by the tab intro blocks and the preview-card inline sections.
- For Degrande panel scroll fixes, prefer grid rows with `minmax(0, 1fr)` and `min-height: 0`. Do not force `height: 100%` on `.ctl-tags-layout`, `.ctl-tags-detail-scroll`, or `.ctl-preview-scroll`.
- If page title gradients are involved, use the resolved DOM shape from the live app: the page title row is `.block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container)`, which lets the gradient span the full bar and page icon, while the tags are rendered separately in `.ls-block-right .block-tags`.
- Do not use broad `.block-title-wrap` or generic linked-block selectors for page titles. Keep page-title rules isolated to `.block-main-content:has(.ls-page-title-container)` so linked blocks retain their own gradient behavior.
- If linked-block gradients are involved at the same time, explicitly exclude page-title containers from the linked-block selector with `:not(:has(.block-content-or-editor-wrap.ls-page-title-container))` to prevent node settings from overriding page-title gradients.