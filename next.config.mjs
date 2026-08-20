// Simulates a monorepo package that has not been built yet:
// "some-package" declares only a subpath export, so importing the root fails.
import somePlugin from 'some-package'

export default somePlugin({})
