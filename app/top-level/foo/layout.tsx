export default function Layout({ children, parallel }: { children: React.ReactNode; parallel: React.ReactNode }) {
  return (
    <div>
      <div>children: {children}</div>
      <div>parallel: {parallel}</div>
    </div>
  )
}
