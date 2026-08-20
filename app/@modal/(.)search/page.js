import SearchInput from '../../search-input'
export default async function SearchModal({ searchParams }) {
  const sp = await searchParams
  return (
    <div id="modal" style={{ border: '4px solid red', padding: 12 }}>
      <h2>MODAL (intercepted /search)</h2>
      <p id="modal-q">q={sp.q ?? ''}</p>
      <SearchInput id="modal-input" />
    </div>
  )
}
