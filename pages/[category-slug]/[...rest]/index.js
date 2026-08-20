export default function CatchAll({ params }) {
  return (
    <div>
      <h1 id="which">catch-all: [category-slug]/[...rest]</h1>
      <pre id="params">{JSON.stringify(params)}</pre>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { "category-slug": "hair", rest: ["shop-by-hair-type", "dry-scalp"] } },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: { params } };
}
