import { Blockchain } from './blockchain.js';
import { Transaction } from './transaction.js';

/**
 * 测试文件 - 验证区块链功能
 */

console.log('运行区块链测试...\n');

// 测试 1: 创建区块链
console.log('测试 1: 创建区块链');
const blockchain = new Blockchain();
console.log('✅ 区块链创建成功');
console.log(`   创世区块哈希: ${blockchain.chain[0].hash}`);

// 测试 2: 挖矿奖励
console.log('\n测试 2: 挖矿奖励');
blockchain.minePendingTransactions('miner1');
const balance1 = blockchain.getBalanceOfAddress('miner1');
console.log(`✅ 矿工余额: ${balance1} (预期: 0, 因为奖励在下个区块)`);

blockchain.minePendingTransactions('miner1');
const balance2 = blockchain.getBalanceOfAddress('miner1');
console.log(`✅ 矿工余额: ${balance2} (预期: 100)`);

// 测试 3: 转账交易
console.log('\n测试 3: 转账交易');
try {
  const tx = new Transaction('miner1', 'user1', 50);
  blockchain.addTransaction(tx);
  blockchain.minePendingTransactions('miner2');

  const balanceMiner1 = blockchain.getBalanceOfAddress('miner1');
  const balanceUser1 = blockchain.getBalanceOfAddress('user1');

  console.log(`✅ miner1 余额: ${balanceMiner1} (预期: 50)`);
  console.log(`✅ user1 余额: ${balanceUser1} (预期: 50)`);
} catch (error) {
  console.log(`❌ 测试失败: ${error.message}`);
}

// 测试 4: 余额不足
console.log('\n测试 4: 余额不足检查');
try {
  const tx = new Transaction('user1', 'user2', 100);
  blockchain.addTransaction(tx);
  console.log('❌ 应该抛出错误');
} catch (error) {
  console.log(`✅ 正确检测到余额不足: ${error.message}`);
}

// 测试 5: 区块链验证
console.log('\n测试 5: 区块链验证');
const isValid = blockchain.isChainValid();
console.log(`✅ 区块链有效性: ${isValid} (预期: true)`);

// 测试 6: 篡改检测
console.log('\n测试 6: 篡改检测');
blockchain.chain[1].transactions[0].amount = 999;
const isValidAfterTamper = blockchain.isChainValid();
console.log(`✅ 篡改后的验证: ${isValidAfterTamper} (预期: false)`);

// 测试总结
console.log('\n' + '='.repeat(50));
console.log('所有测试完成! ✅');
console.log('='.repeat(50));
