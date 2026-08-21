import "server-only";

import {
  pino,
  stdTimeFunctions,
  type Logger,
  type LoggerOptions,
  transport,
} from "pino";
import { join } from "node:path";

function getLoggerTransport() {
  return transport({
    targets: [
      { target: "pino-pretty" },
      {
        target: "pino-roll",
        options: { file: join("logs", "log"), frequency: "daily", mkdir: true },
      },
    ],
  });
}

function loggerSingleton(): Logger {
  const loggerOptions: LoggerOptions = {
    level: "info",
    timestamp: stdTimeFunctions.isoTime,
  };
  const loggerTransport = getLoggerTransport();
  const logger = pino(loggerOptions, loggerTransport);

  return logger;
}

const globalForLogger = globalThis as {
  logger?: Logger;
};
export const logger = globalForLogger.logger ?? loggerSingleton();
globalForLogger.logger ??= logger;
