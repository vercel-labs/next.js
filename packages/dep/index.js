// Untransformed: plugin must rewrite `import { hello } from 'lib'`
// into `import hello from 'lib/hello'`. `lib` has no main entry,
// so if the SWC plugin does not run, resolution fails.
import { hello } from 'lib'
export function fromDep() { return hello }
