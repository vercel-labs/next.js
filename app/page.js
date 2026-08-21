async function work() {
  // a handful of awaits, like a real page doing IO
  await Promise.all([1, 2, 3, 4, 5].map(async (i) => {
    await new Promise((r) => setTimeout(r, 1))
    return i
  }))
  return Date.now()
}

export default async function Page() {
  const t = await work()
  return <p>hello {t}</p>
}
