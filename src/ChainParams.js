//todo : add regtest https://dash-docs.github.io/en/developer-reference#constants-and-defaults
class ChainParams {
  constructor(network = "mainnet") {
    this.COIN = 100000000;
    this.INV_TYPE = [
      null,
      "MSG_TX",
      "MSG_BLOCK",
      "MSG_FILTERED_BLOCK",
      "MSG_TXLOCK_REQUEST",
      "MSG_TXLOCK_VOTE",
      "MSG_SPORK",
      "MSG_MASTERNODE_PAYMENT_VOTE",
      "MSG_MASTERNODE_PAYMENT_BLOCK",
      "MSG_MASTERNODE_SCANNING_ERROR",
      "MSG_BUDGET_FINALIZED",
      "MSG_BUDGET_FINALIZED_VOTE",
      "MSG_MASTERNODE_QUORUM",
      "MSG_MASTERNODE_ANNONCE",
      "MSG_MASTERNODE_PING",
      "MSG_DSTX",
      "MSG_GOVERNANCE_OBJECT",
      "MSG_GOVERNANCE_OBJECT_VOTE",
      "MSG_MASTERNODE_VERIFY"
    ];
    this.protocol = {
      PROTOCOL_VERSION: 70208,
      INIT_PROTO_VERSION: 209,
      GETHEADERS_VERSION: 70077,
      MIN_PEER_PROTO_VERSION: 70206,
      CADDR_TIME_VERSION: 31402,
      NOBLKS_VERSION_START: 32000,
      NOBLKS_VERSION_END: 32400,
      BIP0031_VERSION: 60000,
      MEMPOOL_GD_VERSION: 60002,
      NO_BLOOM_VERSION: 70201,
      SENDHEADERS_VERSION: 70201,
      SERVICES_SPV:0,//hex: 0000000000000000
      SERVICES_FULL:1//hex:0100000000000000
    };
    this.MAX_MONEY = 21000000 * this.COIN;
    this.network = "mainnet";
    (network === "mainnet"|| network === "livenet") ? this.loadMainnetParams() : this.loadTestnetParams();
  }

  loadMainnetParams() {
    this.defaultPort = 9999;
    this.protocol.MAGIC_NETWORK = 0xbd6b0cbf;
    this.protocol.versionP2PKHAddress = 0x4c;
    this.protocol.versionP2SHAddress = 0x10;
    this.genesisHeader = {
      version: 1,
      time: 1390095618,
      bits: 504365040,//0x1e0ffff0
      nonce: 28917698,
      reward: 50 * this.COIN,
      hash: "0x00000ffd590b1485b3caadc19b22e6379c733355108f107a430458cdf3407ab6",
      merkleRoot: "0xe0028eb9648db56b1ac77cf090b99048a8007e2bb64b68f092c03c7f56a662c7"
    };
    this.DNSSeeds = [
      'dnsseed.dash.org',
      'dnsseed.dashdot.io',
      'dnsseed.masternode.io',
      'dnsseed.dashpay.io'
    ];
    this.checkpoints = [
      ["1500", "0x000000aaf0300f59f49bc3e970bad15c11f961fe2347accffff19d96ec9778e3"],
      ["4991", "0x000000003b01809551952460744d5dbb8fcbd6cbae3c220267bf7fa43f837367"],
      ["9918", "0x00000000213e229f332c0ffbe34defdaa9e74de87f2d8d1f01af8d121c3c170b"],
      ["16912", "0x00000000075c0d10371d55a60634da70f197548dbbfa4123e12abfcbc5738af9"],
      ["23912", "0x0000000000335eac6703f3b1732ec8b2f89c3ba3a7889e5767b090556bb9a276"],
      ["35457", "0x0000000000b0ae211be59b048df14820475ad0dd53b9ff83b010f71a77342d9f"],
      ["45479", "0x000000000063d411655d590590e16960f15ceea4257122ac430c6fbe39fbf02d"],
      ["55895", "0x0000000000ae4c53a43639a4ca027282f69da9c67ba951768a20415b6439a2d7"],
      ["68899", "0x0000000000194ab4d3d9eeb1f2f792f21bb39ff767cb547fe977640f969d77b7"],
      ["74619", "0x000000000011d28f38f05d01650a502cc3f4d0e793fbc26e2a2ca71f07dc3842"],
      ["75095", "0x0000000000193d12f6ad352a9996ee58ef8bdc4946818a5fec5ce99c11b87f0d"],
      ["88805", "0x00000000001392f1652e9bf45cd8bc79dc60fe935277cd11538565b4a94fa85f"],
      ["107996", "0x00000000000a23840ac16115407488267aa3da2b9bc843e301185b7d17e4dc40"],
      ["137993", "0x00000000000cf69ce152b1bffdeddc59188d7a80879210d6e5c9503011929c3c"],
      ["167996", "0x000000000009486020a80f7f2cc065342b0c2fb59af5e090cd813dba68ab0fed"],
      ["207992", "0x00000000000d85c22be098f74576ef00b7aa00c05777e966aff68a270f1e01a5"],
      ["312645", "0x0000000000059dcb71ad35a9e40526c44e7aae6c99169a9e7017b7d84b1c2daf"],
      ["407452", "0x000000000003c6a87e73623b9d70af7cd908ae22fee466063e4ffc20be1d2dbc"],
      ["523412", "0x000000000000e54f036576a10597e0e42cc22a5159ce572f999c33975e121d4d"],
      ["523930", "0x0000000000000bccdb11c2b1cfb0ecab452abf267d89b7f46eaf2d54ce6e652c"]
    ];
  }

  loadTestnetParams() {
    this.defaultPort = 19999;
    this.protocol.MAGIC_NETWORK = 0xffcae2ce;
    this.protocol.versionP2PKHAddress = 0x8c;
    this.protocol.versionP2SHAddress = 0x13;

    this.genesisHeader = {
      version: 1,
      time: 1390666206,
      bits: 504365040,//0x1e0ffff0
      nonce: 3861367235,
      reward: 50 * this.COIN,
      hash: "0x00000bafbc94add76cb75e2ec92894837288a481e5c005f6563d91623bf8bc2c",
      merkleRoot: "0xe0028eb9648db56b1ac77cf090b99048a8007e2bb64b68f092c03c7f56a662c7"
    };
    this.network="testnet";
    this.DNSSeeds = [
      'testnet-seed.dashdot.io',
      'test.dnsseed.masternode.io'
    ];
    this.checkpoints = [
      ["261", "0x00000c26026d0815a7e2ce4fa270775f61403c040647ff2c3091f99e894a4618"],
      ["1999", "0x00000052e538d27fa53693efe6fb6892a0c1d26c0235f599171c48a3cce553b1"],
      ["2999", "0x0000024bc3f4f4cb30d29827c13d921ad77d2c6072e586c7f60d83c2722cdcc5"]
    ]
  }
  fromMagic(magic){
    if(magic!==this.protocol.MAGIC_NETWORK){
      if(this.network==="testnet") this.loadMainnetParams();
      else this.loadTestnetParams();

      if(magic!==this.protocol.MAGIC_NETWORK) throw new Error('Unrecognized network.');
    }
  }

};

module.exports = ChainParams;