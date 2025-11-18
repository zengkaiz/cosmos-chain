import crypto from 'crypto';

/**
 * Block 类 - 区块链中的单个区块
 */
export class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;           // 区块创建时间戳
    this.transactions = transactions;     // 区块中的交易数据
    this.previousHash = previousHash;     // 前一个区块的哈希值
    this.nonce = 0;                       // 工作量证明的随机数
    this.hash = this.calculateHash();     // 当前区块的哈希值
  }

  /**
   * 计算区块的哈希值
   * 使用 SHA-256 算法
   */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
      )
      .digest('hex');
  }

  /**
   * 挖矿 - 工作量证明 (Proof of Work)
   * @param {number} difficulty - 难度值(前导零的个数)
   */
  mineBlock(difficulty) {
    // 生成目标字符串，例如难度为4时，target = "0000"
    const target = Array(difficulty + 1).join('0');

    // 不断尝试不同的 nonce 值，直到哈希值满足难度要求
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`区块挖矿成功! Hash: ${this.hash}`);
  }

  /**
   * 验证区块中的所有交易
   */
  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}
