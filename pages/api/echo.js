export default function handler(req, res) {
  res.status(200).json({
    contentType: req.headers['content-type'] || null,
    bodyType: typeof req.body,
    isPlainObject: !!req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body),
    body: typeof req.body === 'string' ? req.body : req.body,
  });
}
