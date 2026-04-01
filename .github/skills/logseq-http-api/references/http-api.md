# Logseq HTTP API Notes

## Endpoint Shape

- Base docs endpoint: `http://127.0.0.1:12315/`
- API endpoint: `http://127.0.0.1:12315/api`
- Required headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

## Request Body

```json
{
  "method": "logseq.Editor.getAllTags",
  "args": []
}
```

## Verified Results

- `logseq.App.getCurrentGraph` returned the active graph metadata.
- `logseq.App.getUserConfigs` returned user settings including theme mode and current graph.
- `logseq.Editor.getAllTags` returned 21 tags in the investigated graph.
- `logseq.UI.showMsg` displayed an in-app toast successfully.

## Observed Limitations

- Root style injection via `logseq.provideStyle` was not available through the bridge.
- Registration and direct UI mutation attempts such as `logseq.App.registerUIItem` and `logseq.App.setZoomFactor` failed through the bridge.
- A graph-local `custom.css` file was not found in the investigated DB graph folder.

## Workspace Plugin Path

- The workspace contains an unpacked plugin scaffold under `logseq-db-degrande-colors/` that loads `custom.css` through plugin runtime instead of the HTTP bridge.
- Use Logseq Developer mode and `Load unpacked plugin` against `logseq-db-degrande-colors/` to activate it.
- This is the preferred route for persistent UI changes discovered during this investigation.
- The plugin now includes preview, tags, and CSS tabs, live gradient editing, tag color assignment, and in-panel reload controls.

## Known UI Issue

- Custom tag colors now propagate to tag-driven blocks and other gradient consumers through plugin-generated CSS.
- The remaining unresolved bug is page title gradients in the live Logseq UI: the plugin preview can show the correct title gradient while the real page title still renders with the wrong gradient shape.
- Reordering CSS rules was not sufficient. The next investigation should inspect the exact page-title wrapper rendered by Logseq and target that concrete DOM shape instead of relying on generic `h1.title`, `.journal-title`, or broad `div:has(...)` fallbacks.

## Current Tag Set From The Investigated Graph

- Access
- Azure
- Card
- Cards
- Code
- Company
- DevOps
- EnergyConnect
- Image
- Login
- Math
- Person
- Project
- QMS
- Query
- Questions
- Quote
- Region
- Role
- Task
- Template