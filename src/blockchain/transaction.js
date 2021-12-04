const R = require('ramda');
const CryptoUtil = require('../util/cryptoUtil'); // default cryptography module (SHA-256 calculator)
const CryptoEdDSAUtil = require('../util/cryptoEdDSAUtil'); // digital signature module (ECDSA)
const TransactionAssertionError = require('./assertionErrors/transactionAssertionError');
const Config = require('../config');

class Transaction {

      // Transaction constructor method
      construct() {
            this.id = null;
            this.hash = null;
            this.type = null;
            this.data = {
                  inputs:  [],
                  outputs: []
            };
      }

      // Calculate the transaction hash
      toHash() {
            return CryptoUtil.hash(this.id + this.type + JSON.stringify(this.data));
      }

      // The check method will validate every transaction inside an array of transactions
      check() {
            // Check if the transaction hash is correct
            let isTransactionHashValid = this.hash == this.toHash();

            // Throw error if the has is not correct
            if (!isTransactionHashValid) {
                  console.error(`[ERR] Invalid transaction hash '${this.hash}'`, this);
                  throw new TransactionAssertionError(`[ERR] Invalid transaction hash '${this.hash}'`, this);
            }

            // If the hash is correct: validate the transactions
            // Check if the signatures of all input transactions are correct (transaction data is signed by the public key of the address)
            R.map((txInput) => {
                  let txInputHash = CryptoUtil.hash({
                        transaction: txInput.transaction,
                        index: txInput.index,
                        address: txInput.address
                  });

                  let isValidSignature = CryptoEdDSAUtil.verifySignature(txInput.address, txInput.signature, txInputHash);

                  // Throw an error if the signature is invalid
                  if (!isValidSignature) {
                        console.error(`[ERR] Invalid transaction input signature '${JSON.stringify(txInput)}'`);
                        throw new TransactionAssertionError(`[ERR] Invalid transaction input signature '${JSON.stringify(txInput)}'`, txInput);
                  }
            }, this.data.inputs);

            // If the incoming transaction is of regular type:
            if (this.type == 'regular') {
                  // Check if the sum of the input transactions is greater than the sum of the output transactions
                  let sumOfInputsAmount = R.sum(R.map(R.prop('amount'), this.data.inputs));
                  let sumOfOutputsAmount = R.sum(R.map(R.prop('amount'), this.data.outputs));

                  let negativeOutputsFound = 0;
                  
                  // Check for negative outputs
                  for (let i = 0; i < this.data.outputs.length; i++) {
                        if (this.data.outputs[i].amount < 0) {
                              negativeOutputsFound++;
                        }
                  }

                  let isInputsAmountGreaterOrEqualThanOutputsAmount = R.gte(sumOfInputsAmount, sumOfOutputsAmount);

                  if (!isInputsAmountGreaterOrEqualThanOutputsAmount) {
                        console.error(`Invalid transaction balance: inputs sum = '${sumOfInputsAmount}', outputs sum = '${sumOfOutputsAmount}'`);
                        throw new TransactionAssertionError(`Invalid transaction balance: inputs sum = '${sumOfInputsAmount}', outputs sum = '${sumOfOutputsAmount}'`, { sumOfInputsAmount, sumOfOutputsAmount });
                  }

                  // Check for the fees inside the transactions
                  let isEnoughFee = (sumOfInputsAmount - sumOfOutputsAmount) >= Config.FEE_PER_TRANSACTION; 

                  // If the fee isn't correct: throw an error
                  if (!isEnoughFee) {
                        console.error(`Not enough fee: expected '${Config.FEE_PER_TRANSACTION}' got '${(sumOfInputsAmount - sumOfOutputsAmount)}'`);
                        throw new TransactionAssertionError(`Not enough fee: expected '${Config.FEE_PER_TRANSACTION}' got '${(sumOfInputsAmount - sumOfOutputsAmount)}'`, { sumOfInputsAmount, sumOfOutputsAmount, FEE_PER_TRANSACTION: Config.FEE_PER_TRANSACTION });
                  }

                  // Throw an error if negative outputs are found
                  if (negativeOutputsFound > 0) {
                        console.error(`Transaction is either empty or negative, output(s) caught: '${negativeOutputsFound}'`);
                        throw new TransactionAssertionError(`Transaction is either empty or negative, output(s) caught: '${negativeOutputsFound}'`);
                  }
            }

            return true;
      }

      // Get transaction from JSON
      static fromJson(data) {
            let transaction = new Transaction();
            R.forEachObjIndexed((value, key) => { transaction[key] = value; }, data);
            transaction.hash = transaction.toHash();
            return transaction;
      }
}

module.exports = Transaction;