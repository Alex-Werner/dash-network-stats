const _ = require('lodash');
const PeerList = require('./PeerList');
const ChainParams = require('./ChainParams');
const Logger = require('./utils/Logger');
const fileconf = require('../config.json');

const defaultOpts = {
  mode:'node',
  logLevel:'WARN',
  network:'mainnet',
  peers:{
    known:[]
  }
}
class Node {
  constructor(opts){
    this.config = _.get(opts, 'config', fileconf);
    let confLogLevel = _.get(opts, 'logLevel', defaultOpts.logLevel);
    const logLevel = ['FATAL', 'ERROR', 'WARN', 'NOTICE', 'INFO', 'DEBUG', 'VERBOSE']
        .includes(confLogLevel.toUpperCase()) ? confLogLevel.toUpperCase() :  defaultOpts.logLevel;
    this.mode = _.get(opts, 'mode', defaultOpts.mode);
    this.chain = new ChainParams(_.get(this.config, 'network', defaultOpts.network));

    let logger = global.logger = this.logger = new Logger({level: logLevel});

    if(['discovery', 'node'].includes(this.mode)){
      this.startNode();
    }

  }
  initPeerList(){
    this.peerList = new PeerList({
      chain: this.chain,
      DNSSeeds:this.chain.DNSSeeds,
      peers:{
        known:_.get(fileconf,'peers', defaultOpts.peers.known)
      },
      mode:this.mode
    });
    logger.info('PeerList initializated');
  }
  startNode(){
    this.initPeerList();
    logger.info(`Starting up a new node (in ${this.mode} mode)`);
  }
};
module.exports = Node;
