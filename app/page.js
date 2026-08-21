import Form from './form'

export default async function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Form />
      <p>
        <a id="to-dashboard" href="/dashboard">Go to Dashboard</a>
      </p>
      <p>
        <a id="to-external" href="/external.html">Go to External</a>
      </p>
    </main>
  )
}
