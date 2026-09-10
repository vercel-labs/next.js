'use strict';

const { ConfigSymbol } = require('@demo/di-core');

// Simulates inversify's @inject metadata: the service class declares the DI identifiers it depends on.
// Note: the ConfigSymbol here comes from [the @demo/di-core instance that this module requires].
// If this package is externalized by the bundler while @demo/di-core gets bundled,
// the Symbol('Config') of the two di-core instances won't be equal, and container resolution fails.
exports.ServiceDeps = [ConfigSymbol];
