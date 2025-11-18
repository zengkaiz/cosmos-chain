import express from 'express';
import cors from 'cors';
import { Blockchain } from './blockchain.js';
import { Transaction } from './transaction.js';

const app = express();
const PORT = 3000;

// 创建区块链实例
const blockchain = new Blockchain();

// 初始化一些演示数据
console.log('初始化区块链...');
blockchain.minePendingTransactions('miner-node');
console.log('创世挖矿完成');

// 创建一些初始交易
const tx1 = new Transaction('miner-node', 'alice', 30);
blockchain.addTransaction(tx1);
blockchain.minePendingTransactions('miner-node');
console.log('初始交易完成\n');

// 中间件
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 请求体

// ==================== API 端点 ====================

/**
 * GET /status - 获取节点状态
 */
app.get('/status', (req, res) => {
  res.json({
    nodeInfo: {
      network: 'nodechain-1',
      version: '1.0.0',
      moniker: 'nodechain-node'
    },
    syncInfo: {
      latestBlockHeight: blockchain.chain.length - 1,
      latestBlockTime: new Date(blockchain.getLatestBlock().timestamp).toISOString(),
      catching_up: false
    }
  });
});

/**
 * GET /blockchain - 获取完整的区块链
 */
app.get('/blockchain', (req, res) => {
  res.json({
    chain: blockchain.chain,
    chainInfo: blockchain.getChainInfo()
  });
});

/**
 * GET /chain-info - 获取链信息
 */
app.get('/chain-info', (req, res) => {
  const info = blockchain.getChainInfo();
  res.json({
    chainId: 'nodechain-1',
    latestBlockHeight: info.chainLength - 1,
    latestBlockTime: new Date(blockchain.getLatestBlock().timestamp).toISOString(),
    difficulty: info.difficulty,
    miningReward: info.miningReward,
    isValid: info.isValid
  });
});

/**
 * GET /block/:height - 获取指定高度的区块
 */
app.get('/block/:height', (req, res) => {
  const height = parseInt(req.params.height);

  if (isNaN(height) || height < 0 || height >= blockchain.chain.length) {
    return res.status(404).json({
      error: 'Block not found',
      message: `Invalid block height: ${req.params.height}`
    });
  }

  const block = blockchain.chain[height];
  res.json({
    block: {
      header: {
        height: height,
        time: new Date(block.timestamp).toISOString(),
        hash: block.hash,
        previousHash: block.previousHash,
        nonce: block.nonce
      },
      data: {
        txs: block.transactions.map(tx => ({
          from: tx.fromAddress || 'System',
          to: tx.toAddress,
          amount: tx.amount,
          timestamp: new Date(tx.timestamp).toISOString()
        }))
      }
    },
    blockId: {
      hash: block.hash
    }
  });
});

/**
 * GET /blocks - 获取最近的区块列表
 */
app.get('/blocks', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const blocks = blockchain.getRecentBlocks(count);

  res.json({
    blocks: blocks.map((block, index) => ({
      height: blockchain.chain.length - blocks.length + index,
      hash: block.hash,
      time: new Date(block.timestamp).toISOString(),
      txCount: block.transactions.length,
      proposer: 'node-validator',
      previousHash: block.previousHash
    }))
  });
});

/**
 * GET /balance/:address - 获取地址余额
 */
app.get('/balance/:address', (req, res) => {
  const address = req.params.address;
  const balance = blockchain.getBalanceOfAddress(address);

  res.json({
    address,
    balance,
    transactions: blockchain.getAllTransactionsForAddress(address).length
  });
});

/**
 * GET /transactions/:address - 获取地址的所有交易
 */
app.get('/transactions/:address', (req, res) => {
  const address = req.params.address;
  const transactions = blockchain.getAllTransactionsForAddress(address);

  res.json({
    address,
    transactions: transactions.map(tx => ({
      from: tx.fromAddress || 'System',
      to: tx.toAddress,
      amount: tx.amount,
      timestamp: new Date(tx.timestamp).toISOString()
    }))
  });
});

/**
 * POST /transaction - 创建新交易
 */
app.post('/transaction', (req, res) => {
  const { from, to, amount } = req.body;

  if (!from || !to || !amount) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Missing required fields: from, to, amount'
    });
  }

  try {
    const tx = new Transaction(from, to, parseFloat(amount));
    blockchain.addTransaction(tx);

    res.json({
      success: true,
      message: 'Transaction added to pending pool',
      transaction: {
        from: tx.fromAddress,
        to: tx.toAddress,
        amount: tx.amount
      }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Transaction failed',
      message: error.message
    });
  }
});

/**
 * POST /mine - 挖矿
 */
app.post('/mine', (req, res) => {
  const { minerAddress } = req.body;

  if (!minerAddress) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Missing required field: minerAddress'
    });
  }

  try {
    const beforeHeight = blockchain.chain.length;
    blockchain.minePendingTransactions(minerAddress);
    const newBlock = blockchain.getLatestBlock();

    res.json({
      success: true,
      message: 'Block mined successfully',
      block: {
        height: beforeHeight,
        hash: newBlock.hash,
        nonce: newBlock.nonce,
        transactions: newBlock.transactions.length,
        reward: blockchain.miningReward
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Mining failed',
      message: error.message
    });
  }
});

/**
 * GET /validate - 验证区块链
 */
app.get('/validate', (req, res) => {
  const isValid = blockchain.isChainValid();

  res.json({
    valid: isValid,
    chainLength: blockchain.chain.length,
    message: isValid ? 'Blockchain is valid' : 'Blockchain has been tampered with'
  });
});

/**
 * GET /pending - 获取待处理交易
 */
app.get('/pending', (req, res) => {
  res.json({
    count: blockchain.pendingTransactions.length,
    transactions: blockchain.pendingTransactions.map(tx => ({
      from: tx.fromAddress || 'System',
      to: tx.toAddress,
      amount: tx.amount,
      timestamp: new Date(tx.timestamp).toISOString()
    }))
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 NodeChain API Server 运行在 http://localhost:${PORT}`);
  console.log('='.repeat(60));
  console.log('\n📡 可用的 API 端点:\n');
  console.log('  GET  /status              - 获取节点状态');
  console.log('  GET  /chain-info          - 获取链信息');
  console.log('  GET  /blockchain          - 获取完整区块链');
  console.log('  GET  /block/:height       - 获取指定区块');
  console.log('  GET  /blocks?count=N      - 获取最近N个区块');
  console.log('  GET  /balance/:address    - 获取地址余额');
  console.log('  GET  /transactions/:addr  - 获取地址交易');
  console.log('  POST /transaction         - 创建新交易');
  console.log('  POST /mine                - 挖矿');
  console.log('  GET  /validate            - 验证区块链');
  console.log('  GET  /pending             - 获取待处理交易');
  console.log('\n' + '='.repeat(60));
  console.log(`\n💡 提示: 前端浏览器地址配置为 http://localhost:${PORT}`);
  console.log('='.repeat(60) + '\n');
});

export { app, blockchain };
