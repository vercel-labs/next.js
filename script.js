// CJS: works
require("@next/env").loadEnvConfig(process.cwd());
console.log("cjs TEST =", process.env.TEST);
