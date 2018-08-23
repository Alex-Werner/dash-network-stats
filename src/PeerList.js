const _ = require('lodash');
const {EventEmitter2} = require('eventemitter2');
const Peer = require('./Peer');
const fs = require('fs');
const fileHelper = require('./utils/fileHelper');
const Net = require('./utils/Net');

const defaultOpts = {
  peersPath:'.data/peers.json',
  peersFileActive:true,
  peersFileSyncInterval:10000,
  mode:'node',
}
class PeerList{
  constructor(opts){
    this.emitter = new EventEmitter2({
      wildcard:true,
      maxListeners:20
    });
    this.chain = opts.chain;
    if(!this.chain){
      throw new Error('Missing chain');
    }
    this.DNSSeeds = _.get(opts, 'DNSSeeds', opts.chain.DNSSeeds);
    this.mode = _.get(opts, 'mode', opts.mode);
    this.peers = {
      active: {},
      closed: {},
      known: {},
      file:{
        lastRehydrate:0,
        lastSave:0,
      }
    };

    this.workers = {
      fileSync:{
        active:_.get(opts, 'peersFileActive', defaultOpts.peersFileActive),
        path:_.get(opts, 'peersPath', defaultOpts.peersPath),
        workerExecIntervalTime:_.get(opts, 'peersFileSyncInterval',  defaultOpts.peersFileSyncInterval),
        workerExecInterval:null,
        workerRunning:false
      }
    };
    this.net = new Net();
    this.importConfigPeers(opts);
    this.importPeersFile(opts);
    if(this.workers.fileSync.active){
      this.startFileSyncWorker();
    }

    if(this.mode==='discovery'){
      this.startDiscovery(true);
    }
    logger.info('PeerList started');
  }
  async startDiscovery(expendPeerList=false){
   this.fetchDNSSeeds(true);

  }
  async fetchDNSSeeds(store=false){
    const self = this;
    const seeds = this.DNSSeeds || this.chain.DNSSeeds;
    let promises = [];
    seeds.forEach(async (seed)=>{
      logger.info('Fetching DNS seed at ', seed);
      promises.push(this.net.lookupHost(seed));
    })
    let resolved = await Promise.all(promises);
    let lookups = [];
    resolved.forEach((seeds)=>{
      seeds.forEach((seed)=>{
        if(!lookups.includes(seed)){
          lookups.push(seed);
        }
      })
    });
    if(store){
      const peerOpts = this.mode==='discovery' ? {priority:true} : {};
      const addInFile = true;
      lookups.forEach((ip)=>{
        self.addPeer({ip}, addInFile, peerOpts)
      })
    }
    return lookups;
  }
  stopFileSyncWorker(){
    clearInterval(this.workers.fileSync.workerExecInterval);
    this.workers.fileSync.workerExecInterval = null
  }
  execFileSyncWorker(){

    fileHelper.writeJSON(this.workers.fileSync.path, Object.assign({}, this.peers.known));
      this.peers.file.lastSave=Date.now()
    console.log('execFileSyncWorker');
    console.log(`${Object.keys(this.peers.known).length} known node`);
    // console.log(this.peers);
  }
  startFileSyncWorker(){
    const self = this;
    if (this.workers.fileSync.workerRunning || this.workers.fileSync.workerExecInterval) {
      this.stopFileSyncWorker();
    }
    const path = this.workers.fileSync.path;
    fileHelper.ensureDirSync(path);
    if (!fileHelper.isFileExistSync(path)) {
      fileHelper.writeJSONSync(path, []);
    }

    // every minutes, check the pool
    this.workers.fileSync.workerExecInterval = setInterval(self.execFileSyncWorker.bind(self), this.workers.fileSync.workerExecIntervalTime);
    this.workers.fileSync.workerRunning = true;
    this.emitter.emit('PEERLIST/FILESYNC/STARTED');
  }
  importConfigPeers(opts){
    const self = this;
    let knownPeers = _.get(opts, 'peers.known', []);
    knownPeers.map(function (ip) {
      //If we setup that, this mean we want to connect to them in priority.
      self.addPeer({ip}, true, {priority:true});
    })
  }
  importPeersFile(){
    const self = this;
    const knownPeers = fileHelper.readJSONSync(this.workers.fileSync.path);
    const knownIp = Object.keys(knownPeers);
    knownIp.forEach((ip)=>{
      self.addPeer({...knownPeers[ip]}, true, {priority:true});
    })
  }
  getPeer(peer){
    const {ip} = peer;
    const knownIps = Object.keys(this.peers.known);
    return knownIps.includes(ip) ? this.peers.known[ip] : false;
  }
  addPeer(peer, addInFile = true, opts){
    const {ip} = peer;
    if(!this.getPeer({ip})){
      this.peers.known[ip]=peer;
    }
    // console.log(peer);
  }
};
module.exports = PeerList;