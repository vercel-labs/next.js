// Hits a matcher-excluded path and reports whether middleware ran.
const base = process.env.BASE_URL ?? 'http://localhost:3000'
for (const p of ['/', '/vercel.svg']) {
  const res = await fetch(base + p)
  console.log(p, res.status)
}
console.log('Now check the dev server output: with grouped exports, "MIDDLEWARE: .../vercel.svg" is logged, proving config.matcher was ignored.')
