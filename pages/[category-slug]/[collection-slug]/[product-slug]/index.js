export default function Product({ params }) {
  return (
    <div>
      <h1 id="which">product: [category-slug]/[collection-slug]/[product-slug]</h1>
      <pre id="params">{JSON.stringify(params)}</pre>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          "category-slug": "hair",
          "collection-slug": "shampoo",
          "product-slug": "some-shampoo",
        },
      },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: { params } };
}
