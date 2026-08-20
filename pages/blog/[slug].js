export async function getStaticPaths() {
  return { paths: [{ params: { slug: 'a' }, locale: 'en' }], fallback: 'blocking' };
}
export async function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
export default function Post(props) {
  return (<div><h1 id="post">Post</h1><pre id="props">{JSON.stringify(props)}</pre></div>);
}
