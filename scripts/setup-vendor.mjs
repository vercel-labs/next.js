// npm links `file:` deps by symlink; webpack then sees the real (non-node_modules)
// path and transpiles it. Copy it so the module truly lives under node_modules/.
import { cp, rm, mkdir } from 'node:fs/promises'
await mkdir('node_modules', { recursive: true })
await rm('node_modules/vendor-lib', { recursive: true, force: true })
await cp('vendor-lib', 'node_modules/vendor-lib', { recursive: true })
console.log('copied vendor-lib into node_modules/')
