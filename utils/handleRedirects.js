// Mirrors the reporter's setup: a helper required by the custom server that
// (transitively) pulls in a Next.js module using the shared AsyncLocalStorage.
require('next/headers')

module.exports = function handleRedirects(req, res, next) {
  next()
}
