export default function Page() {
  return (
    <ul>
      <li><a href="/cjs">/cjs (package from node_modules - fails)</a></li>
      <li><a href="/local">/local (same code inside app dir - works)</a></li>
    </ul>
  );
}
