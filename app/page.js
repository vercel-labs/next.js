export default function Home() {
  return (
    <>
      <script type="speculationrules" dangerouslySetInnerHTML={{ __html: '{"prerender":[{"urls":["/target"]}]}' }} />
      <p>Wait a second for Chrome to prerender, then <a href="/target">open /target</a>.</p>
      {/* /?auto navigates by itself after 2.5s, for automated checks */}
      <script dangerouslySetInnerHTML={{ __html: "if (location.search === '?auto') setTimeout(() => location.href = '/target', 2500)" }} />
    </>
  );
}
