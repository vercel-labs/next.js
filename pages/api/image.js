export default function handler(req, res) {
  res.status(200).json({ url: req.query.url ?? null, reqUrl: req.url })
}
