import { nextTestSetup } from 'e2e-utils'
import execa from 'execa'

describe('next/jest - @jest/globals', () => {
  const { next } = nextTestSetup({
    skipStart: true,
    files: {
      // `next/jest` requires an `app` or `pages` directory to exist.
      'app/page.js': `
        export default function Page() {
          return <p>hello world</p>
        }
      `,
      'lib/greet.js': `
        export default function greet(name) {
          return 'Hello ' + name
        }
      `,
      'jest.config.js': `
        const nextJest = require('next/jest')

        const createJestConfig = nextJest({
          dir: './',
        })

        module.exports = createJestConfig({
          moduleDirectories: ['node_modules', '<rootDir>/'],
          testEnvironment: 'node',
        })
      `,
      // The mock must be hoisted above the imports even though `jest` is
      // imported from `@jest/globals` instead of relying on the global.
      'tests/jest-globals-mock.test.js': `
        import { expect, it, jest } from '@jest/globals'
        import greet from '../lib/greet'

        jest.mock('../lib/greet', () => ({
          __esModule: true,
          default: (name) => 'Hola ' + name,
        }))

        it('applies jest.mock when jest is imported from @jest/globals', () => {
          expect(greet('Jane')).toBe('Hola Jane')
        })
      `,
      // Control case that already works, to make sure hoisting keeps working
      // for the injected `jest` global.
      'tests/jest-global-mock.test.js': `
        import greet from '../lib/greet'

        jest.mock('../lib/greet', () => ({
          __esModule: true,
          default: (name) => 'Hola ' + name,
        }))

        it('applies jest.mock when using the jest global', () => {
          expect(greet('Jane')).toBe('Hola Jane')
        })
      `,
    },
    dependencies: {
      jest: '29.7.0',
    },
  })

  it('should hoist jest.mock when jest is imported from @jest/globals', async () => {
    const { exitCode, stdout, stderr } = await execa(
      'pnpm',
      ['jest', 'tests/'],
      {
        cwd: next.testDir,
        reject: false,
      }
    )

    expect({ exitCode, output: stdout + stderr }).toMatchObject({ exitCode: 0 })
  })
})
