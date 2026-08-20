import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  revalidatePath('/a')
  revalidatePath('/b')
  return NextResponse.json({ revalidated: ['/a', '/b'], now: Date.now() })
}
