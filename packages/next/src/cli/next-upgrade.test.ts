import fs from 'fs'
import os from 'os'
import path from 'path'
import { EventEmitter } from 'events'
import { spawn } from 'child_process'

import { spawnNextUpgrade } from './next-upgrade'

jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'),
  spawn: jest.fn(),
}))

const spawnMock = jest.mocked(spawn)

const CODEMOD_PACKAGE = '@next/codemod'

// Anything that is not a semver version/range (e.g. `canary`, `latest`) is a
// mutable dist-tag that always resolves to the newest publish.
function isSemverSpec(spec: string): boolean {
  return /^[\^~><=v\s]*\d/.test(spec.slice(`${CODEMOD_PACKAGE}@`.length))
}

function findCodemodSpecs(): string[] {
  return spawnMock.mock.calls
    .flatMap(([, args]) => (Array.isArray(args) ? args : []))
    .filter((arg) => arg.startsWith(`${CODEMOD_PACKAGE}@`))
}

describe('next upgrade', () => {
  let projectDir: string
  let previousExitCode: typeof process.exitCode

  beforeEach(() => {
    previousExitCode = process.exitCode
    projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'next-upgrade-'))
    fs.writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify({ dependencies: { next: '16.2.9' } })
    )
    // Pin the package manager detection so the spawned command is stable.
    fs.writeFileSync(path.join(projectDir, 'package-lock.json'), '{}')

    // Simulate a registry that refuses to serve the version behind a mutable
    // dist-tag, e.g. `npm error code ETARGET / No matching version found for
    // @next/codemod@16.3.1-canary.23` when a minimum release age gate hides
    // freshly published versions.
    spawnMock.mockImplementation((() => {
      const child = new EventEmitter()
      setImmediate(() => child.emit('close', 1))
      return child
    }) as unknown as typeof spawn)
  })

  afterEach(() => {
    spawnMock.mockReset()
    process.exitCode = previousExitCode
    fs.rmSync(projectDir, { recursive: true, force: true })
  })

  it('requests an installable @next/codemod version when a registry hides recent publishes', async () => {
    spawnNextUpgrade(projectDir, { revision: 'latest', verbose: false })

    // Give the CLI a chance to react to the failed child process.
    await new Promise((resolve) => setTimeout(resolve, 100))

    const specs = findCodemodSpecs()
    expect(specs.length).toBeGreaterThan(0)

    // A dist-tag such as `canary` always points at the newest publish, which is
    // always inside a minimum release age window, so `next upgrade` can never
    // install it against such a registry. At least one attempt has to ask for a
    // resolvable semver version/range instead.
    expect(
      specs.map((spec) => ({ spec, isSemverSpec: isSemverSpec(spec) }))
    ).toContainEqual(expect.objectContaining({ isSemverSpec: true }))
  })

  it('forwards the requested revision to the codemod', async () => {
    spawnNextUpgrade(projectDir, { revision: 'latest', verbose: false })

    await new Promise((resolve) => setTimeout(resolve, 100))

    const [, args] = spawnMock.mock.calls[0]
    expect(args).toEqual(expect.arrayContaining(['upgrade', 'latest']))
  })
})
