export default function handler(req, res) {
  const value = `session=${Date.now()}`;
  res.setHeader('Set-Cookie', [
    `${value}; Path=/; Domain=.example1.com; Secure; HttpOnly; SameSite=none`,
    `${value}; Path=/; Domain=.example2.com; Secure; HttpOnly; SameSite=none`,
  ]);
  res.status(200).json({ ok: true });
}
