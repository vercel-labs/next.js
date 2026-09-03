export async function makeMeta(name: string){
  await new Promise((r)=>setTimeout(r, 5))
  const mod = await import('./extra')
  return { title: name + mod.suffix, description: 'desc ' + name }
}
