import { connection } from 'next/server'
export default async function Page(){
  await connection()
  const vals = {
    API_URL_FROM_ENV: process.env.API_URL_FROM_ENV ?? null,
    API_URL_FROM_ENV_LOCAL: process.env.API_URL_FROM_ENV_LOCAL ?? null,
    API_URL_FROM_ENV_PRODUCTION: process.env.API_URL_FROM_ENV_PRODUCTION ?? null,
  }
  console.log('[repro] runtime env:', vals)
  return <pre id="out">{JSON.stringify(vals, null, 2)}</pre>
}
