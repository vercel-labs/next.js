// ESM: throws SyntaxError: Named export 'loadEnvConfig' not found.
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
console.log("esm TEST =", process.env.TEST);
