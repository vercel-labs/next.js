export default function handler(req, res) {
  res.send(
    'instrumentationFinished=' + (globalThis as any).instrumentationFinished
  )
}
