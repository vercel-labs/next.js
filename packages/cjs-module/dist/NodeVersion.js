'use strict';
var undici = require('undici');
class NodeVersion {
  constructor() {
    this.agent = undici.ProxyAgent;
  }
}
exports.NodeVersion = NodeVersion;
