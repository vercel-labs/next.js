export default function CatchAll({ params }) {
  return (
    <>
      <p id="page">catch-all</p>
      <p id="params">{JSON.stringify(params)}</p>
    </>
  )
}

export function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          'category-slug': 'hair',
          rest: ['shop-by-hair-type', 'dry-scalp'],
        },
      },
    ],
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  return { props: { params } }
}
