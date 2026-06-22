// Patch react-native-css-interop printUpgradeWarning to not crash
// when stringifying props that contain navigation context getters
/* global __dirname */
const fs = require('fs');
const path = require('path');

const candidates = [
  path.join(
    __dirname,
    '..',
    'node_modules',
    'react-native-css-interop',
    'dist',
    'runtime',
    'native',
    'render-component.js',
  ),
  path.join(
    __dirname,
    '..',
    'node_modules',
    'nativewind',
    'node_modules',
    'react-native-css-interop',
    'dist',
    'runtime',
    'native',
    'render-component.js',
  ),
];

let target = candidates.find((c) => {
  try {
    fs.accessSync(c);
    return true;
  } catch {
    return false;
  }
});
if (!target) {
  console.error('[postinstall] No se encontró render-component.js para parchar');
  process.exit(1);
}

let content = fs.readFileSync(target, 'utf8');

const patched = content
  .replace(
    `function printUpgradeWarning(warning, originalProps) {\n    console.log(\`CssInterop upgrade warning.\\n\\n\${warning}.\\n\\nThis warning was caused by a component with the props:\\n\${stringify(originalProps)}\\n\\nIf adding or removing sibling components caused this warning you should add a unique "key" prop to your components. https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key\\n\`);\n}`,
    `function printUpgradeWarning(warning, originalProps) {
    var propsStr;
    try {
        propsStr = stringify(originalProps);
    }
    catch (e) {
        propsStr = "[Error: ".concat(e.message, "]");
    }
    console.log("CssInterop upgrade warning.\\n\\n".concat(warning, ".\\n\\nThis warning was caused by a component with the props:\\n").concat(propsStr, "\\n\\nIf adding or removing sibling components caused this warning you should add a unique \\"key\\" prop to your components. https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key\\n"));
}`,
  )
  .replace(
    `        const newValue = Array.isArray(value) ? [] : {};\n        for (const entry of Object.entries(value)) {\n            newValue[entry[0]] = replace(entry[0], entry[1]);\n        }`,
    `        var newValue = Array.isArray(value) ? [] : {};
        try {
            for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
                var entry = _a[_i];
                newValue[entry[0]] = replace(entry[0], entry[1]);
            }
        }
        catch (e) {
            seen.delete(value);
            return "[Error: ".concat(e.message, "]");
        }`,
  );

if (content !== patched) {
  fs.writeFileSync(target, patched, 'utf8');
  console.log('[postinstall] react-native-css-interop patched successfully');
} else {
  console.log('[postinstall] react-native-css-interop already patched');
}
