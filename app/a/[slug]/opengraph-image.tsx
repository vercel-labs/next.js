import { ImageResponse } from 'next/og'

export const size = { width: 600, height: 300 }
export const contentType = 'image/png'

// no generateImageMetadata, no generateStaticParams (page has generateStaticParams)
export default async function Image({ params }: any) {
  const p = await params
  return new ImageResponse(
    (
      <div style={{ display: 'flex', fontSize: 48, background: '#fff', width: '100%', height: '100%' }}>
        {`a ${p?.slug}`}
      </div>
    ),
    size
  )
}
