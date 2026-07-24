// Dynamic API route: in dev this is only matched against
// fsChecker.dynamicRoutes, which is built by the watcher's "aggregated"
// callback. If the first aggregation fires before the initial pages scan
// finishes, this route 404s.
export default function handler(req, res) {
  res.status(200).json({ ok: 'dynamic', id: req.query.id })
}
