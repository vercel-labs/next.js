import Image from 'next/image'

// Exact image URLs served by the docs demo https://next-blog-wordpress.vercel.app/
const COVER =
  'https://vercelsolutions.com/wp-content/uploads/2022/06/claudio-schwarz-ZuT6efbmt8U-unsplash-scaled.jpg'
const AVATAR =
  'https://secure.gravatar.com/avatar/b58996c504c5638798eb6b511e6f49af?s=96&d=mm&r=g'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main>
      <h1>next.js#94807 — cms-wordpress demo cover images</h1>
      <section>
        <h2 id="cover">Cover image (WordPress origin vercelsolutions.com) — broken</h2>
        <Image id="cover-img" src={COVER} alt="Cover Image" width={800} height={450} />
      </section>
      <section>
        <h2 id="avatar">Author avatar (secure.gravatar.com) — works</h2>
        <Image id="avatar-img" src={AVATAR} alt="Avatar" width={96} height={96} />
      </section>
    </main>
  )
}
