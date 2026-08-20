export default function Layout(props: LayoutProps<'/parallel-routes'>) {
  return (
    <div>
      <h1>parallel-routes layout</h1>
      {props.children}
      {props['parallel-panel']}
    </div>
  )
}
