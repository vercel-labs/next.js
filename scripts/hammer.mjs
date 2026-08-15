// Requests every route repeatedly and touches globals.css / postcss.config.mjs
// to force PostCSS re-evaluation (the transform that runs in a Node pool worker).
import { appendFileSync, utimesSync } from 'node:fs'
const base = process.env.BASE_URL ?? 'http://localhost:3000'
const routes = ['/', '/p1', '/p2', '/p3', '/p4', '/p5', '/p6']
const rounds = Number(process.argv[2] ?? 15)
for (let r = 0; r < rounds; r++) {
  appendFileSync('app/globals.css', `\n/* churn ${r} */\n`)
  utimesSync('postcss.config.mjs', new Date(), new Date())
  await Promise.all(
    routes.map((route) =>
      fetch(base + route, { signal: AbortSignal.timeout(120_000) })
        .then((res) => console.log(`round ${r} ${route} -> ${res.status}`))
        .catch((err) => console.log(`round ${r} ${route} -> ${err.name}`))
    )
  )
  await new Promise((res) => setTimeout(res, 1500))
}
