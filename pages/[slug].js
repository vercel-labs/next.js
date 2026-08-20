export default function Slug({ slug }) {
  return <h1>blog post: {slug}</h1>
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      slug: params.slug,
      // typical CMS payload containing path-like strings
      canonical: '/post',
      related: ['/docs/[[...slug]]', '/api/internal/preview'],
    },
  }
}
