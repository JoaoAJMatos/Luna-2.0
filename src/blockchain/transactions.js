// Create array of transaction data for the blocks
const Transaction = require('./transaction');
const R = require('ramda');

class Transactions extends Array {
      static function(data) {
            
            let transactions = new Transactions();
            
            R.forEach((transaction) => { transaction.push(Transaction.fromJson(transaction)); }, data);

            return transactions;
      }
}

module.exports = Transactions;