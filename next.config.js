module.exports = {
  // 120 non-static routes each pull in the same 20k-file glob during
  // "Collecting build traces" -> heap blows up.
  outputFileTracingIncludes: {
    '/api/**': ['./data/**/*'],
  },
}
