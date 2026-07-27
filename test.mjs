import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const port = 32104
const baseUrl = `http://localhost:${port}`
const expectedAfterPage = process.env.EXPECTED_AFTER_PAGE || 'photo'
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
})
let output = ''
server.stdout.on('data', (chunk) => { output += chunk; process.stdout.write(chunk) })
server.stderr.on('data', (chunk) => { output += chunk; process.stderr.write(chunk) })

async function waitForServer() {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next.js exited early (${server.exitCode})\n${output}`)
    try {
      const response = await fetch(`${baseUrl}/`)
      if (response.ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Timed out waiting for Next.js\n${output}`)
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(`${baseUrl}/`)
  await page.getByTestId('photo-0').click()
  await page.waitForURL(`${baseUrl}/p/0`)

  const before = {
    url: page.url(),
    page: await page.locator('main').getAttribute('data-page'),
    carousel: await page.getByTestId('carousel').textContent(),
  }
  console.log('Before carousel navigation:', JSON.stringify(before))

  await page.getByRole('button', { name: 'Next photo' }).click()
  await page.waitForURL(`${baseUrl}/p/1`)
  await page.waitForTimeout(250)

  const after = {
    url: page.url(),
    page: await page.locator('main').getAttribute('data-page'),
    standaloneCount: await page.getByTestId('standalone').count(),
    carouselCount: await page.getByTestId('carousel').count(),
  }
  console.log('After carousel navigation:', JSON.stringify(after))

  if (before.page !== 'index' || after.page !== expectedAfterPage) {
    throw new Error(`Expected page ${expectedAfterPage}, received ${after.page}`)
  }
  if (after.page === 'photo' && after.carouselCount === 0) {
    console.log('REPRODUCED: query-only href resolved against masked /p/0 URL and left carousel mode.')
  } else {
    console.log('CONTROL: query-only href kept the index page and carousel mounted.')
  }
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}
