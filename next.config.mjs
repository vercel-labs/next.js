/** @type {import('next').NextConfig} */
const nextConfig = {
  // cacheComponents is what makes every request run a prerender pass whose
  // render controllers get aborted; partialPrefetching is what builds the
  // per-segment RSC payloads (`segmentData`) that end up inside the retained
  // graph. output: standalone so the server can be started with --expose-gc.
  cacheComponents: true,
  partialPrefetching: true,
  output: "standalone",
};
export default nextConfig;
