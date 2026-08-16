/* global jest, describe, it, expect, beforeEach, afterEach */
const fs = require('fs')
const os = require('os')
const path = require('path')

const TARGET_VERSION = '16.3.1'

/**
 * npm 12 removed the `--field` flag from `npm view`. Passing it makes npm exit
 * with `EUNKNOWNCONFIG`, which `runUpgrade` surfaced as a misleading
 * "Invalid revision provided" error for every revision form, even exact
 * published versions.
 * x-ref: https://github.com/vercel/next.js/issues/97445
 */
const execSyncMock = jest.fn((command) => {
  if (/\s--field(\s|=|$)/.test(command)) {
    const error = new Error(`Command failed: ${command}`)
    error.status = 1
    error.stdout = JSON.stringify({
      error: {
        code: 'EUNKNOWNCONFIG',
        summary:
          'Unknown cli flag:\n  - --field\nRun `npm help config` for supported options.',
        detail: '',
      },
    })
    throw error
  }
  // Positional field form, supported by npm 10, 11 and 12.
  if (/^npm --silent view "next@[^"]+" version --json$/.test(command)) {
    return JSON.stringify([TARGET_VERSION])
  }
  if (/^npm --silent view "next@[^"]+" --json$/.test(command)) {
    return JSON.stringify({
      version: TARGET_VERSION,
      peerDependencies: {
        react: '^19.2.0',
        'react-dom': '^19.2.0',
      },
    })
  }
  throw new Error(`Unexpected command: ${command}`)
})

jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'),
  execSync: (command) => execSyncMock(command),
}))

describe('@next/codemod upgrade on npm 12', () => {
  let projectDir
  let originalCwd
  let logSpy

  beforeEach(() => {
    execSyncMock.mockClear()
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    projectDir = fs.mkdtempSync(
      path.join(process.env.NEXT_TEST_DIR || os.tmpdir(), 'upgrade-npm-view-')
    )
    fs.writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify({
        name: 'upgrade-npm-view-fixture',
        private: true,
        dependencies: { next: TARGET_VERSION },
      })
    )
    const installedNextDir = path.join(projectDir, 'node_modules', 'next')
    fs.mkdirSync(installedNextDir, { recursive: true })
    fs.writeFileSync(
      path.join(installedNextDir, 'package.json'),
      JSON.stringify({ name: 'next', version: TARGET_VERSION })
    )
    originalCwd = process.cwd()
    // `bin/upgrade` snapshots `process.cwd()` at module scope.
    process.chdir(projectDir)
  })

  afterEach(() => {
    process.chdir(originalCwd)
    fs.rmSync(projectDir, { recursive: true, force: true })
    logSpy.mockRestore()
  })

  it('resolves the revision without the removed `npm view --field` flag', async () => {
    let runUpgrade
    jest.isolateModules(() => {
      runUpgrade = require('../../bin/upgrade').runUpgrade
    })

    await runUpgrade(TARGET_VERSION, { verbose: false, yes: true })

    const commands = execSyncMock.mock.calls.map(([command]) => command)
    expect(commands.filter((command) => command.includes('--field'))).toEqual([])
    expect(commands).toContain(
      `npm --silent view "next@${TARGET_VERSION}" version --json`
    )
    expect(logSpy.mock.calls.flat().join('\n')).toContain(
      `Current Next.js version is already on the target version "v${TARGET_VERSION}"`
    )
  })
})
