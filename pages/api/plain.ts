import type { NextApiRequest, NextApiResponse } from 'next'

// Identical config without `as const` -> builds fine.
export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ ok: true })
}
