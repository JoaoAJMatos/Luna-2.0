const R = require('ramda');
const CryptoUtil = require('../util/cryptoUtil');
const Transactions = require('./transactions');
const Config = require('../config');

class Block {
      
      // Get hash of current block
      toHash() {
            return CryptoUtil.hash(this.index + this.lastHash + this.timestamp + JSON.stringify(this.data) + this.nonce);
      }

      getDifficulty() {
            // 14 is the maximum precision length supported by javascript
            return parseInt(this.hash.substring(0, 14), 16); // TODO: See if I can implement the use of binary lvl POF checking instead of byte (bytes suck, all my homies hate bytes)
      }

      // Get Genesis block data
      static get genesis() {
            return Block.fromJSON(Config.GENESIS_BLOCK);
      }

      // Get block from JSON
      static fromJSON(data) {
            let block = new Block();

            R.forEachObjIndexed((value, key) => {

                  if (key == 'transactions' && value) {
                        block[key] = Transactions.fromJson(value);
                  } else {
                        block[key] = value;
                  }
            }, data);

            block.hash = block.toHash();
            return block;
      }
}

module.exports = Block;