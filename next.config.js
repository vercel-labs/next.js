/** @type {import('next').NextConfig} */
module.exports = {
  // Unrelated to this issue: the generated type validator treats `sitemap.ts`
  // as a route handler, so type checking is skipped to keep the repro focused.
  typescript: { ignoreBuildErrors: true },
}
