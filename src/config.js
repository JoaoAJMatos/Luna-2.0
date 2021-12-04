// This file contains all the necessary configurations for the Luna blockchain to start up
// 
// ! Warning !
// ! DO NOT change these configurations after the blockchain is initialized !

module.exports = {
      MINING_REWARD: 50000, // TODO: try to make the mining reward decrease over time

      FEE_PER_TRANSACTION: 1, // TODO: try to implement a fee over the transaction size (not quantity)

      TRANSACTIONS_PER_BLOCK: 2, // TODO: try to determine a limit based on the block size (not quantity)

      // Initial blockchain block
      GENESIS_BLOCK: {
            index: 0,
            lastHash: '1e37312febade73f59e296deab3d098799604e3e6848fdb8fd5ef9db5654f66a',
            timestamp: 1083283200,
            nonce: 0,
            transactions: [
                  {
                        id: '4578faa575ce64fe6eba7b345ac70ae5060dc8d4343be9f2b5fd601121a24205',
                        hash: 'none',
                        type: 'regular',
                        data: {
                              inputs: [],
                              outputs: [],
                        }
                  }
            ]
      },

      // Proof Of Work difficulty settings
      INITIAL_DIFFICULTY: 10 // 10 leading 0s
}