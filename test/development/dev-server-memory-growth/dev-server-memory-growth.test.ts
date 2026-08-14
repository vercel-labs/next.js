import { nextTestSetup } from 'e2e-utils'
import { readFileSync, readdirSync } from 'fs'

// Resident memory of the process tree is read from procfs, so this only runs on
// Linux (which is what CI uses).
const describeIfLinux = process.platform === 'linux' ? describe : describe.skip

const WINDOW_REQUESTS = 250
const WINDOWS = 6
// Idle time before sampling, so that in-flight work and GC can settle.
const SETTLE_MS = 5000
// Resident memory of a dev server fluctuates by a few hundred MB as V8 grows
// and collects its heap, so the minimum of the first half of the samples is
// compared against the minimum of the second half. The regression this guards
// against grew by 1.2-3.0 MB per request and never plateaued, i.e. by >450 MB
// between the two halves, while a plateaued dev server stays flat or shrinks.
const MAX_GROWTH_BYTES = 250 * 1024 * 1024

function readStat(pid: string): { ppid: number; rssBytes: number } | undefined {
  try {
    // `/proc/<pid>/stat` is a single line, but the second field (comm) may
    // contain spaces, so it is parsed after the last ')'.
    const stat = readFileSync(`/proc/${pid}/stat`, 'utf8')
    const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ')
    // Fields after comm are shifted by 2 relative to the proc(5) numbering:
    // ppid = fields[1] (field 4), rss in pages = fields[21] (field 24).
    return {
      ppid: Number(fields[1]),
      rssBytes: Number(fields[21]) * 4096,
    }
  } catch {
    // The process exited while it was being read.
    return undefined
  }
}

/**
 * Sum of the resident set size of `rootPid` and all of its descendants. `next
 * dev` runs the server itself in a child process, so the whole tree has to be
 * sampled.
 */
function processTreeRss(rootPid: number): number {
  const children = new Map<number, number[]>()
  const rss = new Map<number, number>()

  for (const entry of readdirSync('/proc')) {
    if (!/^\d+$/.test(entry)) continue
    const stat = readStat(entry)
    if (!stat) continue
    const pid = Number(entry)
    rss.set(pid, stat.rssBytes)
    const siblings = children.get(stat.ppid)
    if (siblings) {
      siblings.push(pid)
    } else {
      children.set(stat.ppid, [pid])
    }
  }

  let total = 0
  const queue = [rootPid]
  while (queue.length > 0) {
    const pid = queue.pop()!
    total += rss.get(pid) ?? 0
    queue.push(...(children.get(pid) ?? []))
  }
  return total
}

describeIfLinux('dev server memory growth', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  async function requestPage(times: number) {
    for (let i = 0; i < times; i++) {
      const res = await next.fetch('/')
      expect(res.status).toBe(200)
      await res.text()
    }
  }

  async function sampleRss(pid: number) {
    await new Promise((resolve) => setTimeout(resolve, SETTLE_MS))
    return processTreeRss(pid)
  }

  // Sampling memory requires a lot of serial requests.
  it(
    'plateaus for repeated requests to the same page',
    async () => {
      const pid = next.pid
      expect(typeof pid).toBe('number')

      // Compiling the page and warming the server up legitimately allocates
      // memory, so the first window is not part of the measurement.
      await requestPage(WINDOW_REQUESTS)
      await sampleRss(pid!)

      const samples: number[] = []
      for (let window = 0; window < WINDOWS; window++) {
        await requestPage(WINDOW_REQUESTS)
        samples.push(await sampleRss(pid!))
      }

      const half = WINDOWS / 2
      const firstHalf = Math.min(...samples.slice(0, half))
      const secondHalf = Math.min(...samples.slice(half))
      const growth = secondHalf - firstHalf

      require('console').log(
        `rss samples per ${WINDOW_REQUESTS} requests: ${samples.join(', ')} ` +
          `bytes, growth ${growth} bytes`
      )

      expect(growth).toBeLessThan(MAX_GROWTH_BYTES)
    },
    10 * 60 * 1000
  )
})
