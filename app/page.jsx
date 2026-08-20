export default function Page() {
  const el = (
    <form action={foo}>
      <button type="submit">submit</button>
    </form>
  )
  const x = 2
  return el

  async function foo() {
    'use server'
    console.log('server action received x =', x)
  }
}
