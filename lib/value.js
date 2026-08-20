import { randomBytes } from "node:crypto";
export const value = (global.cachedValue ??= randomBytes(8).toString("hex"));
