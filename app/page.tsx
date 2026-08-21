/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  return (
    <a href="/rewrite">This link should proxy you to value defined in process.env.REWRITE_URL</a>
  );
}
