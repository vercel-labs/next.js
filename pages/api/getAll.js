export default function handler(req, res) {
  res.status(200).json({ route: "/api/getAll", ok: true });
}
