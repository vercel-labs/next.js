import { NextResponse } from 'next/server'

export async function middleware(request) {
  const response = NextResponse.next()

  // 1) awaited fetch + response.json()
  try {
    const res = await fetch('http://api.tvmaze.com/search/shows?q=postman', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    console.log('MIDDLEWARE AWAIT JSON OK', res.status, Array.isArray(data), data.length)
  } catch (e) {
    console.log('MIDDLEWARE AWAIT ERROR:', e)
  }

  // 2) fire-and-forget fetch + .json() (original report style)
  fetch('http://api.tvmaze.com/search/shows?q=postman', { method: 'GET' })
    .then((r) => r.json())
    .then((d) => console.log('MIDDLEWARE FIRE-FORGET JSON OK', d.length))
    .catch((e) => console.log('MIDDLEWARE FIRE-FORGET ERROR:', e))

  // 3) POST fetch
  try {
    const res = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hello: 'world' }),
    })
    console.log('MIDDLEWARE POST OK', res.status)
  } catch (e) {
    console.log('MIDDLEWARE POST ERROR:', e)
  }

  return response
}

export const config = { matcher: ['/'] }
