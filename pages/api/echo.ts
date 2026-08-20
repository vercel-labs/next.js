import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    hostHeader: req.headers.host,
    matchedHost: req.query.matchedHost ?? null,
  })
}
