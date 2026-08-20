export default function Page() {
  async function act() {
    'use server'
    console.log('[server action] ran from /protected (should be blocked)')
  }
  return (<form action={act}><button id="go" type="submit">run action</button></form>)
}
