import Link from 'next/link'
import { useRouter } from 'next/router'

export default function IndexPage() {
  const router = useRouter()
  const photoId = router.query.photoId

  function nextPhoto() {
    const nextId = Number(photoId) + 1
    router.push(
      { query: { photoId: nextId } },
      `/p/${nextId}`,
      { shallow: true }
    )
  }

  return (
    <main data-page="index">
      <h1>Gallery index</h1>
      <Link
        href="/?photoId=0"
        as="/p/0"
        shallow
        prefetch={false}
        data-testid="photo-0"
      >
        Open photo 0
      </Link>
      {photoId !== undefined && (
        <section role="dialog" aria-label="Carousel">
          <p data-testid="carousel">Carousel photo {photoId}</p>
          <button onClick={nextPhoto}>Next photo</button>
        </section>
      )}
    </main>
  )
}
