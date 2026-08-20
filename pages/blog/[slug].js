export default function Post({ slug }) { return <h1>Post {slug}</h1> }
export function getStaticProps({ params }) { return { props: { slug: params.slug } } }
export function getStaticPaths() { return { paths: [{ params: { slug: 'one' } }], fallback: 'blocking' } }
