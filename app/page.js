import Form from 'next/form'

export default function Home() {
  return (
    <main>
      <h1>next/form submitter value repro (#84857)</h1>

      <h2>next/form</h2>
      <Form action="/target" id="next-form">
        <input type="text" name="query" defaultValue="hello" />
        <button id="next-form-submit" type="submit" name="intent" value="save">
          Submit
        </button>
      </Form>

      <h2>vanilla HTML form</h2>
      <form action="/target" method="get" id="html-form">
        <input type="text" name="query" defaultValue="hello" />
        <button id="html-form-submit" type="submit" name="intent" value="save">
          Submit
        </button>
      </form>
    </main>
  )
}
