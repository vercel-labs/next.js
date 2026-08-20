// this is the logger for the browser
import pino, { DestinationStream, LoggerOptions } from "pino";
import config from "./environment";
import isStringNullable from "./utils";

const pinoConfig: LoggerOptions<string> | DestinationStream = {
  browser: {
    asObject: true,
  },
};

if (!isStringNullable(config.serverUrl) && pinoConfig.browser) {
  pinoConfig.browser.transmit = {
    level: "info",
    send: (level, logEvent) => {
      const msg = logEvent.messages[0];

      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        type: "application/json",
      };
      const blob = new Blob([JSON.stringify({ msg, level })], headers);
      navigator.sendBeacon(`${config.serverUrl}/log`, blob);
    },
  };
}

const logger = pino(pinoConfig);

// this is the logger for the server
export const serverLogger = pino({
  browser: {
    asObject: true,
  },
});

export default logger;
