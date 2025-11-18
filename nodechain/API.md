# NodeChain API 文档

NodeChain HTTP API 服务器提供了完整的区块链访问接口，兼容前端区块链浏览器。

## 启动 API 服务器

```bash
cd nodechain
npm run server
```

服务器将在 `http://localhost:3000` 启动

## API 端点

### 1. 获取节点状态

```
GET /status
```

**响应示例：**
```json
{
  "nodeInfo": {
    "network": "nodechain-1",
    "version": "1.0.0",
    "moniker": "nodechain-node"
  },
  "syncInfo": {
    "latestBlockHeight": 2,
    "latestBlockTime": "2025-11-17T11:05:27.442Z",
    "catching_up": false
  }
}
```

### 2. 获取链信息

```
GET /chain-info
```

**响应示例：**
```json
{
  "chainId": "nodechain-1",
  "latestBlockHeight": 2,
  "latestBlockTime": "2025-11-17T11:05:27.442Z",
  "difficulty": 4,
  "miningReward": 100,
  "isValid": true
}
```

### 3. 获取完整区块链

```
GET /blockchain
```

**响应示例：**
```json
{
  "chain": [...],
  "chainInfo": {
    "chainLength": 3,
    "difficulty": 4,
    "miningReward": 100,
    "pendingTransactions": 0,
    "isValid": true
  }
}
```

### 4. 获取指定区块

```
GET /block/:height
```

**参数：**
- `height` - 区块高度 (从 0 开始)

**响应示例：**
```json
{
  "block": {
    "header": {
      "height": 1,
      "time": "2025-11-17T11:05:27.227Z",
      "hash": "00004b686329a31250706c2cc8ef3d4d8d5fb8583820ad9899823ab3f409148e",
      "previousHash": "d53815eeb8759ff35c527872de9b1177a4da03c1b418da6fef33f07c84eefde0",
      "nonce": 160120
    },
    "data": {
      "txs": [
        {
          "from": "System",
          "to": "miner-node",
          "amount": 100,
          "timestamp": "2025-11-17T11:05:27.227Z"
        }
      ]
    }
  },
  "blockId": {
    "hash": "00004b686329a31250706c2cc8ef3d4d8d5fb8583820ad9899823ab3f409148e"
  }
}
```

### 5. 获取最近的区块列表

```
GET /blocks?count=N
```

**查询参数：**
- `count` - 区块数量 (默认: 10)

**响应示例：**
```json
{
  "blocks": [
    {
      "height": 2,
      "hash": "0000...",
      "time": "2025-11-17T11:05:27.442Z",
      "txCount": 2,
      "proposer": "node-validator",
      "previousHash": "0000..."
    }
  ]
}
```

### 6. 获取地址余额

```
GET /balance/:address
```

**参数：**
- `address` - 钱包地址

**响应示例：**
```json
{
  "address": "alice",
  "balance": 30,
  "transactions": 2
}
```

### 7. 获取地址的所有交易

```
GET /transactions/:address
```

**参数：**
- `address` - 钱包地址

**响应示例：**
```json
{
  "address": "alice",
  "transactions": [
    {
      "from": "miner-node",
      "to": "alice",
      "amount": 30,
      "timestamp": "2025-11-17T11:05:27.442Z"
    }
  ]
}
```

### 8. 创建新交易

```
POST /transaction
```

**请求体：**
```json
{
  "from": "alice",
  "to": "bob",
  "amount": 10
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "Transaction added to pending pool",
  "transaction": {
    "from": "alice",
    "to": "bob",
    "amount": 10
  }
}
```

**错误响应：**
```json
{
  "error": "Transaction failed",
  "message": "余额不足"
}
```

### 9. 挖矿

```
POST /mine
```

**请求体：**
```json
{
  "minerAddress": "miner-node"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "Block mined successfully",
  "block": {
    "height": 3,
    "hash": "0000abc...",
    "nonce": 12345,
    "transactions": 2,
    "reward": 100
  }
}
```

### 10. 验证区块链

```
GET /validate
```

**响应示例：**
```json
{
  "valid": true,
  "chainLength": 3,
  "message": "Blockchain is valid"
}
```

### 11. 获取待处理交易

```
GET /pending
```

**响应示例：**
```json
{
  "count": 2,
  "transactions": [
    {
      "from": "alice",
      "to": "bob",
      "amount": 10,
      "timestamp": "2025-11-17T11:05:27.442Z"
    }
  ]
}
```

## 使用示例

### 使用 curl

```bash
# 获取链信息
curl http://localhost:3000/chain-info

# 获取区块
curl http://localhost:3000/block/1

# 获取最近 5 个区块
curl 'http://localhost:3000/blocks?count=5'

# 查询余额
curl http://localhost:3000/balance/alice

# 创建交易
curl -X POST http://localhost:3000/transaction \
  -H "Content-Type: application/json" \
  -d '{"from":"alice","to":"bob","amount":10}'

# 挖矿
curl -X POST http://localhost:3000/mine \
  -H "Content-Type: application/json" \
  -d '{"minerAddress":"miner-node"}'
```

### 使用 JavaScript (Fetch API)

```javascript
// 获取链信息
const response = await fetch('http://localhost:3000/chain-info');
const chainInfo = await response.json();
console.log(chainInfo);

// 创建交易
const txResponse = await fetch('http://localhost:3000/transaction', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from: 'alice',
    to: 'bob',
    amount: 10
  })
});
const txResult = await txResponse.json();
console.log(txResult);

// 挖矿
const mineResponse = await fetch('http://localhost:3000/mine', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    minerAddress: 'miner-node'
  })
});
const mineResult = await mineResponse.json();
console.log(mineResult);
```

## 连接前端浏览器

要将前端区块链浏览器连接到 NodeChain：

1. 修改前端的 `vite.config.ts` 代理配置：

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rpc': {
        target: 'http://localhost:3000',  // NodeChain API 服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rpc/, ''),
      },
    },
  },
})
```

2. 启动前端浏览器：

```bash
cd chain-front
npm run dev
```

3. 在浏览器中访问 `http://localhost:5173`，输入 `http://localhost:3000` 并点击连接

## CORS 配置

API 服务器已启用 CORS，允许所有来源的跨域请求。这使得前端应用可以直接调用 API。

## 错误处理

所有错误响应遵循统一格式：

```json
{
  "error": "错误类型",
  "message": "详细错误信息"
}
```

常见错误码：
- `400` - 请求参数错误
- `404` - 资源不存在
- `500` - 服务器内部错误

## 性能注意事项

- 挖矿操作是 CPU 密集型任务，难度为 4 时大约需要几百毫秒
- 建议在生产环境中使用更低的难度或将挖矿移到后台任务队列
- 区块链数据存储在内存中，重启服务器会丢失数据

## 安全提示

⚠️ **这是一个教学项目，不适用于生产环境**

- 没有身份验证机制
- 没有速率限制
- 没有数据持久化
- 简化的交易验证

如需用于生产，请添加：
1. JWT 身份验证
2. API 速率限制
3. 数据库持久化
4. 完整的加密签名验证
