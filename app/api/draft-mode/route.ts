import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const slug = searchParams.get('slug')!
  searchParams.set('test', 'working')
  request.nextUrl.pathname = slug
  const dm = await draftMode()
  dm.enable()
  redirect(`${request.nextUrl.pathname}${request.nextUrl.search}`)
}
