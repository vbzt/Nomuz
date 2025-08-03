const Blockchain = require('./blockchain')

const bitcoin = new Blockchain()

bitcoin.createNewBlock(123, 'abc', 'def')

bitcoin.createNewTransaction(100, 'AlexJIHNUgygdb7yvt7e236ASD', 'MininoHASJDASD89H9167381Cyd81gc82163')

bitcoin.createNewBlock(456, 'ghi', 'jkl')

console.log(bitcoin.chain[1])