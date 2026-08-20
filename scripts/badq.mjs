import { execSync } from 'node:child_process'
const pid = process.env.SERVER_PID
const rss = () => Number(execSync(`ps -o rss= -p ${pid}`).toString().trim()) / 1024
console.log('req,rssMB,status')
for (let n = 1; n <= 6000; n++) {
  const res = await fetch(`http://localhost:3000/_next/image?url=%2Fbig.jpg&w=1200&q=${(n % 99) + 1}`)
  await res.arrayBuffer()
  if (n % 500 === 0) console.log(`${n},${rss().toFixed(0)},${res.status}`)
}
