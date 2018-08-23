const _ = require('lodash');
const PeerList = require('./PeerList');
const ChainParams = require('./ChainParams');
const Logger = require('./utils/Logger');
const fileconf = require('../config.json');

class Node {
  constructor(opts){
    this.config = _.get(opts, 'config', fileconf);
    let confLogLevel = _.get(opts, 'logLevel', 'WARN');
    const logLevel = ['FATAL', 'ERROR', 'WARN', 'NOTICE', 'INFO', 'DEBUG', 'VERBOSE']
        .includes(confLogLevel.toUpperCase()) ? confLogLevel.toUpperCase() : 'WARN';
    let logger = global.logger = this.logger = new Logger({level: logLevel});
    this.mode = _.get(opts, 'mode', 'node');
    this.chain = new ChainParams(_.get(this.config, 'chain', 'testnet'));

    this.initPeerList();

    if(['discovery', 'node'].includes(this.mode)){
      this.startNode();
      logger.info(`Starting up a new node (in ${this.mode} mode)`);
    }

  }
  initPeerList(){
    this.peerList = new PeerList({
      chain: this.chain,
      DNSSeeds:this.chain.DNSSeeds,
      peers:{
        known:_.get(fileconf,'peers', [])
      }
    });
    logger.info('PeerList initializated');
  }
  startNode(){

  }
};
module.exports = Node;
