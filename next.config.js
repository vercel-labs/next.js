/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  async rewrites() {
    const local = (name) => ({
      source: `/local/${name}`,
      destination: `http://127.0.0.1:4000/${name}`,
    })
    return [
      local('gzip'),
      local('gzip-chunked'),
      local('br'),
      local('plain'),
      local('bad-length'),
      local('close'),
      local('redirect'),
      local('abort'),
      // double slash in destination, like the original report
      {
        source: '/local/double-slash',
        destination: 'http://127.0.0.1:4000//gzip',
      },
      // real https upstream (plausible), like the original report
      {
        source: '/js/plausible.js',
        destination: 'https://plausible.io/js/script.js',
      },
      // the exact upstream from the issue, including its double slash
      {
        source: '/js/script.file-downloads.hash.outbound-links.tagged-events.js',
        destination:
          'https://analytics.thedannicraft.de//js/script.file-downloads.hash.outbound-links.tagged-events.js',
      },
    ]
  },
}
