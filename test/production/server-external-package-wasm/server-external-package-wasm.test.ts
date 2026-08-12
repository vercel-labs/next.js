import path from 'path'
import { FileRef, nextTestSetup } from 'e2e-utils'

// Regression test for https://github.com/vercel/next.js/issues/96897
//
// A package in `serverExternalPackages` that imports a `.wasm` file is traced (not bundled), and
// the generated wasm loader references Turbopack's internal `[turbopack-wasm]/node/loadWasm.ts`
// helper. That module lives outside the project and output filesystems, which made
// `NftJsonAsset` bail out with
// `NftJsonAsset: cannot handle filepath '[turbopack-wasm]/node/loadWasm.ts'` and abort the build.
describe('serverExternalPackages with a wasm import', () => {
  const { next, skipped } = nextTestSetup({
    files: {
      'node_modules/wasm-external-package/package.json': JSON.stringify({
        name: 'wasm-external-package',
        version: '1.0.0',
        type: 'module',
        main: 'index.js',
      }),
      'node_modules/wasm-external-package/index.js': `
        import { add_one } from './add.wasm'
        export function increment(value) {
          return add_one(value)
        }
      `,
      'node_modules/wasm-external-package/add.wasm': new FileRef(
        path.join(__dirname, 'add.wasm')
      ),
      'app/layout.js': `
        export default function RootLayout({ children }) {
          return (
            <html>
              <body>{children}</body>
            </html>
          )
        }
      `,
      'app/page.js': `
        export default function Page() {
          return <p>hello</p>
        }
      `,
      'app/wasm/route.js': `
        import { increment } from 'wasm-external-package'

        export function GET() {
          return new Response(String(increment(1)))
        }
      `,
    },
    nextConfig: {
      serverExternalPackages: ['wasm-external-package'],
    },
    skipStart: true,
    // The build output (`.nft.json`) is asserted on locally.
    skipDeployment: true,
  })

  if (skipped) return

  it('should build and trace the wasm file of the external package', async () => {
    const { exitCode, cliOutput } = await next.build()

    expect(cliOutput).not.toContain('NftJsonAsset')
    expect(exitCode).toBe(0)

    const trace = await next.readJSON('.next/server/app/wasm/route.js.nft.json')
    const externalPackageFiles = (trace.files as string[])
      .filter((file) => file.includes('node_modules/wasm-external-package/'))
      .map((file) => path.basename(file))

    // The wasm file has to be traced, the internal wasm loader helper must not show up.
    expect(externalPackageFiles).toContain('index.js')
    expect(externalPackageFiles).toContain('add.wasm')
    expect(
      (trace.files as string[]).filter((file) => file.includes('loadWasm'))
    ).toEqual([])
  })
})
