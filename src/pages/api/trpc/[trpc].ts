import * as Sentry from "@sentry/nextjs";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";

import { appRouter } from "~/server/root";
import { createTRPCContext } from "~/server/trpc";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4.5mb",
    },
  },
};

const trpcHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError({ path, error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      Sentry.captureException(error, { extra: { path } });
    }
    console.error(`tRPC error on ${path ?? "<no-path>"}:`, error.message);
  },
});

// Wrapper as the new typedRoutes validator conflicts with tRPC types
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await trpcHandler(req, res);
}
