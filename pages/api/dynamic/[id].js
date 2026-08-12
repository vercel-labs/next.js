export default function handler(req, res) {
  res.status(200).json({ ok: true, route: 'dynamic', id: req.query.id })
}
