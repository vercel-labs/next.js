module.exports = {
  output: 'export',
  // fixed build id so only real (chunk hash) non-determinism shows up in diffs
  generateBuildId: () => 'fixed-build-id',
}
