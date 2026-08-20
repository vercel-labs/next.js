/**
 * Regression test for https://github.com/vercel/next.js/issues/97632
 *
 * The Pages Router adopted deployment-id skew handling in `v16.2` (#89325): when
 * a `/_next/data` response carries an `x-nextjs-deployment-id` that differs from
 * the client's configured `deploymentId`, the router throws and falls back to a
 * hard reload. Self-hosted Pages Router apps that had `deploymentId` set for
 * years suddenly performed full page loads during rolling deployments, and
 * nothing in the docs recorded the change: the `deploymentId` version history
 * stops at `v14.1.4` and the "outdated deployment" error has no
 * `nextjs.org/docs/messages` page, unlike the neighbouring `deploymentId`
 * validation errors.
 */
import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const repoRoot = join(__dirname, '..', '..')
const read = (relativePath: string) =>
  readFileSync(join(repoRoot, relativePath), 'utf8')

const PAGES_ROUTER_SOURCE = 'packages/next/src/shared/lib/router/router.ts'
const DEPLOYMENT_ID_DOC =
  'docs/01-app/03-api-reference/05-config/01-next-config-js/deploymentId.mdx'
const ERRORS_DIR = 'errors'
const HARD_RELOAD_MESSAGE =
  'Loaded static props were from an outdated deployment, forcing a hard reload'

describe('deploymentId version skew documentation', () => {
  it('still hard reloads the Pages Router on a deployment id mismatch', () => {
    // Guards the assertions below: they only matter while this code path exists.
    const source = read(PAGES_ROUTER_SOURCE)

    expect(source).toContain('NEXT_NAV_DEPLOYMENT_ID_HEADER')
    expect(source).toContain(HARD_RELOAD_MESSAGE)
  })

  it('records the release in which the Pages Router adopted version skew handling', () => {
    const doc = read(DEPLOYMENT_ID_DOC)
    const versionHistory = doc.split('## Version History')[1] ?? ''

    expect(versionHistory).toMatch(/`v16\.2(\.\d+)?`/)
    expect(versionHistory.toLowerCase()).toContain('pages router')
  })

  it('has an error page for the outdated deployment hard reload', () => {
    const errorsDir = join(repoRoot, ERRORS_DIR)
    expect(existsSync(errorsDir)).toBe(true)

    const documentingPages = readdirSync(errorsDir)
      .filter((file) => file.endsWith('.mdx'))
      .filter((file) =>
        /outdated deployment/i.test(read(join(ERRORS_DIR, file)))
      )

    expect(documentingPages).not.toHaveLength(0)
  })
})
