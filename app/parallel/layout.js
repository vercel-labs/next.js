export default function Layout({ children, alpha, zulu }) {
  return (
    <div>
      <div id="children">{children}</div>
      <div id="alpha">{alpha}</div>
      <div id="zulu">{zulu}</div>
    </div>
  )
}
