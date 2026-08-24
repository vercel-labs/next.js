// A big-ish "app shell": layout chrome that is identical on every route.
// 300 nodes is enough to make the serialized RSC tree tens of KB.
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <nav>
        {Array.from({ length: 300 }, (_, i) => (
          <a key={i} href={`/link-${i}`} data-index={i} title={`Navigation entry number ${i}`}>
            Navigation entry number {i}
          </a>
        ))}
      </nav>
      <main>{children}</main>
      <footer>
        {Array.from({ length: 300 }, (_, i) => (
          <span key={i} data-footer={i}>
            Footer entry number {i}
          </span>
        ))}
      </footer>
    </div>
  )
}
