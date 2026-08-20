export default function Data() {
  return (
    <div>
      <div id="page">data</div>
    </div>
  )
}

Data.getInitialProps = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {}
}
