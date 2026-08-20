import { loadCaseStudies } from '../lib/mdx'

// next-intl (as used in the reporter's app) opts pages into dynamic rendering,
// so the glob runs per-request inside the serverless function instead of at build time.
export const dynamic = 'force-dynamic'

export default async function Home() {
  const { cwd, files, entries, dir, workDir } = await loadCaseStudies()
  return (
    <main style={{ fontFamily: 'monospace', padding: 24 }}>
      <h1>CaseStudies</h1>
      <p id="count">matched mdx files: {files.length}</p>
      <p id="cwd">process.cwd(): {cwd}</p>
      <pre id="files">{JSON.stringify(files, null, 2)}</pre>
      <pre id="dir">readdir(cwd): {JSON.stringify(dir)}</pre>
      <pre id="workdir">readdir(cwd + /app/work): {JSON.stringify(workDir)}</pre>
      <ul>
        {entries.map((e) => (
          <li key={e.href}>
            {e.title} — {e.client}
          </li>
        ))}
      </ul>
      {entries.length === 0 ? <p id="empty">EMPTY: no case studies rendered</p> : null}
    </main>
  )
}
