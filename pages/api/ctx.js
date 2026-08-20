import httpContext from 'express-http-context'

export default function handler(req, res) {
  httpContext.set('foo', 'bar')
  res.json({ foo: httpContext.get('foo') })
}
