import duckdb from 'duckdb'

export default async function Page() {
  return <pre>{typeof duckdb}</pre>
}
