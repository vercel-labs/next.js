export const dynamic = 'force-dynamic'

const key = 'NODE_' + 'ENV' // avoid build-time inlining

export default function Page() {
  return (
    <pre id="out">
      {JSON.stringify(
        {
          runtimeNodeEnv: process.env[key],
          MY_ENV_NAME: process.env.MY_ENV_NAME,
        },
        null,
        2
      )}
    </pre>
  )
}
