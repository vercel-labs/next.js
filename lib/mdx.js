import glob from 'fast-glob'
import fs from 'fs'

// Mirrors the reporter's src/lib/mdx.ts: fast-glob with a *relative* cwd
// plus dynamic import() of the matched .mdx files.
export async function loadCaseStudies() {
  const files = await glob('**/*.mdx', { cwd: 'app/work' })
  const entries = await Promise.all(
    files.map(async (filename) => {
      const mod = await import(`../app/work/${filename}`)
      return { ...mod.caseStudy, href: `/work/${filename.replace(/\/page\.mdx$/, '')}` }
    })
  )
  let dir = []
  try {
    dir = fs.readdirSync(process.cwd())
  } catch (e) {
    dir = [String(e)]
  }
  // NOTE: adding a statically analyzable read such as
  //   fs.readdirSync(process.cwd() + '/app/work')
  // makes Vercel's file tracer bundle app/work/**, which hides the bug.
  const workDir = []
  return { cwd: process.cwd(), files, entries, dir, workDir }
}
