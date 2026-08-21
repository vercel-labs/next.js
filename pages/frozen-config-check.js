// Server-side proof that Next.js deep-freezes images.qualities / images.deviceSizes
// in production: required-server-files.json is loaded through loadManifest(),
// which applies deepFreeze(). That frozen object becomes ImageConfigContext.
export async function getServerSideProps() {
  const path = require('path')
  const { loadManifest } = require('next/dist/server/load-manifest.external.js')
  const manifest = loadManifest(
    path.join(process.cwd(), '.next', 'required-server-files.json')
  )
  const images = manifest.config.images
  let sortError = null
  try {
    images.qualities.sort((a, b) => a - b)
  } catch (err) {
    sortError = String(err && err.message)
  }
  return {
    props: {
      frozenQualities: Object.isFrozen(images.qualities),
      frozenDeviceSizes: Object.isFrozen(images.deviceSizes),
      sortError,
    },
  }
}

export default function FrozenConfigCheck(props) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>
}
