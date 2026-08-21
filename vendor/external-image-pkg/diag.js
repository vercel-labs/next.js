const React = require('react')
const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime')

exports.Diag = function Diag() {
  const ctx = React.useContext(ImageConfigContext)
  const info = {
    configEnvType: typeof process.env.__NEXT_IMAGE_OPTS,
    ctxQualities: ctx && ctx.qualities,
    ctxQualitiesFrozen: !!(ctx && ctx.qualities && Object.isFrozen(ctx.qualities)),
    ctxDeviceSizesFrozen: !!(ctx && ctx.deviceSizes && Object.isFrozen(ctx.deviceSizes)),
    ctxFrozen: !!(ctx && Object.isFrozen(ctx)),
    isServer: typeof window === 'undefined',
  }
  let sortError = null
  if (typeof window === 'undefined' && ctx && ctx.deviceSizes) {
    try {
      ctx.deviceSizes.sort((a, b) => a - b)
    } catch (e) {
      sortError = String(e && e.message)
    }
  }
  return React.createElement('pre', null, JSON.stringify({ ...info, sortError }, null, 2))
}
