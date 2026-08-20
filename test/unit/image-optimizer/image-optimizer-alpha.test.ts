/* eslint-env jest */
import {
  getImageEtag,
  getSharp,
  imageOptimizer,
} from 'next/dist/server/image-optimizer'
import { readFile } from 'fs-extra'
import { join } from 'path'

const nextConfig = {
  experimental: {
    imgOptConcurrency: null,
    imgOptOperationCache: null,
    imgOptMaxInputPixels: null,
    imgOptSequentialRead: null,
    imgOptTimeoutInSeconds: 7,
  },
  images: {
    dangerouslyAllowSVG: false,
    minimumCacheTTL: 60,
  },
} as unknown as Parameters<typeof imageOptimizer>[2]

async function optimize(filepath: string, mimeType: string | null) {
  const buffer = await readFile(join(__dirname, filepath))
  return imageOptimizer(
    {
      buffer,
      contentType: null,
      cacheControl: null,
      etag: getImageEtag(buffer),
    },
    { href: `/${filepath}`, width: 32, quality: 75, mimeType },
    nextConfig,
    { silent: true }
  )
}

describe('imageOptimizer transparency fallback', () => {
  it('should keep transparency when webp with alpha is downleveled for old browsers', async () => {
    // A browser that does not accept image/webp (e.g. Safari 13) results in
    // `mimeType` being empty so the optimizer picks the fallback format.
    const { contentType, buffer } = await optimize(
      'images/transparent.webp',
      ''
    )

    expect(contentType).toBe('image/png')

    const sharp = getSharp(null, null)
    const metadata = await sharp(buffer).metadata()
    expect(metadata.format).toBe('png')
    expect(metadata.hasAlpha).toBe(true)

    // The top-left pixel is fully transparent in the source image and must stay
    // transparent instead of being flattened to opaque black.
    const { data } = await sharp(buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const topLeftAlpha = data[3]
    expect(topLeftAlpha).toBe(0)
  })

  it('should keep using jpeg when webp without alpha is downleveled for old browsers', async () => {
    const { contentType } = await optimize('images/opaque.webp', '')

    expect(contentType).toBe('image/jpeg')
  })
})
