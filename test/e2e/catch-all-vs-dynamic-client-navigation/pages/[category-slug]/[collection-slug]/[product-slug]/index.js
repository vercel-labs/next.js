export default function Product({ params }) {
  return (
    <>
      <p id="page">product</p>
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
          'collection-slug': 'shampoo',
          'product-slug': 'some-shampoo',
        },
      },
    ],
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  return { props: { params } }
}
