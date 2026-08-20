export default function handler(req, res) {
  res.json({ route: 'pages/api/test', url: req.url, query: req.query })
}
