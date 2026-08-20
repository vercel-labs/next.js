const { interceptHttpGet } = require('next/dist/experimental/testmode/httpget')
const nodeFetch = require('next/dist/compiled/node-fetch')
const url = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap'
;(async () => {
  const before = await nodeFetch(url)
  console.log('without interceptor:', before.status, 'content-encoding=', before.headers.get('content-encoding'), 'len=', (await before.text()).length)
  interceptHttpGet(fetch)
  try {
    const res = await nodeFetch(url)
    console.log('with interceptor: status', res.status, 'content-encoding=', res.headers.get('content-encoding'))
    console.log('len=', (await res.text()).length)
  } catch (e) {
    console.log('with interceptor FAILED:', e.message, e.code)
  }
  process.exit(0)
})()
