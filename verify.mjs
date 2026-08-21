// Automated check: submits both forms and prints the search params each one sends.
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage()
const results = {}

for (const [label, selector] of [
  ['next/form', '#next-form-submit'],
  ['vanilla html form', '#html-form-submit'],
]) {
  await page.goto(BASE + '/')
  await page.click(selector)
  await page.waitForSelector('#received')
  results[label] = {
    url: page.url(),
    searchParams: await page.textContent('#received'),
  }
}

console.log(JSON.stringify(results, null, 2))
await browser.close()

const bug = !results['next/form'].searchParams.includes('intent')
console.log(
  bug
    ? 'REPRODUCED: next/form dropped the submit button name/value ("intent=save")'
    : 'NOT REPRODUCED: next/form included intent=save'
)
process.exit(bug ? 0 : 1)
