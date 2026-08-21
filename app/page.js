import fs from 'node:fs/promises'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const files = await fs.readdir(process.cwd())
  return <main>ok {Date.now()} files:{files.length}</main>
}
