---
applyTo: "**/*.{md,mjs,js,ts,json}"
description: "Use for files and docs related to Logseq DB graph investigation, the local HTTP API, tag queries, plugin SDK bridge calls, and Logseq automation scripts."
---

# Logseq HTTP API File Guidance

- Use `POST /api` with a JSON body containing `method` and `args`.
- Keep examples concrete and reproducible against a local Logseq desktop instance.
- Prefer documented SDK method names such as `logseq.Editor.getAllTags` instead of undocumented internal endpoints.
- Document whether a method was verified working, inferred from docs, or verified failing through the HTTP bridge.
- When discussing UI customization for DB graphs, note that a file-backed `custom.css` was not found in the investigated graph and runtime style injection was not exposed through the HTTP bridge in this environment.
- In this workspace, `logseq-db-degrande-colors/` contains the unpacked plugin that loads `custom.css`; prefer evolving that plugin for persistent UI changes.