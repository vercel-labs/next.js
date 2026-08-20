// Singleton that starts a poller once, mimicking a DB connection / background job.
let instanceCounter = 0

export class BackendMock {
  static hasInitialized = false
  static init() {
    if (!this.hasInitialized) {
      this.hasInitialized = true
      const id = ++instanceCounter
      const moduleLoadId = Math.random().toString(36).slice(2, 8)
      console.log(`[BackendMock] init instance=${id} module=${moduleLoadId}`)
      setInterval(() => {
        console.log(`[BackendMock] polling instance=${id} module=${moduleLoadId}`)
      }, 2000)
      // No API to subscribe to this module being unloaded/replaced by the dev server,
      // so this interval keeps running forever after a hot reload.
      if (typeof (module as any) !== 'undefined' && (module as any).hot) {
        console.log('[BackendMock] module.hot IS available')
      } else {
        console.log('[BackendMock] module.hot is NOT available')
      }
    }
  }
}
