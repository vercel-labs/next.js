export default function About() {
  return <h1>About {process.env.DEPLOY_LABEL || 'A'}</h1>
}
