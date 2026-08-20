export default function handler(req, res) {
  const info = { where: 'api', reqUrl: req.url, hostHeader: req.headers.host, xfh: req.headers['x-forwarded-host'] ?? null }
  console.log('API ' + JSON.stringify(info))
  res.status(200).json(info)
}
