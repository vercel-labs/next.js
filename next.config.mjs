/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_NAME: process.env.APP_NAME,
  },
  compiler: {
      styledComponents: true,
  },
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: "img.clerk.com",
          },
      ],

  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

export default nextConfig;
