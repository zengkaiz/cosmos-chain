import crypto from 'crypto';

/**
 * Transaction 类 - 交易
 */
export class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;   // 发送方地址
    this.toAddress = toAddress;       // 接收方地址
    this.amount = amount;             // 转账金额
    this.timestamp = Date.now();      // 交易时间戳
  }

  /**
   * 计算交易的哈希值
   */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.fromAddress +
        this.toAddress +
        this.amount +
        this.timestamp
      )
      .digest('hex');
  }

  /**
   * 验证交易是否有效
   * 简化版本：只检查基本规则
   */
  isValid() {
    // 挖矿奖励交易(fromAddress 为 null)是有效的
    if (this.fromAddress === null) return true;

    // 检查地址是否有效
    if (!this.fromAddress || !this.toAddress) {
      return false;
    }

    // 检查金额是否有效
    if (this.amount <= 0) {
      return false;
    }

    return true;
  }

  /**
   * 显示交易信息
   */
  toString() {
    return `从 ${this.fromAddress || 'System'} 转账 ${this.amount} 到 ${this.toAddress}`;
  }
}
