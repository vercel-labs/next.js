export const dynamic = 'force-dynamic'

async function getThemeName(): Promise<string> {
  return Math.random() > 0.5 ? 'one' : 'two'
}

export default async function Page() {
  const themeName = await getThemeName()
  const mod = await import(`../themes/theme-${themeName}`)
  return <p>theme: {mod.default.name}</p>
}
