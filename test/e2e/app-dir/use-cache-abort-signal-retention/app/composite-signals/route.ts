import { connection } from 'next/server'
import { getCompositeSignalStats } from '../../instrumentation'

export async function GET() {
  await connection()

  return Response.json(getCompositeSignalStats())
}
