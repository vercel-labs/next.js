"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceException = void 0;

class ServiceException extends Error {
  constructor(options) {
    super(options.message);
    this.name = options.name;
    this.$fault = options.$fault;
    Object.setPrototypeOf(this, ServiceException.prototype);
  }
}
exports.ServiceException = ServiceException;
