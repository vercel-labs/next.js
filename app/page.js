export default function Page() {
  return <main>
    <h1>2 GiB FormData reproduction</h1>
    <p>POST multipart/form-data to <code>/api/upload</code>.</p>
    <p>The streaming CLI client avoids allocating the test file: <code>npm run upload -- 2147483648</code>.</p>
  </main>
}
