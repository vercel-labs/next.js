// Hits both routes once and reports whether <title> from generateMetadata
// made it into the server HTML. Watch the `next start` terminal for
// "Expected the resume to render <div> ... <__next_metadata_boundary__>".
const base = process.argv[2] ?? 'http://localhost:3000';
const UA = 'Mozilla/5.0 (Macintosh) Chrome/124.0 Safari/537.36';
for (const path of ['/minimal', `/posts/${Math.ceil(Math.random() * 90)}`]) {
  const res = await fetch(base + path, { headers: { 'user-agent': UA } });
  const html = await res.text();
  console.log(path, 'status=' + res.status, 'titleInHtml=' + /<title>/.test(html));
}
