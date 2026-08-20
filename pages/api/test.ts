import type { NextApiRequest, NextApiResponse } from 'next'

// `as const` makes Next.js' static analysis fail with
// `Unsupported node type "TsConstAssertion" at "config"`.
export const config = { api: { bodyParser: { sizeLimit: '8mb' } } } as const

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ ok: true })
}
