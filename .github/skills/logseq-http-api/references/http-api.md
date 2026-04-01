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

## Page Title DOM Notes

- Custom tag colors now propagate to tag-driven blocks and other gradient consumers through plugin-generated CSS.
- In the current Logseq UI, the page title row that should receive the gradient is `.block-main-content:has(.block-content-or-editor-wrap.ls-page-title-container)`.
- The page-title tags are not children of the visible title text node; they are rendered separately in the sibling `.ls-block-right .block-tags` area.
- For page title gradients, use `.ls-page-title-container` as the page-only boundary, then paint the containing `.block-main-content` row so the gradient spans the full title bar and icon.
- Do not retarget page-title gradients through broad `.block-title-wrap` or generic linked-block selectors, or linked blocks will incorrectly pick up the title-gradient behavior.
- For linked-block gradients, keep the normal `.ls-block > div:first-child` selector but exclude page-title containers with `:not(:has(.block-content-or-editor-wrap.ls-page-title-container))`, or node-gradient edits will bleed through the transparent parts of the title row and override the page-title gradient.

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