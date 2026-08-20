/** @type {import('next').NextConfig} */
module.exports = (phase, { defaultConfig }) => ({
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'export',
})
