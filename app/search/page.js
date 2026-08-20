import SearchInput from '../search-input'
export default async function SearchPage({ searchParams }) {
  const sp = await searchParams
  return (
    <div id="full-page">
      <h2>Full search page</h2>
      <p id="full-q">q={sp.q ?? ''}</p>
      <SearchInput id="full-input" />
    </div>
  )
}
