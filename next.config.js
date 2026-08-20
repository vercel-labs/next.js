/** @type {import('next').NextConfig} */
module.exports = {
  // Pages Router app that has had `deploymentId` set "for years".
  // Before 16.2 this only appended ?dpl=<id> to asset URLs.
  // Since #89325 (16.2) a `deploymentId` mismatch on a /_next/data response
  // also forces a hard navigation (E989).
  deploymentId: process.env.DPL,
  // Pinned so the two "pods" differ ONLY by deploymentId. Without this, a
  // differing buildId makes /_next/data/<buildId>/... 404 and would force a
  // hard reload for reasons unrelated to the 16.2 change.
  generateBuildId: () => 'fixed-build-id',
  distDir: process.env.DIST_DIR || '.next',
}
