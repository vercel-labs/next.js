// No next/jest, no transform: proves the behaviour is Jest watch-mode, not Next.js.
test('pauses on the debugger statement', () => {
  console.log(
    'TEST_PID', process.pid,
    'PPID', process.ppid,
    'INSPECTOR_URL', String(require('inspector').url()),
    'EXECARGV', JSON.stringify(process.execArgv)
  )
  debugger
  expect(1 + 1).toBe(2)
})
