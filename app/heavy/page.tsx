import Widget from '../components/widget'
export default function Heavy() {
  return (
    <main>
      {Array.from({ length: 300 }, (_, i) => (
        <div key={i}>
          <Widget i={i} />
          <p>Row {i} lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.</p>
        </div>
      ))}
    </main>
  )
}
