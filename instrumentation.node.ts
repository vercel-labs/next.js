import diagnosticsChannel from 'node:diagnostics_channel'

console.log('[instrumentation.node] subscribing to undici:request:create')
diagnosticsChannel.subscribe('undici:request:create', (msg: any) => {
  console.log(
    '[node diagnostics_channel] undici:request:create ->',
    String(msg?.request?.origin ?? '') + String(msg?.request?.path ?? '')
  )
})
