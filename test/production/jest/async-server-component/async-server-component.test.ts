import { nextTestSetup } from 'e2e-utils'
import execa from 'execa'

describe('next/jest async Server Component', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    dependencies: {
      '@testing-library/jest-dom': '5.16.5',
      '@testing-library/react': '14.0.0',
      jest: '29.5.0',
      'jest-environment-jsdom': '29.5.0',
      react: '18.2.0',
      'react-dom': '18.2.0',
    },
    skipStart: true,
  })

  it('renders with React Testing Library', async () => {
    const result = await execa(
      'pnpm',
      ['jest', 'tests/page.spec.tsx', '--runInBand'],
      {
        cwd: next.testDir,
        reject: false,
      }
    )

    expect({
      exitCode: result.exitCode,
      output: result.stdout + result.stderr,
    }).toEqual({
      exitCode: 0,
      output: expect.stringContaining('1 passed'),
    })
  })
})
