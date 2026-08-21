const products = [
  { id: 1, name: 'Sourcemap' },
  { id: 2, name: 'Names' },
]

export default function Page() {
  return (
    <div>
      {products.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  )
}
