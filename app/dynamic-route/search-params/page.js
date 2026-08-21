// Dynamic because of `await searchParams`
export default async function Page(props) {
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page) || 1
  return <p>search-params page: {page}</p>
}
