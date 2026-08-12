import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

// Auto-installing missing dependencies would hit the network, so pretend to be
// CI. That makes a missing dependency fail fast with the user-facing error.
const originalCI = process.env.CI
process.env.CI = '1'

const { verifyAndRunTypeScript } =
  require('next/dist/lib/verify-typescript-setup') as typeof import('next/dist/lib/verify-typescript-setup')

function writePackage(
  dir: string,
  packageJson: Record<string, unknown>,
  files: Record<string, string> = {}
) {
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )

  for (const [file, contents] of Object.entries(files)) {
    const filePath = path.join(dir, file)
    mkdirSync(path.dirname(filePath), { recursive: true })
    writeFileSync(filePath, contents)
  }
}

describe('TypeScript package aliased to a differently named package', () => {
  let testDir: string

  beforeEach(() => {
    testDir = mkdtempSync(path.join(tmpdir(), 'next-typescript-alias-'))

    writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify({
        name: 'my-app',
        dependencies: { typescript: 'npm:@typescript/typescript6@6.0.2' },
      })
    )
    writeFileSync(
      path.join(testDir, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: { strict: true } }, null, 2)
    )
    mkdirSync(path.join(testDir, 'app'), { recursive: true })
    writeFileSync(
      path.join(testDir, 'app/page.tsx'),
      'export default function Page() {\n  return null\n}\n'
    )

    // `typescript` aliased to `@typescript/typescript6`, as recommended for
    // repositories that need both TypeScript 6 and 7. Its only bin is `tsc6`,
    // so `node_modules/typescript/bin/tsc` does not exist.
    writePackage(
      path.join(testDir, 'node_modules/typescript'),
      {
        name: '@typescript/typescript6',
        version: '6.0.2',
        main: './lib/typescript.js',
        bin: { tsc6: './bin/tsc6' },
      },
      {
        'bin/tsc6': '#!/usr/bin/env node\nrequire("../lib/tsc.js")\n',
        'lib/tsc.js': '',
        'lib/typescript.js': 'module.exports = { version: "6.0.2" }\n',
      }
    )

    writePackage(
      path.join(testDir, 'node_modules/@types/react'),
      { name: '@types/react', version: '19.2.4', types: './index.d.ts' },
      { 'index.d.ts': 'export {}\n' }
    )
    writePackage(
      path.join(testDir, 'node_modules/@types/node'),
      { name: '@types/node', version: '20.17.7', types: './index.d.ts' },
      { 'index.d.ts': 'export {}\n' }
    )
  })

  afterEach(() => {
    rmSync(testDir, { force: true, recursive: true })
  })

  afterAll(() => {
    if (originalCI === undefined) {
      delete process.env.CI
    } else {
      process.env.CI = originalCI
    }
  })

  it('is detected by the TypeScript CLI backend', async () => {
    await expect(
      verifyAndRunTypeScript({
        dir: testDir,
        distDir: '.next',
        strictRouteTypes: false,
        tsconfigPath: 'tsconfig.json',
        shouldRunTypeCheck: false,
        typedRoutes: false,
        disableStaticImages: false,
        hasAppDir: true,
        hasPagesDir: false,
        appDir: path.join(testDir, 'app'),
        useTypeScriptCli: true,
      })
    ).resolves.toMatchObject({ version: '6.0.2' })
  })
})
