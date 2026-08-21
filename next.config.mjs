import createMDX from '@next/mdx';

/**
 * MDX configuration using the official @next/mdx integration.
 * This mirrors a standard App Router + MDX setup with no custom webpack config.
 */
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

export default withMDX(nextConfig);

