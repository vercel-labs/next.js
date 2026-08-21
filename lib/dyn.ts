import fs from 'fs'
import path from 'path'

// A dynamic path built from process.cwd(), like @opentelemetry/instrumentation
// (and other libs) do. Turbopack resolves this to the pattern
// ('/ROOT/' <dynamic> | '/ROOT' <dynamic>) and traces the whole project root.
export function readDynamic(...segments: string[]) {
  return fs.readFileSync(path.join(process.cwd(), ...segments), 'utf-8')
}

// Fully static path: only package.json ends up in the trace (control case).
export function readStatic() {
  return fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
}
