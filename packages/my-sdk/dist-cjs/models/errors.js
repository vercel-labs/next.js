"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDeniedException = void 0;
const ServiceException_1 = require("./ServiceException");

class AccessDeniedException extends ServiceException_1.ServiceException {
  name = "AccessDeniedException";
  $fault = "client";
  constructor(options) {
    super({
      name: "AccessDeniedException",
      $fault: "client",
      ...options,
    });
    Object.setPrototypeOf(this, AccessDeniedException.prototype);
  }
}
exports.AccessDeniedException = AccessDeniedException;
