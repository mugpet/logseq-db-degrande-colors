const fs = require('fs');
let css = fs.readFileSync('custom.css', 'utf8');

// Replace all `--grad-<token>: anything` with `--grad-<token>: var(--bd-<token>);`
css = css.replace(/([\s\{])--grad-([^:]+):\s*[^;]+;/g, '$1--grad-$2: var(--bd-$2);');
fs.writeFileSync('custom.css', css);

let main = fs.readFileSync('plugin-main.js', 'utf8');
const searchFallback = /if \(panelState\.themeMode === "dark"\) {\s*const rgb = hexToRgb\(preset\.darkBorder\);\s*return rgb \? rgbToCss\(rgb, 0\.25\) : preset\.darkBorder;\s*}\s*return preset\.lightBg;/g;
main = main.replace(searchFallback, 'if (panelState.themeMode === "dark") {\n    return preset.darkBorder;\n  }\n\n  return preset.lightBorder;');
main = main.replace(/FALLBACK_PLUGIN_VERSION = "0\.4\.11"/, 'FALLBACK_PLUGIN_VERSION = "0.4.12"');
fs.writeFileSync('plugin-main.js', main);

let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = "0.4.12";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + "\n");

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/0\.4\.11/g, '0.4.12');
fs.writeFileSync('index.html', html);

console.log("Done upgrading styles!");
