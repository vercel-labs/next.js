import square from './square.module.css'
import page from './page.module.css'

export default async function Page() {
  await new Promise((r) => setTimeout(r, 1000))
  return <div id="sq" className={`${square.square} ${page.square}`} />
}
