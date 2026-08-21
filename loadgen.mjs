// Steady low-volume traffic, like the reporter's 15s cron poll but faster.
const base = process.env.BASE ?? 'http://localhost:3000'
const requests = Number(process.env.REQUESTS ?? 2000)
const concurrency = Number(process.env.CONCURRENCY ?? 4)
const monitorEvery = Number(process.env.MONITOR_EVERY ?? 250)

let done = 0
async function monitor() {
  const r = await fetch(`${base}/api/monitor`)
  const j = await r.json()
  console.log(new Date().toISOString(), 'requests=' + done, JSON.stringify(j))
}

await monitor()
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (done < requests) {
      await fetch(`${base}/api/ping`).then((r) => r.text())
      done++
      if (done % monitorEvery === 0) await monitor()
    }
  })
)
await monitor()
