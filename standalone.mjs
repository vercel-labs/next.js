import fs from 'node:fs'
import { compile } from '@mdx-js/mdx'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
const src = fs.readFileSync('app/heavy/page.mdx', 'utf8')
const t = Date.now()
const out = await compile(src, { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] })
console.log('mdx compile ms', Date.now() - t, 'output bytes', String(out).length, 'peakRSS MB', (process.memoryUsage().rss/1e6).toFixed(0))
