import { getImgProps } from './get-img-props'
import { imageConfigDefault } from './image-config'
import type { ImageConfigComplete } from './image-config'

function loader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  return `${src}?w=${width}&q=${quality || 75}`
}

function getSrcSetWidths(srcSet: string | undefined): number[] {
  if (!srcSet) return []
  return srcSet
    .split(', ')
    .map((candidate) => Number(candidate.split(' ')[1].replace('w', '')))
}

describe('getImgProps() srcSet widths', () => {
  // https://github.com/vercel/next.js/issues/27547
  it('should not include widths that are unreachable for absolute px `sizes`', () => {
    const imgConf: ImageConfigComplete = {
      ...imageConfigDefault,
      deviceSizes: [
        144, 164, 184, 208, 234, 303, 358, 440, 488, 503, 524, 606, 640, 716,
        750, 766, 828, 880, 1080, 1200, 1920, 2048, 3840,
      ],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    }
    // The image is never wider than 280px, so at most 280 * 3 (DPR 3) = 840px
    // of image data can ever be displayed.
    const sizes = [
      '(max-width: 399px) 184px',
      '(max-width: 519px) 244px',
      '(max-width: 639px) 200px',
      '(max-width: 767px) 156px',
      '(max-width: 1023px) 220px',
      '(max-width: 1279px) 280px',
      '280px',
    ].join(',')

    const { props } = getImgProps(
      { alt: 'test', src: '/test.jpg', fill: true, sizes },
      { defaultLoader: loader as any, imgConf }
    )

    const widths = getSrcSetWidths(props.srcSet)
    const allSizes = [...imgConf.deviceSizes, ...imgConf.imageSizes].sort(
      (a, b) => a - b
    )
    // Largest useful candidate: the first configured width at or above 840px.
    const upperBound = allSizes.find((s) => s >= 280 * 3) as number
    expect(upperBound).toBe(880)

    expect(props.sizes).toBe(sizes)
    // Widths that could actually be requested must still be present.
    expect(widths).toEqual(expect.arrayContaining([184, 303, 640, 828]))
    // Widths larger than the largest useful candidate can never be requested.
    expect(widths.filter((w) => w > upperBound)).toEqual([])
    expect(
      Number(new URL(props.src, 'http://n').searchParams.get('w'))
    ).toBeLessThanOrEqual(upperBound)
  })

  it('should trim widths that are too small for `vw` based `sizes`', () => {
    const { props } = getImgProps(
      { alt: 'test', src: '/test.jpg', fill: true, sizes: '100vw' },
      { defaultLoader: loader as any, imgConf: imageConfigDefault }
    )
    expect(getSrcSetWidths(props.srcSet)).toEqual([
      640, 750, 828, 1080, 1200, 1920, 2048, 3840,
    ])
  })
})
