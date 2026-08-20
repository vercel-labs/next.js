const http = require('http')
const { ServerResponse } = http
const origOn = ServerResponse.prototype.on
ServerResponse.prototype.on = function (event, listener) {
  const r = origOn.call(this, event, listener)
  if (event === 'close') {
    const n = this.listenerCount('close')
    const stack = new Error().stack.split('\n').slice(2, 6).map(s => s.trim()).join(' | ')
    console.log(`[probe] close#${n} url=${this.req && this.req.url} :: ${stack}`)
  }
  return r
}
