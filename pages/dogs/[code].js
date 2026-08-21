export default function BreedPage({ dog }) {
  return (
    <>
      <h1>Single Breed Page</h1>
      <h2 id="name">{dog.name}</h2>
    </>
  )
}
export const getStaticPaths = async () => ({ paths: [], fallback: 'blocking' })
export async function getStaticProps(ctx) {
  return { props: { dog: { id: ctx.params.code, name: ctx.params.code } }, revalidate: 3600 }
}
