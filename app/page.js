import List from './list'

export default function Page() {
  return (
    <main>
      <h1>Repro: server action lost after a same-path Link navigation</h1>
      <List ids={['1', '2', '3', '4']} />
    </main>
  )
}
