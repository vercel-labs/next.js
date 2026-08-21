import { myAction } from './actions'
import Client from './client'
export default async function Page({ params }) {
  const { locale } = await params
  return (<main><h1>locale: {locale}</h1><Client action={myAction} /></main>)
}
