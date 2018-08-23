const dns = require('dns');
class Net {
  constructor(){

  }
  lookupHost(hostname){
    return new Promise(function(resolve, reject){
      dns.resolve(hostname,'A',function(err, addr){
        if(err){
          return reject(err);
        }
        return resolve(addr);
      });
    });
  }
};
module.exports = Net;