'use strict';

// Simulates a DI identifier (instance-unique Symbol)
exports.ConfigSymbol = Symbol('Config');

// Simulates a minimal implementation of the inversify Container
exports.Container = class Container {
  constructor() {
    this.map = new Map();
  }
  bind(key, value) {
    this.map.set(key, value);
  }
  get(key) {
    if (!this.map.has(key)) {
      throw new Error(
        `No matching bindings found for serviceIdentifier: ${String(key)}`
      );
    }
    return this.map.get(key);
  }
};
