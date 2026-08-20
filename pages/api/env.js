export default function handler(req, res) {
  res.json({
    TEST: process.env.TEST ?? null,
    NEXT_PUBLIC_TEST: process.env.NEXT_PUBLIC_TEST ?? null,
  })
}
