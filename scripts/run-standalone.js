// Starts the standalone server WITHOUT the HOSTNAME env var (as in the
// Dockerfile from issue #74488) and reports which interface it binds to.
const { spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const dir = path.join(__dirname, '..', '.next', 'standalone')
fs.cpSync(path.join(__dirname, '..', '.next', 'static'), path.join(dir, '.next', 'static'), { recursive: true })
const env = { ...process.env, PORT: '3000' }
delete env.HOSTNAME
const child = spawn(process.execPath, ['server.js'], { cwd: dir, env, stdio: 'inherit' })

const external = Object.values(os.networkInterfaces()).flat().find((i) => i.family === 'IPv4' && !i.internal)
setTimeout(async () => {
  for (const host of ['127.0.0.1', external && external.address].filter(Boolean)) {
    try {
      const res = await fetch(`http://${host}:3000/`)
      console.log(`GET http://${host}:3000/ -> ${res.status}`)
    } catch (e) {
      console.log(`GET http://${host}:3000/ -> FAILED (${e.message})`)
    }
  }
  child.kill()
}, 5000)
