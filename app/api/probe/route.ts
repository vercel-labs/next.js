import { execFileSync } from 'node:child_process'
import * as nodeTimers from 'node:timers'
import * as nodeTimersPromises from 'node:timers/promises'
import { connection } from 'next/server'


const PRISTINE_SCRIPT = `
const t = require('node:timers');
const tp = require('node:timers/promises');
console.log(JSON.stringify({
  globalSetImmediateName: globalThis.setImmediate.name,
  timersSetImmediateName: t.setImmediate.name,
  timersPromisesSetImmediateName: tp.setImmediate.name,
  nextTickName: process.nextTick.name,
}));
`

export async function GET() {
  await connection()
  const insideNext = {
    globalSetImmediateName: globalThis.setImmediate.name,
    timersSetImmediateName: nodeTimers.setImmediate.name,
    timersPromisesSetImmediateName: nodeTimersPromises.setImmediate.name,
    nextTickName: process.nextTick.name,
    // extra evidence that the exported binding was reassigned by Next.js
    timersPromisesSetImmediateSource: nodeTimersPromises.setImmediate
      .toString()
      .slice(0, 160),
  }

  const pristineNode = JSON.parse(
    execFileSync(process.execPath, ['-e', PRISTINE_SCRIPT], {
      encoding: 'utf8',
      env: { NODE_ENV: "production" },
    })
  )

  return Response.json({
    insideNext,
    pristineNode,
    patched: {
      globalSetImmediate:
        insideNext.globalSetImmediateName !==
        pristineNode.globalSetImmediateName,
      nodeTimersSetImmediate:
        insideNext.timersSetImmediateName !== pristineNode.timersSetImmediateName,
      nodeTimersPromisesSetImmediate:
        insideNext.timersPromisesSetImmediateName !==
        pristineNode.timersPromisesSetImmediateName,
      processNextTick:
        insideNext.nextTickName !== pristineNode.nextTickName,
    },
  })
}
