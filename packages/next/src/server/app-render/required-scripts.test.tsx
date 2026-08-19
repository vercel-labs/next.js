import React from 'react'
import type { BuildManifest } from '../get-page-files'
import { getRequiredScripts } from './required-scripts'

// A CDN on a different registrable domain than the document, i.e. the setup the
// `assetPrefix` docs describe. Chrome 139+ delays *execution* of cross-site
// classic `async` scripts (Blink's `kLowPriorityAsyncScriptExecution`, which
// defaults to `cross_site_only: true`) unless they opt out with
// `fetchpriority="high"`, which stalls React hydration on the chunks it needs.
// See https://github.com/vercel/next.js/issues/97531.
const ASSET_PREFIX = 'https://cdn.example.com'

const ROOT_MAIN_FILES = [
  'static/chunks/webpack.js',
  'static/chunks/main-app.js',
  'static/chunks/framework.js',
]

async function renderScriptTags(
  SRIManifest?: Record<string, string>
): Promise<string[]> {
  const buildManifest = {
    rootMainFiles: ROOT_MAIN_FILES,
  } as unknown as BuildManifest

  const [preinitScripts, bootstrapScript] = getRequiredScripts(
    buildManifest,
    ASSET_PREFIX,
    undefined,
    SRIManifest,
    '',
    undefined,
    '/page'
  )

  function App() {
    preinitScripts()
    return React.createElement(
      'html',
      null,
      React.createElement('body', null, 'hello')
    )
  }

  const { renderToReadableStream } =
    require('react-dom/server.edge') as typeof import('react-dom/server.edge')
  const stream = await renderToReadableStream(React.createElement(App), {
    bootstrapScripts: [bootstrapScript.src],
  })
  await stream.allReady

  let html = ''
  const decoder = new TextDecoder()
  const reader = stream.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    html += decoder.decode(value, { stream: true })
  }
  html += decoder.decode()

  return (html.match(/<script[^>]*><\/script>/g) ?? []).filter(
    (tag) =>
      tag.includes(`src="${ASSET_PREFIX}/_next/`) &&
      // The bootstrap script is emitted by React itself and cannot carry a
      // fetch priority today, so it is not covered by this test.
      !tag.includes('id="_R_"')
  )
}

describe('getRequiredScripts', () => {
  it('marks preinited chunk scripts as high fetch priority', async () => {
    const scriptTags = await renderScriptTags()

    expect(scriptTags).toHaveLength(ROOT_MAIN_FILES.length - 1)
    for (const tag of scriptTags) {
      expect(tag).toMatch(/async=""/)
      expect(tag).toMatch(/fetchPriority="high"/)
    }
  })

  it('marks preinited chunk scripts as high fetch priority with SRI', async () => {
    const scriptTags = await renderScriptTags(
      Object.fromEntries(
        ROOT_MAIN_FILES.map((file) => [file, `sha256-${file}`])
      )
    )

    expect(scriptTags).toHaveLength(ROOT_MAIN_FILES.length - 1)
    for (const tag of scriptTags) {
      expect(tag).toMatch(/async=""/)
      expect(tag).toMatch(/integrity="sha256-/)
      expect(tag).toMatch(/fetchPriority="high"/)
    }
  })
})
