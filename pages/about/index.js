export default function About({ t }) { return <h1>About {t}</h1> }
export function getStaticProps() { return { props: { t: 'about' } } }
