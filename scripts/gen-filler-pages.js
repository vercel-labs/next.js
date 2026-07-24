// Filler pages give the initial watchpack scan enough work that the race
// window is observable. The api/A*.js fillers sort before "[id].js"
// ("A" = 0x41 < "[" = 0x5B), mirroring a real app where dynamic routes are
// discovered late in the scan.
const fs = require('fs')
const path = require('path')

const pDir = path.join(__dirname, '..', 'pages', 'p')
fs.mkdirSync(pDir, { recursive: true })
for (let i = 0; i < 2500; i++) {
  fs.writeFileSync(
    path.join(pDir, `page${i}.js`),
    `export default function P(){return ${JSON.stringify('p' + i)}}`
  )
}

const apiDir = path.join(__dirname, '..', 'pages', 'api')
for (let i = 0; i < 2500; i++) {
  fs.writeFileSync(
    path.join(apiDir, `A${String(i).padStart(4, '0')}.js`),
    `export default function h(req,res){res.status(200).json({i:${i}})}`
  )
}

console.log('filler pages generated (2500 pages + 2500 api routes)')
