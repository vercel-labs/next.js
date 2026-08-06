/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Uncomment to restore the pre-16.3.0 behaviour — scroll resets to top again.
    // Left commented out on purpose so a fresh clone shows the bug.
    // appNewScrollHandler: false,
  },
};

export default nextConfig;
