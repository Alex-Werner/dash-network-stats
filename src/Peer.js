const config = require('../config');
const _ = require('lodash');
const defaultOpts = {
  queueInterval: 500
}

class Peer {
  constructor(opts) {
    if (!opts.port || !opts.ip || !opts.chain) {
      throw new Error('Invalid parameters for peer');
    }
    ;
    this.emitter = new EventEmitter2({
      wildcard: true,
      maxListeners: 20
    })
    this.ip = opts.ip;
    this.port = opts.port;
    this.chain = opts.chain;
    this.agent = null;
    this.version = this.chain.protocol.PROTOCOL_VERSION;
    this.magicNetwork = this.chain.protocol.network;
    this.packetQ = [];
    this.packetsReceived = 0;
    this.packetHistory = [];
    this.historyEvents = {
      nbTimeout: 0
    }

    this.preferences = {
      blocksAsHeaders: false//Became true when the peer sent a sendheaders msg
    }
    this.timestamps = {
      init: +new Date(),
      connected: null
    }
    this.queueInterval = _.get(config, 'queueInterval', defaultOpts.queueInterval)
    let self = this;
    this.worker = {
      queueParserInt: setInterval(self.queueParser.bind(self), self.queueInterval),
      queue:[]
    }
  }
  queueParser() {
    let len = this.worker.queue.length;
    if (len < 1)
      return false;

    logger.info(`Queue parsing - ${len} in queue`);
  }
};
module.exports = Peer;