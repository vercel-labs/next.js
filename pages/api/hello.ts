import type { NextApiRequest, NextApiResponse } from 'next'
import { BackendMock } from '../../lib/BackendMock'
import { VALUE } from '../../lib/unrelated'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  BackendMock.init()
  res.json({ ok: true, value: VALUE })
}
