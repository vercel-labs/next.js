self.onmessage = (e: MessageEvent) => {
  // eslint-disable-next-line no-restricted-globals
  ;(self as any).postMessage('pong:' + e.data)
}
