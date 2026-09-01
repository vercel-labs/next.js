const p = Promise.resolve({ constructor: '1' })
Object.defineProperty(p, 'constructor', {
  get() { return '1' },
  set(v) {},
  enumerable: true,
  configurable: true,
})
p.then((v) => console.log('resolved', v)).catch((e) => console.log('caught', e))
