/**
 * Mirrors a `vercel build` for a prebuilt deployment:
 *   NEXT_DEPLOYMENT_ID=<custom id>  is the build-time custom deployment ID
 *   (the key prebuilt Skew Protection pins by; it lands in routes-manifest.json)
 *
 * Set REPRO_DISABLE_RUNTIME_ID=1 to apply the reporter's workaround.
 */
module.exports = {
  output: 'standalone',
  deploymentId: process.env.NEXT_DEPLOYMENT_ID,
  ...(process.env.REPRO_DISABLE_RUNTIME_ID
    ? { experimental: { runtimeServerDeploymentId: false } }
    : {}),
};
