import { Blockchain } from './blockchain.js';
import { Transaction } from './transaction.js';

/**
 * NodeChain - 简单的区块链演示
 */

console.log('='.repeat(60));
console.log('NodeChain - 简单的区块链实现');
console.log('='.repeat(60));

// 创建区块链
const nodeChain = new Blockchain();

console.log('\n📦 创世区块已创建');
console.log('链信息:', nodeChain.getChainInfo());

// 创建一些地址
const address1 = 'alice-address';
const address2 = 'bob-address';
const minerAddress = 'miner-address';

console.log('\n' + '='.repeat(60));
console.log('场景 1: 第一次挖矿 - 矿工获得奖励');
console.log('='.repeat(60));

// 第一次挖矿(矿工获得奖励)
nodeChain.minePendingTransactions(minerAddress);
console.log(`\n矿工余额: ${nodeChain.getBalanceOfAddress(minerAddress)} 币`);

console.log('\n' + '='.repeat(60));
console.log('场景 2: 矿工转账给 Alice');
console.log('='.repeat(60));

// 矿工转账给 Alice
try {
  const tx1 = new Transaction(minerAddress, address1, 30);
  nodeChain.addTransaction(tx1);

  // 挖矿处理交易
  nodeChain.minePendingTransactions(minerAddress);

  console.log(`\n💰 当前余额:`);
  console.log(`  矿工: ${nodeChain.getBalanceOfAddress(minerAddress)} 币`);
  console.log(`  Alice: ${nodeChain.getBalanceOfAddress(address1)} 币`);
  console.log(`  Bob: ${nodeChain.getBalanceOfAddress(address2)} 币`);
} catch (error) {
  console.error('❌ 交易失败:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('场景 3: Alice 转账给 Bob');
console.log('='.repeat(60));

try {
  const tx2 = new Transaction(address1, address2, 10);
  nodeChain.addTransaction(tx2);

  // 挖矿处理交易
  nodeChain.minePendingTransactions(minerAddress);

  console.log(`\n💰 当前余额:`);
  console.log(`  矿工: ${nodeChain.getBalanceOfAddress(minerAddress)} 币`);
  console.log(`  Alice: ${nodeChain.getBalanceOfAddress(address1)} 币`);
  console.log(`  Bob: ${nodeChain.getBalanceOfAddress(address2)} 币`);
} catch (error) {
  console.error('❌ 交易失败:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('场景 4: 尝试余额不足的交易');
console.log('='.repeat(60));

try {
  const tx3 = new Transaction(address2, address1, 100); // Bob 只有 10 币
  nodeChain.addTransaction(tx3);
} catch (error) {
  console.error('❌ 交易失败:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('区块链验证');
console.log('='.repeat(60));

console.log(`\n区块链是否有效: ${nodeChain.isChainValid() ? '✅ 是' : '❌ 否'}`);
console.log('\n📊 区块链信息:');
console.log(nodeChain.getChainInfo());

console.log('\n📋 区块列表:');
nodeChain.chain.forEach((block, index) => {
  console.log(`\n区块 #${index}:`);
  console.log(`  时间: ${new Date(block.timestamp).toLocaleString('zh-CN')}`);
  console.log(`  哈希: ${block.hash}`);
  console.log(`  前区块哈希: ${block.previousHash}`);
  console.log(`  Nonce: ${block.nonce}`);
  console.log(`  交易数: ${block.transactions.length}`);

  if (block.transactions.length > 0) {
    console.log(`  交易详情:`);
    block.transactions.forEach((tx, i) => {
      console.log(`    ${i + 1}. ${tx.toString()}`);
    });
  }
});

console.log('\n' + '='.repeat(60));
console.log('场景 5: 尝试篡改区块链');
console.log('='.repeat(60));

// 尝试篡改第二个区块的交易
console.log('\n尝试修改区块 #1 的交易金额...');
nodeChain.chain[1].transactions[0].amount = 1000;

console.log(`区块链是否有效: ${nodeChain.isChainValid() ? '✅ 是' : '❌ 否'}`);
console.log('结论: 篡改被检测到! 区块链的不可篡改性得到验证 ✅');

console.log('\n' + '='.repeat(60));
console.log('演示完成!');
console.log('='.repeat(60));
