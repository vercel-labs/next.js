export const dynamic = 'force-dynamic'
export default function Gallery() {
  return (
    <div>
      <h1 id="gallery">gallery</h1>
      {Array.from({ length: 12 }, (_, i) => (
        <img key={i} src={`/api/thumbnail?g=${i}`} width={64} height={64} alt="" />
      ))}
    </div>
  )
}
