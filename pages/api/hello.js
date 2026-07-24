// Static API route: resolved via on-demand filesystem checks in dev,
// so it keeps working even when the dynamic route table is incomplete.
export default function handler(req, res) {
  res.status(200).json({ ok: 'static' })
}
