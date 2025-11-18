# 区块链浏览器集成指南

本文档说明如何将前端区块链浏览器与不同的区块链后端集成。

## 项目结构

```
chain/
├── mychain/          # Cosmos SDK 区块链 (Ignite CLI)
├── nodechain/        # Node.js 区块链 (自研)
└── chain-front/      # React 区块链浏览器
```

## 连接选项

### 选项 1: 连接到 NodeChain (Node.js 区块链)

**1. 启动 NodeChain API 服务器**

```bash
cd nodechain
npm run server
# 服务器运行在 http://localhost:3000
```

**2. 配置前端代理**

编辑 `chain-front/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rpc': {
        target: 'http://localhost:3000',  // NodeChain API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rpc/, ''),
      },
    },
  },
})
```

**3. 启动前端**

```bash
cd chain-front
npm run dev
# 浏览器打开 http://localhost:5173
```

**4. 连接**

在浏览器中输入 `http://localhost:3000` 并点击"连接"。

---

### 选项 2: 连接到 Cosmos 链 (mychain)

**1. 启动 Cosmos 链**

```bash
cd mychain
ignite chain serve
# RPC 服务运行在 http://localhost:26657
```

**2. 配置前端代理**

编辑 `chain-front/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rpc': {
        target: 'http://localhost:26657',  // Cosmos RPC
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rpc/, ''),
      },
    },
  },
})
```

**3. 启动前端**

```bash
cd chain-front
npm run dev
```

**4. 连接**

在浏览器中输入 `http://localhost:26657` 并点击"连接"。

---

## API 端点对比

### NodeChain API

| 端点 | 说明 |
|------|------|
| `GET /status` | 节点状态 |
| `GET /chain-info` | 链信息 |
| `GET /block/:height` | 获取区块 |
| `GET /blocks?count=N` | 获取最近区块 |
| `POST /transaction` | 创建交易 |
| `POST /mine` | 挖矿 |

详细文档: [nodechain/API.md](../nodechain/API.md)

### Cosmos Tendermint RPC

| 端点 | 说明 |
|------|------|
| `GET /status` | 节点状态 |
| `GET /block?height=N` | 获取区块 |
| `GET /blockchain?minHeight=M&maxHeight=N` | 获取区块范围 |
| `GET /tx?hash=...` | 获取交易 |

文档: [Tendermint RPC](https://docs.tendermint.com/v0.34/rpc/)

---

## 数据格式适配

前端浏览器使用 CosmJS 的 `@cosmjs/tendermint-rpc` 库，期望的数据格式与 Tendermint RPC 兼容。

NodeChain API 服务器已经适配了这种格式，可以无缝对接。

### 区块数据结构

**Tendermint RPC 格式:**
```json
{
  "block": {
    "header": {
      "height": "1",
      "time": "2025-11-17T...",
      "hash": "0x...",
      "proposer_address": "..."
    },
    "data": {
      "txs": [...]
    }
  },
  "block_id": {
    "hash": "0x..."
  }
}
```

**NodeChain API 格式 (已适配):**
```json
{
  "block": {
    "header": {
      "height": 1,
      "time": "2025-11-17T...",
      "hash": "0000...",
      "previousHash": "0000..."
    },
    "data": {
      "txs": [...]
    }
  },
  "blockId": {
    "hash": "0000..."
  }
}
```

---

## 功能对比

| 功能 | NodeChain | Cosmos (mychain) |
|------|-----------|------------------|
| 查看区块 | ✅ | ✅ |
| 查看交易 | ✅ | ✅ |
| 查看链信息 | ✅ | ✅ |
| 实时刷新 | ✅ | ✅ |
| 创建交易 | ✅ (HTTP API) | ⚠️ (需要钱包) |
| 挖矿 | ✅ (HTTP API) | ❌ (自动出块) |
| 工作量证明 | ✅ (PoW) | ❌ (PoS/BFT) |

---

## 快速切换

如果想要在两个区块链之间快速切换，只需要：

1. 修改 `chain-front/vite.config.ts` 中的 `target`
2. 重启前端开发服务器 (`Ctrl+C` 然后 `npm run dev`)
3. 在浏览器中输入对应的 RPC 地址

---

## 同时运行两条链

你可以同时运行 NodeChain 和 Cosmos 链：

```bash
# 终端 1: Cosmos 链
cd mychain
ignite chain serve

# 终端 2: NodeChain API
cd nodechain
npm run server

# 终端 3: 前端浏览器
cd chain-front
npm run dev
```

然后在前端浏览器中切换连接地址：
- NodeChain: `http://localhost:3000`
- Cosmos: `http://localhost:26657`

---

## 开发建议

### 使用 NodeChain 的场景:
- ✅ 学习区块链基础概念
- ✅ 快速原型开发
- ✅ 测试前端浏览器功能
- ✅ 自定义区块链逻辑

### 使用 Cosmos (mychain) 的场景:
- ✅ 生产级区块链应用
- ✅ 需要完整的 Cosmos SDK 功能
- ✅ 跨链通信 (IBC)
- ✅ 自定义模块开发

---

## 故障排除

### 前端无法连接

1. 检查后端服务是否运行:
   ```bash
   # NodeChain
   curl http://localhost:3000/status

   # Cosmos
   curl http://localhost:26657/status
   ```

2. 检查 vite.config.ts 中的 proxy.target 配置

3. 检查浏览器控制台的错误信息

### CORS 错误

- NodeChain: 已内置 CORS 支持
- Cosmos: 检查 `config/config.toml` 中的 `cors_allowed_origins`

### 数据格式错误

确保前端的 `blockchain.ts` 服务正确解析 API 响应。NodeChain API 已经适配了 Tendermint RPC 格式。

---

## 总结

现在你有两条区块链可供选择：

1. **NodeChain** - 简单、可控、教学友好
2. **Cosmos (mychain)** - 完整、生产级、功能强大

前端浏览器可以无缝连接两者，帮助你更好地理解区块链的工作原理！
