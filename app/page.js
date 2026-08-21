export default function Page() {
  return (
    <main>
      <a id="unencoded" href="/About STAR & HPI (09-2024).pdf">navigate to static file (PDF)</a>
      <br />
      <a id="encoded" href="/About%20STAR%20%26%20HPI%20(09-2024).pdf">encoded link</a>
    </main>
  );
}
