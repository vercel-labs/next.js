import fs from 'node:fs'
import { AsyncLocalStorage } from 'node:async_hooks'
const als = new AsyncLocalStorage<string>()
console.log('[node-instrumentation] loaded, cwd entries:', fs.readdirSync(process.cwd()).length, typeof als)
