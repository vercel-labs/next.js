/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
}
// Next <=14 only: allow toggling output file tracing to measure its cost.
if (process.env.NEXT_REPRO_TRACING === 'false') {
  config.outputFileTracing = false
}
module.exports = config
