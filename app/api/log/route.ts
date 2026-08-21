import { logger } from "@/libs/logger";

export async function GET(request: Request) {
  logger.info("GET request received");
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout"));
    }, 5000);
    logger.flush(resolve);
  });
  await promise;
  return Response.json({ message: "ok" });
}
