// Renders the same external-package <Image> through ReactDOMServer so the
// TypeError (which otherwise only shows up as a 500 in the platform logs)
// is visible in the HTTP response.
export async function getServerSideProps() {
  const React = require('react')
  const { renderToString } = require('react-dom/server')
  const {
    ImageConfigContext,
  } = require('next/dist/shared/lib/image-config-context.shared-runtime')
  const path = require('path')
  const {
    loadManifest,
  } = require('next/dist/server/load-manifest.external.js')
  const { PkgImage } = require('external-image-pkg')

  // Exactly what Next.js does in production: the config is read from
  // required-server-files.json through loadManifest(), which deepFreeze()s it,
  // and is then handed to ImageConfigContext by base-server/render.
  const images = loadManifest(
    path.join(process.cwd(), '.next', 'required-server-files.json')
  ).config.images

  let error = null
  try {
    renderToString(
      React.createElement(
        ImageConfigContext.Provider,
        { value: images },
        React.createElement(PkgImage, {
          src: 'https://picsum.photos/id/100/1200/800',
          alt: 'repro',
          width: 1200,
          height: 800,
          quality: 90,
        })
      )
    )
  } catch (err) {
    error = { message: String(err && err.message), stack: String(err && err.stack) }
  }

  return {
    props: {
      qualitiesFrozen: Object.isFrozen(images.qualities),
      deviceSizesFrozen: Object.isFrozen(images.deviceSizes),
      configEnvType: typeof process.env.__NEXT_IMAGE_OPTS,
      error,
    },
  }
}

export default function ExternalPkgError(props) {
  return <pre>{JSON.stringify(props, null, 2)}</pre>
}
