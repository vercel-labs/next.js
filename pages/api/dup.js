export default function handler(req, res) {
  res.json({ url: req.url, query: req.query, mw: req.headers['x-mw-url'] || null })
}
