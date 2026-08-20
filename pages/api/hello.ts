import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import lib from 'esm-only-lib'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ lib })
}
