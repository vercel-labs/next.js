import { inspector } from './inspector'

it('pauses on the debugger statement', () => {
  // eslint-disable-next-line no-console
  console.log(
    'TEST_PID', process.pid,
    'PPID', process.ppid,
    'INSPECTOR_URL', String(inspector()),
    'EXECARGV', JSON.stringify(process.execArgv)
  )
  debugger
  expect(1 + 1).toBe(2)
})
