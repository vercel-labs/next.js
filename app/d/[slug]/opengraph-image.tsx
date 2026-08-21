import { ImageResponse } from 'next/og'

export const size = { width: 600, height: 300 }
export const contentType = 'image/png'

// generateStaticParams + generateImageMetadata in the same file
export function generateStaticParams() {
  return [{ slug: 'one' }, { slug: 'two' }]
}

export function generateImageMetadata() {
  return [
    { id: 'small', size, contentType, alt: 'small' },
    { id: 'large', size, contentType, alt: 'large' },
  ]
}

export default async function Image({ params, id }: any) {
  const p = await params
  return new ImageResponse(
    (
      <div style={{ display: 'flex', fontSize: 48, background: '#fff', width: '100%', height: '100%' }}>
        {`d ${p?.slug} ${id}`}
      </div>
    ),
    size
  )
}
