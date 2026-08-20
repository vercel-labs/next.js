import { getImageProps } from 'next/image'
export default function P() {
  const common = { alt: 'art', sizes: '100vw', priority: true }
  const { props: desktop } = getImageProps({ ...common, width: 800, height: 300, quality: 80, src: '/wide.png' })
  const { props: mobile } = getImageProps({ ...common, width: 400, height: 400, quality: 70, src: '/ball.png' })
  return (
    <picture>
      <source media="(min-width: 500px)" srcSet={desktop.srcSet} width={desktop.width} height={desktop.height} />
      <img {...mobile} />
    </picture>
  )
}
