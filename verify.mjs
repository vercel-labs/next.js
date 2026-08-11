const base = process.env.BASE_URL ?? 'http://localhost:3000'
for (const session of ['none', 'user', 'admin']) {
  const res = await fetch(`${base}/api/route?session=${session}`)
  console.log(`session=${session} -> ${res.status} ${await res.text()}`)
}
