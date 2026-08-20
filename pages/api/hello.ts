import type { NextApiRequest, NextApiResponse, PageConfig } from 'next'

export const config: PageConfig = {
  api: { bodyParser: { sizeLimit: '1mb' } },
}

// negative check: invalid key must error
export const bad: PageConfig = { api: { bodyParser: { sizeLimit: '1mb' } }, nope: true }

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ ok: true })
}
