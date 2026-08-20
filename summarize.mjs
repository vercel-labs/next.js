import fs from 'fs'
const lines = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n')
const vals = lines
  .map((l) => l.match(/t=\+([\d.]+)s .* staleness=([\d.-]+)s/))
  .filter(Boolean)
  .filter((m) => Number(m[1]) > 8)
  .map((m) => Number(m[2]))
console.log(process.argv[2], 'samples', vals.length, 'max', Math.max(...vals), 'min', Math.min(...vals))
