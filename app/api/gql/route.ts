import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'

// This is the exact shape of the handler returned by
// `startServerAndCreateNextHandler` from `@as-integrations/next` (Apollo Server),
// reduced to plain types so the repro has no third-party dependencies.
type ApolloNextHandler = {
  <Req extends NextApiRequest>(req: Req, res: NextApiResponse): Promise<unknown>
  <Req extends NextRequest | Request>(
    req: Req,
    res?: undefined
  ): Promise<Response>
}

const handleRequest = ((req: any, res?: any) =>
  Promise.resolve(Response.json({ ok: true }))) as ApolloNextHandler

export { handleRequest as POST }
