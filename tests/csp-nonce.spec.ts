import { test, expect } from '@playwright/test'

test('every parser-inserted <script> carries the response CSP nonce', async ({
  page,
}) => {
  const violations: string[] = []
  page.on('console', (msg) => {
    if (/Content Security Policy|Refused to load/i.test(msg.text())) {
      violations.push(msg.text())
    }
  })

  const response = await page.goto('/', { waitUntil: 'load' })
  const csp = response!.headers()['content-security-policy']
  const nonce = /'nonce-([^']+)'/.exec(csp)![1]

  const html = await response!.text()
  const tags = html.match(/<script[^>]*>/g) ?? []
  const missing = tags.filter((tag) => !tag.includes(`nonce="${nonce}"`))

  console.log('CSP:', csp)
  console.log('scripts without nonce:', missing)
  console.log('browser CSP violations:', violations)

  expect(missing, 'scripts missing the CSP nonce').toEqual([])
})
