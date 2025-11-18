import { Block } from './block.js';
import { Transaction } from './transaction.js';

/**
 * Blockchain 类 - 区块链
 */
export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];  // 区块链(以创世区块开始)
    this.difficulty = 4;                        // 挖矿难度
    this.pendingTransactions = [];              // 待处理的交易
    this.miningReward = 100;                    // 挖矿奖励
  }

  /**
   * 创建创世区块(区块链的第一个区块)
   */
  createGenesisBlock() {
    return new Block(Date.now(), [], '0');
  }

  /**
   * 获取最新的区块
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * 挖矿 - 将待处理的交易打包成新区块
   * @param {string} miningRewardAddress - 矿工地址
   */
  minePendingTransactions(miningRewardAddress) {
    // 创建挖矿奖励交易
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    // 创建新区块
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    // 挖矿
    console.log('开始挖矿...');
    block.mineBlock(this.difficulty);

    // 将新区块添加到链上
    this.chain.push(block);

    // 清空待处理交易
    this.pendingTransactions = [];
  }

  /**
   * 添加交易到待处理交易池
   */
  addTransaction(transaction) {
    // 验证交易
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('交易必须包含发送方和接收方地址');
    }

    if (!transaction.isValid()) {
      throw new Error('无法添加无效交易到链上');
    }

    // 检查余额是否足够
    if (transaction.amount <= 0) {
      throw new Error('交易金额必须大于0');
    }

    const balance = this.getBalanceOfAddress(transaction.fromAddress);
    if (balance < transaction.amount) {
      throw new Error('余额不足');
    }

    this.pendingTransactions.push(transaction);
    console.log(`交易已添加: ${transaction.toString()}`);
  }

  /**
   * 获取某个地址的余额
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    // 遍历所有区块
    for (const block of this.chain) {
      // 遍历区块中的所有交易
      for (const trans of block.transactions) {
        // 如果是发送方，减少余额
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        // 如果是接收方，增加余额
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  /**
   * 获取某个地址的所有交易
   */
  getAllTransactionsForAddress(address) {
    const transactions = [];

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address || trans.toAddress === address) {
          transactions.push(trans);
        }
      }
    }

    return transactions;
  }

  /**
   * 验证整个区块链是否有效
   */
  isChainValid() {
    // 从第二个区块开始验证(跳过创世区块)
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 验证区块中的交易
      if (!currentBlock.hasValidTransactions()) {
        console.log('发现无效交易');
        return false;
      }

      // 验证当前区块的哈希值
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('当前区块哈希值无效');
        return false;
      }

      // 验证区块链的连接
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('区块链连接断裂');
        return false;
      }

      // 验证工作量证明
      const target = Array(this.difficulty + 1).join('0');
      if (currentBlock.hash.substring(0, this.difficulty) !== target) {
        console.log('工作量证明无效');
        return false;
      }
    }

    return true;
  }

  /**
   * 获取区块链信息
   */
  getChainInfo() {
    return {
      chainLength: this.chain.length,
      difficulty: this.difficulty,
      miningReward: this.miningReward,
      pendingTransactions: this.pendingTransactions.length,
      isValid: this.isChainValid()
    };
  }

  /**
   * 获取最近的区块
   */
  getRecentBlocks(count = 10) {
    const start = Math.max(0, this.chain.length - count);
    return this.chain.slice(start).reverse();
  }
}
