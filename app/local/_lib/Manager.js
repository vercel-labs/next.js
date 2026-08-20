'use strict';

class Manager {
  static init() {
    if (Manager.instance) return;
    if (typeof window === 'undefined') {
      const { NodeVersion } = require('./NodeVersion');
      Manager.instance = new NodeVersion();
    } else {
      const { WebVersion } = require('./WebVersion');
      Manager.instance = new WebVersion();
    }
  }
}

exports.Manager = Manager;
