// API route that never reads the request body.
export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  res.status(200).json({ ok: true, note: 'body was never read by this route' });
}
