"use server";

import { serverAct } from "server-act";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const problemAction = serverAct
  // Next.js see this middleware function as server action, and wants it to be an async function
  .middleware(() => ({ special: "Hello from middleware" }))
  .input(
    zfd.formData({
      // This one as well
      name: z.string().refine((v) => true),
    }),
  )
  .action(async () => {
    return "Done";
  });

export const workaroundAction = serverAct
  // Mark this as async function to workaround
  .middleware(async () => ({ special: "Hello from middleware" }))
  .input(
    zfd.formData({
      // Mark this as async function to workaround
      name: z.string().refine(async (v) => true),
    }),
  )
  .action(async () => {
    return "Done";
  });
