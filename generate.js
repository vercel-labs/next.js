// Generates the module chain + late Tailwind entry CSS files used to make the
// runtime-chunk race deterministic. See README.md.
const fs = require('fs');
const path = require('path');

const N = 300; // depth of the import chain that delays the webpack-loader transform
const CSS = 24; // Tailwind entry CSS files imported at the end of that chain

const dir = path.join(__dirname, 'app', 'zz-txt');
fs.rmSync(path.join(dir, 'chain'), { recursive: true, force: true });
fs.mkdirSync(path.join(dir, 'chain'), { recursive: true });

let imports = '';
for (let k = 1; k <= CSS; k++) {
  fs.writeFileSync(
    path.join(dir, `late${k}.css`),
    `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n/* late ${k} */\n`
  );
  imports += `import "../late${k}.css";\n`;
}

for (let i = 0; i < N; i++) {
  const body =
    i === N - 1
      ? `import data from "../data.txt";\n${imports}export const v${i} = data;\n`
      : `import { v${i + 1} } from "./m${i + 1}.js";\nexport const v${i} = v${i + 1} + "${i}";\n`;
  fs.writeFileSync(path.join(dir, 'chain', `m${i}.js`), body);
}
console.log(`generated ${N} chain modules and ${CSS} css entries`);
