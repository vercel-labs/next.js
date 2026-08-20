// Preloaded with `node -r` so `next dev` believes it runs on Android arm64 (Termux).
Object.defineProperty(process, 'platform', { value: 'android' })
Object.defineProperty(process, 'arch', { value: 'arm64' })
